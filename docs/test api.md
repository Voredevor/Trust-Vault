# TrustVault Test API

This file is the running list of API calls you can try in Postman or curl.
I’ll keep updating it as new endpoints are added.

## Environment Variables

Use these in Postman as variables where possible.

- `baseUrl` = `http://localhost:3000`
- `nombaBaseUrl` = `https://api.nomba.com`
- `nombaParentAccountId` = your parent account ID
- `nombaSubAccountId` = your sub-account ID
- `nombaClientId` = your Nomba client ID
- `nombaClientSecret` = your Nomba client secret
- `nombaAccessToken` = the access token returned by the auth call
- `virtualAccountRef` = a unique virtual account reference you choose
- `virtualAccountIdentifier` = the account reference or virtual account number

## 1. Get Nomba Access Token

Method: `POST`

URL:

`https://api.nomba.com/v1/auth/token/issue`

Headers:

- `Content-Type: application/json`
- `accountId: {{nombaParentAccountId}}`

Body:

```json
{
  "grant_type": "client_credentials",
  "client_id": "{{nombaClientId}}",
  "client_secret": "{{nombaClientSecret}}"
}
```

Use the `data.access_token` value as `nombaAccessToken`.

## 2. Fetch Parent Account Balance

Method: `GET`

URL:

`https://api.nomba.com/v1/accounts/balance`

Headers:

- `Authorization: Bearer {{nombaAccessToken}}`
- `accountId: {{nombaParentAccountId}}`

## 3. Create a Virtual Account for the Sub Account

Method: `POST`

URL:

`https://api.nomba.com/v1/accounts/virtual/{{nombaSubAccountId}}`

Headers:

- `Authorization: Bearer {{nombaAccessToken}}`
- `Content-Type: application/json`
- `accountId: {{nombaParentAccountId}}`

Body:

```json
{
  "accountRef": "{{virtualAccountRef}}",
  "accountName": "TrustVaultPhaseFour",
  "currency": "NGN"
}
```

Rules I learned from live testing:
- Keep `accountName` simple and alphanumeric.
- Use a unique `accountRef` every time.

## 4. Fetch a Virtual Account

Method: `GET`

URL:

`https://api.nomba.com/v1/accounts/virtual/{{virtualAccountIdentifier}}`

Headers:

- `Authorization: Bearer {{nombaAccessToken}}`
- `accountId: {{nombaParentAccountId}}`

Use this to look up the account by account reference or virtual account number.

## 5. Update a Virtual Account

Method: `PUT`

URL:

`https://api.nomba.com/v1/accounts/virtual/{{virtualAccountIdentifier}}`

Headers:

- `Authorization: Bearer {{nombaAccessToken}}`
- `Content-Type: application/json`
- `accountId: {{nombaParentAccountId}}`

Body:

```json
{
  "newAccountRef": "{{virtualAccountRef}}",
  "accountName": "TrustVaultPhaseFour",
  "callbackUrl": "https://your-public-webhook-url.example/webhooks/nomba"
}
```

## 6. Expire a Virtual Account

Method: `DELETE`

URL:

`https://api.nomba.com/v1/accounts/virtual/{{virtualAccountIdentifier}}`

Headers:

- `Authorization: Bearer {{nombaAccessToken}}`
- `accountId: {{nombaParentAccountId}}`

## 7. TrustVault Local APIs

These are the app-level endpoints for the current phase.

### Create and persist a virtual account

Method: `POST`

URL:

`{{baseUrl}}/virtual-accounts`

Body:

```json
{
  "accountRef": "{{virtualAccountRef}}",
  "accountName": "TrustVaultPhaseFour",
  "currency": "NGN"
}
```

### List persisted virtual accounts

Method: `GET`

URL:

`{{baseUrl}}/virtual-accounts`

### Fetch a persisted virtual account by database id

Method: `GET`

URL:

`{{baseUrl}}/virtual-accounts/{{id}}`

### Lookup a Nomba virtual account from TrustVault

Method: `GET`

URL:

`{{baseUrl}}/virtual-accounts/nomba/{{virtualAccountIdentifier}}`

### Update a Nomba virtual account from TrustVault

Method: `PATCH`

URL:

`{{baseUrl}}/virtual-accounts/nomba/{{virtualAccountIdentifier}}`

Body:

```json
{
  "newAccountRef": "{{virtualAccountRef}}",
  "accountName": "TrustVaultPhaseFour",
  "callbackUrl": "https://your-public-webhook-url.example/webhooks/nomba"
}
```

### Expire a Nomba virtual account from TrustVault

Method: `DELETE`

URL:

`{{baseUrl}}/virtual-accounts/nomba/{{virtualAccountIdentifier}}`

## Notes

- Keep `accountName` plain and alphanumeric for Nomba.
- If Nomba returns validation errors, test the same payload in Postman before changing code.
- I’ll append new endpoints here as we add them.
