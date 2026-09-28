# MVP scope

## Product outcome

Help a prospective buyer answer, for a shortlist of homes: “What will this cost me each month, does it meet my non-negotiables, and what tradeoffs would I make?”

## Target user

First-time buyers evaluating a small set of properties. They need confidence in affordability and fit, not a comprehensive replacement for every listing portal.

## MVP workflow

1. A visitor searches the supplied property catalogue.
2. They create one budget-and-needs profile using a small progressive form.
3. They label each rule Must Have, Prefer, or No Preference.
4. Each property shows true monthly cost, eligibility, a match score, and concise reasons.
5. They save and compare up to four homes in one session.
6. They can inspect the calculation assumptions and missing data notices.

## In scope

- Deterministic mortgage and true-monthly-cost calculation.
- Browser-persisted single profile, favorites, and comparison selection for early validation.
- Budget rules for price, monthly cost, bedrooms, bathrooms, square feet, property tax, and HOA.
- Explainable Must Have checks and weighted Prefer scoring.
- Property-card and detail-page match explanations.
- Comparison of financial, property, and score data.
- Clear sample-data and estimate disclosures.
- Tests for every calculation and matching rule.

## Deferred

- Authentication, database persistence, alerts, and real listings.
- Commute-time calculations and provider-backed neighborhood intelligence.
- FutureFit, stress test, AI search, AI explanations, and collaboration.
- Payments, agent workspaces, and Smart Home Finder Pro.

## Acceptance criteria

The MVP is ready for a user test when a user can create a profile in under three minutes, inspect why a home passes or fails each rule, compare several homes, and understand all financial assumptions without asking support. Every score must identify the evaluated rules and the reason for any lost points.

## Non-goals

The MVP does not recommend a purchase, provide financial advice, claim live market accuracy, or conceal an ineligible home as a high-quality match.
