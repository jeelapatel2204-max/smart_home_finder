# Quality strategy

## Test pyramid

| Layer | Purpose | Examples |
| --- | --- | --- |
| Unit | Trust individual deterministic rules | mortgage, true cost, match eligibility, score, stress scenarios |
| Component | Verify user-visible states | profile validation, explanation display, unavailable-data labels |
| Integration | Verify boundaries | repository adapters, server authorization, provider normalization |
| End-to-end | Protect critical journeys | create rules, assess a property, save, compare |

## Required calculation cases

- Standard fixed-rate mortgage and zero-interest mortgage.
- Zero down payment and fully paid cash purchase.
- Missing tax, HOA, insurance, and maintenance inputs.
- NOI, cash flow, cap rate, and remaining balance.
- Must Have failure, Prefer penalty, and No Preference exclusion.
- Scores at boundary values and a property with no evaluated preferences.
- Stress scenarios with transparent assumptions.

## Release gates

Before a production release, lint and typecheck must pass, domain unit tests must pass, and the production build must complete in an environment with its required network access. Critical paths must have an accessible keyboard flow, readable errors, and responsive layouts. A calculation or score change requires a reviewed test update and visible assumption text.

## Bug severity

- **P0:** data exposure, authorization bypass, or materially incorrect financial output shown as reliable. Stop release and mitigate.
- **P1:** core search, save, compare, or match flow broken for many users. Prioritize next release.
- **P2:** degraded or confusing behavior with a workaround. Schedule normally.
- **P3:** visual or copy issue without decision impact. Batch when practical.

## Current baseline

The repository currently has lint and TypeScript checks but no automated test runner. Add a lightweight unit-test setup with the first extracted financial service; do not create tests that merely duplicate JSX implementation details.
