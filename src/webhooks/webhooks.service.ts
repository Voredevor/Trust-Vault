import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import type { IncomingHttpHeaders } from 'http';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

type SignatureVerificationResult =
  | 'passed'
  | 'failed'
  | 'missing'
  | 'not_configured';

interface LastWebhookDebugState {
  timestamp: string;
  headers: Record<string, string>;
  signatureHeaderName?: string;
  signatureHeaderExists: boolean;
  signatureVerificationResult: SignatureVerificationResult;
  payload?: unknown;
  accountNumber?: string;
  accountReference?: string;
  customerMatched?: boolean;
  virtualAccountMatched?: boolean;
  transactionCreated?: { id: string; reference?: string | null } | null;
  auditLogCreated?: { id: string } | null;
  responseStatusReturned?: number;
  errorMessage?: string;
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private lastWebhookDebugState?: LastWebhookDebugState;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async ingestNombaWebhook(
    headers: IncomingHttpHeaders,
    payload: unknown,
    rawBody?: Buffer,
  ) {
    const requestTimestamp = new Date();
    const sanitizedHeaders = this.sanitizeHeaders(headers);
    this.lastWebhookDebugState = {
      timestamp: requestTimestamp.toISOString(),
      headers: sanitizedHeaders,
      signatureHeaderExists: false,
      signatureVerificationResult: 'missing',
      payload: this.sanitizePayload(payload),
    };

    this.logger.log({
      stage: 'Webhook request received',
      timestamp: requestTimestamp.toISOString(),
    });
    this.logger.log({
      stage: 'Request headers',
      headers: sanitizedHeaders,
    });

    const webhookSecret = this.configService.get<string>('NOMBA_WEBHOOK_SECRET');
    if (!webhookSecret) {
      this.lastWebhookDebugState.signatureVerificationResult = 'not_configured';
      this.lastWebhookDebugState.responseStatusReturned = 401;
      this.lastWebhookDebugState.errorMessage = 'Nomba webhook secret is not configured';
      this.logger.warn({
        stage: 'Signature verification failed',
        reason: 'NOMBA_WEBHOOK_SECRET is not configured',
      });
      this.logger.warn({
        stage: 'Response status returned',
        statusCode: 401,
      });
      throw new UnauthorizedException('Nomba webhook secret is not configured');
    }

    const signatureHeaderNames = [
      'x-nomba-signature',
      'x-webhook-signature',
      'x-signature',
    ];
    const signatureHeaderName = this.findHeaderName(headers, signatureHeaderNames);
    const signature = signatureHeaderName ? this.readHeader(headers, [signatureHeaderName]) : undefined;
    const signatureHeaderExists = Boolean(signature);
    this.lastWebhookDebugState.signatureHeaderName = signatureHeaderName;
    this.lastWebhookDebugState.signatureHeaderExists = signatureHeaderExists;
    this.logger.log({
      stage: 'Signature header exists',
      exists: signatureHeaderExists,
      headerName: signatureHeaderName,
    });

    if (!signature) {
      this.lastWebhookDebugState.signatureVerificationResult = 'missing';
      this.lastWebhookDebugState.responseStatusReturned = 401;
      this.lastWebhookDebugState.errorMessage = 'Missing Nomba webhook signature';
      this.logger.warn({
        stage: 'Signature verification failed',
        reason: 'Missing Nomba webhook signature',
      });
      this.logger.warn({
        stage: 'Response status returned',
        statusCode: 401,
      });
      throw new UnauthorizedException('Missing Nomba webhook signature');
    }

    const body = rawBody ?? Buffer.from(JSON.stringify(payload ?? {}));
    const signatureVerificationPassed = this.verifySignature(body, signature, webhookSecret);
    this.lastWebhookDebugState.signatureVerificationResult = signatureVerificationPassed
      ? 'passed'
      : 'failed';
    this.logger.log({
      stage: signatureVerificationPassed
        ? 'Signature verification passed'
        : 'Signature verification failed',
      algorithm: 'HMAC-SHA256',
      environmentVariable: 'NOMBA_WEBHOOK_SECRET',
    });

    if (!signatureVerificationPassed) {
      this.lastWebhookDebugState.responseStatusReturned = 401;
      this.lastWebhookDebugState.errorMessage = 'Invalid Nomba webhook signature';
      this.logger.warn({
        stage: 'Response status returned',
        statusCode: 401,
      });
      throw new UnauthorizedException('Invalid Nomba webhook signature');
    }

    this.logger.log({
      stage: 'Parsed payload',
      payload: this.sanitizePayload(payload),
    });

    const providerEventId = this.readHeader(headers, [
      'x-nomba-event-id',
      'x-event-id',
    ]);

    const storedEvent = providerEventId
      ? await this.prisma.webhookEvent.upsert({
          where: { providerEventId },
          create: {
            provider: 'nomba',
            eventType: this.readHeader(headers, [
              'x-nomba-event',
              'x-event-type',
              'x-webhook-event',
            ]) ?? 'unknown',
            providerEventId,
            signature,
            verified: true,
            payload: payload as Prisma.InputJsonValue,
            headers: this.normalizeHeaders(headers) as Prisma.InputJsonValue,
          },
          update: {
            eventType: this.readHeader(headers, [
              'x-nomba-event',
              'x-event-type',
              'x-webhook-event',
            ]) ?? 'unknown',
            signature,
            verified: true,
            payload: payload as Prisma.InputJsonValue,
            headers: this.normalizeHeaders(headers) as Prisma.InputJsonValue,
          },
        })
      : await this.prisma.webhookEvent.create({
          data: {
            provider: 'nomba',
            eventType: this.readHeader(headers, [
              'x-nomba-event',
              'x-event-type',
              'x-webhook-event',
            ]) ?? 'unknown',
            signature,
            verified: true,
            payload: payload as Prisma.InputJsonValue,
            headers: this.normalizeHeaders(headers) as Prisma.InputJsonValue,
          },
        });

    const processingResult = await this.processVerifiedEvent(storedEvent.id, payload);
    this.lastWebhookDebugState.responseStatusReturned = 201;

    return {
      received: true,
      verified: true,
      ...processingResult,
      event: await this.prisma.webhookEvent.findUniqueOrThrow({
        where: { id: storedEvent.id },
      }),
    };
  }

