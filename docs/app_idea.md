# Smart Home Finder
## Product Vision, Pitch, and Codex Implementation Blueprint

**Project status:** Frontend prototype exists; V2 personalization and financial tools are in progress.  
**Primary stack:** Next.js, React, TypeScript, Tailwind CSS, Supabase, PostgreSQL  
**Product type:** Consumer real-estate decision platform with a future B2B agent product  
**Working name:** Smart Home Finder

---

# 1. One-Sentence Product Idea

**Smart Home Finder helps people decide which home actually fits their finances, lifestyle, future plans, and investment goals—not just which homes are for sale.**

---

# 2. Elevator Pitch

Most real-estate platforms are designed around listings. They are good at answering:

> "What homes are available?"

Smart Home Finder is designed to answer a more important question:

> **"Which of these homes actually makes sense for me?"**

The platform combines property listings with a buyer's personal budget rules, true monthly ownership costs, neighborhood data, commute preferences, future plans, and optional investment analysis.

Instead of ranking homes mainly by listing price, Smart Home Finder explains the **real financial and lifestyle fit** of each property.

A user can set requirements such as:

- maximum purchase price
- maximum true monthly housing cost
- property-tax tolerance
- HOA tolerance
- down payment
- maintenance budget
- bedroom and bathroom requirements
- commute limits
- neighborhood preferences
- future family needs
- investment goals

Each preference can be classified as:

- **Must Have** — hard requirement
- **Prefer** — soft preference
- **No Preference** — ignored

The platform then evaluates homes using transparent tools such as:

- True Monthly Cost
- Personalized Home Match Score
- Neighborhood Score
- Property Comparison
- FutureFit
- Home Stress Test
- Investment Property Analyzer
- AI natural-language property search
- AI explanations

The long-term goal is to create a real-estate **decision engine**, not another listing website.

---

# 3. Core Product Thesis

Real-estate search today is too focused on asking:

- What is the listing price?
- How many bedrooms?
- Where is the property?
- What does the house look like?

Those factors matter, but they are not enough to make a good housing decision.

Two houses with similar listing prices can have very different:

- monthly ownership costs
- property taxes
- HOA fees
- insurance
- maintenance requirements
- commute costs
- neighborhood quality
- long-term suitability
- investment potential

Smart Home Finder should combine these dimensions into one transparent system.

The product should never simply say:

> "This is the best home."

It should instead say:

> **"This home is a strong match for your rules, and here is exactly why."**

---

# 4. Product Positioning

Smart Home Finder is not intended to be:

- a Zillow clone
- a Redfin clone
- a mortgage calculator with listings
- a black-box AI recommendation engine

It should become:

> **A personalized real-estate decision platform that sits between property discovery and the final buying decision.**

The core value is not simply showing properties.

The core value is helping the user understand:

1. what the home really costs
2. whether it fits their personal requirements
3. what tradeoffs they are making
4. whether it still fits their future
5. whether the financial risk is reasonable
6. whether the home has investment potential
7. how it compares with other properties they are considering

---

# 5. Primary Users

## 5.1 First-Time Home Buyer

Typical concerns:

- "Can I actually afford this?"
- "What will I really pay every month?"
- "Am I forgetting property taxes or maintenance?"
- "Which neighborhood is better for me?"
- "Is this house going to make me house-poor?"

Primary features:

- My Home Budget Rules
- True Monthly Cost
- Personalized Match Score
- Property Comparison
- Neighborhood Score
- Home Stress Test

---

## 5.2 Move-Up / Lifestyle Buyer

Typical concerns:

- schools
- commute
- family size
- yard
- neighborhood amenities
- long-term suitability
- resale potential

Primary features:

- FutureFit
- Match Score
- Neighborhood Score
- personalized rules
- AI explanations

---

## 5.3 Real-Estate Investor

Typical concerns:

- rent
- cash flow
- cap rate
- cash-on-cash return
- equity growth
- vacancy
- appreciation
- operating expenses
- holding-period return

Primary features:

- Investment Property Analyzer
- scenario projections
- property comparison
- future return analysis

---

## 5.4 Real-Estate Agent — Future B2B Product

Future product:

**Smart Home Finder Pro**

