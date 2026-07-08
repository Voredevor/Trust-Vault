import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service.js';
import { TransfersController } from './transfers.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NombaModule } from '../nomba/nomba.module.js';
import { TrustEngineModule } from '../trust-engine/trust-engine.module.js';

@Module({
  imports: [PrismaModule, NombaModule, TrustEngineModule],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}
