# Operations and release guide

## Environments

| Environment | Purpose | Data |
| --- | --- | --- |
| Local | Feature development and deterministic tests | Mock data and local-only credentials |
| Preview | Review each proposed release | Isolated non-production services and seed data |
| Production | Customer use | Authorized providers and production user data |

Production data must never be copied into local fixtures or committed to the repository. Environment configuration is documented by variable name and purpose, never by value.

## Release routine

1. Review the change against MVP scope and the affected contracts.
2. Run lint, typecheck, relevant tests, and production build.
3. Verify critical flows in a preview environment: search, property detail, profile, evaluation, saved items, and compare as applicable.
4. Confirm error, empty, unavailable-data, and disclosure states.
5. Deploy with a short change note and watch application errors and provider health.
6. Roll back or disable a feature if it creates incorrect financial results, data exposure, or a broken decision flow.

## Reliability basics

Provider calls need timeouts, structured failures, bounded retries where safe, and caching that records data freshness. The product must still render meaningful partial results when noncritical neighborhood data is unavailable. Record a source and retrieval timestamp for sourced facts.

## Incident priorities

P0 security or materially misleading financial output: contain, disable the affected capability, and investigate immediately. P1 broad core-flow outage: communicate internally, restore service or roll back. All incidents receive a brief follow-up with trigger, impact, detection, remediation, and prevention.
