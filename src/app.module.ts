import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { NombaModule } from './nomba/nomba.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { VirtualAccountsModule } from './virtual-accounts/virtual-accounts.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { TransfersModule } from './transfers/transfers.module.js';
import { WebhooksModule } from './webhooks/webhooks.module.js';
import { AuditModule } from './audit/audit.module.js';
import { DevicesModule } from './devices/devices.module.js';
import { BeneficiariesModule } from './beneficiaries/beneficiaries.module.js';
import { TrustEngineModule } from './trust-engine/trust-engine.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';

@Module({
  // imports: [ConfigModule, NombaModule, AuthModule, UsersModule, VirtualAccountsModule, TransactionsModule, TransfersModule, WebhooksModule, AuditModule, DevicesModule, BeneficiariesModule, TrustEngineModule],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NombaModule,
    AuthModule,
    UsersModule,
    VirtualAccountsModule,
    TransactionsModule,
    TransfersModule,
    WebhooksModule,
    AuditModule,
    DevicesModule,
    BeneficiariesModule,
    TrustEngineModule,
    PrismaModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
