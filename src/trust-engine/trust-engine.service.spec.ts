import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { TrustEngineService } from './trust-engine.service.js';

jest.mock('../generated/prisma/client', () => {
  class PrismaClientMock {
    async $connect(): Promise<void> {}
    async $disconnect(): Promise<void> {}
  }

  return {
    PrismaClient: PrismaClientMock,
  };
});

describe('TrustEngineService', () => {
  let service: TrustEngineService;
  const prismaService = {
  user: {
    findUnique: jest.fn(),
  },
  device: {
    findMany: jest.fn(),
  },
  transaction: {
    findMany: jest.fn(),
  },
  virtualAccount: {
    findMany: jest.fn(),
  },
  auditLog: {
    findMany: jest.fn(),
  },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrustEngineService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<TrustEngineService>(TrustEngineService);

  prismaService.user.findUnique.mockResolvedValue({
    id: 'user-id',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  });
  prismaService.device.findMany.mockResolvedValue([]);
  prismaService.transaction.findMany.mockResolvedValue([]);
  prismaService.virtualAccount.findMany.mockResolvedValue([]);
  prismaService.auditLog.findMany.mockResolvedValue([]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('computes a trust score for a known user', async () => {
    prismaService.device.findMany.mockResolvedValueOnce([
      { status: 'TRUSTED', trustedAt: new Date(), lastSeenAt: new Date() },
    ]);
    prismaService.transaction.findMany.mockResolvedValueOnce([
      { status: 'SUCCESS', direction: 'CREDIT', occurredAt: new Date(), createdAt: new Date() },
      { status: 'SUCCESS', direction: 'CREDIT', occurredAt: new Date(), createdAt: new Date() },
      { status: 'SUCCESS', direction: 'CREDIT', occurredAt: new Date(), createdAt: new Date() },
      { status: 'SUCCESS', direction: 'CREDIT', occurredAt: new Date(), createdAt: new Date() },
    ]);
    prismaService.virtualAccount.findMany.mockResolvedValueOnce([
      { status: 'ACTIVE' },
    ]);
    prismaService.auditLog.findMany.mockResolvedValueOnce([
      { action: 'CUSTOMER_CREATED', severity: 'LOW', createdAt: new Date() },
    ]);

    const result = await service.assessUserTrust('user-id');

    expect(result).toMatchObject({
      userId: 'user-id',
      score: 100,
      riskLevel: 'LOW',
      metrics: {
        successfulPayments: 4,
        failedPayments: 0,
        activeVirtualAccounts: 1,
        closedVirtualAccounts: 0,
      },
    });
    expect(prismaService.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user-id' } }),
    );
    expect(prismaService.virtualAccount.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user-id' } }),
    );
    expect(prismaService.auditLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user-id' } }),
    );
  });

  it('returns a trust decision for a known user', async () => {
    prismaService.device.findMany.mockResolvedValueOnce([
      { status: 'TRUSTED', trustedAt: new Date(), lastSeenAt: new Date() },
    ]);
    prismaService.transaction.findMany.mockResolvedValueOnce([
      { status: 'SUCCESS', direction: 'CREDIT', occurredAt: new Date(), createdAt: new Date() },
      { status: 'SUCCESS', direction: 'CREDIT', occurredAt: new Date(), createdAt: new Date() },
      { status: 'SUCCESS', direction: 'CREDIT', occurredAt: new Date(), createdAt: new Date() },
      { status: 'SUCCESS', direction: 'CREDIT', occurredAt: new Date(), createdAt: new Date() },
    ]);
    prismaService.virtualAccount.findMany.mockResolvedValueOnce([
      { status: 'ACTIVE' },
    ]);
    prismaService.auditLog.findMany.mockResolvedValueOnce([
      { action: 'CUSTOMER_CREATED', severity: 'LOW', createdAt: new Date() },
    ]);

    const result = await service.decideUserTrust('user-id');

    expect(result).toMatchObject({
      userId: 'user-id',
      action: 'ALLOW',
      assessment: {
        score: 100,
        riskLevel: 'LOW',
      },
    });
  });

  it('blocks when risky customer-specific signals are present', async () => {
    prismaService.user.findUnique.mockResolvedValueOnce({
      id: 'user-id',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    prismaService.device.findMany.mockResolvedValueOnce([
      { status: 'REVOKED', trustedAt: null, lastSeenAt: null },
    ]);
    prismaService.transaction.findMany.mockResolvedValueOnce([
      { status: 'FAILED', direction: 'DEBIT', occurredAt: new Date(), createdAt: new Date() },
    ]);
    prismaService.virtualAccount.findMany.mockResolvedValueOnce([
      { status: 'INACTIVE' },
    ]);
    prismaService.auditLog.findMany.mockResolvedValueOnce([
      { action: 'WEBHOOK_RECEIVED', severity: 'HIGH', createdAt: new Date() },
    ]);

    const result = await service.decideUserTrust('user-id');

    expect(result.action).toBe('BLOCK');
    expect(result.assessment.score).toBeLessThan(55);
    expect(result.assessment.signals.length).toBeGreaterThan(0);
    expect(result.reason).toContain('based on');
  });

  it('throws for an unknown user', async () => {
    prismaService.user.findUnique.mockResolvedValueOnce(null);

    await expect(service.assessUserTrust('missing-user')).rejects.toBeInstanceOf(NotFoundException);
  });
});
