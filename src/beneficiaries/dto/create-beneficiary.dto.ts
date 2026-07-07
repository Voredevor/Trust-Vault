export class CreateBeneficiaryDto {
  userId: string;
  displayName: string;
  type?: 'BANK_ACCOUNT' | 'WALLET';
  status?: 'PENDING' | 'TRUSTED' | 'REVOKED';
  bankName?: string;
  bankCode?: string;
  accountName?: string;
  accountNumber?: string;
  externalReference?: string;
  isTrusted?: boolean;
  metadata?: Record<string, unknown>;
}