Agents can create client profiles, enter client rules, compare properties, generate personalized shortlists, and explain why each property fits a client's needs.

---

# 6. Product Principles

Codex should preserve these principles in every feature.

## 6.1 Explainability Over Black-Box Scoring

Every score should have a visible explanation.

Bad:

> Match Score: 91

Better:

> Match Score: 91%

Reasons:

- $240 below your monthly housing limit
- meets your 4-bedroom requirement
- 18-minute commute
- no HOA
- slightly exceeds your preferred annual property-tax limit

---

## 6.2 Monthly Cost Matters More Than Sticker Price

Listing price should never be the only affordability signal.

True Monthly Cost should become one of the most important numbers in the product.

---

## 6.3 Hard Requirements and Preferences Are Different

A user should not be forced to treat every preference equally.

Each rule supports:

```text
MUST_HAVE
PREFER
NO_PREFERENCE
```

A Must Have can disqualify a property.

A Prefer should affect ranking but not necessarily hide the property.

No Preference should not affect scoring.

---

## 6.4 Users Stay in Control

AI should assist the decision.

AI should not pretend to make the purchase decision for the user.

The product should explain tradeoffs clearly.

---

## 6.5 Transparency

Financial assumptions and scoring rules should be visible.

Avoid mysterious scores.

---

## 6.6 Progressive Complexity

The app should be useful without requiring the user to fill out 30 fields.

Basic users can set only:

- budget
- bedrooms
- location

Advanced users can add detailed financial/lifestyle constraints.

---

# 7. Main Feature Set

---

# 7.1 Property Search

The search experience should support:

- city / ZIP / area
- minimum price
- maximum price
- bedrooms
- bathrooms
- property type
- square footage
- optional HOA limit
- optional property-tax limit
- optional monthly cost limit

Views:

- list
- map
- property detail

Property cards should eventually display:

- image
- address
- listing price
- beds
- baths
- square feet
- estimated True Monthly Cost
- Match Score
- favorite button

---

# 7.2 My Home Budget Rules

This is a core feature.

Users create a reusable profile describing what they want.

Potential fields:

```text
max_purchase_price
max_monthly_housing_cost
down_payment_amount
down_payment_percent
interest_rate
loan_term_years
max_property_tax_annual
max_hoa_monthly
maintenance_budget_monthly
min_bedrooms
min_bathrooms
min_square_feet
max_commute_minutes
preferred_locations
future_family_size
investment_interest
```

Each preference should support a rule type:

```ts
type PreferenceLevel =
  | "MUST_HAVE"
  | "PREFER"
  | "NO_PREFERENCE";
```

Example:

```ts
{
  field: "maxHoaMonthly",
  value: 250,
  level: "PREFER"
}
```

---

# 7.3 True Monthly Cost

## Goal

Show a realistic estimate of what owning the property may cost each month.

## Formula

```text
True Monthly Cost =
Mortgage Principal + Interest
+ Property Taxes
+ Homeowners Insurance
+ HOA
+ Estimated Maintenance
```

Future optional additions:

- PMI
- flood insurance
- special assessments
- utilities
- location-specific recurring costs

## Mortgage Formula

Use standard fixed-rate amortization.

```text
M = P * [r(1+r)^n] / [(1+r)^n - 1]
```

Where:

```text
M = monthly payment
P = loan principal
r = monthly interest rate
n = total number of payments
```

Handle zero-interest loans safely.

---

# 7.4 Personalized Home Match Score

## Goal

Measure how closely a property matches the user's rules.

The score should be explainable.

Recommended structure:

```ts
interface MatchResult {
  score: number; // 0-100
  eligible: boolean;
  strengths: string[];
  concerns: string[];
  failedMustHaves: string[];
}
```

## Scoring Logic

### Must Have

If a property violates a Must Have:

```text
eligible = false
```

The property may still optionally appear in a "Near Matches" section, but it must clearly show why it failed.

### Prefer

Preferred conditions contribute to score.

Example:

```text
Max preferred monthly cost = $3,000
Property monthly cost = $3,100

Result:
Property remains visible.
Score decreases slightly.
Explanation:
"$100 above your preferred monthly budget."
```

### No Preference

Ignore the field completely.

---

# 7.5 Match Explanation

