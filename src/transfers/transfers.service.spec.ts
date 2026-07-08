import { Test, TestingModule } from '@nestjs/testing';
import { NombaService } from '../nomba/nomba.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { TrustEngineService } from '../trust-engine/trust-engine.service.js';
import { TransfersService } from './transfers.service.js';

describe('TransfersService', () => {
  let service: TransfersService;

  const prismaService = {
    user: { findUnique: jest.fn() },
    virtualAccount: { findUnique: jest.fn() },
    beneficiary: { findFirst: jest.fn() },
    auditLog: { count: jest.fn(), create: jest.fn() },
    transaction: { count: jest.fn(), create: jest.fn(), findMany: jest.fn(), findUniqueOrThrow: jest.fn() },
  };

  const nombaService = {
    lookupBankAccount: jest.fn(),
    createBankTransfer: jest.fn(),
  };

  const trustEngineService = {
    assessUserTrust: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersService,
        { provide: PrismaService, useValue: prismaService },
        { provide: NombaService, useValue: nombaService },
        { provide: TrustEngineService, useValue: trustEngineService },
      ],
    }).compile();

    service = module.get<TransfersService>(TransfersService);

    prismaService.user.findUnique.mockResolvedValue({
      id: 'user-id',
      status: 'ACTIVE',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
    });
    prismaService.virtualAccount.findUnique.mockResolvedValue({
      id: 'va-id',
      userId: 'user-id',
      status: 'ACTIVE',
      accountNumber: '1234567890',
      accountName: 'Ada Lovelace',
    });
    prismaService.beneficiary.findFirst.mockResolvedValue({ id: 'beneficiary-id', status: 'TRUSTED', isTrusted: true });
    prismaService.auditLog.count.mockResolvedValue(0);
    prismaService.auditLog.create.mockResolvedValue({ id: 'audit-id' });
    prismaService.transaction.count.mockResolvedValue(0);
    prismaService.transaction.create.mockResolvedValue({ id: 'transaction-id', status: 'SUCCESS' });
    nombaService.lookupBankAccount.mockResolvedValue({
      data: { accountName: 'Grace Hopper', accountNumber: '0123456789', bankCode: '999' },
    });
    nombaService.createBankTransfer.mockResolvedValue({
      data: { reference: 'provider-ref', status: 'SUCCESS' },
    });
    trustEngineService.assessUserTrust.mockResolvedValue({
      score: 90,
      metrics: { recentActivityCount: 3 },
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('allows low-risk transfers and records an outgoing transaction', async () => {
    const result = await service.create({
      userId: 'user-id',
      virtualAccountId: 'va-id',
      recipientBank: 'Nomba Bank',
      recipientBankCode: '999',
      recipientAccount: '0123456789',
      amount: 5000,
      narration: 'Vendor payment',
    });

    expect(result.decision).toBe('ALLOW');
    expect(nombaService.lookupBankAccount).toHaveBeenCalled();
    expect(nombaService.createBankTransfer).toHaveBeenCalled();
    expect(prismaService.transaction.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-id',
          direction: 'DEBIT',
        }),
      }),
    );
    expect(prismaService.auditLog.create).toHaveBeenCalled();
  });

  it('requires manual review without calling Nomba transfer when risk is elevated', async () => {
    trustEngineService.assessUserTrust.mockResolvedValueOnce({
      score: 70,
      metrics: { recentActivityCount: 0 },
    });
    prismaService.beneficiary.findFirst.mockResolvedValueOnce(null);

    const result = await service.create({
      userId: 'user-id',
      recipientBank: 'Nomba Bank',
      recipientBankCode: '999',
      recipientAccount: '0123456789',
      amount: 5000,
    });

    expect(result.decision).toBe('REVIEW');
    expect(result.message).toBe('Manual review required.');
    expect(nombaService.createBankTransfer).not.toHaveBeenCalled();
    expect(prismaService.transaction.create).not.toHaveBeenCalled();
    expect(prismaService.auditLog.create).toHaveBeenCalled();
  });
});
