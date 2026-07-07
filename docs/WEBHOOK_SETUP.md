# Webhook Firing Setup

Use this setup when you want Nomba to fire real webhook events into TrustVault.

## Endpoint

- `POST /webhooks/nomba`

## What TrustVault expects

- A raw request body, so signature verification uses the exact bytes that were sent.
- One of these signature headers:
  - `x-nomba-signature`
  - `x-webhook-signature`
  - `x-signature`
- Optional event headers for dedupe and event typing:
  - `x-nomba-event-id`
  - `x-event-id`
  - `x-nomba-event`
  - `x-event-type`
  - `x-webhook-event`

## Required Environment

- `DATABASE_URL`
- `NOMBA_WEBHOOK_SECRET`

## Local Delivery Flow

1. Start the app:

```bash
npm run dev
```

2. Expose the local server with a public tunnel such as Cloudflare Tunnel or ngrok.
3. Point the Nomba webhook URL to the public tunnel URL plus `/webhooks/nomba`.
4. Send a test event from Nomba.
5. Confirm the event appears at `GET /webhooks/events`.

### Example Tunnel Commands

Cloudflare Tunnel:

```bash
cloudflared tunnel --url http://localhost:3000
```

ngrok:

```bash
ngrok http 3000
```

Use the public HTTPS URL from either tunnel provider and append `/webhooks/nomba`.

### Wrangler Note

Do not use `npx wrangler dev` to run this NestJS API for webhook testing. Wrangler runs Cloudflare Workers or static assets and expects a Worker entry file such as `src/index.ts`; this project is a normal Node/Nest server whose entry point is `src/main.ts`.

For webhook testing, run the API locally with `npm run dev`, then expose `http://localhost:3000` with `cloudflared tunnel --url http://localhost:3000` or `ngrok http 3000`.

## Manual Replay Check

If you need to replay a webhook locally, sign the exact JSON payload body with HMAC SHA-256 using `NOMBA_WEBHOOK_SECRET`, then send it to `POST /webhooks/nomba` with the signature header and raw body preserved.

### Example Replay Request

```bash
curl -X POST http://localhost:3000/webhooks/nomba \
  -H "Content-Type: application/json" \
  -H "x-nomba-signature: <signature>" \
  -H "x-nomba-event: payment.received" \
  -H "x-nomba-event-id: evt_123" \
  --data '{"event":"payment.received","amount":"1000"}'
```

## Expected Result

- The event is stored as a `WebhookEvent`.
- A matching virtual account can create a `Transaction` and an `AuditLog` entry.
- The event can be inspected through the webhook event API and the dashboard shell.
