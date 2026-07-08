import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('../generated/prisma/client', () => {
  class PrismaClientMock {
    async $connect(): Promise<void> {}
    async $disconnect(): Promise<void> {}
  }

  return {
    PrismaClient: PrismaClientMock,
  };
});

import { WebhooksService } from './webhooks.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('WebhooksService', () => {
  let service: WebhooksService;
  const webhookSecret = 'webhook-secret';

  const prismaService = {
    webhookEvent: {
      count: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      findMany: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    transaction: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
    },
    virtualAccount: {
      findFirst: jest.fn(),
    },
  };

  const configService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'NOMBA_WEBHOOK_SECRET') {
        return webhookSecret;
      }

      return undefined;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhooksService,
        { provide: PrismaService, useValue: prismaService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<WebhooksService>(WebhooksService);
    prismaService.webhookEvent.create.mockResolvedValue({ id: 'event-id' });
    prismaService.webhookEvent.count.mockResolvedValue(1);
    prismaService.webhookEvent.findFirst.mockResolvedValue({
      id: 'event-id',
      receivedAt: new Date('2026-07-08T00:00:00.000Z'),
      payload: { event: 'payment.received' },
    });
    prismaService.webhookEvent.upsert.mockResolvedValue({ id: 'event-id' });
    prismaService.webhookEvent.update.mockResolvedValue({ id: 'event-id' });
    prismaService.webhookEvent.findUniqueOrThrow.mockResolvedValue({ id: 'event-id' });
    prismaService.auditLog.create.mockResolvedValue({ id: 'audit-log-id' });
    prismaService.transaction.findFirst.mockResolvedValue(null);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('verifies and stores a signed nomba webhook', async () => {
	const payload = { event: 'payment.received', amount: '1000' };
	const rawBody = Buffer.from(JSON.stringify(payload));
	const signature = createHmac('sha256', webhookSecret).update(rawBody).digest('hex');

	await expect(
		service.ingestNombaWebhook(
			{
				'x-nomba-signature': signature,
				'x-nomba-event': 'payment.received',
				'x-nomba-event-id': 'evt_123',
			},
			payload,
			rawBody,
		),
	).resolves.toMatchObject({
		received: true,
		verified: true,
	});

    expect(prismaService.webhookEvent.upsert).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { providerEventId: 'evt_123' },
      create: expect.objectContaining({
        provider: 'nomba',
        eventType: 'payment.received',
        providerEventId: 'evt_123',
        verified: true,
      }),
      update: expect.objectContaining({
        eventType: 'payment.received',
        verified: true,
      }),
    }),
  );
  });

  it('accepts Nomba signature value headers from Render webhook requests', async () => {
    const payload = { event: 'payment.received', amount: '1000' };
    const rawBody = Buffer.from(JSON.stringify(payload));
    const signature = createHmac('sha256', webhookSecret).update(rawBody).digest('hex');

    await expect(
      service.ingestNombaWebhook(
        {
          'nomba-signature': 'signature-metadata',
          'nomba-signature-algorithm': 'HMAC-SHA256',
          'nomba-signature-version': '1',
          'nomba-sig-value': signature,
        },
        payload,
        rawBody,
      ),
    ).resolves.toMatchObject({
      received: true,
      verified: true,
    });

    await expect(service.debug()).resolves.toMatchObject({
      lastSignatureVerificationResult: 'passed',
      lastWebhookAttempt: {
        signatureHeaderExpected: expect.arrayContaining([
          'nomba-sig-value',
          'nomba-signature',
        ]),
        signatureHeaderName: 'nomba-sig-value',
        signatureHeaderExists: true,
        signatureValueLength: signature.length,
      },
    });
  });

  it('treats incoming signature header names as lowercase-insensitive', async () => {
    const payload = { event: 'payment.received', amount: '1000' };
    const rawBody = Buffer.from(JSON.stringify(payload));
    const signature = createHmac('sha256', webhookSecret).update(rawBody).digest('hex');

    await expect(
      service.ingestNombaWebhook(
        {
          'Nomba-Sig-Value': signature,
        },
        payload,
        rawBody,
      ),
    ).resolves.toMatchObject({
      received: true,
      verified: true,
    });
  });

  it('creates a transaction and audit log when a webhook matches a virtual account', async () => {
    const payload = {
      event: 'payment.received',
      amount: '1250',
      currency: 'NGN',
      reference: 'txn_1250',
      accountReference: 'account-ref',
    };
    const rawBody = Buffer.from(JSON.stringify(payload));
    const signature = createHmac('sha256', webhookSecret).update(rawBody).digest('hex');

    prismaService.virtualAccount.findFirst.mockResolvedValue({
      id: 'virtual-account-id',
      userId: null,
    });
    prismaService.transaction.upsert.mockResolvedValue({
      id: 'transaction-id',
    });

    await expect(
      service.ingestNombaWebhook(
        {
          'x-nomba-signature': signature,
          'x-nomba-event': 'payment.received',
          'x-nomba-event-id': 'evt_456',
        },
        payload,
        rawBody,
      ),
    ).resolves.toMatchObject({
      processed: true,
      transaction: { id: 'transaction-id' },
    });

    expect(prismaService.virtualAccount.findFirst).toHaveBeenCalledWith({
      where: {
        OR: [{ providerReference: 'account-ref' }],
      },
    });
    expect(prismaService.transaction.upsert).toHaveBeenCalled();
    expect(prismaService.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'WEBHOOK_RECEIVED',
          resourceType: 'WebhookEvent',
        }),
      }),
    );
  });

  it('rejects missing signatures', async () => {
	await expect(
		service.ingestNombaWebhook({}, { event: 'payment.received' }),
	).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects invalid signatures', async () => {
    await expect(
      service.ingestNombaWebhook(
        {
          'x-nomba-signature': 'bad-signature',
        },
        { event: 'payment.received' },
        Buffer.from('{"event":"payment.received"}'),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns temporary webhook debug information', async () => {
    prismaService.webhookEvent.count.mockClear();
    prismaService.webhookEvent.findFirst.mockClear();

    await expect(service.debug()).resolves.toMatchObject({
      totalWebhookEvents: 1,
      lastSignatureVerificationResult: null,
    });

    expect(prismaService.webhookEvent.count).toHaveBeenCalledTimes(1);
    expect(prismaService.webhookEvent.findFirst).toHaveBeenCalledWith({
      orderBy: { receivedAt: 'desc' },
    });
  });
});
