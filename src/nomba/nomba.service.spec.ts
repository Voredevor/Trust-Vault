import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { NombaService } from './nomba.service';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

describe('NombaService', () => {
  let service: NombaService;
  let postMock: jest.Mock;
  let requestMock: jest.Mock;

  beforeEach(async () => {
    postMock = jest.fn();
    requestMock = jest.fn();

    (axios.create as jest.Mock).mockReturnValue({
      post: postMock,
      request: requestMock,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NombaService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              const values: Record<string, string> = {
                NOMBA_BASE_URL: 'https://api.nomba.com',
              };

              return values[key];
            },
            getOrThrow: (key: string) => {
              const values: Record<string, string> = {
                NOMBA_PARENT_ACCOUNT_ID: 'parent-account-id',
                NOMBA_SUB_ACCOUNT_ID: 'sub-account-id',
                NOMBA_CLIENT_ID: 'client-id',
                NOMBA_PRIVATE_KEY: 'private-key',
              };

              const value = values[key];
              if (!value) {
                throw new Error(`Missing config value: ${key}`);
              }

              return value;
            },
          },
        },
      ],
    }).compile();

    service = module.get<NombaService>(NombaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('obtains an access token with the parent account header', async () => {
    postMock.mockResolvedValue({
      data: {
        code: '00',
        description: 'Success',
        data: {
          businessId: 'business-id',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          expiresAt: '2026-07-03T12:30:00Z',
        },
      },
    });

    const token = await service.obtainAccessToken();

    expect(token.access_token).toBe('access-token');
    expect(postMock).toHaveBeenCalledWith(
      '/v1/auth/token/issue',
      {
        grant_type: 'client_credentials',
        client_id: 'client-id',
        client_secret: 'private-key',
      },
      {
        headers: {
          accountId: 'parent-account-id',
        },
      },
    );
  });

  it('fetches the parent account balance with a bearer token', async () => {
    postMock.mockResolvedValueOnce({
      data: {
        code: '00',
        description: 'Success',
        data: {
          businessId: 'business-id',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          expiresAt: '2026-07-03T12:30:00Z',
        },
      },
    });

    requestMock.mockResolvedValueOnce({
      data: {
        code: '00',
        description: 'Success',
        data: {
          amount: '1000.00',
          currency: 'NGN',
          timeCreated: '2026-07-03T12:30:00Z',
        },
      },
    });

    const response = await service.fetchParentAccountBalance();

    expect(response.data.amount).toBe('1000.00');
    expect(requestMock).toHaveBeenCalledWith({
      method: 'GET',
      url: '/v1/accounts/balance',
      data: undefined,
      headers: {
        Authorization: 'Bearer access-token',
        accountId: 'parent-account-id',
      },
    });
  });

  it('creates a virtual account for the configured sub account', async () => {
    postMock.mockResolvedValueOnce({
      data: {
        code: '00',
        description: 'Success',
        data: {
          businessId: 'business-id',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          expiresAt: '2026-07-03T12:30:00Z',
        },
      },
    });

    requestMock.mockResolvedValueOnce({
      data: {
        code: '00',
        description: 'Success',
        data: {
          createdAt: '2026-07-03T12:30:00Z',
          accountHolderId: 'account-holder-id',
          accountRef: 'account-ref',
          accountName: 'TrustVault User',
          bankName: 'Nombank MFB',
          bankAccountNumber: '1234567890',
          bankAccountName: 'TrustVault User',
          currency: 'NGN',
          expired: false,
        },
      },
    });

    const response = await service.createSubAccountVirtualAccount({
      accountRef: 'account-ref',
      accountName: 'TrustVault User',
      currency: 'NGN',
    });

    expect(response.data.accountRef).toBe('account-ref');
    expect(requestMock).toHaveBeenCalledWith({
      method: 'POST',
      url: '/v1/accounts/virtual/sub-account-id',
      data: {
        accountRef: 'account-ref',
        accountName: 'TrustVault User',
        currency: 'NGN',
      },
      headers: {
        Authorization: 'Bearer access-token',
        accountId: 'parent-account-id',
      },
    });
  });
});
