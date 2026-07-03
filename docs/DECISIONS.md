# Architecture Decisions

This file records the first stable decisions so we can review them before changing direction.

## Decision 1: Modular Monolith

We will keep TrustVault as a modular monolith for now.

Reason: it is the simplest structure that still gives us clear boundaries between payments, security, and persistence.

Tradeoff: it is not as independently deployable as separate services, but the project is not large enough to justify that complexity yet.

## Decision 2: Prisma as the Database Gateway

All database access will go through PrismaService.

Reason: one database boundary makes testing and future refactors easier.

Tradeoff: it adds a small abstraction layer, but that is worth it for maintainability.

## Decision 3: Nomba Stays Isolated

All Nomba API communication will live inside the Nomba module.

Reason: payment integration details should not leak into the rest of the application.

Tradeoff: the Nomba module will need careful mapping between external payloads and internal domain models.

## Decision 4: Feature Progression Must Be Sequential

We will finish one layer before moving to the next major capability.

Reason: payment and trust systems are easier to reason about when each layer is stable.

Tradeoff: delivery is slower than jumping ahead, but the architecture stays coherent.

## Decision 5: Prisma Client Is Generated Into src

The generated Prisma client will live inside `src/generated/prisma`.

Reason: this keeps the client inside the Nest compilation path and avoids build-time import issues.

Tradeoff: generated code sits in the source tree, so we need to treat it as build output and regenerate it when the schema changes.

## Open Decisions

- Exact database schema for users, accounts, devices, beneficiaries, transactions, and audits
- Shape of the Nomba integration boundary
- Trust scoring rules and how they evolve over time
- Webhook verification strategy
# Architectural Decisions

## Decision 1

Architecture First

We design before we code.

Reason

Reduces refactoring.

Improves understanding.

---

## Decision 2

Backend First

The frontend depends on the backend.

Backend is completed first.

---

## Decision 3

Wrapper Pattern

TrustVault never communicates directly with Nomba from controllers.

All communication goes through dedicated services.

Reason

Loose coupling.

Maintainability.

Testing.