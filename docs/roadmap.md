# Roadmap

Each milestone ends with a demoable behavior and a verification gate. Dates belong in planning tooling after capacity and customer research are known.

| Milestone | Outcome | Exit criteria | Dependencies |
| --- | --- | --- | --- |
| 0. Product foundation | Reliable prototype structure | Feature boundaries documented; lint and typecheck pass | Complete |
| 1. Financial foundation | Trusted ownership-cost result | Mortgage and cost services are pure and tested; assumptions shown | None |
| 2. Budget rules | Reusable buyer profile | User can create, edit, reset, and locally persist a profile | 1 |
| 3. Match engine | Explainable property fit | Must Have, Prefer, and No Preference produce typed results and reasons | 1, 2 |
| 4. Decision experience | Users compare viable homes | Cards, details, saved items, and comparison render one shared result | 3 |
| 5. Backend foundation | Durable user data | Database schema, migrations, server client, and RLS policy tests | 2, 4 |
| 6. Accounts | Cross-device saved work | Authenticated favorites and profiles persist with authorization | 5 |
| 7. Neighborhood intelligence | Source-backed transparent neighborhood data | Adapter, freshness metadata, breakdown, and unavailable states | 5 |
| 8. Resilience features | FutureFit and stress insights | Deterministic scenarios and explanations tested | 1, 2 |
| 9. Production listings | Authorized property data | Provider contract, caching, failure UX, attribution, and data agreement | 5 |
| 10. AI assistance | Safer natural-language intake | Schema-constrained parsing, confirmation UI, evaluation, and monitoring | 3, 9 |

## Sequencing rules

- Do not build a database UI before the local workflow is validated.
- Do not call a language model until deterministic filters, calculations, and explanations are available.
- Do not make a provider integration the only way the app can run.
- Do not start Pro until consumer users repeatedly complete the decision workflow.

## Discovery checkpoints

Before moving from milestone 4 to 5, test the MVP with target buyers. Confirm that true monthly cost and explanations change which homes users shortlist. Before investing in listings data, verify that users return to saved profiles or comparisons. Those observations should drive the next roadmap revision.
