import type { BudgetProfile, BudgetRuleKey } from "@/features/budget-rules/lib/preference-profile";
import { calculateTrueMonthlyCost } from "@/features/financials/lib/true-monthly-cost";
import type { Property } from "@/features/properties/data/properties";

export type MatchResult = {
  eligible: boolean;
  score: number;
  evaluatedRuleCount: number;
  failedMustHaves: string[];
  strengths: string[];
  concerns: string[];
  unavailableInputs: string[];
};

export const minimumSearchMatchScore = 70;

export function shouldShowForMatchFilter(match: MatchResult) {
  return match.eligible && match.score >= minimumSearchMatchScore;
}

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

type PropertyValue = { value: number | null; unit: "currency" | "number" };

function getPropertyValue(property: Property, key: BudgetRuleKey): PropertyValue {
  const cost = calculateTrueMonthlyCost(
    {
      purchasePrice: property.price,
      downPaymentPercent: property.defaultDownPaymentPercent,
      annualInterestRatePercent: property.defaultInterestRate,
      loanTermYears: 30,
    },
    property.financials,
  );

  switch (key) {
    case "maxPurchasePrice": return { value: property.price, unit: "currency" };
    case "maxMonthlyHousingCost": return { value: cost.total, unit: "currency" };
    case "minBedrooms": return { value: property.beds, unit: "number" };
    case "minBathrooms": return { value: property.baths, unit: "number" };
    case "minSquareFeet": return { value: property.squareFeet, unit: "number" };
    case "maxAnnualPropertyTax": return { value: property.financials.annualPropertyTax, unit: "currency" };
    case "maxMonthlyHoa": return { value: property.financials.monthlyHoa, unit: "currency" };
  }
}

function describe(key: BudgetRuleKey, value: number, limit: number, unit: PropertyValue["unit"], passes: boolean) {
  const formattedValue = unit === "currency" ? currency.format(value) : value.toLocaleString();
  const formattedLimit = unit === "currency" ? currency.format(limit) : limit.toLocaleString();

  if (key === "minBedrooms") {
    return passes
      ? `This home has ${formattedValue} bedrooms, meeting your minimum of ${formattedLimit} bedrooms.`
      : `This home has ${formattedValue} bedrooms, below your minimum of ${formattedLimit} bedrooms.`;
  }

  if (key === "minBathrooms") {
    return passes
      ? `This home has ${formattedValue} bathrooms, meeting your minimum of ${formattedLimit} bathrooms.`
      : `This home has ${formattedValue} bathrooms, below your minimum of ${formattedLimit} bathrooms.`;
  }

  const isMinimum = key.startsWith("min");

  if (passes) {
    return isMinimum
      ? `${formattedValue} meets your minimum of ${formattedLimit}.`
      : `${formattedValue} is within your limit of ${formattedLimit}.`;
  }

  return isMinimum
    ? `${formattedValue} is below your minimum of ${formattedLimit}.`
    : `${formattedValue} exceeds your limit of ${formattedLimit}.`;
}

export function evaluateProperty(property: Property, profile: BudgetProfile): MatchResult {
  const failedMustHaves: string[] = [];
  const strengths: string[] = [];
  const concerns: string[] = [];
  const unavailableInputs: string[] = [];
  let preferredRules = 0;
  let preferredRulesPassed = 0;
  let evaluatedRuleCount = 0;

  (Object.keys(profile.rules) as BudgetRuleKey[]).forEach((key) => {
    const rule = profile.rules[key];
    if (rule.level === "NO_PREFERENCE" || rule.value === null) {
      return;
    }

    const propertyValue = getPropertyValue(property, key);
    if (propertyValue.value === null) {
      const message = `${key === "maxMonthlyHousingCost" ? "True monthly cost" : key} is unavailable.`;
      unavailableInputs.push(message);
      if (rule.level === "MUST_HAVE") {
        failedMustHaves.push(message);
      } else {
        concerns.push(message);
      }
      return;
    }

    evaluatedRuleCount += 1;
    const passes = key.startsWith("min")
      ? propertyValue.value >= rule.value
      : propertyValue.value <= rule.value;
    const explanation = describe(key, propertyValue.value, rule.value, propertyValue.unit, passes);

    if (rule.level === "MUST_HAVE") {
      if (passes) strengths.push(explanation);
      else failedMustHaves.push(explanation);
      return;
    }

    preferredRules += 1;
    if (passes) {
      preferredRulesPassed += 1;
      strengths.push(explanation);
    } else {
      concerns.push(explanation);
    }
  });

  if (evaluatedRuleCount === 0) {
    strengths.push("Add your budget rules to personalize this result.");
  }

  return {
    eligible: failedMustHaves.length === 0,
    score: preferredRules === 0 ? 100 : Math.round((preferredRulesPassed / preferredRules) * 100),
    evaluatedRuleCount,
    failedMustHaves,
    strengths,
    concerns,
    unavailableInputs,
  };
}
