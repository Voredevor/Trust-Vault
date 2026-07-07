# Roadmap

## Phase 0: Project Design

Goal: define the product, domain boundaries, and architecture before coding more features.

Status: Completed

## Phase 1: Foundation

Goal: set up NestJS structure, core modules, shared configuration, and project conventions.

Status: Completed

## Phase 2: Database

Goal: design the Prisma schema, build PrismaService, run the first migration, and verify the connection.

Status: Completed

Completed:

- Prisma schema defined
- User and Device foundation models added
- PrismaService implemented
- PrismaModule wired into the app
- Prisma client generated into `src/generated/prisma`
- Initial migration SQL prepared in `prisma/migrations/20260703_initial/migration.sql`
- Initial migration applied successfully against Supabase

## Phase 3: Nomba Integration

Goal: authenticate with Nomba, obtain OAuth tokens, and confirm the first successful API request.

Status: Completed

Completed:

- Nomba auth requirements reviewed
- Nomba client wrapper implemented
- OAuth token acquired successfully
- First authenticated Nomba API request completed

## Phase 4: Dedicated Virtual Accounts

Goal: create and manage virtual accounts through Nomba in a controlled, reusable way.

Status: Completed

Completed:

- First virtual account created successfully through Nomba
- Virtual accounts are persisted in Prisma
- Virtual accounts can be listed and fetched from the database
- Virtual account lifecycle APIs are implemented

Notes:

- Nomba account names must remain simple and alphanumeric for the current flow

## Phase 5: Webhooks

Goal: receive, verify, and process payment events reliably.

Status: Completed

Completed:

- Nomba webhook signatures are verified from the raw request body
- Verified webhook events are persisted in Prisma
- Matching payment webhooks can create transaction records and audit logs

Notes:

- Webhook delivery setup is documented in `docs/WEBHOOK_SETUP.md` for tunnel-based external firing tests

## Phase 6: TrustVault Security Engine

Goal: introduce trust scoring, device awareness, and adaptive security decisions.

Status: Completed

Completed:

- First trust score service implemented on existing Prisma data
- User trust assessment endpoint added
- Trust scores now resolve into an explicit allow/review/step-up/block decision
- User trust decision endpoint added

Notes:

- The initial engine uses user status, device status, transactions, and virtual-account state as scoring inputs

## Phase 7: Frontend

Goal: build the administrative and integration-facing UI if the product needs one.

Status: Completed as an embedded dashboard shell.

Completed:

- Root route now serves the TrustVault dashboard shell
- Dashboard panels connect to trust score, trust decision, virtual account, and webhook APIs
- The dashboard now includes live snapshot cards and an operator rail for refresh/actions
- Build and test suite were revalidated after the UI change

Notes:

- This phase intentionally stays lightweight and API-driven rather than introducing a full standalone frontend app.
- External webhook delivery testing now has a documented tunnel-based setup path.

## Phase 8: Testing

Goal: harden the system with unit, integration, and e2e coverage around critical flows.

## Phase 9: Deployment

Goal: prepare the service for Render with production configuration, observability, and safe release steps.

## Current Next Step

Begin Phase 8 by hardening the system with focused testing around the dashboard and existing API flows.