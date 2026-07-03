# API

This document will become the contract for TrustVault endpoints as the backend matures.

## Current Status

The public API surface is not finalized yet.

That is intentional. In Phase 2, the priority is database stability and a clean persistence boundary.

## Planned Direction

- Keep controllers thin and predictable
- Expose only the endpoints needed for the current phase
- Document request and response shapes in Swagger as each feature ships
- Avoid designing a large API surface before the data model is stable

## Near-Term Candidates

- Health check endpoint
- Database readiness check
- Future Nomba authentication and virtual account endpoints

## Rule

No endpoint should be added unless its underlying service behavior is already defined.
# API Documentation

This document will contain every endpoint exposed by TrustVault.

It will be updated after each feature is completed.