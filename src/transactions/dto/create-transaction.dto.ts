export class CreateTransactionDto {
  userId?: string;
  virtualAccountId?: string;
  beneficiaryId?: string;
  reference: string;
  providerReference?: string;
  direction: 'CREDIT' | 'DEBIT';
  status?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED';
  amount: string | number;
  currency?: string;
  narration?: string;
  metadata?: Record<string, unknown>;
}
