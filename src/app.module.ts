import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { NombaModule } from './nomba/nomba.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VirtualAccountsModule } from './virtual-accounts/virtual-accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TransfersModule } from './transfers/transfers.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { AuditModule } from './audit/audit.module';
import { DevicesModule } from './devices/devices.module';
import { BeneficiariesModule } from './beneficiaries/beneficiaries.module';
import { TrustEngineModule } from './trust-engine/trust-engine.module';
import { PrismaModule } from './prisma/prisma.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
