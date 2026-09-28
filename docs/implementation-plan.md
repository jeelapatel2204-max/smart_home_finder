# Implementation plan

This plan converts the product vision into small, reviewable phases. Complete one work package at a time; do not begin a dependent package until its acceptance criteria pass.

## Working rhythm

For every work package:

1. Confirm the user problem and acceptance criteria.
2. Define or update the typed domain contract.
3. Build the pure domain logic before UI when calculations or scoring are involved.
4. Add focused tests for the new behavior.
5. Connect the smallest useful UI path.
6. Run lint, TypeScript, relevant tests, and a production build.
7. Update the decision log if a durable choice was made.

## Phase 0 — Stabilize the prototype

**Goal:** Make the current mock-data app an easy, safe base for product work.

| Work package | Deliverable | Done when |
| --- | --- | --- |
| 0.1 Feature boundaries | Thin routes and feature-owned code | Already completed; routes and features are documented |
| 0.2 Property model cleanup | One normalized mock property shape | Complete: address, location, financial fields, and map coordinates are internally consistent |
| 0.3 App states | Route loading, not-found, and error UI | Complete: a broken or missing route has a useful recovery path |
| 0.4 Test foundation | Lightweight unit-test runner and first test | Complete: calculation tests run locally and in GitHub Actions CI |

**Do not add:** real providers, accounts, AI, or a database.

## Phase 1 — Financial foundation

**Goal:** Produce a transparent true monthly ownership cost that users can trust as an estimate.

| Work package | Deliverable | Done when |
| --- | --- | --- |
| 1.1 Mortgage service | Fixed-rate payment and remaining-balance functions | Complete: standard-rate and zero-rate cases are tested |
| 1.2 Ownership-cost service | Mortgage, tax, insurance, HOA, and maintenance result | Complete: missing input returns an unavailable state, never a silent zero |
| 1.3 Assumptions model | Typed purchase and finance assumptions | Complete: the detail view discloses and allows adjustment of assumptions |
| 1.4 Property UI | True Monthly Cost on card and detail views | Complete: the same domain result is rendered in both places |

**Demo:** Change a down payment or rate and see the monthly estimate and assumption list update consistently.

## Phase 2 — Budget Rules profile

**Goal:** Let a buyer describe what they need without facing an overwhelming form.

| Work package | Deliverable | Done when |
| --- | --- | --- |
| 2.1 Rule contracts | Preference level, operators, and validated values | Complete: rules support Must Have, Prefer, and No Preference |
| 2.2 Essential-profile form | Price, monthly cost, beds, baths, square feet, tax, and HOA | Complete: the profile form covers each MVP criterion |
| 2.3 Progressive fields | Optional financial and lifestyle settings | Complete: tax and HOA rules stay hidden until requested |
| 2.4 Local persistence | Browser-backed profile and reset control | Complete: a valid profile persists locally and can be reset |

**Demo:** Create a buyer profile, reload, and edit it without losing the rules.

## Phase 3 — Explainable Match Engine

**Goal:** Evaluate every property using the buyer’s rules and show why.

| Work package | Deliverable | Done when |
| --- | --- | --- |
| 3.1 Eligibility evaluator | Failed Must Have rules | Complete: a failed hard constraint makes `eligible` false |
| 3.2 Preference scorer | Weighted score for evaluated Prefer rules | Complete: No Preference rules cannot affect the result |
| 3.3 Explanation builder | Strengths, concerns, and unavailable inputs | Complete: each score change maps to a readable reason |
| 3.4 Listings integration | Match indicators and near-match state | Complete: users can distinguish eligible homes from near matches |
| 3.5 Detail integration | Full explanation and assumptions | Complete: detail view uses the same result as the card |

**Demo:** Change one rule and see eligibility, score, and reasons change predictably across the app.

## Phase 4 — Shortlist and comparison

**Goal:** Help a buyer make a decision among several viable homes.

| Work package | Deliverable | Done when |
| --- | --- | --- |
| 4.1 Saved shortlist | Local favorites tied to the current profile | Complete: favorites remain available within the active session |
| 4.2 Comparison selection | Select up to four properties | Complete: cards communicate the selection state and four-home limit |
| 4.3 Comparison view | Comparable ownership, home, and match metrics | Complete: price, home facts, match score, and neighborhood score are compared |
| 4.4 Decision explanations | Per-metric strengths and tradeoffs | Complete: match scores retain their detail-page explanations |

