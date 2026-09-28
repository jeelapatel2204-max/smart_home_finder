export const preferenceLevels = ["MUST_HAVE", "PREFER", "NO_PREFERENCE"] as const;

export type PreferenceLevel = (typeof preferenceLevels)[number];

export const ruleDefinitions = {
  maxPurchasePrice: { label: "Maximum purchase price", unit: "$", minimum: 1 },
  maxMonthlyHousingCost: { label: "Maximum monthly cost", unit: "$", minimum: 1 },
  minBedrooms: { label: "Minimum bedrooms", minimum: 1 },
  minBathrooms: { label: "Minimum bathrooms", minimum: 1 },
  minSquareFeet: { label: "Minimum square feet", minimum: 1 },
  maxAnnualPropertyTax: { label: "Maximum annual property tax", unit: "$", minimum: 1 },
  maxMonthlyHoa: { label: "Maximum monthly HOA", unit: "$", minimum: 0 },
} as const;

export type BudgetRuleKey = keyof typeof ruleDefinitions;

export type BudgetRule = {
  level: PreferenceLevel;
  value: number | null;
};

export type BudgetProfile = {
  version: 1;
  rules: Record<BudgetRuleKey, BudgetRule>;
};

export function createDefaultBudgetProfile(): BudgetProfile {
  return {
    version: 1,
    rules: Object.fromEntries(
      Object.keys(ruleDefinitions).map((key) => [key, { level: "NO_PREFERENCE", value: null }]),
    ) as Record<BudgetRuleKey, BudgetRule>,
  };
}

export function validateBudgetProfile(profile: BudgetProfile) {
  return (Object.keys(ruleDefinitions) as BudgetRuleKey[]).flatMap((key) => {
    const rule = profile.rules[key];
    const definition = ruleDefinitions[key];

    if (rule.level === "NO_PREFERENCE") {
      return [];
    }

    if (rule.value === null || !Number.isFinite(rule.value) || rule.value < definition.minimum) {
      return [`Enter a value for ${definition.label.toLowerCase()}.`];
    }

    return [];
  });
}

export function isBudgetProfile(value: unknown): value is BudgetProfile {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<BudgetProfile>;
  if (candidate.version !== 1 || !candidate.rules || typeof candidate.rules !== "object") {
    return false;
  }

  return (Object.keys(ruleDefinitions) as BudgetRuleKey[]).every((key) => {
    const rule = candidate.rules?.[key];
    return Boolean(
      rule
      && preferenceLevels.includes(rule.level)
      && (rule.value === null || typeof rule.value === "number"),
    );
  });
}
