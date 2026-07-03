import { Test, TestingModule } from '@nestjs/testing';
import { TrustEngineService } from './trust-engine.service';

describe('TrustEngineService', () => {
  let service: TrustEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrustEngineService],
    }).compile();

    service = module.get<TrustEngineService>(TrustEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
