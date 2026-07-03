# Architecture

TrustVault uses a modular monolith with clear service boundaries.

## Request Flow

Client

↓

Controller

↓

Application Service

↓

Domain-Oriented Module Boundary

↓

PrismaService or NombaService

↓

PostgreSQL or Nomba API

## Why This Design

This structure keeps the codebase easy to reason about while the product is still small.

It also gives us one place for database access, one place for Nomba integration, and one place for trust and risk logic.

## Module Responsibilities

- Controllers accept requests, validate inputs, and return responses.
- Services contain business logic and orchestration.
- PrismaService owns database access.
- NombaModule owns all external payment API calls.
- TrustEngineModule owns security, scoring, and policy decisions.
- AuditModule records traceable security-relevant events.

## Boundary Rules

- Controllers should not talk to Prisma or Nomba directly.
- Services should call abstractions, not raw infrastructure clients.
- External API response mapping should happen close to the integration boundary.
- Shared cross-cutting concerns should be extracted only when they repeat.

## Why Prisma Lives Behind One Service

Prisma should be treated as the database gateway, not a general-purpose utility.

That keeps persistence concerns centralized and makes migrations, testing, and swapping implementation details easier.

The generated client lives under `src/generated/prisma`, which keeps the Nest build and the Prisma boundary aligned.

## Alternatives Considered

- Active Record style entities: simpler at first, but it blurs domain and persistence concerns.
- Direct database calls from services: faster to start, but harder to test and maintain.
- Full DDD layering everywhere: powerful, but too heavy for the current phase.

## Tradeoffs

- This approach adds some ceremony.
- It reduces accidental coupling.
- It scales better than a controller-heavy or service-free design.

## Current Architectural Priority

Make the database layer stable before adding Nomba workflows or security rules.