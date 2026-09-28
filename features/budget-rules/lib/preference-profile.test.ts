import { describe, expect, it } from "vitest";
import {
  createDefaultBudgetProfile,
  isBudgetProfile,
  validateBudgetProfile,
} from "./preference-profile";

describe("budget profile", () => {
  it("starts with rules that do not affect a buyer's results", () => {
    expect(validateBudgetProfile(createDefaultBudgetProfile())).toEqual([]);
  });

  it("requires a valid value for Must Have and Prefer rules", () => {
    const profile = createDefaultBudgetProfile();
    profile.rules.maxPurchasePrice.level = "MUST_HAVE";

    expect(validateBudgetProfile(profile)).toEqual(["Enter a value for maximum purchase price."]);

    profile.rules.maxPurchasePrice.value = 500_000;
    expect(validateBudgetProfile(profile)).toEqual([]);
  });

  it("validates the persisted profile shape", () => {
    expect(isBudgetProfile(createDefaultBudgetProfile())).toBe(true);
    expect(isBudgetProfile({ version: 1, rules: {} })).toBe(false);
  });
});
