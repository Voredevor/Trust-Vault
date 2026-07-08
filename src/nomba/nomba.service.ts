import {
	BadGatewayException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance, Method } from 'axios';

type NombaAccountScope = 'parent' | 'sub';

export interface NombaTokenData {
	businessId: string;
	access_token: string;
	refresh_token: string;
	expiresAt: string;
}

export interface NombaApiResponse<T> {
	code: string;
	description: string;
	data: T;
}

export interface NombaRequestOptions<TBody = unknown> {
	method: Method;
	path: string;
	body?: TBody;
	accountScope?: NombaAccountScope;
}

export interface NombaAccountBalanceData {
	amount: string;
	currency: string;
	timeCreated: string;
}

export interface NombaCreateVirtualAccountData {
	createdAt: string;
	accountHolderId: string;
	accountRef: string;
	bvn?: string;
	accountName: string;
	bankName: string;
	bankAccountNumber: string;
	bankAccountName: string;
	currency: string;
	callbackUrl?: string;
	expired: boolean;
}

export interface CreateVirtualAccountRequest {
	accountRef: string;
	accountName: string;
	currency: string;
	bvn?: string;
	expiryDate?: string;
	expectedAmount?: number;
}

export interface UpdateVirtualAccountRequest {
	newAccountRef?: string;
	accountName?: string;
	callbackUrl?: string;
	expectedAmount?: number;
}

export interface NombaBankLookupRequest {
	bankCode: string;
	accountNumber: string;
}

export interface NombaBankLookupData {
	accountName?: string;
	accountNumber?: string;
	bankCode?: string;
	bankName?: string;
	[key: string]: unknown;
}

export interface NombaBankTransferRequest {
	amount: number;
	bankCode: string;
	accountNumber: string;
	accountName?: string;
	narration?: string;
	reference: string;
	currency?: string;
}

export interface NombaBankTransferData {
	reference?: string;
	transactionReference?: string;
	sessionId?: string;
	status?: string;
	[key: string]: unknown;
}

interface CachedNombaToken {
	accessToken: string;
	refreshToken: string;
	expiresAt: Date;
}

@Injectable()
export class NombaService {
	private readonly httpClient: AxiosInstance;
	private cachedToken?: CachedNombaToken;