Every evaluated property should produce:

```text
Why This Home Matches You
```

Example:

```text
Strong matches:
- True Monthly Cost is $220 below your limit.
- Meets your 4-bedroom requirement.
- No HOA.
- Estimated commute is 21 minutes.

Tradeoffs:
- Property taxes are $650/year above your preferred target.
- Estimated maintenance is slightly above your monthly preference.
```

---

# 7.6 Property Comparison

Users should be able to select multiple properties and compare them.

Suggested comparison fields:

| Metric | Property A | Property B |
|---|---:|---:|
| Listing Price | | |
| True Monthly Cost | | |
| Mortgage Payment | | |
| Property Taxes | | |
| Insurance | | |
| HOA | | |
| Maintenance | | |
| Bedrooms | | |
| Bathrooms | | |
| Square Feet | | |
| Match Score | | |
| Neighborhood Score | | |
| FutureFit | | |
| Investment Cash Flow | | |

Important:

Do not highlight a winner without explaining why.

---

# 7.7 Neighborhood Score

## Goal

Provide a transparent neighborhood evaluation.

Initial dimensions:

```text
schools
safety
amenities
accessibility
housing_value
```

Future dimensions:

```text
walkability
public_transit
parks
restaurants
grocery_access
hospitals
commute
development
home_appreciation
rental_demand
```

Example:

```text
Neighborhood Score: 84 / 100

Schools: 87
Safety: 78
Amenities: 92
Accessibility: 81
Housing Value: 82
```

## Requirement

Users should be able to see how the score is calculated.

Do not use a single unexplained number.

---

# 7.8 FutureFit

## Product Question

> "Will this home still fit my life several years from now?"

Possible variables:

- expected household size
- number of bedrooms
- career / work location
- commute
- expected income
- property-tax growth
- HOA growth
- maintenance
- resale potential
- rental potential

Recommended initial implementation:

```ts
interface FutureFitResult {
  rating: "STRONG" | "MODERATE" | "WEAK";
  reasons: string[];
  risks: string[];
}
```

Do not attempt predictive machine learning in the first version.

Use deterministic rules first.

---

# 7.9 Home Stress Test

## Product Question

> "What happens if owning this home becomes more expensive or my finances become less favorable?"

Possible scenarios:

### Base

Current assumptions.

### Moderate Stress

Example:

```text
property taxes +10%
insurance +10%
maintenance +20%
```

### High Stress

Example:

```text
property taxes +20%
insurance +20%
maintenance +40%
monthly income -10%
```

Allow the user to customize assumptions later.

Output should include:

```text
monthly cost
monthly surplus after housing
housing-to-income percentage
stress category
explanation
```

Suggested categories:

```text
COMFORTABLE
TIGHT
HIGH_STRESS
```

These are descriptive financial scenario labels, not financial advice.

---

# 7.10 Investment Property Analyzer

This feature is for users evaluating rental property.

Inputs:

```text
purchase_price
down_payment
interest_rate
loan_term
monthly_rent
vacancy_rate
property_tax
insurance
hoa
maintenance
other_operating_expenses
expected_appreciation
holding_period
```

Outputs:

```text
effective_rental_income
NOI
mortgage_payment
monthly_cash_flow
annual_cash_flow
cap_rate
cash_on_cash_return
remaining_loan_balance
projected_property_value
projected_equity
cumulative_cash_flow
estimated_total_return
```

## NOI

```text
Effective Rental Income
- Operating Expenses
= NOI
```

Operating expenses include:

```text
property taxes
insurance
HOA
maintenance
other operating expenses
```

Mortgage principal and interest should NOT be included in NOI.

---

## Monthly Cash Flow

```text
Monthly Cash Flow =
Monthly NOI
- Monthly Mortgage Principal & Interest
```

---

## Cap Rate

```text
Cap Rate =
Annual NOI / Purchase Price
```

---

## Cash-on-Cash Return

```text
Cash-on-Cash Return =
Annual Cash Flow / Cash Invested
```

---

# 7.11 Investment Scenario Projections

Support:

```text
Conservative
Expected
Optimistic
```

Each scenario can have different assumptions for:

- appreciation
- rent growth
- expenses

Output:

