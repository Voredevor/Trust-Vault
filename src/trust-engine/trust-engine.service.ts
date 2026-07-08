import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export type TrustRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TrustDecisionAction = 'ALLOW' | 'REVIEW' | 'BLOCK';

export interface TrustRiskSignal {
	key: string;
	description: string;
	impact: number;
}

export interface TrustMetrics {
	successfulPayments: number;
	failedPayments: number;
	pendingPayments: number;
	activeVirtualAccounts: number;
	closedVirtualAccounts: number;
	accountAgeDays: number;
	customerStatus: string;
	auditEvents: number;
	recentActivityCount: number;
}

export interface TrustAssessment {
	userId: string;
	score: number;
	riskLevel: TrustRiskLevel;
	metrics: TrustMetrics;
	signals: TrustRiskSignal[];
	summary: string;
}

export interface TrustDecision {
	userId: string;
	action: TrustDecisionAction;
	reason: string;
	assessment: TrustAssessment;
}

@Injectable()
export class TrustEngineService {
	constructor(private readonly prisma: PrismaService) {}

	async assessUserTrust(userId: string): Promise<TrustAssessment> {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				status: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!user) {
			throw new NotFoundException(`User ${userId} not found`);
		}

		const [devices, transactions, virtualAccounts, auditLogs] = await Promise.all([
			this.prisma.device.findMany({
				where: { userId },
				select: { status: true, trustedAt: true, lastSeenAt: true },
			}),
			this.prisma.transaction.findMany({
				where: { userId },
				select: { status: true, direction: true, occurredAt: true, createdAt: true },
			}),
			this.prisma.virtualAccount.findMany({
				where: { userId },
				select: { status: true },
			}),
			this.prisma.auditLog.findMany({
				where: { userId },
				select: { action: true, severity: true, createdAt: true },
			}),
		]);

		const metrics = this.buildMetrics(user, transactions, virtualAccounts, auditLogs);
		const signals: TrustRiskSignal[] = [];
		let score = 50;

		score = this.applyUserStatusSignal(metrics.customerStatus, score, signals);
		score = this.applyAccountAgeSignal(metrics.accountAgeDays, score, signals);
		score = this.applyDeviceSignals(devices, score, signals);
		score = this.applyTransactionSignals(metrics, score, signals);
		score = this.applyVirtualAccountSignals(metrics, score, signals);
		score = this.applyAuditSignals(auditLogs, score, signals);
		score = this.applyRecentActivitySignals(metrics, score, signals);
		score = this.clampScore(score);

