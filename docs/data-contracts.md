# Data contracts

These are internal contracts. A provider adapter maps external data into them before domain services or UI use it.

## Conventions

- IDs are stable strings in persisted data; mock numeric IDs are a temporary implementation detail.
- Currency amounts are decimal dollar values in TypeScript and `numeric` values in PostgreSQL. Do not use floating-point database columns for money.
- Rates are percentages at the boundary (`6.5` means 6.5%) and documented explicitly in every type.
- Timestamps are ISO-8601 UTC strings in API results.
- Optional source data remains `null` or omitted; it is never converted to zero.

## Core entities

```ts
type PreferenceLevel = "MUST_HAVE" | "PREFER" | "NO_PREFERENCE";

type PropertyFinancials = {
  annualPropertyTax: number | null;
  monthlyHoa: number | null;
  monthlyInsurance: number | null;
  monthlyMaintenance: number | null;
  dataCompleteness: "COMPLETE" | "PARTIAL" | "UNKNOWN";
};

type PreferenceRule = {
  id: string;
  field: string;
  operator: "LTE" | "GTE" | "EQ" | "IN";
  level: PreferenceLevel;
  numericValue?: number;
  textValues?: string[];
  weight?: number;
};

type BudgetRuleKey =
  | "maxPurchasePrice"
  | "maxMonthlyHousingCost"
  | "minBedrooms"
  | "minBathrooms"
  | "minSquareFeet"
  | "maxAnnualPropertyTax"
  | "maxMonthlyHoa";

type BudgetProfile = {
  version: 1;
  rules: Record<BudgetRuleKey, { level: PreferenceLevel; value: number | null }>;
};

type MatchResult = {
  eligible: boolean;
  score: number | null;
  evaluatedRuleCount: number;
  failedMustHaves: string[];
  strengths: string[];
  concerns: string[];
  unavailableInputs: string[];
};
```

## Ownership-cost result

```ts
type TrueMonthlyCostResult = {
  mortgagePrincipalAndInterest: number | null;
  propertyTax: number | null;
  insurance: number | null;
  hoa: number | null;
  maintenance: number | null;
  total: number | null;
  assumptions: string[];
  unavailableInputs: string[];
};
```

`total` is available only when the product explicitly has enough inputs to calculate it. The UI must show its assumptions and label estimated values.

## Repository interfaces

```ts
interface PropertyRepository {
  search(criteria: PropertySearchCriteria): Promise<Property[]>;
  getById(id: string): Promise<Property | null>;
}

interface UserDecisionRepository {
  getProfile(userId: string): Promise<PreferenceProfile | null>;
  saveProfile(userId: string, profile: PreferenceProfile): Promise<void>;
  listFavorites(userId: string): Promise<Favorite[]>;
}
```

The UI depends on these interfaces, not on Supabase or any listing provider. Concrete adapters live server-side.
