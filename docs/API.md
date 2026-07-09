# API

Base URL for local development:

```text
http://localhost:3000
```

Most endpoints return JSON. Errors use NestJS HTTP errors, usually with a `statusCode`, `message`, and `error`.

## Dashboard and Settings

### Operator dashboard page

Purpose: serves the embedded TrustVault admin dashboard.

Method: `GET`

Route: `/`

Response:

```html
<!doctype html>...
```

Possible errors:

- `500` if the server fails before rendering the page.

### Dashboard summary

Purpose: returns counts and recent records used by the dashboard.

Method: `GET`

Route: `/dashboard`

Response:

```json
{
  "customers": 12,
  "virtualAccounts": 8,
  "transactionsToday": 4,
  "webhooksToday": 4,
  "pendingRiskReviews": 1,
  "failedTransfers": 0,
  "recentActivity": {
    "transactions": [],
    "webhooks": [],
    "auditLogs": []
  }
}
```

Possible errors:

- `500` if the database is unavailable.

Settings are shown in the dashboard UI. There is no separate settings API yet.

## Customers

### Create customer

Purpose: creates a customer record.

Method: `POST`

Route: `/users`

Request body:

```json
{
  "email": "ada@example.com",
  "firstName": "Ada",
  "lastName": "Okafor",
  "phoneNumber": "08000000000",
  "password": "optional-password",
  "status": "ACTIVE",
  "role": "USER"
}
```

Response: created user record.

Possible errors:

- `400` for invalid request data.
- `409` if unique fields such as email or phone number already exist.
- `500` if the database write fails.

### List customers

Purpose: lists customers.

Method: `GET`

Route: `/users`

Query:

- `includeArchived=true` includes archived customers.

Response:

```json
[
  {
    "id": "uuid",
    "email": "ada@example.com",
    "firstName": "Ada",
    "lastName": "Okafor",
    "status": "ACTIVE",
    "deletedAt": null
  }
]
```

Possible errors:

- `500` if the database read fails.

### Get customer

Purpose: returns one customer with related profile data.

Method: `GET`

Route: `/users/:id`

Response: user record with devices, beneficiaries, virtual accounts, transactions, and audit logs.

Possible errors:

- `404` if the customer does not exist.

### Update customer

Purpose: updates customer fields.

Method: `PATCH`

Route: `/users/:id`

Request body: any field from the create customer body.

Response: updated user record.

Possible errors:

- `404` if the customer does not exist.
- `409` if a unique field conflicts.

### Archive customer

Purpose: soft-deletes a customer by setting `deletedAt`.

Method: `DELETE`

Route: `/users/:id`

Response: archived user record.

Possible errors:

- `404` if the customer does not exist.

### Restore customer

Purpose: restores an archived customer.

Method: `PATCH`

Route: `/users/:id/restore`

Response: restored user record.

Possible errors:

- `404` if the customer does not exist.

## Virtual Accounts

### Create virtual account

Purpose: creates a Nomba dedicated virtual account and stores it locally.

Method: `POST`

Route: `/virtual-accounts`

Request body:

```json
{
  "userId": "customer-uuid",
  "accountRef": "tv-ada-001",
  "accountName": "Ada Okafor",
  "currency": "NGN",
  "bvn": "optional-bvn",
  "expiryDate": "2026-12-31",
  "expectedAmount": 50000
}
```

Response: local `VirtualAccount` record with Nomba metadata.

Possible errors:

- `400` for invalid payload.
- `401` or `502` if Nomba authentication or request fails.
- `500` if the local record cannot be stored.

### List virtual accounts

Purpose: lists local virtual accounts.

Method: `GET`

Route: `/virtual-accounts`

Query:

- `includeArchived=true` includes archived accounts.

Response: array of virtual account records with customer summary.

Possible errors:

- `500` if the database read fails.

### Lookup Nomba virtual account

Purpose: fetches a virtual account directly from Nomba by account reference or account number.

Method: `GET`

Route: `/virtual-accounts/nomba/:identifier`

Response: Nomba API response.

Possible errors:

- `401` or `502` if Nomba rejects the request.

### Update Nomba virtual account

Purpose: updates a Nomba virtual account and syncs matching local records by provider reference.

Method: `PATCH`

Route: `/virtual-accounts/nomba/:identifier`

Request body:

```json
{
  "newAccountRef": "tv-ada-002",
  "accountName": "Ada Okafor",
  "callbackUrl": "https://example.com/webhooks/nomba",
  "expectedAmount": 50000
}
```

Response: Prisma update result for matching local records.

Possible errors:

- `401` or `502` if Nomba rejects the request.

### Expire Nomba virtual account

Purpose: expires the account through Nomba and marks matching local records inactive.

Method: `DELETE`

Route: `/virtual-accounts/nomba/:identifier`

Response: Prisma update result for matching local records.

Possible errors:

- `401` or `502` if Nomba rejects the request.

### Get local virtual account

Purpose: returns a stored virtual account with recent transactions.

Method: `GET`

Route: `/virtual-accounts/:id`

Response: virtual account record.

Possible errors:

- `404` if not found.

### Update local virtual account

Purpose: updates local account label, name, or provider reference.

Method: `PATCH`

Route: `/virtual-accounts/:id`

Request body:

```json
{
  "newAccountRef": "tv-ada-local",
  "accountName": "Ada Main Account"
}
```

Response: updated virtual account.

Possible errors:

- `400` if the account is closed or archived.
- `404` if the account does not exist.

### Suspend, close, and archive local account

Purpose: changes local account lifecycle state.

Routes:

- `PATCH /virtual-accounts/:id/suspend`
- `PATCH /virtual-accounts/:id/close`
- `PATCH /virtual-accounts/:id/archive`

