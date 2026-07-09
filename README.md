# TrustVault

TrustVault is a payment security layer built on top of Nomba. It helps a business receive payments through dedicated virtual accounts, record what happened, and check outgoing transfers before money leaves an account.

## The Problem

Receiving payments is usually straightforward. A customer pays into an account, the provider sends a webhook, and the business records the payment.

Sending money safely is harder. Fraud happens. Human error happens. A real customer can suddenly behave in a risky way. A transfer can go to the wrong account. Operators need a way to slow down risky transfers without blocking every payment by default.

TrustVault was built to reduce that risk.

## The Solution

TrustVault sits between a business and Nomba. It keeps its own record of customers, virtual accounts, transactions, webhooks, and audit logs. Before an outgoing transfer happens, TrustVault can:

- check the customer's trust score
- look at payment and account history
- review the transfer amount and recipient
- recommend whether to allow, review, or block the payment
- send allowed transfers to Nomba
- log every important action

## Why TrustVault?

Most payment platforms focus on helping businesses move money.

TrustVault focuses on helping businesses move money safely.

Instead of replacing payment providers like Nomba, TrustVault sits on top of them as a security layer. Every incoming payment is verified and reconciled, while every outgoing payment can be inspected, scored, approved, or blocked before funds leave the business.

The goal is simple: make payment infrastructure smarter, safer, and easier to trust.

## Features

- Customer management for creating, viewing, updating, archiving, and restoring customers.
- Dedicated Virtual Accounts created through Nomba and stored locally.
- Incoming webhook processing for Nomba payment events.
- Webhook signature verification using the raw request body.
- Transaction recording for incoming payments and outgoing transfers.
- Audit logs for security and operational events.
- Trust Engine for customer scoring and transfer decisions.
- Transfer Guard for checking outgoing transfers before execution.
- Risk dashboard and security overview for operators.
- Embedded admin dashboard served from the NestJS app root route.

## Dashboard Tour

### Dashboard

The dashboard gives a quick view of payment activity, recent transactions, webhook events, audit signals, and transfer risk. It is meant to help an operator understand what is happening without opening every API response by hand.

### Customers

The Customers screen lists active and archived customers. Selecting a customer opens a profile panel with their identity, virtual accounts, devices, beneficiaries, and recent transactions.

### Virtual Accounts

This screen manages Nomba-backed dedicated virtual accounts. Operators can create accounts, look them up, rename them locally, suspend them, close them, archive them, or inspect the raw account data.

### Transactions

The Transactions screen shows incoming and outgoing payments. Operators can filter by direction, status, date, and customer, then open a transaction to inspect the full payload.

### Transfer Guard

Transfer Guard is the main safety flow for outgoing money. The operator enters the customer, recipient, bank details, and amount. TrustVault checks the customer and transfer risk, then returns a decision.

### Security Overview

The Security Overview screen collects trust scores, alerts, payment volume, risk decisions, webhook activity, and recent transfers in one place.

### Webhooks

The Webhooks screen shows signed Nomba events received by TrustVault. Each row can expand to show the payload, headers, matching result, and processing status.

### Trust Engine

The Trust Engine screen lets an operator inspect a customer's score, risk level, decision, metrics, and risk factors.

### Audit Logs

Audit Logs show the security trail. The page includes a timeline view and the original table view so operators can scan recent events or inspect structured records.

### Settings

Settings shows connection status, webhook configuration, deployment environment, and the webhook endpoint for the current host.

## How It Works

```text
Customer
  ↓
Virtual Account
  ↓
Money enters account
  ↓
Nomba fires webhook
  ↓
Webhook is verified
  ↓
Transaction is created
  ↓
Audit log is created
  ↓
Trust Engine has more history to score with
  ↓
Dashboard refreshes from the API
```

For outgoing transfers, the flow is:

```text
Operator enters transfer details
  ↓
TrustVault checks the customer
  ↓
TrustVault checks recipient and transfer risk
  ↓
Transfer Guard returns ALLOW, REVIEW, or BLOCK
  ↓
Allowed transfers are sent to Nomba
  ↓
The decision is written to audit logs
```

