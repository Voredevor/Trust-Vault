import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export type TrustRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TrustDecisionAction = 'ALLOW' | 'REVIEW' | 'STEP_UP' | 'BLOCK';

export interface TrustRiskSignal {
	key: string;
	description: string;
	impact: number;
}

export interface TrustAssessment {
	userId: string;
	score: number;
	riskLevel: TrustRiskLevel;
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

		const [devices, transactions, virtualAccounts] = await Promise.all([
			this.prisma.device.findMany({
				where: { userId },
				select: { status: true, trustedAt: true, lastSeenAt: true },
			}),
			this.prisma.transaction.findMany({
				where: { userId },
				select: { status: true, direction: true, occurredAt: true },
			}),
			this.prisma.virtualAccount.findMany({
				where: { userId },
				select: { status: true },
			}),
		]);

		const signals: TrustRiskSignal[] = [];
		let score = 100;

		score = this.applyUserStatusSignal(user.status, score, signals);
		score = this.applyDeviceSignals(devices, score, signals);
		score = this.applyTransactionSignals(transactions, score, signals);
		score = this.applyVirtualAccountSignals(virtualAccounts, score, signals);

		score = this.clampScore(score);

		return {
			userId,
			score,
			riskLevel: this.resolveRiskLevel(score),
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

	private applyUserStatusSignal(
		status: { toString(): string },
		score: number,
		signals: TrustRiskSignal[],
	): number {
		const normalizedStatus = String(status);
		if (normalizedStatus === 'ACTIVE') {
			signals.push({ key: 'user.active', description: 'User account is active', impact: 0 });
			return score;
		}

		if (normalizedStatus === 'PENDING') {
			signals.push({ key: 'user.pending', description: 'User account is pending review', impact: -15 });
			return score - 15;
		}

		if (normalizedStatus === 'SUSPENDED') {
			signals.push({ key: 'user.suspended', description: 'User account is suspended', impact: -50 });
			return score - 50;
		}

		signals.push({ key: 'user.disabled', description: 'User account is disabled', impact: -80 });
		return score - 80;
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
				description: `${trustedCount} trusted device(s) linked to the account`,
				impact,
			});
			score += impact;
		}

		if (pendingCount > 0) {
			const impact = pendingCount * -8;
			signals.push({
				key: 'devices.pending',
				description: `${pendingCount} pending device(s) still need review`,
				impact,
			});
			score += impact;
		}

		if (revokedCount > 0) {
			const impact = revokedCount * -20;
			signals.push({
				key: 'devices.revoked',
				description: `${revokedCount} revoked device(s) were seen`,
				impact,
			});
			score += impact;
		}

		return score;
	}

	private applyTransactionSignals(
		transactions: Array<{ status: { toString(): string }; direction: { toString(): string } }>,
		score: number,
		signals: TrustRiskSignal[],
	): number {
		const successfulCredits = transactions.filter(
			(transaction) => String(transaction.status) === 'SUCCESS' && String(transaction.direction) === 'CREDIT',
		).length;
		const failedTransactions = transactions.filter(
			(transaction) => ['FAILED', 'REVERSED'].includes(String(transaction.status)),
		).length;
		const pendingTransactions = transactions.filter(
			(transaction) => String(transaction.status) === 'PENDING',
		).length;

		if (successfulCredits > 0) {
			const impact = Math.min(successfulCredits * 2, 10);
			signals.push({
				key: 'transactions.successful',
				description: `${successfulCredits} successful incoming transaction(s)`,
				impact,
			});
			score += impact;
		}

		if (failedTransactions > 0) {
			const impact = failedTransactions * -10;
			signals.push({
				key: 'transactions.failed',
				description: `${failedTransactions} failed or reversed transaction(s)`,
				impact,
			});
			score += impact;
		}

		if (pendingTransactions > 0) {
			const impact = pendingTransactions * -4;
			signals.push({
				key: 'transactions.pending',
				description: `${pendingTransactions} pending transaction(s) are unresolved`,
				impact,
			});
			score += impact;
		}

		return score;
	}

	private applyVirtualAccountSignals(
		virtualAccounts: Array<{ status: { toString(): string } }>,
		score: number,
		signals: TrustRiskSignal[],
	): number {
		const activeCount = virtualAccounts.filter((virtualAccount) => String(virtualAccount.status) === 'ACTIVE').length;
		const inactiveCount = virtualAccounts.filter((virtualAccount) => String(virtualAccount.status) === 'INACTIVE').length;
		const closedCount = virtualAccounts.filter((virtualAccount) => String(virtualAccount.status) === 'CLOSED').length;

		if (activeCount > 0) {
			const impact = Math.min(activeCount * 2, 6);
			signals.push({
				key: 'virtual-accounts.active',
				description: `${activeCount} active virtual account(s) available`,
				impact,
			});
			score += impact;
		}

		if (inactiveCount > 0) {
			signals.push({
				key: 'virtual-accounts.inactive',
				description: `${inactiveCount} inactive virtual account(s) were found`,
				impact: inactiveCount * -5,
			});
			score += inactiveCount * -5;
		}

		if (closedCount > 0) {
			signals.push({
				key: 'virtual-accounts.closed',
				description: `${closedCount} closed virtual account(s) were found`,
				impact: closedCount * -10,
			});
			score += closedCount * -10;
		}

		return score;
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

		if (score >= 65) {
			return 'REVIEW';
		}

		if (score >= 40) {
			return 'STEP_UP';
		}

		return 'BLOCK';
	}

	private buildDecisionReason(action: TrustDecisionAction, assessment: TrustAssessment): string {
		const strongestSignal = assessment.signals.length
			? [...assessment.signals].sort(
				(leftSignal, rightSignal) => Math.abs(rightSignal.impact) - Math.abs(leftSignal.impact),
			)[0]
			: null;

		if (!strongestSignal) {
			return `No negative trust signals found. Trust score ${assessment.score} supports ${action.toLowerCase()}.`;
		}

		return `Trust score ${assessment.score} leads to ${action.toLowerCase()} because ${strongestSignal.description}.`;
	}

	private buildSummary(score: number, signals: TrustRiskSignal[]): string {
		if (!signals.length) {
			return `Trust score ${score}: no notable trust signals found.`;
		}

		const strongestSignal = [...signals].sort((leftSignal, rightSignal) => Math.abs(rightSignal.impact) - Math.abs(leftSignal.impact))[0];
		return `Trust score ${score}: ${strongestSignal.description}`;
	}
}