- projected property value
- loan balance
- equity
- cumulative cash flow
- estimated return

Clearly label projections as estimates.

---

# 7.12 AI Natural-Language Search

Future feature.

Example user input:

> Find me a house near Cincinnati under $500K with at least 3 bedrooms, no huge HOA, good schools, less than 25 minutes from downtown, and something that would still work if I have kids.

AI should translate this into structured criteria.

Example:

```json
{
  "maxPrice": 500000,
  "minBedrooms": 3,
  "maxHoaMonthly": 250,
  "maxCommuteMinutes": 25,
  "schoolPreference": "high",
  "futureFamilyFriendly": true
}
```

The final search should still use deterministic filters and scoring.

AI should interpret language.

AI should not invent property facts.

---

# 7.13 AI Match Explanations

AI may convert deterministic calculations into plain English.

Example:

> This property is $12,000 above your preferred purchase price, but its lower property taxes and lack of HOA make the estimated monthly ownership cost $180 below your monthly limit.

Important architecture rule:

```text
CALCULATIONS -> deterministic TypeScript services

AI -> explanation layer
```

Do not ask an LLM to calculate mortgage payments or investment returns.

---

# 7.14 Favorites

Users should be able to:

- favorite a property
- unfavorite a property
- view saved properties
- compare saved properties

Current browser-based persistence should eventually be replaced by database-backed favorites after authentication.

---

# 7.15 Saved Searches

Future authenticated users should be able to save search criteria.

Potential model:

```text
SavedSearch
- id
- user_id
- name
- criteria_json
- created_at
- updated_at
```

Future feature:

property alerts when matching listings appear.

---

# 8. Smart Home Finder Pro

This is a future B2B SaaS product.

Do NOT implement until the consumer product is stable.

---

# 8.1 Pro Target Customers

- individual real-estate agents
- real-estate teams
- brokerages

---

# 8.2 Client Profiles

Agents create profiles for buyers.

Example:

```text
Client:
Sarah & John

Budget:
$600,000

Must Have:
- 4 bedrooms
- total monthly cost below $4,000
- commute under 30 minutes

Prefer:
- finished basement
- large yard
- low HOA
- strong schools
```

---

# 8.3 Agent Match Dashboard

For each client:

```text
Property A — 94% Match
Property B — 87% Match
Property C — 79% Match
```

Agents can inspect why.

---

# 8.4 Client Shortlists

Agents can create and share personalized property collections.

Each property can include:

- Match Score
- True Monthly Cost
- neighborhood information
- strengths
- tradeoffs
- agent notes

---

# 8.5 Brokerage Version

Possible future features:

- multiple agents
- team roles
- shared clients
- branded client portals
- reporting
- engagement analytics

---

# 9. Business Model Direction

## Consumer

Core home-search and decision tools should remain free or largely free.

Goal:

- user adoption
- trust
- data
- product-market fit

## Professional

Monetize through:

**Smart Home Finder Pro**

Potential subscription tiers:

```text
Individual Agent
Team
Brokerage
```

Do not add payment infrastructure until there is a working professional feature set.

---

# 10. Product Architecture

Recommended architecture:

```text
Next.js Frontend
       |
       v
Server Actions / API Layer
       |
       v
Domain Services
       |
       +----------------------+
       |                      |
       v                      v
Supabase / PostgreSQL      External APIs
                              |
                              +-- Listings
                              +-- Neighborhood data
                              +-- Maps / geocoding
                              +-- Mortgage/rate data
```

Financial calculations should live in reusable domain services.

Example:

```text
src/
  app/
  components/
  features/
  lib/
    calculations/
    matching/
    neighborhoods/
    investment/
  types/
  services/
```

---

# 11. Recommended Folder Structure

Codex should adapt this to the existing codebase instead of forcing a destructive refactor.

