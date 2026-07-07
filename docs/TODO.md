# TODO

## Phase 2 - Database

- [x] Create foundational models for user and device
- [x] Define the first Prisma schema for TrustVault core entities
- [x] Add PrismaService with lifecycle hooks and a clean application-facing API
- [x] Wire PrismaModule into the app as the single database boundary
- [x] Run the first migration against PostgreSQL
- [x] Confirm the app can connect to the database on startup

## Phase 3 - Nomba Integration

- [x] Review Nomba auth requirements and token flow
- [x] Build the Nomba client wrapper inside the Nomba module
- [x] Obtain an OAuth token successfully
- [x] Make the first authenticated API request to Nomba

## Phase 4 - Dedicated Virtual Accounts

- [x] Review how Nomba creates and scopes virtual accounts
- [x] Define the TrustVault virtual-account persistence model
- [x] Build the virtual account service boundary
- [x] Create the first virtual account through Nomba sandbox or live credentials

- [x] Add Nomba virtual-account lookup support
- [x] Add Nomba virtual-account update support
- [x] Add Nomba virtual-account suspend support
- [x] Persist created virtual accounts in Prisma
- [x] Expose virtual-account list and fetch endpoints from TrustVault

## Phase 4 Notes

- Nomba rejected account names with special characters, so use simple alphanumeric naming for this flow.
- TrustVault now persists the created virtual account and supports list/fetch reads from Prisma.

## Phase 5 - Webhooks

- [x] Review Nomba webhook requirements and signature verification
- [x] Build the webhook receiver and verifier
- [x] Store incoming payment events in TrustVault
- [x] Map verified payment webhooks into transactions and audit logs

## Phase 5 Notes

- The webhook receiver now verifies Nomba signatures from the raw request body.
- Verified webhook events are persisted in Prisma as `WebhookEvent`.
- Matching payment events can create a `Transaction` and `AuditLog` when a virtual account is recognized.
- Tunnel-based webhook firing instructions are documented in `docs/WEBHOOK_SETUP.md`.

## Phase 6 - TrustVault Security Engine

- [x] Define the trust engine data model and scoring inputs
- [x] Decide how device status influences risk evaluation
- [x] Add the first trust engine rules or scoring service
- [x] Convert trust scores into a decision flow for allow, review, step-up, or block
- [x] Expose a trust decision endpoint for a user

## Phase 6 Notes

- The first trust score uses existing Prisma data for user status, device status, transaction history, and virtual-account state.
- The trust engine now exposes a score endpoint for a user without introducing a new schema table.
- The trust engine now also returns an explicit action recommendation on top of the score.

## Phase 7 - Frontend Dashboard Shell

- [x] Replace the root route with an embedded dashboard shell
- [x] Wire the dashboard to trust score and decision endpoints
- [x] Add dashboard panels for virtual accounts and webhook events
- [x] Revalidate the app build and test suite after the dashboard change

## Phase 7 Notes

- The root route now serves a lightweight operator dashboard instead of the old hello-world response.
- The dashboard is a shell only; it reuses the existing backend APIs rather than introducing a separate frontend stack.
- Webhook delivery setup is now documented so external firing tests can be run through a public tunnel.
- The dashboard now includes live snapshot cards and an operator rail with a refresh-all action.

## Phase 8 - Testing

- [x] Replace the stale root hello-world smoke test with a dashboard-aware app test
- [x] Add broader coverage for the trust-engine decision flow
- [x] Add a webhook signature failure test at the HTTP boundary
- [x] Add a happy-path webhook ingestion smoke test through the controller layer

## Phase 8 Notes

- The root dashboard smoke test now asserts the real TrustVault shell instead of the old hello-world output.
- The next test-hardening step is to cover the trust-engine and webhook HTTP paths more directly.

## Webhook Delivery Follow-up

- [x] Create webhook firing setup documentation
- [x] Update project documentation for webhook testing
- [x] Prepare for external delivery testing

## Phase Checkpoint

- [x] Do not start virtual account creation until Phase 2 is complete
- [x] Do not expand trust logic until the persistence layer is stable
- [x] Do not advance past the dashboard shell until the build and test suite pass
