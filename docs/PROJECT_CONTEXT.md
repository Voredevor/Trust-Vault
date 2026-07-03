# TrustVault

TrustVault is a backend-first trust and payment security layer built on top of Nomba Dedicated Virtual Account APIs.

## Current Phase

Phase 5 - Webhooks

## Project Goal

Provide a reusable security layer that fintechs and businesses can integrate without replacing Nomba.

## Stack

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Nomba APIs
- OAuth2
- JWT
- Swagger
- Render

## Completed So Far

- NestJS project scaffolded
- Core feature modules generated
- Prisma added to the project
- Documentation workspace created
- Base module wiring established
- Foundational User and Device models defined
- PrismaService implemented as the database boundary
- PrismaModule wired into the application
- Prisma client generated into `src/generated/prisma`
- First Prisma migration applied against Supabase
- Nomba OAuth token acquisition works in production
- First authenticated Nomba API request works in production

## Current Focus

- Review Nomba webhook requirements and signature verification
- Decide on Cloudflare Tunnel or a deployed endpoint for local webhook testing
- Build the webhook receiver and verifier

## What Must Stay True

- Business logic lives in services, not controllers
- Third-party API calls stay inside the Nomba module
- Database access stays behind PrismaService
- Security concerns live in the Trust Engine
- Features ship in small, working increments

## Long-Term Outcome

TrustVault should support:

- Dedicated Virtual Accounts
- Transaction reconciliation
- Trusted device tracking
- Beneficiary trust management
- Risk scoring
- Adaptive authentication
- Audit logging

## Working Rule

Before adding a new feature, confirm the previous architectural layer is complete and stable.