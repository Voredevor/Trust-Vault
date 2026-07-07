import { Test, TestingModule } from '@nestjs/testing';
import { VirtualAccountsController } from './virtual-accounts.controller.js';
import { VirtualAccountsService } from './virtual-accounts.service.js';

jest.mock('../generated/prisma/client', () => {
  class PrismaClientMock {
    async $connect(): Promise<void> {}
    async $disconnect(): Promise<void> {}
  }

  return {
    PrismaClient: PrismaClientMock,
  };
});

describe('VirtualAccountsController', () => {
  let controller: VirtualAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VirtualAccountsController],
      providers: [
        {
          provide: VirtualAccountsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VirtualAccountsController>(VirtualAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
