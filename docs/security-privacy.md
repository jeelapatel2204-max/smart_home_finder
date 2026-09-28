# Security and privacy

## Data classification

| Class | Examples | Handling |
| --- | --- | --- |
| Public listing data | address, price, facts supplied by a licensed provider | retain attribution and provider restrictions |
| Personal profile data | budget, commute preferences, household plans, favorites | collect minimally; authorize per user; never expose in public URLs or logs |
| Sensitive credentials | database keys, provider tokens, service credentials | server-only environment variables; no source control or client bundle |
| Derived results | match score, stress result, investment assumptions | treat as personal when linked to a user |

## Requirements before accounts launch

- Use a managed identity provider; never implement password storage.
- Enforce row-level authorization for profiles, favorites, saved searches, and comparisons.
- Check authorization again in server code; client state is never authoritative.
- Validate and limit all user-provided input on the server.
- Keep provider keys and privileged database access server-only.
- Provide a way to delete an account and associated user-owned data.
- Publish a privacy notice that accurately describes collection, retention, and providers before collecting personal data.

## Financial communication

All costs, projections, scores, and stress scenarios are estimates based on disclosed assumptions. The product should never imply lending approval, investment advice, guaranteed returns, or complete data coverage. Unknown data must remain visible as unavailable.

## AI and third parties

Send only the minimum information required for an AI explanation. Do not send credentials, full user profiles, or unneeded property records. AI output is untrusted display content: constrain it to supplied facts, disclose its role, and retain deterministic results as the source of truth.

## Incident handling

If a secret or personal-data exposure is suspected, revoke the affected credential or session, preserve relevant audit evidence, assess affected records, and pause dependent releases. Document the event and corrective actions in a private incident record.