```text
src/
├── app/
│   ├── page.tsx
│   ├── search/
│   ├── property/
│   ├── favorites/
│   ├── compare/
│   ├── budget-rules/
│   ├── investment/
│   └── account/
│
├── components/
│   ├── ui/
│   ├── property/
│   ├── finance/
│   ├── neighborhood/
│   └── layout/
│
├── features/
│   ├── search/
│   ├── favorites/
│   ├── budget-rules/
│   ├── property-matching/
│   ├── investment/
│   └── neighborhoods/
│
├── lib/
│   ├── calculations/
│   │   ├── mortgage.ts
│   │   ├── trueMonthlyCost.ts
│   │   ├── investment.ts
│   │   └── stressTest.ts
│   │
│   ├── matching/
│   │   ├── calculateMatchScore.ts
│   │   └── generateMatchReasons.ts
│   │
│   ├── supabase/
│   └── utils/
│
├── services/
│   ├── propertyService.ts
│   ├── neighborhoodService.ts
│   └── userPreferenceService.ts
│
└── types/
    ├── property.ts
    ├── preferences.ts
    ├── investment.ts
    └── neighborhood.ts
```

---

# 12. Core Data Models

These are conceptual models. Codex should map them to the actual existing project.

---

# 12.1 User

```ts
interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
```

Supabase Auth should own credentials.

Do not store raw passwords.

---

# 12.2 Property

```ts
interface Property {
  id: string;
  externalListingId?: string;

  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;

  latitude?: number;
  longitude?: number;

  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  lotSize?: number;
  yearBuilt?: number;

  propertyType?: string;

  annualPropertyTax?: number;
  monthlyHoa?: number;
  estimatedMonthlyInsurance?: number;

  images: string[];

  listingStatus?: string;
  source?: string;

  createdAt: string;
  updatedAt: string;
}
```

---

# 12.3 Favorite

```ts
interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
}
```

Unique constraint:

```text
(user_id, property_id)
```

---

# 12.4 User Preference Profile

```ts
interface UserPreferenceProfile {
  id: string;
  userId: string;

  maxPurchasePrice?: number;
  maxMonthlyHousingCost?: number;

  downPaymentAmount?: number;
  downPaymentPercent?: number;

  interestRate?: number;
  loanTermYears?: number;

  maxAnnualPropertyTax?: number;
  maxMonthlyHoa?: number;
  maintenanceBudgetMonthly?: number;

  minBedrooms?: number;
  minBathrooms?: number;
  minSquareFeet?: number;

  maxCommuteMinutes?: number;

  createdAt: string;
  updatedAt: string;
}
```

Preference levels may be stored separately.

---

# 12.5 Preference Rule

Recommended scalable model:

```ts
interface PreferenceRule {
  id: string;
  profileId: string;

  field: string;
  operator: string;

  numericValue?: number;
  textValue?: string;
  booleanValue?: boolean;

  level: "MUST_HAVE" | "PREFER" | "NO_PREFERENCE";

  weight?: number;
}
```

---

# 12.6 Neighborhood

```ts
interface Neighborhood {
  id: string;
  name: string;
  city: string;
  state: string;

  schoolScore?: number;
  safetyScore?: number;
  amenityScore?: number;
  accessibilityScore?: number;
  housingValueScore?: number;

  overallScore?: number;

  sourceMetadata?: Record<string, unknown>;
}
```

---

# 13. Database Direction

Use:

```text
Supabase
PostgreSQL
```

Initial tables:

```text
profiles
properties
favorites
preference_profiles
preference_rules
neighborhoods
saved_searches
```

Future:

```text
property_analysis
comparisons
investment_scenarios
agent_profiles
agent_clients
client_preferences
client_shortlists
```

---

# 14. Authentication

Use Supabase Auth.

Initial requirements:

- sign up
- sign in
- sign out
- persisted user session

After authentication:

- favorites should be stored by user
- Budget Rules should be stored by user
- saved searches should be stored by user

Implement Row Level Security.

Example principle:

```text
A user can read/write their own preference profile.
A user can read/write their own favorites.
Public property data can be readable by all authenticated or anonymous users depending on product design.
```

---

# 15. Listing Data Strategy

## Current State

The prototype uses mock/sample listing data.

## Production Direction

Replace mock listings with a legitimate licensed source.

Possible categories:

- MLS integration
- licensed real-estate data provider
- legitimate property listing API

Do not make the production architecture depend on scraping Zillow.

Create a provider abstraction.

Example:

```ts
interface PropertyProvider {
  search(criteria: PropertySearchCriteria): Promise<Property[]>;
  getById(id: string): Promise<Property | null>;
}
```

