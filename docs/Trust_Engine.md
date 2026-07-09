# Trust Engine

The Trust Engine scores a customer using the data TrustVault already has.

It is not trying to be a machine learning system yet. The first version uses clear rules that are easy to inspect, test, and change.

## What It Returns

Trust score endpoint:

```text
GET /trust-engine/users/:userId/score
```

Decision endpoint:

```text
GET /trust-engine/users/:userId/decision
```

The score response includes:

- `score`
- `riskLevel`
- `metrics`
- `signals`
- `summary`

The decision response adds:

- `action`
- `reason`
- `assessment`

## Trust Score

The score is a number from `0` to `100`.

Higher is better.

TrustVault starts each customer at `50`, then applies signals from the customer's records.

```text
base score = 50
apply customer status
apply account age
apply device signals
apply transaction signals
apply virtual account signals
apply audit signals
apply recent activity signals
clamp between 0 and 100
```

## Current Scoring Rules

### Customer status

| Status | Impact |
| --- | --- |
| `ACTIVE` | `+15` |
| `PENDING` | `-15` |
| `SUSPENDED` | `-50` |
| `DISABLED` | `-80` |

### Account age

| Condition | Impact |
| --- | --- |
| Account is 90 days or older | `+10` |
| Account is 30 days or older | `+5` |
| Account is newer than 30 days | `-5` |

### Devices

| Signal | Impact |
| --- | --- |
| Trusted devices | `+5` each, max `+15` |
| Pending devices | `-8` each |
| Revoked devices | `-20` each |

### Transactions

| Signal | Impact |
| --- | --- |
| Successful payments | `+3` each, max `+18` |
| Failed or reversed payments | `-12` each |
| Pending payments | `-4` each |

### Virtual accounts

| Signal | Impact |
| --- | --- |
| Active virtual accounts | `+4` each, max `+12` |
| Closed virtual accounts | `-8` each |

### Audit logs

| Signal | Impact |
| --- | --- |
| Low severity audit logs | up to `+5` total |
| Medium severity audit logs | `-6` each |
| High or critical audit logs | `-18` each |

### Recent activity

| Signal | Impact |
| --- | --- |
| Recent payment activity in the last 30 days | `+2` each, max `+8` |
| No recent payment activity | `-5` |

## Risk Levels

The score maps to a risk level:

| Score | Risk level |
| --- | --- |
| `80` to `100` | `LOW` |
| `60` to `79` | `MEDIUM` |
| `40` to `59` | `HIGH` |
| `0` to `39` | `CRITICAL` |

## Decision Categories

### ALLOW

The customer looks safe enough for low-friction actions.

Current rule:

```text
score >= 85
```

Why it exists: some customers should not need manual review every time. A high score means the customer's history is strong enough to proceed.

### REVIEW

The customer is not clearly bad, but the system wants an operator to look closer.

Current rule:

```text
score >= 55 and score < 85
```

Why it exists: most real risk is not black and white. Review gives operators a middle path.

### STEP_UP

`STEP_UP` is part of the product direction, but the current service does not return it yet.

Why it exists: some actions should require extra confirmation instead of a full block. Future versions can use it for OTP, device confirmation, biometric approval, or multi-factor checks.

### BLOCK

The customer is too risky for the action.

Current rule:

```text
score < 55
```

Why it exists: some activity should stop before money moves.

## Risk Score vs Trust Score

The Trust Engine returns a trust score. Transfer Guard turns that into a transfer risk score.

```text
trustScore = customer safety score
riskScore = transfer-specific risk
```

This split matters because a trusted customer can still make a risky transfer, and a newer customer can still receive payments safely.

## Future Scoring Ideas

- Device fingerprint confidence
- Beneficiary age and history
- Customer-specific velocity baselines
- Failed login attempts
- Location changes
- Unusual payment size
- Time-of-day patterns
- Business category rules
- Machine learning once enough transaction history exists

## Related Docs

- [Transfer Guard](Transfer_Guard.md)
- [Architecture](Architecture.md)
- [Testing](Testing.md)
