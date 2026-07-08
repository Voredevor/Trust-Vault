import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      customers,
      virtualAccounts,
      transactionsToday,
      webhooksToday,
      pendingRiskReviews,
      failedTransfers,
      recentTransactions,
      recentWebhookEvents,
      recentAuditLogs,
    ] = await Promise.all([
      this.prisma.user.count({
        where: { deletedAt: null },
      }),
      this.prisma.virtualAccount.count({
        where: { archivedAt: null },
      }),
      this.prisma.transaction.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      this.prisma.webhookEvent.count({
        where: { receivedAt: { gte: startOfToday } },
      }),
      this.prisma.user.count({
        where: { deletedAt: null, status: { in: ['PENDING', 'SUSPENDED'] } },
      }),
      this.prisma.transaction.count({
        where: { direction: 'DEBIT', status: { in: ['FAILED', 'REVERSED'] } },
      }),
      this.prisma.transaction.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
      this.prisma.webhookEvent.findMany({
        take: 5,
        orderBy: { receivedAt: 'desc' },
      }),
      this.prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      customers,
      virtualAccounts,
      transactionsToday,
      webhooksToday,
      pendingRiskReviews,
      failedTransfers,
      recentActivity: {
        transactions: recentTransactions,
        webhooks: recentWebhookEvents,
        auditLogs: recentAuditLogs,
      },
    };
  }
}
