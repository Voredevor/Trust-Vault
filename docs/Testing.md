# Testing

TrustVault has tests for the backend modules and the important payment security flows. This document explains what is covered and how to run the tests.

## Run Tests

```bash
npm test
```

Run in one process:

```bash
npm test -- --runInBand
```

Build before deployment:

```bash
npm run build
```

## Unit Testing

Unit tests cover service and controller behaviour without needing the full app to run.

Current areas include:

- users
- devices
- beneficiaries
- virtual accounts
- transactions
- transfers
- trust engine
- webhooks
- audit logs
- Prisma service startup checks

Unit tests are useful for scoring rules, validation, and service behaviour that should not depend on a live Nomba request.

## Integration Testing

The project includes controller-level tests for important HTTP boundaries.

The root dashboard smoke test checks that the app returns the TrustVault dashboard HTML instead of the old Nest starter page.

Webhook tests cover:

- missing or bad signatures
- successful signed webhook ingestion
- persistence of verified events
- transaction and audit creation for matching events

## Webhook Testing

For local webhook testing, use the instructions in [Webhook Setup](Webhook_Setup.md).

The short version:

1. Set `NOMBA_WEBHOOK_SECRET`.
2. Start the app with `npm run dev`.
3. Expose it with ngrok or Cloudflare Tunnel.
4. Point Nomba to `/webhooks/nomba`.
5. Check `/webhooks/events` or the dashboard.

When writing automated webhook tests, the important detail is signing the exact request body. If the body changes after signing, verification should fail.

## Transfer Testing

Transfer Guard should be tested in three groups:

### ALLOW

Use a trusted customer, low risk amount, low velocity, and a known recipient. Expected result:

- decision is `ALLOW`
- Nomba transfer is called
- debit transaction is created
- audit log severity is `LOW`

### REVIEW

Use a medium risk transfer, such as a new beneficiary or elevated amount. Expected result:

- decision is `REVIEW`
- Nomba transfer is not called
- no debit transaction is created
- audit log severity is `HIGH`

### BLOCK

Use a suspended customer, low trust score, high risk amount, or high-risk audit history. Expected result:

- decision is `BLOCK`
- Nomba transfer is not called
- no debit transaction is created
- audit log severity is `CRITICAL`

## Manual Testing

Manual testing is still useful because TrustVault has an embedded dashboard.

Recommended manual checks:

- create a customer
- create a virtual account
- receive or replay a webhook
- confirm a transaction appears
- inspect the audit timeline
- open the customer profile
- run Transfer Guard with a low-risk transfer
- run Transfer Guard with a risky transfer
- inspect the Trust Engine score
- check the Security Overview page

## Future Automated Testing

Useful next tests:

- full e2e flow from customer creation to webhook transaction
- Transfer Guard with mocked Nomba lookup and transfer responses
- dashboard route checks for every screen
- audit log consistency checks
- archived customer and archived account edge cases
- virtual account lifecycle edge cases
- role-based access tests when admin roles are enforced
- webhook replay and duplicate event handling

## Related Docs

- [Webhook Setup](Webhook_Setup.md)
- [Transfer Guard](Transfer_Guard.md)
- [Trust Engine](Trust_Engine.md)
