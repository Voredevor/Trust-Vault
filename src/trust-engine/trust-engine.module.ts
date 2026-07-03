import { Module } from '@nestjs/common';
import { TrustEngineService } from './trust-engine.service';

@Module({
  providers: [TrustEngineService]
})
export class TrustEngineModule {}
