import { Module } from '@nestjs/common';
import { VirtualAccountsService } from './virtual-accounts.service';
import { VirtualAccountsController } from './virtual-accounts.controller';
import { NombaModule } from '../nomba/nomba.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [NombaModule, PrismaModule],
  controllers: [VirtualAccountsController],
  providers: [VirtualAccountsService],
})
export class VirtualAccountsModule {}