  async findAll() {
    return this.prisma.webhookEvent.findMany({
      orderBy: { receivedAt: 'desc' },
    });
  }

  async debug() {
    const [totalWebhookEvents, lastWebhookEvent, lastTransaction] = await Promise.all([
      this.prisma.webhookEvent.count(),
      this.prisma.webhookEvent.findFirst({
        orderBy: { receivedAt: 'desc' },
      }),
      this.prisma.transaction.findFirst({
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      totalWebhookEvents,
      lastWebhookTimestamp: lastWebhookEvent?.receivedAt ?? null,
      lastWebhookPayload: lastWebhookEvent
        ? this.sanitizePayload(lastWebhookEvent.payload)
        : null,
      lastSignatureVerificationResult:
        this.lastWebhookDebugState?.signatureVerificationResult ?? null,
      lastTransactionCreated:
        this.lastWebhookDebugState?.transactionCreated ??
        (lastTransaction
          ? {
              id: lastTransaction.id,
              reference: lastTransaction.reference,
              providerReference: lastTransaction.providerReference,
              amount: lastTransaction.amount,
              currency: lastTransaction.currency,
              createdAt: lastTransaction.createdAt,
            }
          : null),
      lastWebhookAttempt: this.lastWebhookDebugState
        ? {
            ...this.lastWebhookDebugState,
            payload: this.sanitizePayload(this.lastWebhookDebugState.payload),
          }
        : null,
    };
  }

  async findOne(id: string) {
    return this.prisma.webhookEvent.findUniqueOrThrow({
      where: { id },
    });
  }

  private async processVerifiedEvent(eventId: string, payload: unknown) {
    const eventPayload = this.asRecord(payload);
    const eventType = this.readPayloadValue(eventPayload, ['event', 'type', 'eventType']) ?? 'unknown';
    const providerReference = this.readPayloadValue(eventPayload, ['reference', 'transactionReference', 'eventId']);
    const accountReference = this.readPayloadValue(eventPayload, [
      'accountReference',
      'virtualAccountReference',
    ]);
    const accountNumber = this.readPayloadValue(eventPayload, ['accountNumber']);
    const currency = this.readPayloadValue(eventPayload, ['currency']) ?? 'NGN';
    const narration = this.readPayloadValue(eventPayload, ['narration', 'description']) ?? `Nomba webhook ${eventType}`;
    const amount = this.readAmount(eventPayload, ['amount', 'transactionAmount']);

    if (this.lastWebhookDebugState) {
      this.lastWebhookDebugState.accountNumber = accountNumber;
      this.lastWebhookDebugState.accountReference = accountReference;
    }
    this.logger.log({
      stage: 'Account number',
      accountNumber: accountNumber ?? null,
    });
    this.logger.log({
      stage: 'Account reference',
      accountReference: accountReference ?? null,
    });

    const auditLog = await this.prisma.auditLog.create({
      data: {
        actorType: 'SYSTEM',
        action: 'WEBHOOK_RECEIVED',
        resourceType: 'WebhookEvent',
        resourceId: eventId,
        severity: 'LOW',
        metadata: {
          eventType,
          providerReference,
          accountReference,
          accountNumber,
          amount,
          currency,
        } as Prisma.InputJsonValue,
      },
    });
    if (this.lastWebhookDebugState) {
      this.lastWebhookDebugState.auditLogCreated = { id: auditLog.id };
    }
    this.logger.log({
      stage: 'Audit log created',
      created: true,
      auditLogId: auditLog.id,
    });

    const matchedVirtualAccount = await this.findMatchingVirtualAccount(accountReference, accountNumber);
    const customerMatched = Boolean(matchedVirtualAccount?.userId);
    const virtualAccountMatched = Boolean(matchedVirtualAccount);
    if (this.lastWebhookDebugState) {
      this.lastWebhookDebugState.customerMatched = customerMatched;
      this.lastWebhookDebugState.virtualAccountMatched = virtualAccountMatched;
    }
    this.logger.log({
      stage: 'Customer matched',
      matched: customerMatched,
      userId: matchedVirtualAccount?.userId ?? null,
    });
    this.logger.log({
      stage: 'Virtual account matched',
      matched: virtualAccountMatched,
      virtualAccountId: matchedVirtualAccount?.id ?? null,
    });

    let transaction: { id: string } | null = null;
    if (matchedVirtualAccount && amount !== null) {
      const transactionReference = providerReference ?? eventId;
      transaction = await this.prisma.transaction.upsert({
        where: {
          reference: transactionReference,
        },
        create: {
          userId: matchedVirtualAccount.userId,
          virtualAccountId: matchedVirtualAccount.id,
          reference: transactionReference,
          providerReference: providerReference ?? transactionReference,
          direction: 'CREDIT',
          status: 'SUCCESS',
          amount,
          currency,
          narration,
          metadata: {
            source: 'nomba-webhook',
            eventType,
            payload,
          } as Prisma.InputJsonValue,
        },
        update: {
          userId: matchedVirtualAccount.userId,
          virtualAccountId: matchedVirtualAccount.id,
          providerReference: providerReference ?? transactionReference,
          direction: 'CREDIT',
          status: 'SUCCESS',
          amount,
          currency,
          narration,
          metadata: {
            source: 'nomba-webhook',
            eventType,
            payload,
          } as Prisma.InputJsonValue,
        },
      });
    }
    if (this.lastWebhookDebugState) {
      this.lastWebhookDebugState.transactionCreated = transaction
        ? {
            id: transaction.id,
            reference: providerReference ?? eventId,
          }
        : null;
    }
    this.logger.log({
      stage: 'Transaction created',
      created: Boolean(transaction),
      transactionId: transaction?.id ?? null,
      skippedReason: transaction
        ? null
        : matchedVirtualAccount
          ? 'Missing amount'
          : 'No matching virtual account',
    });

    await this.prisma.webhookEvent.update({
      where: { id: eventId },
      data: {
        processedAt: new Date(),
        errorMessage: null,
      },
    });

    return {
      processed: true,
      auditLog,
      transaction,
      matchedVirtualAccount,
    };
  }

  private verifySignature(body: Buffer, signature: string, secret: string): boolean {
    const normalizedSignature = signature.trim();
    const signatureValue = normalizedSignature.includes('=')
      ? normalizedSignature.split('=', 2)[1]
      : normalizedSignature;
    const expectedHex = createHmac('sha256', secret).update(body).digest('hex');
    const expectedBase64 = createHmac('sha256', secret).update(body).digest('base64');

    return (
      this.safeCompare(signatureValue.toLowerCase(), expectedHex) ||
      this.safeCompare(signatureValue, expectedBase64)
    );
  }

  private safeCompare(leftValue: string, rightValue: string): boolean {
    const left = Buffer.from(leftValue);
    const right = Buffer.from(rightValue);

    if (left.length !== right.length) {
      return false;
    }

    return timingSafeEqual(left, right);
  }

  private readHeader(headers: IncomingHttpHeaders, names: string[]): string | undefined {
    for (const name of names) {
      const value = headers[name];
      if (Array.isArray(value)) {
        return value[0];
      }

      if (typeof value === 'string') {
        return value;
      }
    }

    return undefined;
  }

  private findHeaderName(headers: IncomingHttpHeaders, names: string[]): string | undefined {
    const lowerCaseHeaderNames = new Set(Object.keys(headers).map((key) => key.toLowerCase()));
    return names.find((name) => lowerCaseHeaderNames.has(name));
  }

  private normalizeHeaders(headers: IncomingHttpHeaders): Record<string, string> {
    return Object.fromEntries(
      Object.entries(headers).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(',') : value ?? '',
      ]),
    );
  }

  private sanitizeHeaders(headers: IncomingHttpHeaders): Record<string, string> {
    return Object.fromEntries(
      Object.entries(this.normalizeHeaders(headers)).map(([key, value]) => [
        key,
        this.isSensitiveKey(key) ? '[REDACTED]' : value,
      ]),
    );
  }

  private sanitizePayload(payload: unknown): unknown {
    if (Array.isArray(payload)) {
      return payload.map((item) => this.sanitizePayload(item));
    }

    if (payload && typeof payload === 'object') {
      return Object.fromEntries(
        Object.entries(payload as Record<string, unknown>).map(([key, value]) => [
          key,
          this.isSensitiveKey(key) ? '[REDACTED]' : this.sanitizePayload(value),
        ]),
      );
    }

    return payload;
  }

  private isSensitiveKey(key: string): boolean {
    const normalizedKey = key.toLowerCase();
    return (
      normalizedKey.includes('authorization') ||
      normalizedKey.includes('cookie') ||
      normalizedKey.includes('secret') ||
      normalizedKey.includes('signature') ||
      normalizedKey.includes('token') ||
      normalizedKey.includes('key')
    );
  }

  private async findMatchingVirtualAccount(accountReference?: string, accountNumber?: string) {
    const OR = [] as Array<{ providerReference?: string; accountNumber?: string }>;

    if (accountReference) {
      OR.push({ providerReference: accountReference });
    }

    if (accountNumber) {
      OR.push({ accountNumber });
    }

    if (!OR.length) {
      return null;
    }

    return this.prisma.virtualAccount.findFirst({
      where: { OR },
    });
  }

  private asRecord(payload: unknown): Record<string, unknown> {
    if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
      return payload as Record<string, unknown>;
    }

    return {};
  }

  private readPayloadValue(payload: Record<string, unknown>, keys: string[]): string | undefined {
    for (const key of keys) {
      const value = payload[key];
      if (typeof value === 'string' && value.trim()) {
        return value;
      }
    }

    return undefined;
  }

  private readAmount(payload: Record<string, unknown>, keys: string[]): string | null {
    for (const key of keys) {
      const value = payload[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        return value.toFixed(2);
      }

      if (typeof value === 'string') {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
          return parsed.toFixed(2);
        }
      }
    }

    return null;
  }
}
