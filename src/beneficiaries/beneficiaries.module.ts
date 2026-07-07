import { Module } from '@nestjs/common';
import { BeneficiariesService } from './beneficiaries.service.js';
import { BeneficiariesController } from './beneficiaries.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [BeneficiariesController],
  providers: [BeneficiariesService],
})
export class BeneficiariesModule {}
