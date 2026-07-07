import { Test, TestingModule } from '@nestjs/testing';
import { NombaController } from './nomba.controller.js';
import { NombaService } from './nomba.service.js';

describe('NombaController', () => {
  let controller: NombaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NombaController],
      providers: [
        {
          provide: NombaService,
          useValue: {
            fetchParentAccountBalance: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NombaController>(NombaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