## Technology Stack

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Nomba APIs
- JWT support
- Swagger support
- Render

## Running Locally

1. Clone the repository.

```bash
git clone <repo-url>
cd trustvault-api
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file.

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NOMBA_BASE_URL="https://api.nomba.com"
NOMBA_PARENT_ACCOUNT_ID="your-parent-account-id"
NOMBA_SUB_ACCOUNT_ID="your-sub-account-id"
NOMBA_CLIENT_ID="your-client-id"
NOMBA_PRIVATE_KEY="your-private-key"
NOMBA_WEBHOOK_SECRET="your-webhook-secret"
PORT=3000
```

4. Generate the Prisma client.

```bash
npm run prisma:generate
```

5. Run database migrations.

```bash
npx prisma migrate deploy
```

6. Start the server.

```bash
npm run dev
```

7. Open the dashboard.

```text
http://localhost:3000
```

If port 3000 is already in use, start on another port:

```bash
PORT=3001 npm run dev
```

PowerShell:

```powershell
$env:PORT=3001; npm run dev
```

## Environment Variables

| Variable | What it does | Why it exists |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma. | TrustVault stores customers, accounts, transactions, webhooks, and audit logs in Postgres. |
| `NOMBA_BASE_URL` | Nomba API base URL. Defaults to `https://api.nomba.com` if not set. | Lets local or sandbox environments point to a different Nomba host. |
| `NOMBA_PARENT_ACCOUNT_ID` | Parent account ID sent to Nomba. | Nomba uses it to scope authenticated requests. |
| `NOMBA_SUB_ACCOUNT_ID` | Sub-account ID used when creating virtual accounts. | Dedicated virtual accounts are created under this account. |
| `NOMBA_CLIENT_ID` | Nomba OAuth client ID. | Used to request an access token. |
| `NOMBA_PRIVATE_KEY` | Nomba OAuth private key or secret used by the current integration. | Used to authenticate with Nomba. |
| `NOMBA_WEBHOOK_SECRET` | Secret used to verify webhook signatures. | Prevents unsigned or tampered webhook payloads from being trusted. |
| `PORT` | Server port. Defaults to `3000`. | Useful when running more than one local server. |

## Folder Structure

```text
src/
  app.service.ts          Embedded dashboard HTML, CSS, and browser-side JS
  dashboard/              Summary endpoint used by the dashboard
  users/                  Customer management
  virtual-accounts/       Nomba virtual account workflows and local account state
  transactions/           Incoming and outgoing payment records
  transfers/              Transfer Guard and outgoing transfer flow
  trust-engine/           Customer scoring and decision logic
  webhooks/               Nomba webhook receiver and event records
  audit/                  Audit log API and persistence
  nomba/                  Nomba API wrapper
  prisma/                 PrismaService database boundary
prisma/
  schema.prisma           Database schema
  migrations/             Database migrations
docs/
  *.md                    Project documentation
```

## Screenshots

Screenshots should be added after the UI is stable.

- `[Screenshot: Dashboard overview]`
- `[Screenshot: Transfer Guard decision]`
- `[Screenshot: Webhook event details]`
- `[Screenshot: Customer profile]`
- `[Screenshot: Security overview]`

## Documentation

- [Architecture](docs/Architecture.md)
- [API](docs/API.md)
- [Webhook Setup](docs/Webhook_Setup.md)
- [Transfer Guard](docs/Transfer_Guard.md)
- [Trust Engine](docs/Trust_Engine.md)
- [Product Vision](docs/Product_Vision.md)
- [Roadmap](docs/Roadmap.md)
- [Testing](docs/Testing.md)

## Future Improvements

- Device fingerprinting
- AI-assisted fraud detection
- Multi-factor approval for risky transfers
- Live notifications for operators
- Behaviour analytics
- Admin roles and permissions
- Real-time dashboard updates

## Author

Built by the Olorunfemi Devor and Abiodun Atunwa.

GitHub: project repository.

This project started as a backend-first fintech security layer and grew into a working API with an embedded operator dashboard.
