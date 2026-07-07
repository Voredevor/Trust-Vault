import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { BeneficiariesController } from './beneficiaries.controller.js';
import { BeneficiariesService } from './beneficiaries.service.js';

describe('BeneficiariesController', () => {
  let controller: BeneficiariesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeneficiariesController],
      providers: [
        BeneficiariesService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = module.get<BeneficiariesController>(BeneficiariesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
