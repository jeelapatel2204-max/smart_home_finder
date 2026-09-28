import { describe, expect, it } from "vitest";
import { calculateTrueMonthlyCost } from "./true-monthly-cost";

const mortgage = {
  purchasePrice: 300_000,
  downPaymentPercent: 20,
  annualInterestRatePercent: 6,
  loanTermYears: 30,
};

describe("calculateTrueMonthlyCost", () => {
  it("includes mortgage, tax, insurance, HOA, and maintenance", () => {
    const result = calculateTrueMonthlyCost(mortgage, {
      annualPropertyTax: 6_000,
      monthlyInsurance: 150,
      monthlyHoa: 75,
      estimatedMonthlyMaintenance: 250,
    });

    expect(result.mortgagePrincipalAndInterest).toBeCloseTo(1_438.92, 2);
    expect(result.propertyTax).toBe(500);
    expect(result.total).toBeCloseTo(2_413.92, 2);
    expect(result.unavailableInputs).toEqual([]);
  });

  it("does not create a misleading total when a required input is unavailable", () => {
    const result = calculateTrueMonthlyCost(mortgage, {
      annualPropertyTax: null,
      monthlyInsurance: 150,
      monthlyHoa: 0,
      estimatedMonthlyMaintenance: 250,
    });

    expect(result.propertyTax).toBeNull();
    expect(result.total).toBeNull();
    expect(result.unavailableInputs).toEqual(["Property tax"]);
  });
});
