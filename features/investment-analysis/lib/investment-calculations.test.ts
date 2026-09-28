import { describe, expect, it } from "vitest";
import {
  calculateInvestment,
  type InvestmentAssumptions,
} from "./investment-calculations";

function assumptions(overrides: Partial<InvestmentAssumptions> = {}): InvestmentAssumptions {
  return {
    purchasePrice: 100_000,
    downPaymentPercent: 20,
    interestRate: 6,
    loanTermYears: 30,
    monthlyRent: 1_500,
    vacancyRate: 5,
    maintenanceRate: 6,
    annualAppreciationRate: 3,
    holdingPeriodYears: 5,
    ...overrides,
  };
}

describe("calculateInvestment", () => {
  it("calculates mortgage, operating income, and returns for a standard fixed-rate loan", () => {
    const result = calculateInvestment(assumptions(), 500);

    expect(result.downPayment).toBe(20_000);
    expect(result.loanAmount).toBe(80_000);
    expect(result.monthlyMortgagePayment).toBeCloseTo(479.64, 2);
    expect(result.effectiveMonthlyRent).toBe(1_425);
    expect(result.monthlyOperatingExpenses).toBe(590);
    expect(result.monthlyNOI).toBe(835);
    expect(result.monthlyCashFlow).toBeCloseTo(355.36, 2);
    expect(result.capRate).toBeCloseTo(0.1002, 4);
    expect(result.valueProjection).toHaveLength(6);
  });

  it("handles a zero-interest loan without a divide-by-zero result", () => {
    const result = calculateInvestment(
      assumptions({
        purchasePrice: 120_000,
        downPaymentPercent: 25,
        interestRate: 0,
        monthlyRent: 1_000,
        vacancyRate: 0,
        maintenanceRate: 0,
      }),
      450,
    );

    expect(result.loanAmount).toBe(90_000);
    expect(result.monthlyMortgagePayment).toBe(250);
    expect(result.monthlyNOI).toBe(550);
    expect(result.monthlyCashFlow).toBe(300);
  });

  it("handles a cash purchase and reports no remaining mortgage", () => {
    const result = calculateInvestment(
      assumptions({
        purchasePrice: 300_000,
        downPaymentPercent: 100,
        interestRate: 0,
      }),
      500,
    );

    expect(result.loanAmount).toBe(0);
    expect(result.monthlyMortgagePayment).toBe(0);
    expect(result.remainingMortgageBalance).toBe(0);
    expect(result.projectedEquity).toBeCloseTo(result.projectedPropertyValue, 6);
  });

  it("marks break-even rent unavailable when no rent can contribute to expenses", () => {
    const result = calculateInvestment(
      assumptions({ vacancyRate: 60, maintenanceRate: 40 }),
      500,
    );

    expect(result.breakEvenMonthlyRent).toBeNull();
  });
});