Response: updated virtual account.

Possible errors:

- `400` if the account cannot receive the action.
- `404` if the account does not exist.

## Transactions

### Create transaction

Purpose: creates a transaction manually.

Method: `POST`

Route: `/transactions`

Request body:

```json
{
  "userId": "customer-uuid",
  "virtualAccountId": "account-uuid",
  "beneficiaryId": "beneficiary-uuid",
  "reference": "txn-001",
  "providerReference": "nomba-ref",
  "direction": "CREDIT",
  "status": "SUCCESS",
  "amount": 25000,
  "currency": "NGN",
  "narration": "Payment received",
  "metadata": {}
}
```

Response: created transaction.

Possible errors:

- `400` for invalid data.
- `409` if `reference` or `providerReference` already exists.

### List, get, update, delete transactions

Routes:

- `GET /transactions`
- `GET /transactions/:id`
- `PATCH /transactions/:id`
- `DELETE /transactions/:id`

Purpose: read and manage transaction records.

Update request body: any editable field from the create transaction body except immutable relation IDs.

Possible errors:

- `404` if the transaction does not exist.
- `409` if a unique reference conflicts.

## Transfer Guard

### Run transfer guard

Purpose: checks an outgoing transfer and only sends it to Nomba if the decision is `ALLOW`.

Method: `POST`

Route: `/transfers`

Request body:

```json
{
  "userId": "customer-uuid",
  "virtualAccountId": "optional-account-uuid",
  "recipientBank": "Example Bank",
  "recipientBankCode": "999",
  "recipientAccount": "0123456789",
  "amount": 15000,
  "narration": "Vendor payment",
  "currency": "NGN"
}
```

Response when allowed:

```json
{
  "decision": "ALLOW",
  "message": "Transfer approved and sent to Nomba.",
  "riskScore": 25,
  "reasons": ["Customer trust signals support this transfer"],
  "accountLookup": {},
  "transaction": {}
}
```

Response when not allowed:

```json
{
  "decision": "REVIEW",
  "message": "Manual review required.",
  "riskScore": 45,
  "reasons": ["Recipient is a new beneficiary"],
  "accountLookup": {}
}
```

Possible errors:

- `400` if the amount is invalid or the selected virtual account belongs to another customer.
- `404` if the customer does not exist.
- `401` or `502` if Nomba lookup or transfer fails.

### List guarded transfers

Purpose: lists outgoing debit transactions.

Routes:

- `GET /transfers`
- `GET /transfers/:id`

Possible errors:

- `404` if a transfer transaction does not exist.

## Trust Engine

### Get trust score

Purpose: calculates a customer's current trust assessment.

Method: `GET`

Route: `/trust-engine/users/:userId/score`

Response:

```json
{
  "userId": "customer-uuid",
  "score": 78,
  "riskLevel": "MEDIUM",
  "metrics": {},
  "signals": [],
  "summary": "Trust score 78: ..."
}
```

Possible errors:

- `404` if the customer does not exist.

### Get trust decision

Purpose: returns the trust assessment plus an action recommendation.

Method: `GET`

Route: `/trust-engine/users/:userId/decision`

Response:

```json
{
  "userId": "customer-uuid",
  "action": "REVIEW",
  "reason": "Trust score 78 leads to review...",
  "assessment": {}
}
```

Possible errors:

- `404` if the customer does not exist.

## Webhooks

### Receive Nomba webhook

Purpose: receives, verifies, stores, and processes a Nomba webhook event.

Method: `POST`

Route: `/webhooks/nomba`

Headers:

- `Content-Type: application/json`
- one of `x-nomba-signature`, `x-webhook-signature`, or `x-signature`
- optional event headers such as `x-nomba-event` and `x-nomba-event-id`

Request body: Nomba webhook payload.

Response:

```json
{
  "received": true,
  "verified": true,
  "eventId": "uuid",
  "transactionId": "uuid"
}
```

Possible errors:

- `401` if the signature is missing or invalid.
- `500` if `NOMBA_WEBHOOK_SECRET` is not configured.

### Debug webhook configuration

Purpose: checks webhook configuration without exposing the secret.

Method: `GET`

Route: `/webhooks/debug`

Response: configuration status.

### List and get webhook events

Routes:

- `GET /webhooks/events`
- `GET /webhooks/events/:id`

Purpose: inspect stored webhook events.

Possible errors:

- `404` if the event does not exist.

## Audit Logs

### Create audit log

Purpose: writes an audit event.

Method: `POST`

Route: `/audit`

Request body:

```json
{
  "userId": "customer-uuid",
  "actorType": "SYSTEM",
  "action": "TRANSFER_GUARD_BLOCK",
  "resourceType": "TransferGuard",
  "resourceId": "optional-resource-id",
  "severity": "HIGH",
  "metadata": {},
  "ipAddress": "127.0.0.1",
  "userAgent": "browser"
}
```

Response: created audit log.

### List, get, update, delete audit logs

Routes:

- `GET /audit`
- `GET /audit/:id`
- `PATCH /audit/:id`
- `DELETE /audit/:id`

Possible errors:

- `404` if the audit log does not exist.

## Other Internal APIs

Devices and beneficiaries are part of the trust model and use standard CRUD endpoints:

- `POST /devices`, `GET /devices`, `GET /devices/:id`, `PATCH /devices/:id`, `DELETE /devices/:id`
- `POST /beneficiaries`, `GET /beneficiaries`, `GET /beneficiaries/:id`, `PATCH /beneficiaries/:id`, `DELETE /beneficiaries/:id`

Nomba balance check:

- `GET /nomba/balance`

That endpoint calls Nomba and returns the parent account balance response.
