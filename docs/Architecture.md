# Architecture

This document explains how TrustVault is put together internally. It is not a theory document. It describes the shape of the current app and why it was built this way.

## Overall Architecture

TrustVault is a modular NestJS app. The API, Nomba integration, database layer, trust logic, webhook receiver, and embedded dashboard all run in one process.

That choice keeps the project easy to run and easy to reason about. The product is still small enough that separate services would add more work than value. The code is still split into modules so each part has a clear job.

```text
Browser or API client
  ↓
NestJS controller
  ↓
Feature service
  ↓
PrismaService or NombaService
  ↓
PostgreSQL or Nomba
```

## Request Lifecycle

Most requests follow the same path:

1. A controller receives the request.
2. The controller passes the body, params, or headers to a service.
3. The service runs the business logic.
4. If data is needed, the service calls `PrismaService`.
5. If Nomba is needed, the service calls `NombaService`.
6. The service returns a plain response to the controller.

Controllers stay thin on purpose. They should not know how Nomba works or how Prisma models are shaped beyond what the service returns.

## Module Responsibilities

### App

`AppController` serves the root route. `AppService` returns the embedded dashboard HTML, CSS, and browser-side JavaScript.

The dashboard is intentionally embedded in the backend. This kept the hackathon build simple and avoided a separate frontend deployment.

### Dashboard

The dashboard module exposes `GET /dashboard`. It returns counts and recent activity used by the embedded UI.

### Users

The users module owns customer records. It supports creating, listing, fetching, updating, archiving, and restoring customers.

### Virtual Accounts

The virtual accounts module creates Nomba dedicated virtual accounts and stores the local record in PostgreSQL. It also supports local lifecycle actions such as suspend, close, and archive.

### Transactions

The transactions module stores payment records. Incoming webhook payments become `CREDIT` transactions. Transfer Guard creates `DEBIT` transactions when a transfer is allowed and sent to Nomba.

### Transfers

The transfers module contains Transfer Guard. It checks a customer, account, recipient, trust score, transfer amount, velocity, and risk history before deciding what should happen.

### Trust Engine

The trust engine scores a customer from existing records. It does not need a separate scoring table right now. It reads users, devices, transactions, virtual accounts, and audit logs, then returns a score and decision.

### Webhooks

The webhooks module receives Nomba webhook events. It verifies signatures from the raw request body, stores the event, and creates matching transactions and audit logs when possible.

### Audit

The audit module records security and operational events. It is used by webhook processing, Transfer Guard, and manual admin actions.

### Nomba

The Nomba module is the only place that talks directly to Nomba APIs. Other modules call `NombaService` instead of building Nomba requests themselves.

### Prisma

`PrismaService` is the database boundary. Keeping database access behind one service makes migrations, tests, and future refactors easier.

## Database Layer

TrustVault uses PostgreSQL through Prisma. The main models are:

- `User`
- `Device`
- `Beneficiary`
- `VirtualAccount`
- `Transaction`
- `AuditLog`
- `WebhookEvent`

The Prisma client is generated into `src/generated/prisma`. That keeps imports inside the Nest build path and avoids generated-client path problems during deployment.

## Nomba Integration

Nomba integration is isolated in `src/nomba`.

The service handles:

- access token requests
- authenticated Nomba requests
- parent and sub-account scoping
- virtual account creation and lookup
- bank account lookup
- bank transfer creation

This boundary matters because Nomba payloads and TrustVault models are not the same thing. Mapping happens near the integration layer so the rest of the app can work with local concepts.

## Webhook Processing

Webhook requests use the raw request body because signature verification must happen against the exact bytes Nomba sent.

The flow is:

```text
POST /webhooks/nomba
  ↓
Read raw body and headers
  ↓
Verify HMAC signature with NOMBA_WEBHOOK_SECRET
  ↓
Store WebhookEvent
  ↓
Try to match the virtual account
  ↓
Create Transaction if matched
  ↓
Create AuditLog
```

If a webhook is not valid, TrustVault rejects it. If it is valid but cannot be matched, the event is still stored so it can be inspected later.

## Trust Engine

The Trust Engine currently uses simple rules. It starts with a base score and adjusts it using:

- customer status
- account age
- trusted, pending, or revoked devices
- successful, failed, reversed, or pending transactions
- active or closed virtual accounts
- audit log severity
- recent payment activity

The result is a score from 0 to 100, a risk level, and a decision. The rules are easy to read and change because this project is still early.

See [Trust Engine](Trust_Engine.md) for the scoring details.

## Transfer Guard

Transfer Guard uses the Trust Engine but adds transfer-specific checks:

- amount
- recent outgoing transfer count
- new recipient
- virtual account status
- high-risk audit history
- recent trusted activity

Only `ALLOW` sends a bank transfer request to Nomba. `REVIEW` and `BLOCK` stop inside TrustVault and write an audit log.

See [Transfer Guard](Transfer_Guard.md) for the full flow.

## Frontend

The dashboard is served from the root route by `AppService`. It calls the same API endpoints a separate frontend would call.

This was chosen because the project needed a usable operator interface without adding a full frontend build pipeline. The tradeoff is that the UI code lives inside a TypeScript service file. That is acceptable for the current scope, but a separate frontend would make sense if the UI grows much larger.

## Audit Logging

Audit logs are used as the system memory for important actions. They help answer:

- What happened?
- Who or what triggered it?
- Which customer or resource was involved?
- Was the event low risk or high risk?
- What metadata explains the decision?

Transfer Guard and webhook processing both write audit logs automatically.

## Practical Decisions

- Keep TrustVault as a modular monolith for now.
- Keep controllers thin.
- Keep Nomba calls inside `NombaService`.
- Keep database access behind `PrismaService`.
- Keep scoring rules readable before making them smarter.
- Keep the dashboard embedded until a separate frontend is worth the extra deployment work.
