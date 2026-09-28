import { describe, expect, it } from "vitest";
import { createDefaultBudgetProfile } from "@/features/budget-rules/lib/preference-profile";
import { properties } from "@/features/properties/data/properties";
import { evaluateProperty, shouldShowForMatchFilter } from "./evaluate-property";

describe("evaluateProperty", () => {
  it("disqualifies a property that fails a Must Have rule", () => {
    const profile = createDefaultBudgetProfile();
    profile.rules.maxPurchasePrice = { level: "MUST_HAVE", value: 500_000 };

    const result = evaluateProperty(properties[0], profile);

    expect(result.eligible).toBe(false);
    expect(result.failedMustHaves).toHaveLength(1);
  });

  it("scores Prefer rules while ignoring No Preference rules", () => {
    const profile = createDefaultBudgetProfile();
    profile.rules.minBedrooms = { level: "PREFER", value: 3 };
    profile.rules.maxPurchasePrice = { level: "NO_PREFERENCE", value: 1 };

    const result = evaluateProperty(properties[0], profile);

    expect(result.eligible).toBe(true);
    expect(result.score).toBe(100);
    expect(result.evaluatedRuleCount).toBe(1);
  });

  it("explains bedroom and bathroom matches using the selected minimums", () => {
    const profile = createDefaultBudgetProfile();
    profile.rules.minBedrooms = { level: "PREFER", value: 3 };
    profile.rules.minBathrooms = { level: "PREFER", value: 2 };

    const result = evaluateProperty(properties[0], profile);

    expect(result.strengths).toContain("This home has 3 bedrooms, meeting your minimum of 3 bedrooms.");
    expect(result.strengths).toContain("This home has 2 bathrooms, meeting your minimum of 2 bathrooms.");
  });

  it("only includes eligible homes with a score of at least 70% in filtered search", () => {
    expect(shouldShowForMatchFilter({
      eligible: true,
      score: 70,
      evaluatedRuleCount: 1,
      failedMustHaves: [],
      strengths: [],
      concerns: [],
      unavailableInputs: [],
    })).toBe(true);

    expect(shouldShowForMatchFilter({
      eligible: true,
      score: 69,
      evaluatedRuleCount: 1,
      failedMustHaves: [],
      strengths: [],
      concerns: [],
      unavailableInputs: [],
    })).toBe(false);

    expect(shouldShowForMatchFilter({
      eligible: false,
      score: 100,
      evaluatedRuleCount: 1,
      failedMustHaves: ["Fails a Must Have rule."],
      strengths: [],
      concerns: [],
      unavailableInputs: [],
    })).toBe(false);
  });
});
