import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import type { IncomingHttpHeaders } from 'http';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async ingestNombaWebhook(
    headers: IncomingHttpHeaders,
    payload: unknown,
    rawBody?: Buffer,
  ) {
    const webhookSecret = this.configService.get<string>('NOMBA_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new UnauthorizedException('Nomba webhook secret is not configured');
    }

    const signature = this.readHeader(headers, [
      'x-nomba-signature',
      'x-webhook-signature',
      'x-signature',
    ]);

    if (!signature) {
      throw new UnauthorizedException('Missing Nomba webhook signature');
    }

    const body = rawBody ?? Buffer.from(JSON.stringify(payload ?? {}));
    if (!this.verifySignature(body, signature, webhookSecret)) {
      throw new UnauthorizedException('Invalid Nomba webhook signature');
    }

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

  async findOne(id: string) {
    return this.prisma.webhookEvent.findUniqueOrThrow({
      where: { id },
    });
  }

  private async processVerifiedEvent(eventId: string, payload: unknown) {
    const eventPayload = this.asRecord(payload);
    const eventType = this.readPayloadValue(eventPayload, ['event', 'type', 'eventType']) ?? 'unknown';
    const providerReference = this.readPayloadValue(eventPayload, ['reference', 'transactionReference', 'eventId']);
    const accountReference = this.readPayloadValue(eventPayload, ['accountRef', 'accountReference', 'virtualAccountRef']);
    const accountNumber = this.readPayloadValue(eventPayload, ['accountNumber', 'bankAccountNumber']);
    const currency = this.readPayloadValue(eventPayload, ['currency']) ?? 'NGN';
    const narration = this.readPayloadValue(eventPayload, ['narration', 'description']) ?? `Nomba webhook ${eventType}`;
    const amount = this.readAmount(eventPayload, ['amount', 'transactionAmount']);

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

    const matchedVirtualAccount = await this.findMatchingVirtualAccount(accountReference, accountNumber);

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

  private normalizeHeaders(headers: IncomingHttpHeaders): Record<string, string> {
    return Object.fromEntries(
      Object.entries(headers).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(',') : value ?? '',
      ]),
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
