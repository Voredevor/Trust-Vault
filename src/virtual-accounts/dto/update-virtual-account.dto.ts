export class UpdateVirtualAccountDto {
	newAccountRef?: string;
	accountName?: string;
	callbackUrl?: string;
	expectedAmount?: number;
}
