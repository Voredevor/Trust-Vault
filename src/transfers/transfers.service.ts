import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { NombaService, NombaBankLookupData } from '../nomba/nomba.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { TrustEngineService } from '../trust-engine/trust-engine.service.js';
import { CreateTransferDto } from './dto/create-transfer.dto.js';

type TransferGuardDecision = 'ALLOW' | 'REVIEW' | 'BLOCK';

interface TransferRiskAssessment {
  decision: TransferGuardDecision;
  riskScore: number;
  reasons: string[];
  factors: Record<string, unknown>;
}

@Injectable()
export class TransfersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nombaService: NombaService,
    private readonly trustEngineService: TrustEngineService,
  ) {}

  async create(createTransferDto: CreateTransferDto) {
    return this.guardTransfer(createTransferDto);
  }

  async guardTransfer(createTransferDto: CreateTransferDto) {
    const amount = Number(createTransferDto.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('Transfer amount must be greater than zero');
    }

    const [user, virtualAccount, trustAssessment, lookup] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: createTransferDto.userId },
        select: { id: true, status: true, firstName: true, lastName: true, email: true },
      }),
      createTransferDto.virtualAccountId
        ? this.prisma.virtualAccount.findUnique({
            where: { id: createTransferDto.virtualAccountId },
            select: { id: true, status: true, accountNumber: true, accountName: true, userId: true },
          })
        : Promise.resolve(null),
      this.trustEngineService.assessUserTrust(createTransferDto.userId),
      this.nombaService.lookupBankAccount({
        bankCode: createTransferDto.recipientBankCode,
        accountNumber: createTransferDto.recipientAccount,
      }),
    ]);

    if (!user) {
      throw new NotFoundException(`User ${createTransferDto.userId} not found`);
    }

    if (virtualAccount && virtualAccount.userId !== user.id) {
      throw new BadRequestException('Virtual account does not belong to the selected customer');
    }

    const [recentTransfers, previousBeneficiary, riskHistory] = await Promise.all([
      this.countRecentTransfers(user.id),
      this.prisma.beneficiary.findFirst({
        where: {
          userId: user.id,
          bankCode: createTransferDto.recipientBankCode,
          accountNumber: createTransferDto.recipientAccount,
        },
        select: { id: true, status: true, isTrusted: true },
      }),
      this.prisma.auditLog.count({
        where: {
          userId: user.id,
          severity: { in: ['HIGH', 'CRITICAL'] },
        },
      }),
    ]);

    const decision = this.evaluateTransfer({
      amount,
      trustScore: trustAssessment.score,
      recentTransfers,
      isNewBeneficiary: !previousBeneficiary,
      virtualAccountStatus: virtualAccount?.status ?? 'UNSPECIFIED',
      riskHistory,
      recentActivityCount: trustAssessment.metrics.recentActivityCount,
      customerStatus: String(user.status),
    });

    if (decision.decision === 'ALLOW') {
      const reference = this.createReference();
      const transfer = await this.nombaService.createBankTransfer({
        amount,
        bankCode: createTransferDto.recipientBankCode,
        accountNumber: createTransferDto.recipientAccount,
        accountName: this.resolveLookupAccountName(lookup.data),
        narration: createTransferDto.narration,
        reference,
        currency: createTransferDto.currency ?? 'NGN',
      });

      const transaction = await this.prisma.transaction.create({
        data: {
          userId: user.id,
          virtualAccountId: virtualAccount?.id,
          reference,
          providerReference:
            transfer.data.transactionReference ?? transfer.data.reference ?? transfer.data.sessionId,
          direction: 'DEBIT',
          status: this.mapTransferStatus(transfer.data.status),
          amount,
          currency: createTransferDto.currency ?? 'NGN',
          narration: createTransferDto.narration,
          metadata: {
            module: 'Transfer Guard',
            decision: decision.decision,
            riskScore: decision.riskScore,
            reasons: decision.reasons,
            recipient: this.recipientMetadata(createTransferDto, lookup.data),
            nombaLookup: lookup.data,
            nombaTransfer: transfer.data,
          } as Prisma.InputJsonValue,
        },
      });

      await this.recordTransferAudit(user.id, transaction.id, decision, createTransferDto, lookup.data);

      return {
        decision: decision.decision,
        message: 'Transfer approved and sent to Nomba.',
        riskScore: decision.riskScore,
        reasons: decision.reasons,
        accountLookup: lookup.data,
        transaction,
      };
    }

    await this.recordTransferAudit(user.id, undefined, decision, createTransferDto, lookup.data);

    return {
      decision: decision.decision,
      message: decision.decision === 'REVIEW' ? 'Manual review required.' : 'Transfer blocked by TrustVault.',
      riskScore: decision.riskScore,
      reasons: decision.reasons,
      accountLookup: lookup.data,
    };
  }

  findAll() {
    return this.prisma.transaction.findMany({
      where: { direction: 'DEBIT' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        virtualAccount: true,
        beneficiary: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.transaction.findUniqueOrThrow({
      where: { id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        virtualAccount: true,
        beneficiary: true,
      },
    });
  }

  private evaluateTransfer(input: {
    amount: number;
    trustScore: number;
    recentTransfers: number;
    isNewBeneficiary: boolean;
    virtualAccountStatus: string;
    riskHistory: number;
    recentActivityCount: number;
    customerStatus: string;
  }): TransferRiskAssessment {
    const reasons: string[] = [];
    let riskScore = 100 - input.trustScore;

    if (input.customerStatus !== 'ACTIVE') {
      riskScore += 45;
      reasons.push(`Customer status is ${input.customerStatus}`);
    }

    if (input.amount >= 500000) {
      riskScore += 30;
      reasons.push('Transfer amount is high');
    } else if (input.amount >= 100000) {
      riskScore += 15;
      reasons.push('Transfer amount needs additional scrutiny');
    }

    if (input.recentTransfers >= 5) {
      riskScore += 25;
      reasons.push(`${input.recentTransfers} outgoing transfers in the last 24 hours`);
    } else if (input.recentTransfers >= 3) {
      riskScore += 12;
      reasons.push('Transfer velocity is elevated');
    }

    if (input.isNewBeneficiary) {
      riskScore += 18;
      reasons.push('Recipient is a new beneficiary');
    }

    if (['CLOSED', 'INACTIVE', 'SUSPENDED'].includes(input.virtualAccountStatus)) {
      riskScore += 40;
      reasons.push(`Virtual account status is ${input.virtualAccountStatus}`);
    }

    if (input.riskHistory > 0) {
      riskScore += Math.min(input.riskHistory * 12, 36);
      reasons.push(`${input.riskHistory} high-risk audit event(s) exist for this customer`);
    }

    if (input.recentActivityCount === 0) {
      riskScore += 8;
      reasons.push('No recent trusted payment activity');
    }

    riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));

    if (!reasons.length) {
      reasons.push('Customer trust signals support this transfer');
    }

    const decision: TransferGuardDecision =
      riskScore >= 70 || input.trustScore < 40
        ? 'BLOCK'
        : riskScore >= 40 || input.trustScore < 65
          ? 'REVIEW'
          : 'ALLOW';

    return {
      decision,
      riskScore,
      reasons,
      factors: input,
    };
  }

  private countRecentTransfers(userId: string) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.prisma.transaction.count({
      where: {
        userId,
        direction: 'DEBIT',
        createdAt: { gte: since },
      },
    });
  }

  private async recordTransferAudit(
    userId: string,
    transactionId: string | undefined,
    decision: TransferRiskAssessment,
    dto: CreateTransferDto,
    lookup: NombaBankLookupData,
  ) {
    await this.prisma.auditLog.create({
      data: {
        userId,
        actorType: 'SYSTEM',
        action: `TRANSFER_GUARD_${decision.decision}`,
        resourceType: transactionId ? 'Transaction' : 'TransferGuard',
        resourceId: transactionId,
        severity:
          decision.decision === 'BLOCK'
            ? 'CRITICAL'
            : decision.decision === 'REVIEW'
              ? 'HIGH'
              : 'LOW',
        metadata: {
          module: 'Transfer Guard',
          decision: decision.decision,
          riskScore: decision.riskScore,
          reasons: decision.reasons,
          factors: decision.factors,
          recipient: this.recipientMetadata(dto, lookup),
        } as Prisma.InputJsonValue,
      },
    });
  }

  private recipientMetadata(dto: CreateTransferDto, lookup: NombaBankLookupData) {
    return {
      bank: dto.recipientBank,
      bankCode: dto.recipientBankCode,
      accountNumber: dto.recipientAccount,
      accountName: this.resolveLookupAccountName(lookup),
      amount: dto.amount,
      currency: dto.currency ?? 'NGN',
      narration: dto.narration,
    };
  }

  private resolveLookupAccountName(lookup: NombaBankLookupData): string | undefined {
    return lookup.accountName ?? lookup.account_name as string | undefined;
  }

  private mapTransferStatus(status: unknown): 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED' {
    const normalized = String(status ?? '').toUpperCase();
    if (['SUCCESS', 'SUCCESSFUL', 'COMPLETED'].includes(normalized)) {
      return 'SUCCESS';
    }
    if (['FAILED', 'DECLINED'].includes(normalized)) {
      return 'FAILED';
    }
    if (['REVERSED', 'REVERSAL'].includes(normalized)) {
      return 'REVERSED';
    }
    return 'PENDING';
  }

  private createReference(): string {
    return `TV-TG-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }
}
