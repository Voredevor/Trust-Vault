import { Test, TestingModule } from '@nestjs/testing';
import { NombaService } from '../nomba/nomba.service';
import { PrismaService } from '../prisma/prisma.service';
import { VirtualAccountsService } from './virtual-accounts.service';

jest.mock('../generated/prisma/client', () => {
  class PrismaClientMock {
    async $connect(): Promise<void> {}
    async $disconnect(): Promise<void> {}
  }

  return {
    PrismaClient: PrismaClientMock,
  };
});

describe('VirtualAccountsService', () => {
  let service: VirtualAccountsService;
  let nombaService: { createSubAccountVirtualAccount: jest.Mock };
  let prismaService: { virtualAccount: { create: jest.Mock } };

  beforeEach(async () => {
    nombaService = {
      createSubAccountVirtualAccount: jest.fn(),
    };

    prismaService = {
      virtualAccount: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VirtualAccountsService,
        {
          provide: NombaService,
          useValue: nombaService,
        },
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<VirtualAccountsService>(VirtualAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates and persists a virtual account', async () => {
    nombaService.createSubAccountVirtualAccount.mockResolvedValue({
      code: '00',
      description: 'Success',
      data: {
        createdAt: '2026-07-03T12:30:00Z',
        accountHolderId: 'account-holder-id',
        accountRef: 'account-ref',
        accountName: 'TrustVaultPhaseFour',
        bankName: 'Nombank MFB',
        bankAccountNumber: '1234567890',
        bankAccountName: 'TrustVaultPhaseFour',
        currency: 'NGN',
        expired: false,
      },
    });

    prismaService.virtualAccount.create.mockResolvedValue({
      id: 'virtual-account-id',
    });

    const result = await service.create({
      accountRef: 'account-ref',
      accountName: 'TrustVaultPhaseFour',
      currency: 'NGN',
    });

    expect(result).toEqual({ id: 'virtual-account-id' });
    expect(nombaService.createSubAccountVirtualAccount).toHaveBeenCalledWith({
      accountRef: 'account-ref',
      accountName: 'TrustVaultPhaseFour',
      currency: 'NGN',
    });
    expect(prismaService.virtualAccount.create).toHaveBeenCalledWith({
      data: {
        userId: null,
        label: 'TrustVaultPhaseFour',
        accountName: 'TrustVaultPhaseFour',
        accountNumber: '1234567890',
        bankCode: null,
        providerReference: 'account-ref',
        metadata: {
          createdAt: '2026-07-03T12:30:00Z',
          accountHolderId: 'account-holder-id',
          accountRef: 'account-ref',
          accountName: 'TrustVaultPhaseFour',
          bankName: 'Nombank MFB',
          bankAccountNumber: '1234567890',
          bankAccountName: 'TrustVaultPhaseFour',
          currency: 'NGN',
          expired: false,
        },
      },
    });
  });

  it('lists persisted virtual accounts', async () => {
    prismaService.virtualAccount.findMany.mockResolvedValue([
      { id: 'virtual-account-id' },
    ]);

    const result = await service.findAll();

    expect(result).toEqual([{ id: 'virtual-account-id' }]);
    expect(prismaService.virtualAccount.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('fetches a virtual account by id', async () => {
    prismaService.virtualAccount.findUnique.mockResolvedValue({
      id: 'virtual-account-id',
    });

    const result = await service.findOne('virtual-account-id');

    expect(result).toEqual({ id: 'virtual-account-id' });
    expect(prismaService.virtualAccount.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'virtual-account-id',
      },
    });
  });
});