	constructor(private readonly configService: ConfigService) {
		this.httpClient = axios.create({
			baseURL: this.baseUrl,
			timeout: 15000,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	async obtainAccessToken(): Promise<NombaTokenData> {
		try {
			const response = await this.httpClient.post<NombaApiResponse<NombaTokenData>>(
				'/v1/auth/token/issue',
				{
					grant_type: 'client_credentials',
					client_id: this.clientId,
					client_secret: this.clientSecret,
				},
				{
					headers: {
						accountId: this.parentAccountId,
					},
				},
			);

			this.assertSuccess(response.data);
			this.cachedToken = {
				accessToken: response.data.data.access_token,
				refreshToken: response.data.data.refresh_token,
				expiresAt: new Date(response.data.data.expiresAt),
			};

			return response.data.data;
		} catch (error) {
			this.handleNombaError(error);
		}
	}

	async request<TResponse, TBody = unknown>(
		options: NombaRequestOptions<TBody>,
	): Promise<NombaApiResponse<TResponse>> {
		const accessToken = await this.getAccessToken();
		const accountId = this.resolveAccountId(options.accountScope);

		try {
			const response = await this.httpClient.request<NombaApiResponse<TResponse>>({
				method: options.method,
				url: options.path,
				data: options.body,
				headers: {
					Authorization: `Bearer ${accessToken}`,
					accountId,
				},
			});

			this.assertSuccess(response.data);
			return response.data;
		} catch (error) {
			this.handleNombaError(error);
		}
	}

	async fetchParentAccountBalance(): Promise<NombaApiResponse<NombaAccountBalanceData>> {
		return this.request<NombaAccountBalanceData>({
			method: 'GET',
			path: '/v1/accounts/balance',
			accountScope: 'parent',
		});
	}

	async createSubAccountVirtualAccount(
		payload: CreateVirtualAccountRequest,
	): Promise<NombaApiResponse<NombaCreateVirtualAccountData>> {
		return this.request<NombaCreateVirtualAccountData, CreateVirtualAccountRequest>({
			method: 'POST',
			path: `/v1/accounts/virtual/${this.subAccountId}`,
			body: payload,
			accountScope: 'parent',
		});
	}

	async fetchVirtualAccount(identifier: string): Promise<NombaApiResponse<NombaCreateVirtualAccountData>> {
		return this.request<NombaCreateVirtualAccountData>({
			method: 'GET',
			path: `/v1/accounts/virtual/${identifier}`,
			accountScope: 'parent',
		});
	}

	async updateVirtualAccount(
		identifier: string,
		payload: UpdateVirtualAccountRequest,
	): Promise<NombaApiResponse<{ updated: boolean }>> {
		return this.request<{ updated: boolean }, UpdateVirtualAccountRequest>({
			method: 'PUT',
			path: `/v1/accounts/virtual/${identifier}`,
			body: payload,
			accountScope: 'parent',
		});
	}

	async expireVirtualAccount(identifier: string): Promise<NombaApiResponse<{ expired: boolean }>> {
		return this.request<{ expired: boolean }>({
			method: 'DELETE',
			path: `/v1/accounts/virtual/${identifier}`,
			accountScope: 'parent',
		});
	}

	async lookupBankAccount(
		payload: NombaBankLookupRequest,
	): Promise<NombaApiResponse<NombaBankLookupData>> {
		return this.request<NombaBankLookupData, NombaBankLookupRequest>({
			method: 'POST',
			path: '/v1/transfers/bank/lookup',
			body: payload,
			accountScope: 'parent',
		});
	}

	async createBankTransfer(
		payload: NombaBankTransferRequest,
	): Promise<NombaApiResponse<NombaBankTransferData>> {
		return this.request<NombaBankTransferData, NombaBankTransferRequest>({
			method: 'POST',
			path: '/v1/transfers/bank',
			body: payload,
			accountScope: 'parent',
		});
	}

	private async getAccessToken(): Promise<string> {
		if (this.cachedToken && !this.isTokenExpired(this.cachedToken.expiresAt)) {
			return this.cachedToken.accessToken;
		}

		const token = await this.obtainAccessToken();
		return token.access_token;
	}

	private isTokenExpired(expiresAt: Date): boolean {
		const refreshBufferInMilliseconds = 5 * 60 * 1000;
		return Date.now() >= expiresAt.getTime() - refreshBufferInMilliseconds;
	}

	private resolveAccountId(scope: NombaAccountScope = 'parent'): string {
		if (scope === 'sub') {
			return this.subAccountId;
		}

		return this.parentAccountId;
	}

	private assertSuccess<T>(response: NombaApiResponse<T>): void {
		if (response.code === '00') {
			return;
		}

		throw new UnauthorizedException(
			`Nomba request failed: ${response.description}`,
		);
	}

	private handleNombaError(error: unknown): never {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<{
				description?: string;
				message?: string;
				error?: string;
			}>;
			const upstreamMessage =
				axiosError.response?.data?.description ??
				axiosError.response?.data?.message ??
				axiosError.response?.data?.error ??
				axiosError.message;

			throw new BadGatewayException(`Nomba request failed: ${upstreamMessage}`);
		}

		throw error;
	}

	private get baseUrl(): string {
		return this.configService.get<string>('NOMBA_BASE_URL') ?? 'https://api.nomba.com';
	}

	private get parentAccountId(): string {
		return this.configService.getOrThrow<string>('NOMBA_PARENT_ACCOUNT_ID');
	}

	private get subAccountId(): string {
		return this.configService.getOrThrow<string>('NOMBA_SUB_ACCOUNT_ID');
	}

	private get clientId(): string {
		return this.configService.getOrThrow<string>('NOMBA_CLIENT_ID');
	}

	private get clientSecret(): string {
		return this.configService.getOrThrow<string>('NOMBA_PRIVATE_KEY');
	}
}
