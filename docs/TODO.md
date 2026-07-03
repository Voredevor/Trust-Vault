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

- [ ] Review Nomba webhook requirements and signature verification
- [ ] Decide on Cloudflare Tunnel or deployed URL for local webhook testing
- [ ] Build the webhook receiver and verifier
- [ ] Store incoming payment events in TrustVault

## Phase Checkpoint

- [x] Do not start virtual account creation until Phase 2 is complete
- [ ] Do not expand trust logic until the persistence layer is stable