**Demo:** Compare three properties and identify the financial and preference tradeoffs for each.

## Phase 5 — Validate the consumer workflow

**Goal:** Learn whether the decision engine changes user behavior before investing in infrastructure.

| Work package | Deliverable | Done when |
| --- | --- | --- |
| 5.1 Usability script | Repeatable buyer test script | Testers can complete profile → evaluate → compare flow |
| 5.2 Privacy-conscious events | MVP funnel and guardrail events | Events answer documented product questions without collecting unnecessary personal data |
| 5.3 Findings review | Ranked customer problems and roadmap update | Evidence supports or changes the next milestone |

**Decision gate:** Continue to backend work only if buyers understand the estimates and use match explanations or comparisons to narrow choices.

## Phase 6 — Backend and accounts

**Goal:** Make validated buyer work durable and secure across devices.

| Work package | Deliverable | Done when |
| --- | --- | --- |
| 6.1 Database schema | Profiles, rules, favorites, saved searches, migrations | Constraints and ownership are documented |
| 6.2 Authorization | Row-level policies and server-side checks | Users cannot access another user’s data |
| 6.3 Authentication | Sign-up, sign-in, sign-out, session behavior | Auth flows have error and recovery states |
| 6.4 Persistence migration | Server-backed profiles and favorites | Existing local data migration path is explicit or intentionally omitted |
| 6.5 Account controls | Data deletion and account settings | Users can manage their stored decision data |

**Demo:** Sign in on two devices and access only the same user’s saved profile and homes.

## Phase 7 — Neighborhood and resilience insights

**Goal:** Extend decision support without creating black-box recommendations.

| Work package | Deliverable | Done when |
| --- | --- | --- |
| 7.1 Neighborhood contract | Transparent dimension breakdown and source metadata | Complete: the five-category score is calculated in one tested domain service and explains its weighting |
| 7.2 OpenStreetMap neighborhood adapter | Nearby-place counts through a server-side provider boundary | Complete: property pages show source-labeled school, park, grocery, healthcare, and transit counts when available; missing quality and safety data remains unavailable |
| 7.3 Stress test | Base, moderate, and high-stress scenarios | Each scenario shows altered assumptions and housing burden |
| 7.4 FutureFit | Deterministic household and home-fit rules | Concerns are stated as fit risks, not predictions |

**Demo:** A user can see what changes under stress and why a home may not fit a stated future need.

## Phase 8 — Production data providers

**Goal:** Replace mock facts only with legally authorized, observable data sources.

| Work package | Deliverable | Done when |
| --- | --- | --- |
| 8.1 Provider evaluation | Approved provider, geography, contract, and attribution requirements | Data rights, cost, coverage, and freshness meet launch criteria |
| 8.2 Listing adapter | Server-side normalized listing repository | Search and detail failures degrade gracefully |
| 8.3 Neighborhood adapter | Source-specific normalization and freshness | Scores retain their calculation and source explanation |
| 8.4 Operations | Caching, retries, monitoring, and fallback UI | Provider outages do not make the application unusable |

**Demo:** A production-backed listing displays its source, freshness, and any unavailable facts honestly.

## Phase 9 — Optional AI assistance

**Goal:** Reduce input effort without making AI a decision authority.

| Work package | Deliverable | Done when |
| --- | --- | --- |
| 9.1 Natural-language parser | Structured, schema-validated draft criteria | User reviews and confirms every parsed rule |
| 9.2 Explanation layer | Plain-language wording from deterministic result | Output can cite only supplied calculation and property facts |
| 9.3 Safety and quality review | Monitoring, limits, and fallback | AI failure does not prevent deterministic search or matching |

**Do not start** this phase until structured filters and explanations are already useful without AI.

## Phase 10 — Smart Home Finder Pro

**Goal:** Adapt a proven consumer decision workflow for agents.

Start only after consumer validation demonstrates repeated decision sessions and a clear agent workflow. Build client profiles, shared shortlists, roles, and brokerage controls as a separate product surface with separate authorization and pricing decisions.

## Recommended next work package

Start with **Phase 2: Budget Rules profile**. The tested financial foundation can now become personal to each buyer through Must Have, Prefer, and No Preference rules.
