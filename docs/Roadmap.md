# Roadmap

This roadmap tracks where TrustVault has been, what is working now, and what should come next.

## Completed

### Project foundation

- NestJS project set up
- Core modules created
- TypeScript build working
- Config module added
- Prisma added
- Documentation folder started

### Database

- PostgreSQL schema designed with Prisma
- PrismaService added as the database boundary
- Prisma client generated into `src/generated/prisma`
- Initial migrations created
- Core models added:
  - User
  - Device
  - Beneficiary
  - VirtualAccount
  - Transaction
  - AuditLog
  - WebhookEvent

### Nomba integration

- Nomba API wrapper added
- Access token flow implemented
- Parent account balance request tested
- Virtual account creation connected to Nomba
- Bank account lookup added
- Bank transfer request added for allowed Transfer Guard flows

### Virtual Accounts

- Dedicated virtual accounts can be created through Nomba
- Created accounts are stored locally
- Accounts can be listed and fetched
- Local actions exist for rename, suspend, close, and archive
- Nomba lookup and update endpoints exist

### Webhook Processing

- Nomba webhook receiver added
- Raw request body is preserved for signature verification
- Webhook signatures are verified with `NOMBA_WEBHOOK_SECRET`
- Valid events are stored as `WebhookEvent`
- Matching payment events can create `Transaction` records
- Webhook processing writes audit logs

### Dashboard

- Root route serves an embedded operator dashboard
- Dashboard reads real backend APIs
- Screens exist for:
  - Dashboard
  - Customers
  - Virtual Accounts
  - Transactions
  - Transfer Guard
  - Security Overview
  - Webhooks
  - Trust Engine
  - Audit Logs
  - Settings

### Trust Engine

- Customer trust score endpoint added
- Trust decision endpoint added
- Scoring uses customer status, account age, devices, transactions, virtual accounts, audit logs, and recent activity
- Decisions currently return `ALLOW`, `REVIEW`, or `BLOCK`

### Transfer Guard

- Outgoing transfer check added
- Recipient account lookup through Nomba added
- Transfer risk score added
- `ALLOW`, `REVIEW`, and `BLOCK` flow added
- Allowed transfers are sent to Nomba
- Guard decisions are written to audit logs

### Testing

- Root dashboard smoke test updated
- Trust Engine tests added
- Webhook signature failure test added
- Webhook ingestion happy path test added
- Build and test suite pass after the dashboard work

## Current

The current product is a working backend-first payment safety layer with an embedded admin dashboard.

The most important current work is hardening the critical flows:

- webhook delivery from real Nomba events
- Transfer Guard decisions against more realistic transaction data
- dashboard usability
- production configuration on Render
- better test coverage around failure cases

## Future

### Real outgoing transfer operations

Transfer Guard already calls Nomba when a transfer is allowed. The next step is to make the outgoing transfer process production-ready with approval queues, clearer retry handling, and stronger reconciliation.

### Device recognition

Devices are already part of the schema and Trust Engine. Future work should make device fingerprints more meaningful and update device status from real customer activity.

### Biometric or multi-factor approval

High-risk transfers should be able to ask for extra approval instead of only returning review or block.

### Behaviour analysis

TrustVault should learn normal behaviour for each customer:

- usual transfer size
- common recipients
- normal time of day
- normal payment frequency
- usual devices and locations

### Machine learning

Machine learning should wait until there is enough clean transaction history. The current rule-based engine is easier to debug and safer for the first version.

### Notification system

Operators should get alerts for blocked transfers, failed webhook processing, and high-risk audit events.

### Analytics

The dashboard can grow into a reporting view for payment volume, fraud attempts, transfer outcomes, customer risk, and webhook reliability.

### Admin roles

The schema already has user roles. Future work should add role-based access in the dashboard and API.

## Related Docs

- [Architecture](Architecture.md)
- [Transfer Guard](Transfer_Guard.md)
- [Trust Engine](Trust_Engine.md)
- [Testing](Testing.md)
