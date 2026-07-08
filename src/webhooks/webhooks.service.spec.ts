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
  const nombaTimestamp = '2025-09-29T10:51:44Z';

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
      update: jest.fn(),
    },
    transaction: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
    },
    virtualAccount: {
      findFirst: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
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

  const createNombaPayload = (overrides: Record<string, unknown> = {}) => ({
    event_type: 'payment_success',
    requestId: '45f2dc2d-d559-4773-bba3-2d5ec17b2e20',
    data: {
      merchant: {
        walletId: '6756ff80aafe04a795f18b38',
        walletBalance: 6052,
        userId: 'b7b10e81-e57d-41d0-8fdc-f4e23a132bbf',
      },
      terminal: {},
      transaction: {
        aliasAccountNumber: '5343270516',
        fee: 5,
        sessionId: 'IFAP-TRANSFER-46501-e0339485-1a2f-4b43-9bd5-fec9649e5928',
        type: 'vact_transfer',
        transactionId: 'API-VACT_TRA-B7B10-0435b274-807a-4bc7-8abe-9dbb4548fd7a',
        aliasAccountName: 'SAMPLE/JOHN DOE',
        responseCode: '',
        originatingFrom: 'api',
        transactionAmount: 10,
        narration: 'John Doe Transfer 10.00 To SAMPLE/JOHN DOE - Nomba',
        time: '2025-09-29T10:51:44Z',
        aliasAccountReference: 'sampleAccountReference',
        aliasAccountType: 'VIRTUAL',
      },
      customer: {
        bankCode: '090645',
        senderName: 'John Doe',
        bankName: 'Nombank',
        accountNumber: '0000000000',
      },
    },
    ...overrides,
  });

  const signNombaPayload = (
    payload: ReturnType<typeof createNombaPayload>,
    timestamp = nombaTimestamp,
  ) => {
    const data = payload.data as Record<string, any>;
    const merchant = data.merchant;
    const transaction = data.transaction;
    const responseCode =
      String(transaction.responseCode ?? '').toLowerCase() === 'null'
        ? ''
        : String(transaction.responseCode ?? '');
    const signedString = [
      payload.event_type,
      payload.requestId,
      merchant.userId,
      merchant.walletId,
      transaction.transactionId,
      transaction.type,
      transaction.time,
      responseCode,
      timestamp,
    ].join(':');

    return createHmac('sha256', webhookSecret).update(signedString).digest('base64');
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
    prismaService.auditLog.update.mockResolvedValue({ id: 'audit-log-id' });
    prismaService.transaction.findFirst.mockResolvedValue(null);
    prismaService.user.findUnique.mockResolvedValue({ id: 'user-id' });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('verifies and stores a signed nomba webhook', async () => {
	const payload = createNombaPayload();
	const rawBody = Buffer.from(JSON.stringify(payload));
	const signature = signNombaPayload(payload);

	await expect(
		service.ingestNombaWebhook(
			{
				'nomba-signature': signature,
        'nomba-timestamp': nombaTimestamp,
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
    const payload = createNombaPayload();
    const rawBody = Buffer.from(JSON.stringify(payload));
    const signature = signNombaPayload(payload);

    await expect(
      service.ingestNombaWebhook(
        {
          'nomba-signature': 'signature-metadata',
          'nomba-signature-algorithm': 'HMAC-SHA256',
          'nomba-signature-version': '1',
          'nomba-sig-value': signature,
          'nomba-timestamp': nombaTimestamp,
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

  it('preserves Base64 signature padding during verification', async () => {
    const payload = createNombaPayload();
    const rawBody = Buffer.from(JSON.stringify(payload));
    const signature = signNombaPayload(payload);

    expect(signature.endsWith('=')).toBe(true);

    await expect(
      service.ingestNombaWebhook(
        {
          'nomba-signature': signature,
          'nomba-timestamp': nombaTimestamp,
        },
        payload,
        rawBody,
      ),
    ).resolves.toMatchObject({
      received: true,
      verified: true,
    });
  });

  it('only strips an explicit sha256 signature prefix', async () => {
    const payload = createNombaPayload();
    const rawBody = Buffer.from(JSON.stringify(payload));
    const signature = signNombaPayload(payload);

    await expect(
      service.ingestNombaWebhook(
        {
          'nomba-signature': `sha256=${signature}`,
          'nomba-timestamp': nombaTimestamp,
        },
        payload,
        rawBody,
      ),
    ).resolves.toMatchObject({
      received: true,
      verified: true,
    });
  });

  it('treats incoming signature header names as lowercase-insensitive', async () => {
    const payload = createNombaPayload();
    const rawBody = Buffer.from(JSON.stringify(payload));
    const signature = signNombaPayload(payload);

    await expect(
      service.ingestNombaWebhook(
        {
          'Nomba-Sig-Value': signature,
          'Nomba-Timestamp': nombaTimestamp,
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
      ...createNombaPayload(),
    };
    const rawBody = Buffer.from(JSON.stringify(payload));
    const signature = signNombaPayload(payload);

    prismaService.virtualAccount.findFirst.mockResolvedValue({
      id: 'virtual-account-id',
      userId: 'user-id',
    });
    prismaService.transaction.upsert.mockResolvedValue({
      id: 'transaction-id',
    });

    await expect(
      service.ingestNombaWebhook(
        {
          'nomba-signature': signature,
          'nomba-timestamp': nombaTimestamp,
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
        OR: [
          { providerReference: 'sampleAccountReference' },
          { accountNumber: '5343270516' },
        ],
      },
    });
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-id' },
      select: { id: true },
    });
    expect(prismaService.transaction.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          userId: 'user-id',
          virtualAccountId: 'virtual-account-id',
          amount: '10.00',
          narration: 'John Doe Transfer 10.00 To SAMPLE/JOHN DOE - Nomba',
        }),
      }),
    );
    expect(prismaService.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'WEBHOOK_RECEIVED',
          resourceType: 'WebhookEvent',
        }),
      }),
    );
    expect(prismaService.auditLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'audit-log-id' },
        data: expect.objectContaining({
          userId: 'user-id',
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