For now:

```text
MockPropertyProvider
```

Later:

```text
RealListingProvider
```

This prevents the UI from depending directly on one external vendor.

---

# 16. Neighborhood Data Strategy

Use separate data providers.

Potential categories:

```text
schools
crime/safety
amenities
walkability
transit
property values
commute
```

Normalize each source into internal scores.

Do not couple the UI directly to raw third-party API responses.

---

# 17. Financial Calculation Services

Calculations must be:

- deterministic
- reusable
- unit tested
- independent from UI

Suggested functions:

```ts
calculateMortgagePayment()
calculateRemainingLoanBalance()
calculateTrueMonthlyCost()
calculateNOI()
calculateCashFlow()
calculateCapRate()
calculateCashOnCashReturn()
calculateProjectedPropertyValue()
calculateProjectedEquity()
runStressTest()
```

---

# 18. Match Engine Architecture

Recommended workflow:

```text
Property
+
User Preference Profile
+
Financial Assumptions
+
Neighborhood Data
          |
          v
   Match Engine
          |
          v
 MatchResult
```

Pseudo-code:

```ts
function evaluateProperty(
  property: Property,
  profile: PreferenceProfile,
  financials: PropertyFinancials
): MatchResult {

  const failedMustHaves = [];
  const strengths = [];
  const concerns = [];

  // Check MUST_HAVE rules first.

  // Score PREFER rules.

  // Ignore NO_PREFERENCE rules.

  // Build human-readable reasons.

  return {
    eligible: failedMustHaves.length === 0,
    score,
    failedMustHaves,
    strengths,
    concerns
  };
}
```

---

# 19. Scoring Philosophy

Avoid false precision.

A score of 92 should not imply scientific certainty.

The score means:

> The property matches approximately 92% of the weighted preferences evaluated by the system.

Document the calculation.

Potential simple weighting:

```text
Budget / affordability = 30%
Home characteristics = 25%
Neighborhood = 20%
Commute / location = 15%
FutureFit = 10%
```

These weights should eventually be configurable.

For early versions, prioritize transparency over sophistication.

---

# 20. UI Direction

The app should feel:

- modern
- premium
- clean
- trustworthy
- data-driven
- simple enough for first-time buyers

Avoid:

- overly flashy AI branding
- excessive gradients
- crowded dashboards
- too many financial numbers at once
- unexplained scores

Use progressive disclosure.

Example property card:

```text
--------------------------------------------------
[Property Image]

123 Main Street
Cincinnati, OH

$475,000

4 bd | 3 ba | 2,450 sq ft

Estimated True Monthly Cost
$3,420/mo

92% Match

[View Details]    [♡]
--------------------------------------------------
```

---

# 21. Property Detail Page

Recommended sections:

```text
Property Summary
Photos

Price / Beds / Baths / Sq Ft

True Monthly Cost

Why This Home Matches You

Budget Fit

Neighborhood

FutureFit

Home Stress Test

Investment Analysis

Comparable Homes

Map

Disclosures / Data Sources
```

Do not show every advanced section by default.

Investment tools can be collapsed unless the user indicates investment interest.

---

# 22. Current Project State

Codex should assume:

- Next.js app already exists
- React
- TypeScript
- Tailwind
- App Router
- frontend prototype is functional
- mock properties currently exist
- favorites exist in some client-side form
- investment calculator exists or is partially implemented
- project is already in GitHub
- project can be deployed to Netlify

Codex should inspect the repository before changing architecture.

Do not recreate the app from scratch unless explicitly instructed.

---

# 23. Development Strategy

This project should be built incrementally.

The required workflow is:

```text
PLAN
  ↓
SMALL FEATURE
  ↓
IMPLEMENT
  ↓
TYPECHECK
  ↓
TEST
  ↓
BUILD
  ↓
REVIEW
  ↓
COMMIT
  ↓
NEXT FEATURE
```

Codex should not attempt the entire roadmap in one change.

---

# 24. Implementation Phases

---

## Phase 1 — Frontend Prototype

Status:

**Mostly complete**

Includes:

- mock property data
- property cards
- search interface
- property detail experience
- favorites
- visual design
- basic map/search layout

---

## Phase 2 — Financial Foundation

