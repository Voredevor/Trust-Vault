# Webhook Setup

TrustVault receives payment events from Nomba at:

```text
POST /webhooks/nomba
```

The webhook receiver verifies the request, stores the event, and tries to turn matching payment events into transactions.

## How Nomba Webhooks Fit In

When money enters a dedicated virtual account, Nomba sends an HTTP request to the webhook URL configured for the account or business.

TrustVault expects that request to contain:

- a JSON body
- a signature header
- optional event headers such as event type and event ID

The payload is stored as a `WebhookEvent`. If the event contains a known virtual account number or reference, TrustVault also creates a `Transaction` and an `AuditLog`.

## Why Signatures Are Verified

Webhook endpoints are public URLs. Anyone can send a POST request to them.

TrustVault verifies signatures so it can tell the difference between:

- a real Nomba event
- a copied or modified event
- a random request sent by someone else

Signature verification uses `NOMBA_WEBHOOK_SECRET`.

## How TrustVault Validates a Request

The validation flow is:

```text
Receive request
  ↓
Read the raw body
  ↓
Find a signature header
  ↓
Create an HMAC SHA-256 signature with NOMBA_WEBHOOK_SECRET
  ↓
Compare it with the received signature
  ↓
Reject if it does not match
  ↓
Store and process if it matches
```

TrustVault checks these signature headers:

- `x-nomba-signature`
- `x-webhook-signature`
- `x-signature`

It also reads these optional event headers:

- `x-nomba-event-id`
- `x-event-id`
- `x-nomba-event`
- `x-event-type`
- `x-webhook-event`

## Required Environment Variables

```env
DATABASE_URL="postgresql://..."
NOMBA_WEBHOOK_SECRET="your-webhook-secret"
```

The database is needed because webhook events are stored. The webhook secret is needed because unsigned events should not be trusted.

## Local Testing With a Tunnel

1. Start the API.

```bash
npm run dev
```

2. Expose the local server with a tunnel.

Cloudflare Tunnel:

```bash
cloudflared tunnel --url http://localhost:3000
```

ngrok:

```bash
ngrok http 3000
```

3. Copy the public HTTPS tunnel URL.

4. Configure Nomba to send webhooks to:

```text
https://your-public-url/webhooks/nomba
```

5. Trigger a test payment event from Nomba.

6. Check TrustVault.

```bash
curl http://localhost:3000/webhooks/events
```

You can also inspect events from the Webhooks screen in the dashboard.

## Manual Replay Test

If you want to test without Nomba, sign the exact body you plan to send with HMAC SHA-256 using `NOMBA_WEBHOOK_SECRET`.

Example request:

```bash
curl -X POST http://localhost:3000/webhooks/nomba \
  -H "Content-Type: application/json" \
  -H "x-nomba-signature: <signature>" \
  -H "x-nomba-event: payment.received" \
  -H "x-nomba-event-id: evt_123" \
  --data '{"event":"payment.received","amount":"1000","currency":"NGN"}'
```

The signature must be calculated from the exact JSON string after `--data`. Extra spaces, line breaks, or reordered keys can change the signature.

## Expected Result

For a valid signed event:

- a `WebhookEvent` is created
- `verified` is set to `true`
- `processedAt` is set if processing succeeds
- a matching virtual account can create a `Transaction`
- an `AuditLog` records the processing result

For an invalid event:

- the request is rejected
- no trusted transaction is created

## Common Mistakes

### Missing webhook secret

If `NOMBA_WEBHOOK_SECRET` is not set, TrustVault cannot verify events.

Fix: add it to `.env` and restart the app.

### Wrong signature header

TrustVault supports a few common header names, but the value still has to be correct.

Fix: confirm which header Nomba sends and compare it with the supported list above.

### Body changed after signing

The raw body must match the body that was signed.

Fix: do not pretty-print or reformat the payload after generating the signature.

### Tunnel URL is wrong

Nomba must call the public tunnel URL, not `localhost`.

Fix: use the tunnel URL plus `/webhooks/nomba`.

### Using Wrangler to run the Nest app

Wrangler runs Cloudflare Workers or static assets. This project is a normal NestJS server.

Fix: run TrustVault with `npm run dev`, then expose `http://localhost:3000` with ngrok or Cloudflare Tunnel.

### Event does not create a transaction

The webhook may be valid but not match a known virtual account.

Fix: inspect the event in `/webhooks/events` and compare the account number or reference with records in `/virtual-accounts`.

## Related Docs

- [API](API.md)
- [Architecture](Architecture.md)
- [Testing](Testing.md)
