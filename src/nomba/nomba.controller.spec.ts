import { Test, TestingModule } from '@nestjs/testing';
import { NombaController } from './nomba.controller';
import { NombaService } from './nomba.service';

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