Status:

**In progress**

Implement / stabilize:

- mortgage calculator
- True Monthly Cost
- maintenance estimates
- investment calculator
- investment projections

Required outcome:

Financial calculations are isolated from UI and unit tested.

---

## Phase 3 — My Home Budget Rules

Implement:

- preference profile
- Must Have / Prefer / No Preference
- form UI
- browser persistence first if needed
- reusable matching inputs

Required outcome:

User can define a reusable property criteria profile.

---

## Phase 4 — Personalized Match Engine

Implement:

- Must Have validation
- Prefer scoring
- Match Score
- strengths
- concerns
- failed rules

Required outcome:

Every mock property can be evaluated against user rules.

---

## Phase 5 — Comparison Experience

Implement:

- select properties
- compare financials
- compare Match Score
- compare neighborhood
- compare FutureFit when available

---

## Phase 6 — Backend Foundation

Implement:

- Supabase project configuration
- PostgreSQL schema
- database client
- environment variables
- migration files

Do not remove mock property support yet.

---

## Phase 7 — Authentication

Implement:

- sign up
- login
- logout
- session handling
- protected account pages

Then migrate:

- favorites
- user preferences

from browser storage to database-backed persistence.

---

## Phase 8 — Neighborhood Intelligence

Implement:

- neighborhood schema
- scoring methodology
- transparent breakdown
- initial data adapter

Start with sample data if a production provider is unavailable.

---

## Phase 9 — Home Stress Test

Implement deterministic financial scenarios.

Do not use AI to calculate results.

---

## Phase 10 — FutureFit

Start with rules.

Do not build machine learning.

Example logic:

```text
User expects 2 children
Property has 2 bedrooms

FutureFit concern:
"May not meet your future bedroom needs."
```

---

## Phase 11 — Production Listing Provider

Replace mock listings through provider abstraction.

Requirements:

- legal/authorized source
- normalized internal Property model
- graceful API failure states
- caching if necessary

---

## Phase 12 — AI Search

Only after structured filters are stable.

AI responsibilities:

- parse natural language
- convert into structured search criteria
- explain matches

AI should not:

- invent listing details
- calculate financial metrics
- override hard user preferences silently

---

## Phase 13 — Smart Home Finder Pro

Start only after the consumer product is stable.

---

# 25. Immediate Codex Priorities

When starting or resuming development, Codex should prioritize:

1. inspect current repository structure
2. understand current mock property model
3. locate financial calculation code
4. locate favorites persistence
5. locate Budget Rules implementation
6. run TypeScript checks
7. run build
8. identify the next smallest unfinished V2 feature
9. implement only that feature
10. preserve existing working UI

---

# 26. Codex Coding Rules

Codex should follow these rules.

## Do

- inspect before modifying
- reuse existing components
- use TypeScript types
- keep calculations separate from presentation
- add unit tests for financial logic
- keep components reasonably small
- preserve responsive layout
- reuse design tokens
- run typecheck after changes
- run production build
- explain meaningful architectural changes

## Do Not

- rewrite the entire project unnecessarily
- install large dependencies without justification
- duplicate existing utility functions
- hard-code user-specific numbers into UI
- calculate financial values directly inside JSX
- store secrets in source code
- commit API keys
- scrape Zillow
- make AI responsible for arithmetic
- invent neighborhood or listing facts

---

# 27. Error Handling Expectations

The app should gracefully handle:

- missing property tax
- missing HOA
- missing insurance estimate
- zero interest rate
- missing square footage
- external API failure
- incomplete neighborhood data
- missing user preference
- invalid calculator values

Unknown data should display:

```text
Not available
```

or:

```text
Estimate unavailable
```

Do not silently replace unknown data with zero if that would mislead the user.

---

# 28. Testing Priorities

Financial calculations need strong testing.

At minimum test:

```text
mortgage with standard rate
mortgage with 0% interest
NOI
cash flow
cap rate
cash-on-cash return
remaining balance
true monthly cost
Must Have failure
Prefer scoring
No Preference ignored
stress scenario calculations
```

---

# 29. Security Priorities

When backend work begins:

- Supabase Row Level Security
- validate server-side inputs
- do not expose privileged Supabase keys
- sanitize external data
- use environment variables
- rate-limit sensitive endpoints if needed
- never trust client-calculated values for protected writes

