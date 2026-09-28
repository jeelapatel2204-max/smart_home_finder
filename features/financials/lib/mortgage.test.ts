import { describe, expect, it } from "vitest";
import {
  calculateLoanAmount,
  calculateMortgagePayment,
  calculateRemainingLoanBalance,
} from "./mortgage";

const standardMortgage = {
  purchasePrice: 400_000,
  downPaymentPercent: 20,
  annualInterestRatePercent: 6.5,
  loanTermYears: 30,
};

describe("mortgage calculations", () => {
  it("calculates a standard fixed-rate loan", () => {
    expect(calculateLoanAmount(standardMortgage)).toBe(320_000);
    expect(calculateMortgagePayment(standardMortgage)).toBeCloseTo(2_022.62, 2);
    expect(calculateRemainingLoanBalance(standardMortgage, 60)).toBeCloseTo(299_555.13, 2);
  });

  it("handles zero-interest and cash purchases", () => {
    expect(calculateMortgagePayment({ ...standardMortgage, annualInterestRatePercent: 0 })).toBeCloseTo(888.89, 2);
    expect(calculateMortgagePayment({ ...standardMortgage, downPaymentPercent: 100 })).toBe(0);
    expect(calculateRemainingLoanBalance({ ...standardMortgage, downPaymentPercent: 100 }, 60)).toBe(0);
  });
});
