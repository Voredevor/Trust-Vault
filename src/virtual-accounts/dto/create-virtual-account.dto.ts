export class CreateVirtualAccountDto {
	userId?: string;
	accountRef: string;
	accountName: string;
	currency: string;
	bvn?: string;
	expiryDate?: string;
	expectedAmount?: number;
}
