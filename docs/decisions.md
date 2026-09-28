# Decision log

## Accepted decisions

| ID | Decision | Why | Consequence |
| --- | --- | --- | --- |
| ADR-001 | Start with a consumer decision workflow | It validates the core thesis before the agent product | Pro is deferred |
| ADR-002 | Use deterministic services for finance and matching | Results must be explainable and testable | AI is limited to parsing and wording |
| ADR-003 | Distinguish Must Have, Prefer, and No Preference | Buyers need hard constraints and nuanced tradeoffs | Match result includes eligibility and reasons |
| ADR-004 | Keep provider adapters separate from UI | Listing and neighborhood sources will change | Mock and production providers share contracts |
| ADR-005 | Use browser persistence for initial profile validation | It reduces backend scope before workflow validation | Data is not durable or cross-device until accounts ship |
| ADR-006 | Supabase/PostgreSQL is the proposed persistence path | It aligns with authentication and row-level authorization needs | Verify provider, pricing, and operational fit before commitment |

## Open decisions

| Topic | Decision needed before | Validation question |
| --- | --- | --- |
| Initial launch geography | Real listing integration | Which market has accessible licensed data and target buyer demand? |
| Provider selection | Production data | What data rights, freshness, coverage, attribution, and cost are acceptable? |
| Monthly maintenance methodology | Financial foundation | Which assumptions are transparent and defensible for early users? |
| Match weights | Match-engine release | Which weights users understand and find useful in interviews? |
| Authentication timing | Backend foundation | Does local MVP testing show enough recurring value to justify accounts? |
| Analytics vendor | MVP instrumentation | Which vendor supports minimal, privacy-respecting event collection? |

New material choices should receive an ADR entry with context, decision, alternatives considered, and consequences.
