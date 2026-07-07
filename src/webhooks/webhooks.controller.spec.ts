import { Test, TestingModule } from '@nestjs/testing';

jest.mock('../generated/prisma/client', () => {
  class PrismaClientMock {
    async $connect(): Promise<void> {}
    async $disconnect(): Promise<void> {}
  }

  return {
    PrismaClient: PrismaClientMock,
  };
});

import { WebhooksController } from './webhooks.controller.js';
import { WebhooksService } from './webhooks.service.js';

describe('WebhooksController', () => {
  let controller: WebhooksController;
  let webhooksService: {
    ingestNombaWebhook: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    webhooksService = {
      ingestNombaWebhook: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhooksController],
      providers: [{ provide: WebhooksService, useValue: webhooksService }],
    }).compile();

    controller = module.get<WebhooksController>(WebhooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('forwards webhook requests to the service with raw body support', () => {
    const headers = { 'x-nomba-signature': 'sig' } as any;
    const request = { body: { event: 'payment.received' }, rawBody: Buffer.from('{}') } as any;

    controller.ingestNombaWebhook(headers, request);

    expect(webhooksService.ingestNombaWebhook).toHaveBeenCalledWith(
      headers,
      request.body,
      request.rawBody,
    );
  });

  it('returns the webhook service response for a valid request', async () => {
    webhooksService.ingestNombaWebhook.mockResolvedValue({
      received: true,
      verified: true,
    });

    const result = await controller.ingestNombaWebhook(
      { 'x-nomba-signature': 'sig' } as any,
      { body: { event: 'payment.received' }, rawBody: Buffer.from('{}') } as any,
    );

    expect(result).toMatchObject({
      received: true,
      verified: true,
    });
  });

  it('exposes the webhook event list and lookup endpoints', () => {
    controller.findAll();
    controller.findOne('event-1');

    expect(webhooksService.findAll).toHaveBeenCalledTimes(1);
    expect(webhooksService.findOne).toHaveBeenCalledWith('event-1');
  });
});
