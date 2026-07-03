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

Status: Next

## Phase 6: TrustVault Security Engine

Goal: introduce trust scoring, device awareness, and adaptive security decisions.

## Phase 7: Frontend

Goal: build the administrative and integration-facing UI if the product needs one.

## Phase 8: Testing

Goal: harden the system with unit, integration, and e2e coverage around critical flows.

## Phase 9: Deployment

Goal: prepare the service for Render with production configuration, observability, and safe release steps.

## Current Next Step

Start Phase 5 by reviewing Nomba webhook requirements and signature verification.