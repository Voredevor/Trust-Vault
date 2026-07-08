import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TrustEngineController } from './trust-engine.controller.js';
import { TrustEngineService } from './trust-engine.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [TrustEngineController],
  providers: [TrustEngineService],
  exports: [TrustEngineService],
})
export class TrustEngineModule {}
