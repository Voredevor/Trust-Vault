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
  });
  prismaService.device.findMany.mockResolvedValue([]);
  prismaService.transaction.findMany.mockResolvedValue([]);
  prismaService.virtualAccount.findMany.mockResolvedValue([]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('computes a trust score for a known user', async () => {
    const result = await service.assessUserTrust('user-id');

    expect(result).toMatchObject({
      userId: 'user-id',
      score: 100,
      riskLevel: 'LOW',
    });
  });

  it('returns a trust decision for a known user', async () => {
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

  it('drops the decision to step-up when risky signals are present', async () => {
    prismaService.user.findUnique.mockResolvedValueOnce({
      id: 'user-id',
      status: 'PENDING',
    });
    prismaService.device.findMany.mockResolvedValueOnce([
      { status: 'REVOKED', trustedAt: null, lastSeenAt: null },
    ]);
    prismaService.transaction.findMany.mockResolvedValueOnce([
      { status: 'FAILED', direction: 'DEBIT', occurredAt: new Date() },
    ]);
    prismaService.virtualAccount.findMany.mockResolvedValueOnce([
      { status: 'INACTIVE' },
    ]);

    const result = await service.decideUserTrust('user-id');

    expect(result.action).toBe('STEP_UP');
    expect(result.assessment.score).toBeLessThan(85);
    expect(result.assessment.signals.length).toBeGreaterThan(0);
  });

  it('throws for an unknown user', async () => {
    prismaService.user.findUnique.mockResolvedValueOnce(null);

    await expect(service.assessUserTrust('missing-user')).rejects.toBeInstanceOf(NotFoundException);
  });
});
