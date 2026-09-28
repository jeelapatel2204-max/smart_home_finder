# Engineering guide

## Delivery model

Work in small vertical slices: define the result contract, implement the domain service, connect one UI path, add focused tests, then run lint, typecheck, and production build. Preserve the working prototype unless a task intentionally changes behavior.

## Code boundaries

- `app/` contains route conventions, layouts, metadata, loading, and error boundaries.
- `features/<name>/` owns feature UI, state, and local helpers.
- Pure business logic belongs in a feature `lib/` folder or a dedicated domain feature.
- Server-only provider adapters and database access must never be imported by a client component.
- Use `@/` imports for code across feature boundaries.
- Keep user-visible strings, units, and calculation assumptions close to the contract that defines them.

## Next.js rules

Default to server components. Add `"use client"` only where browser state, event handlers, or browser-only libraries are necessary. Keep pages thin and pass serialized, minimal props into client components. Read the installed Next.js documentation before introducing a framework API, because this repository uses Next 16.

## Financial and matching rules

- Domain functions must be deterministic, side-effect free, and testable without React.
- Validate numeric inputs at the boundary and guard zero-interest and zero-down-payment cases.
- Return unavailable data and warnings explicitly.
- Match evaluation checks Must Have rules before calculating Prefer scores.
- Build explanations from the same evaluated result that supplies the score.
- Never put financial arithmetic, scoring weights, or provider response parsing directly in JSX.

## Integration rules

- Introduce each external system behind an interface and a mock adapter.
- Validate provider payloads at runtime before normalizing them.
- Capture source name, source ID, fetched time, and completeness for provider-backed facts.
- Keep secret keys server-side; client variables require a deliberate public prefix.
- Migrations are append-only and reviewed with their authorization policies.

## Pull-request checklist

- Product behavior and assumptions are described.
- New calculations and match rules have meaningful tests.
- Loading, empty, error, and unknown-data states are covered when relevant.
- No user data or secret is logged.
- `npm run lint`, `npx tsc --noEmit`, and `npm run build` were attempted and results recorded.
- Documentation and decision log are updated if behavior or an architectural choice changed.
