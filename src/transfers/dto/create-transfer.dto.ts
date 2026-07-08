export class CreateTransferDto {
  userId: string;
  virtualAccountId?: string;
  recipientBank: string;
  recipientBankCode: string;
  recipientAccount: string;
  amount: string | number;
  narration?: string;
  currency?: string;
}