---

# 30. Analytics to Consider Later

Potential product metrics:

```text
searches per user
favorites per user
properties compared
Budget Rules completion rate
Match Score engagement
True Monthly Cost interactions
property detail conversion
saved searches
return users
agent clients created
shortlists shared
```

Do not add heavy analytics before core product functionality is stable.

---

# 31. Future Product Opportunities

These are ideas, not current implementation requirements.

Possible future modules:

- property alerts
- mortgage-rate alerts
- tax change monitoring
- renovation cost estimates
- offer analysis
- rent-vs-buy
- closing-cost calculator
- affordability timeline
- homeownership readiness
- property history
- insurance risk
- flood/wildfire risk
- agent collaboration
- lender integrations
- document organization
- deal-room workflow

They should only be considered after the core decision engine works well.

---

# 32. Product North Star

The product should eventually let a user say:

> "I work downtown, want to stay below $3,500 per month total, want at least three bedrooms, may have kids in the next five years, don't want a large HOA, care about schools, and would like the home to have decent rental potential if I move later."

Smart Home Finder should then return relevant homes and explain:

- which requirements each property satisfies
- the true estimated monthly ownership cost
- what tradeoffs exist
- how the neighborhood compares
- whether the home fits future plans
- how resilient the purchase is under stress
- whether it may work as an investment

That is the long-term product.

---

# 33. Short Investor / Demo Pitch

**Smart Home Finder is a personalized real-estate decision platform built for the part of home buying that listing sites largely ignore: deciding which property actually makes sense for a specific person.**

Instead of relying mainly on price, bedrooms, and photos, Smart Home Finder combines a buyer's personal rules with the true monthly cost of ownership, neighborhood intelligence, commute preferences, future lifestyle needs, and optional investment analysis.

Users can classify requirements as Must Have, Prefer, or No Preference. The platform evaluates each property, generates a transparent Match Score, and explains the tradeoffs.

For example, a house may cost $20,000 more than another listing but still be the better financial fit because it has lower property taxes, no HOA, and lower maintenance costs.

Future tools such as FutureFit and the Home Stress Test help buyers evaluate whether a property will continue to make sense as their life and expenses change.

The long-term opportunity extends beyond consumers. Smart Home Finder Pro would let real-estate agents manage client preferences, automatically score listings for each buyer, build personalized shortlists, and provide clients with data-driven explanations.

The goal is simple:

> **Move real-estate technology from property search to property decision intelligence.**

---

# 34. Codex Project Mission

When Codex works on this repository, use this statement as the source of truth:

> Build Smart Home Finder as a transparent, personalized real-estate decision platform. Preserve the existing Next.js application and implement features incrementally. The most important product differentiators are True Monthly Cost, My Home Budget Rules, explainable property matching, neighborhood intelligence, financial stress testing, FutureFit, and investment analysis. Financial calculations must be deterministic and tested. AI should interpret user language and explain results, but it should not invent property data or perform critical financial arithmetic.

---

# 35. Suggested Prompt to Give Codex at the Start of a Session

Copy and paste this with the repository open:

```text
Read SMART_HOME_FINDER_PRODUCT_SPEC.md before making changes.

Then inspect the existing repository and determine the current implementation state.

Do not rewrite the application.

First:
1. identify the current stack and folder structure,
2. locate property data/models,
3. locate Budget Rules,
4. locate financial calculation utilities,
5. locate favorites persistence,
6. run the existing typecheck/build/test commands,
7. summarize what is complete versus what is still missing from the current roadmap.

After that, recommend the smallest logical next implementation task.

Do not implement the next task until the repository state is understood.

Follow the product spec's architecture rules:
- deterministic financial calculations,
- explainable matching,
- Must Have / Prefer / No Preference,
- reusable services,
- TypeScript,
- incremental changes,
- preserve existing working UI.
```

---

# 36. Definition of Success

Smart Home Finder is successful when a user can move from:

> "I like this house."

to:

> "I understand what this house really costs, how well it matches my needs, what the tradeoffs are, how it compares with my alternatives, and whether it still makes sense for my future."

That is the product experience every technical decision should support.
