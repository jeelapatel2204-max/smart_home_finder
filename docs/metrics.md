# Metrics plan

Metrics should answer whether the product helps people make a better home decision. Do not add broad tracking until the MVP workflow exists and events have a stated purpose.

## North-star signal

**Weekly decision sessions completed:** a user evaluates at least one property against a profile and either saves or compares a property. This signals that the decision engine, not mere browsing, delivered value.

## Funnel

| Stage | Event | Question answered |
| --- | --- | --- |
| Discovery | `search_submitted` | Are visitors beginning a property search? |
| Intent | `profile_started`, `profile_completed` | Do users give the product enough context to personalize? |
| Value | `property_evaluated`, `match_explanation_viewed`, `monthly_cost_viewed` | Are they using decision tools? |
| Decision | `favorite_created`, `comparison_started`, `comparison_viewed` | Do insights lead to a shortlist? |
| Retention | `decision_session_completed` on a later week | Do users return to continue evaluating? |

## Event properties

Use opaque internal IDs and product-state categories, not raw addresses, free-text search terms, household details, email addresses, or exact financial inputs. Useful properties include anonymous/session ID, authenticated user ID when available, route, feature version, result availability, count of evaluated rules, and whether a property was eligible.

## Guardrails

- Percentage of results with unavailable financial inputs.
- Match explanations viewed without a subsequent evaluation error.
- Calculation error rate.
- Provider freshness and failure rate.
- Support reports that users find a score confusing or misleading.

Review metrics monthly. Delete events that do not inform a product or reliability decision.