		return {
			userId,
			score,
			riskLevel: this.resolveRiskLevel(score),
			metrics,
			signals,
			summary: this.buildSummary(score, signals),
		};
	}

	async decideUserTrust(userId: string): Promise<TrustDecision> {
		const assessment = await this.assessUserTrust(userId);
		const action = this.resolveDecisionAction(assessment.score);
		const reason = this.buildDecisionReason(action, assessment);

		return {
			userId,
			action,
			reason,
			assessment,
		};
	}

	private buildMetrics(
		user: { status: { toString(): string }; createdAt: Date },
		transactions: Array<{ status: { toString(): string }; direction: { toString(): string }; occurredAt: Date; createdAt: Date }>,
		virtualAccounts: Array<{ status: { toString(): string } }>,
		auditLogs: Array<{ action: string; severity: { toString(): string } }>,
	): TrustMetrics {
		const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
		const accountAgeDays = Math.max(
			0,
			Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (24 * 60 * 60 * 1000)),
		);

		return {
			successfulPayments: transactions.filter(
				(transaction) => String(transaction.status) === 'SUCCESS',
			).length,
			failedPayments: transactions.filter(
				(transaction) => ['FAILED', 'REVERSED'].includes(String(transaction.status)),
			).length,
			pendingPayments: transactions.filter(
				(transaction) => String(transaction.status) === 'PENDING',
			).length,
			activeVirtualAccounts: virtualAccounts.filter(
				(virtualAccount) => String(virtualAccount.status) === 'ACTIVE',
			).length,
			closedVirtualAccounts: virtualAccounts.filter(
				(virtualAccount) => String(virtualAccount.status) === 'CLOSED',
			).length,
			accountAgeDays,
			customerStatus: String(user.status),
			auditEvents: auditLogs.length,
			recentActivityCount: transactions.filter((transaction) => {
				const activityDate = new Date(transaction.occurredAt ?? transaction.createdAt).getTime();
				return activityDate >= thirtyDaysAgo;
			}).length,
		};
	}

	private applyUserStatusSignal(
		status: string,
		score: number,
		signals: TrustRiskSignal[],
	): number {
		if (status === 'ACTIVE') {
			signals.push({ key: 'user.active', description: 'Customer status is active', impact: 15 });
			return score + 15;
		}

		if (status === 'PENDING') {
			signals.push({ key: 'user.pending', description: 'Customer status is pending review', impact: -15 });
			return score - 15;
		}

		if (status === 'SUSPENDED') {
			signals.push({ key: 'user.suspended', description: 'Customer status is suspended', impact: -50 });
			return score - 50;
		}

		signals.push({ key: 'user.disabled', description: 'Customer status is disabled', impact: -80 });
		return score - 80;
	}

	private applyAccountAgeSignal(
		accountAgeDays: number,
		score: number,
		signals: TrustRiskSignal[],
	): number {
		if (accountAgeDays >= 90) {
			signals.push({
				key: 'account.age.established',
				description: `Customer account is established at ${accountAgeDays} day(s) old`,
				impact: 10,
			});
			return score + 10;
		}

		if (accountAgeDays >= 30) {
			signals.push({
				key: 'account.age.maturing',
				description: `Customer account is ${accountAgeDays} day(s) old`,
				impact: 5,
			});
			return score + 5;
		}

		signals.push({
			key: 'account.age.new',
			description: `Customer account is new at ${accountAgeDays} day(s) old`,
			impact: -5,
		});
		return score - 5;
	}

	private applyDeviceSignals(
		devices: Array<{ status: { toString(): string } }>,
		score: number,
		signals: TrustRiskSignal[],
	): number {
		const trustedCount = devices.filter((device) => String(device.status) === 'TRUSTED').length;
		const pendingCount = devices.filter((device) => String(device.status) === 'PENDING').length;
		const revokedCount = devices.filter((device) => String(device.status) === 'REVOKED').length;

		if (trustedCount > 0) {
			const impact = Math.min(trustedCount * 5, 15);
			signals.push({
				key: 'devices.trusted',
				description: `${trustedCount} trusted device(s) linked to this customer`,
				impact,
			});
			score += impact;
		}

		if (pendingCount > 0) {
			const impact = pendingCount * -8;
			signals.push({
				key: 'devices.pending',
				description: `${pendingCount} pending device(s) still need review for this customer`,
				impact,
			});
			score += impact;
		}

		if (revokedCount > 0) {
			const impact = revokedCount * -20;
			signals.push({
				key: 'devices.revoked',
				description: `${revokedCount} revoked device(s) were seen for this customer`,
				impact,
			});
			score += impact;
		}

		return score;
	}

	private applyTransactionSignals(
		metrics: TrustMetrics,
		score: number,
		signals: TrustRiskSignal[],
	): number {
		if (metrics.successfulPayments > 0) {
			const impact = Math.min(metrics.successfulPayments * 3, 18);
			signals.push({
				key: 'transactions.successful',
				description: `${metrics.successfulPayments} successful payment(s) for this customer`,
				impact,
			});
			score += impact;
		}

		if (metrics.failedPayments > 0) {
			const impact = metrics.failedPayments * -12;
			signals.push({
				key: 'transactions.failed',
				description: `${metrics.failedPayments} failed or reversed payment(s) for this customer`,
				impact,
			});
			score += impact;
		}

		if (metrics.pendingPayments > 0) {
			const impact = metrics.pendingPayments * -4;
			signals.push({
				key: 'transactions.pending',
				description: `${metrics.pendingPayments} pending payment(s) are unresolved for this customer`,
				impact,
			});
			score += impact;
		}

		return score;
	}

	private applyVirtualAccountSignals(
		metrics: TrustMetrics,
		score: number,
		signals: TrustRiskSignal[],
	): number {
		if (metrics.activeVirtualAccounts > 0) {
			const impact = Math.min(metrics.activeVirtualAccounts * 4, 12);
			signals.push({
				key: 'virtual-accounts.active',
				description: `${metrics.activeVirtualAccounts} active virtual account(s) for this customer`,
				impact,
			});
			score += impact;
		}

		if (metrics.closedVirtualAccounts > 0) {
			const impact = metrics.closedVirtualAccounts * -8;
			signals.push({
				key: 'virtual-accounts.closed',
				description: `${metrics.closedVirtualAccounts} closed virtual account(s) for this customer`,
				impact,
			});
			score += impact;
		}

		return score;
	}

	private applyAuditSignals(
		auditLogs: Array<{ action: string; severity: { toString(): string } }>,
		score: number,
		signals: TrustRiskSignal[],
	): number {
		const lowCount = auditLogs.filter((auditLog) => String(auditLog.severity) === 'LOW').length;
		const mediumCount = auditLogs.filter((auditLog) => String(auditLog.severity) === 'MEDIUM').length;
		const highCount = auditLogs.filter((auditLog) => ['HIGH', 'CRITICAL'].includes(String(auditLog.severity))).length;

		if (lowCount > 0) {
			const impact = Math.min(lowCount, 5);
			signals.push({
				key: 'audit.low',
				description: `${lowCount} low-severity audit event(s) recorded for this customer`,
				impact,
			});
			score += impact;
		}

		if (mediumCount > 0) {
			const impact = mediumCount * -6;
			signals.push({
				key: 'audit.medium',
				description: `${mediumCount} medium-severity audit event(s) recorded for this customer`,
				impact,
			});
			score += impact;
		}

		if (highCount > 0) {
			const impact = highCount * -18;
			signals.push({
				key: 'audit.high',
				description: `${highCount} high or critical audit event(s) recorded for this customer`,
				impact,
			});
			score += impact;
		}

		return score;
	}

	private applyRecentActivitySignals(
		metrics: TrustMetrics,
		score: number,
		signals: TrustRiskSignal[],
	): number {
		if (metrics.recentActivityCount > 0) {
			const impact = Math.min(metrics.recentActivityCount * 2, 8);
			signals.push({
				key: 'activity.recent',
				description: `${metrics.recentActivityCount} recent payment event(s) in the last 30 days`,
				impact,
			});
			return score + impact;
		}

		signals.push({
			key: 'activity.none-recent',
			description: 'No recent payment activity in the last 30 days',
			impact: -5,
		});
		return score - 5;
	}

	private clampScore(score: number): number {
		return Math.max(0, Math.min(100, Math.round(score)));
	}

	private resolveRiskLevel(score: number): TrustRiskLevel {
		if (score >= 80) {
			return 'LOW';
		}

		if (score >= 60) {
			return 'MEDIUM';
		}

		if (score >= 40) {
			return 'HIGH';
		}

		return 'CRITICAL';
	}

	private resolveDecisionAction(score: number): TrustDecisionAction {
		if (score >= 85) {
			return 'ALLOW';
		}

		if (score >= 55) {
			return 'REVIEW';
		}

		return 'BLOCK';
	}

	private buildDecisionReason(action: TrustDecisionAction, assessment: TrustAssessment): string {
		const signalSummary = assessment.signals.length
			? assessment.signals
				.map((signal) => `${signal.description} (${signal.impact >= 0 ? '+' : ''}${signal.impact})`)
				.join('; ')
			: 'no risk signals were found for this customer';

		return `Trust score ${assessment.score} leads to ${action.toLowerCase()} for this customer based on: ${signalSummary}.`;
	}

	private buildSummary(score: number, signals: TrustRiskSignal[]): string {
		if (!signals.length) {
			return `Trust score ${score}: no notable trust signals found for this customer.`;
		}

		const signalSummary = signals
			.map((signal) => `${signal.description} (${signal.impact >= 0 ? '+' : ''}${signal.impact})`)
			.join('; ');
		return `Trust score ${score}: ${signalSummary}`;
	}
}
