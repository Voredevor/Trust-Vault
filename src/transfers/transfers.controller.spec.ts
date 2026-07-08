import { Test, TestingModule } from '@nestjs/testing';
import { TransfersController } from './transfers.controller.js';
import { TransfersService } from './transfers.service.js';

describe('TransfersController', () => {
  let controller: TransfersController;
  const transfersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfersController],
      providers: [{ provide: TransfersService, useValue: transfersService }],
    }).compile();

    controller = module.get<TransfersController>(TransfersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
