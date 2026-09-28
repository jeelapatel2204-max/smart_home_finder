# Smart Home Finder documentation

Start with [app_idea.md](./app_idea.md). It is the product vision and the authority for product intent. The documents below turn that vision into delivery, engineering, and operating decisions.

| Document | Use it for |
| --- | --- |
| [MVP scope](./mvp.md) | What to build first and what is deliberately deferred |
| [Implementation plan](./implementation-plan.md) | Small work packages, dependencies, demos, and phase gates |
| [Buyer usability test](./usability-test.md) | Script and success criteria for the Phase 5 validation sessions |
| [Supabase setup](./supabase-setup.md) | Create the project, apply the secure account schema, and connect local credentials |
| [Account testing checklist](./account-test-checklist.md) | Manual steps for verifying account data persists across sessions and devices |
| [Test deployment](./deployment.md) | Publish a protected test version and configure its environment |
| [Production data providers](./production-data-providers.md) | Provider choices, credentials, attribution, and fallback behavior for Phase 8 |
| [Roadmap](./roadmap.md) | Milestones, exit criteria, and dependencies |
| [Architecture](./architecture.md) | Current codebase, target boundaries, and technical choices |
| [Data contracts](./data-contracts.md) | Shared domain models and data ownership |
| [Engineering guide](./engineering.md) | Delivery conventions and integration rules |
| [Quality strategy](./quality.md) | Test coverage, review criteria, and release gates |
| [Security and privacy](./security-privacy.md) | Data handling and launch safeguards |
| [Metrics](./metrics.md) | Product events and decision metrics |
| [Operations](./operations.md) | Environments, incident response, and release routine |
| [Decision log](./decisions.md) | Decisions already made and items needing validation |

## Decision order

1. Validate the consumer decision workflow with mock data.
2. Ship financial and matching foundations before integrations or AI.
3. Add authentication and persistence after the workflow proves useful.
4. Add licensed property and neighborhood data behind provider adapters.
5. Consider Pro only after consumer retention and matching quality are established.

The documentation describes intended behavior; it does not claim that an unbuilt integration or safeguard exists today.
