import { Module } from '@nestjs/common';
import { VirtualAccountsService } from './virtual-accounts.service.js';
import { VirtualAccountsController } from './virtual-accounts.controller.js';
import { NombaModule } from '../nomba/nomba.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [NombaModule, PrismaModule],
  controllers: [VirtualAccountsController],
  providers: [VirtualAccountsService],
})
export class VirtualAccountsModule {}
