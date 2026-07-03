export class CreateVirtualAccountDto {
	accountRef: string;
	accountName: string;
	currency: string;
	bvn?: string;
	expiryDate?: string;
	expectedAmount?: number;
}
