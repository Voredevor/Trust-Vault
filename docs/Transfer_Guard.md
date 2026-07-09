# Transfer Guard

Transfer Guard is the main outgoing transfer safety feature in TrustVault.

It checks a transfer before money leaves. If the transfer looks safe, TrustVault sends it to Nomba. If it needs attention, TrustVault stops it and records the reason.

## Overview

The endpoint is:

```text
POST /transfers
```

The operator or client sends customer, recipient, bank, and amount details. TrustVault then:

1. validates the amount
2. loads the customer
3. checks the selected virtual account, if one was provided
4. asks the Trust Engine for the customer score
5. looks up the recipient bank account through Nomba
6. checks transfer-specific risk
7. returns `ALLOW`, `REVIEW`, or `BLOCK`
8. sends the transfer to Nomba only when the decision is `ALLOW`

## Transfer Lifecycle

```text
Transfer request
  ↓
Validate amount
  ↓
Load customer and optional virtual account
  ↓
Run Trust Engine
  ↓
Look up recipient account with Nomba
  ↓
Check amount, velocity, recipient, account status, and risk history
  ↓
Return decision
  ↓
If ALLOW: create Nomba transfer and debit transaction
  ↓
Write audit log
```

## Request Body

```json
{
  "userId": "customer-uuid",
  "virtualAccountId": "optional-account-uuid",
  "recipientBank": "Example Bank",
  "recipientBankCode": "999",
  "recipientAccount": "0123456789",
  "amount": 15000,
  "narration": "Vendor payment",
  "currency": "NGN"
}
```

`virtualAccountId` is optional. If it is sent, TrustVault checks that the account belongs to the selected customer.

## Risk Analysis

Transfer Guard starts with the inverse of the trust score.

```text
riskScore = 100 - trustScore
```

Then it adds risk based on the transfer:

| Signal | Impact |
| --- | --- |
| Customer is not `ACTIVE` | `+45` |
| Amount is at least 500,000 | `+30` |
| Amount is at least 100,000 | `+15` |
| 5 or more outgoing transfers in 24 hours | `+25` |
| 3 or more outgoing transfers in 24 hours | `+12` |
| Recipient is new | `+18` |
| Virtual account is closed, inactive, or suspended | `+40` |
| High-risk audit history exists | up to `+36` |
| No recent trusted payment activity | `+8` |

The final risk score is clamped between `0` and `100`.

## Trust Engine Interaction

Transfer Guard calls the Trust Engine before making its transfer decision.

The Trust Engine contributes:

- trust score
- recent activity count
- customer status
- trust signals that explain the score

Transfer Guard then adds transfer-specific checks on top. This keeps customer trust and transfer risk separate but connected.

See [Trust Engine](Trust_Engine.md) for the scoring rules.

## Decision Flow

Transfer Guard returns one of three decisions.

### ALLOW

The transfer is considered safe enough to send.

Condition:

```text
riskScore < 40 and trustScore >= 65
```

What happens:

- Nomba bank transfer is created.
- A `DEBIT` transaction is stored.
- An audit log is written with low severity.

### REVIEW

The transfer should not be sent automatically.

Condition:

```text
riskScore >= 40 or trustScore < 65
```

What happens:

- No Nomba transfer is created.
- No debit transaction is created.
- An audit log is written with high severity.
- The response explains why review is needed.

### BLOCK

The transfer is too risky.

Condition:

```text
riskScore >= 70 or trustScore < 40
```

What happens:

- No Nomba transfer is created.
- No debit transaction is created.
- An audit log is written with critical severity.
- The response explains why the transfer was blocked.

## Execution

Only `ALLOW` reaches Nomba.

When the transfer is allowed, TrustVault:

1. creates a TrustVault transfer reference
2. sends the transfer request to Nomba
3. maps the returned Nomba status into `PENDING`, `SUCCESS`, `FAILED`, or `REVERSED`
4. creates a local `Transaction`
5. stores the Nomba lookup and transfer response in metadata
6. writes an audit log

## Failure Handling

Transfer Guard stops early when:

- the amount is not greater than zero
- the customer does not exist
- the selected virtual account belongs to a different customer
- Nomba account lookup fails
- Nomba transfer creation fails

For `REVIEW` and `BLOCK`, the response is still successful from an HTTP point of view. The transfer was checked correctly; it just was not allowed to execute.

## Dashboard View

The Transfer Guard screen keeps the form on the left and shows analysis on the right. The workflow steps remain visible while the result updates. This makes the decision easier to follow during demos and manual testing.

## Future Improvements

- Approval queue for `REVIEW` transfers
- Multi-person approval for large transfers
- Device confirmation before execution
- Beneficiary warm-up period before high-value transfers
- Real-time notifications for blocked transfers
- Better velocity rules by customer segment
- Configurable business policies per merchant

## Related Docs

- [Trust Engine](Trust_Engine.md)
- [API](API.md)
- [Testing](Testing.md)
