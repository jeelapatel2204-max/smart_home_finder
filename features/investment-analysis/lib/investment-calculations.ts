import {
  calculateLoanAmount,
  calculateMortgagePayment,
  calculateRemainingLoanBalance,
} from "@/features/financials/lib/mortgage";

export type InvestmentAssumptions = {
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  monthlyRent: number;
  vacancyRate: number;
  maintenanceRate: number;
  annualAppreciationRate: number;
  holdingPeriodYears: number;
};

export type ValueProjectionPoint = {
  year: number;
  conservative: number;
  expected: number;
  optimistic: number;
};

export type InvestmentResults = {
  downPayment: number;
  loanAmount: number;
  monthlyMortgagePayment: number;
  effectiveMonthlyRent: number;
  monthlyOperatingExpenses: number;
  monthlyNOI: number;
  annualNOI: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  breakEvenMonthlyRent: number | null;
  capRate: number;
  cashOnCashReturn: number;
  projectedPropertyValue: number;
  remainingMortgageBalance: number;
  projectedEquity: number;
  estimatedAppreciationGain: number;
  cumulativeCashFlow: number;
  totalEstimatedReturn: number;
  valueProjection: ValueProjectionPoint[];
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));
}

export function calculateInvestment(
  assumptions: InvestmentAssumptions,
  fixedMonthlyExpenses: number,
): InvestmentResults {
  const purchasePrice = Math.max(1, assumptions.purchasePrice);
  const downPaymentPercent = clamp(assumptions.downPaymentPercent, 0, 100);
  const interestRate = clamp(assumptions.interestRate, 0, 30);
  const loanTermYears = clamp(assumptions.loanTermYears, 1, 40);
  const monthlyRent = Math.max(0, assumptions.monthlyRent);
  const vacancyRate = clamp(assumptions.vacancyRate, 0, 100);
  const maintenanceRate = clamp(assumptions.maintenanceRate, 0, 100);
  const annualAppreciationRate = clamp(assumptions.annualAppreciationRate, -20, 30);
  const holdingPeriodYears = Math.round(clamp(assumptions.holdingPeriodYears, 1, 10));
  const mortgage = {
    purchasePrice,
    downPaymentPercent,
    annualInterestRatePercent: interestRate,
    loanTermYears,
  };
  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const loanAmount = calculateLoanAmount(mortgage);
  const monthlyMortgagePayment = calculateMortgagePayment(mortgage);

  // Vacancy reduces collected rent; maintenance is estimated on gross scheduled rent.
  const effectiveMonthlyRent = monthlyRent * (1 - vacancyRate / 100);
  const monthlyOperatingExpenses = Math.max(0, fixedMonthlyExpenses) + monthlyRent * maintenanceRate / 100;

  // NOI excludes all loan payments; debt service is subtracted only when calculating cash flow.
  const monthlyNOI = effectiveMonthlyRent - monthlyOperatingExpenses;
  const annualNOI = monthlyNOI * 12;
  const monthlyCashFlow = monthlyNOI - monthlyMortgagePayment;
  const annualCashFlow = monthlyCashFlow * 12;
  const rentContributionRate = 1 - vacancyRate / 100 - maintenanceRate / 100;
  const breakEvenMonthlyRent = rentContributionRate > 0
    ? (Math.max(0, fixedMonthlyExpenses) + monthlyMortgagePayment) / rentContributionRate
    : null;
  const capRate = annualNOI / purchasePrice;
  const cashOnCashReturn = downPayment > 0 ? annualCashFlow / downPayment : 0;
  const totalHoldingMonths = holdingPeriodYears * 12;
  const projectedPropertyValue = purchasePrice * (1 + annualAppreciationRate / 100) ** holdingPeriodYears;

  // Remaining balance is the amortized loan balance after the selected number of monthly payments.
  const remainingMortgageBalance = calculateRemainingLoanBalance(mortgage, totalHoldingMonths);
  const projectedEquity = projectedPropertyValue - remainingMortgageBalance;
  const estimatedAppreciationGain = projectedPropertyValue - purchasePrice;
  const cumulativeCashFlow = annualCashFlow * holdingPeriodYears;
  // Total return is ending equity plus cumulative cash flow, less the initial down payment.
  const totalEstimatedReturn = projectedEquity + cumulativeCashFlow - downPayment;

  // Scenario rates are expected appreciation +/- 2 points, bounded to avoid extreme V1 forecasts.
  const conservativeRate = clamp(annualAppreciationRate - 2, -5, 25);
  const optimisticRate = clamp(annualAppreciationRate + 2, -5, 25);
  const valueProjection = Array.from({ length: holdingPeriodYears + 1 }, (_, year) => ({
    year,
    conservative: purchasePrice * (1 + conservativeRate / 100) ** year,
    expected: purchasePrice * (1 + annualAppreciationRate / 100) ** year,
    optimistic: purchasePrice * (1 + optimisticRate / 100) ** year,
  }));

  return {
    downPayment,
    loanAmount,
    monthlyMortgagePayment,
    effectiveMonthlyRent,
    monthlyOperatingExpenses,
    monthlyNOI,
    annualNOI,
    monthlyCashFlow,
    annualCashFlow,
    breakEvenMonthlyRent,
    capRate,
    cashOnCashReturn,
    projectedPropertyValue,
    remainingMortgageBalance,
    projectedEquity,
    estimatedAppreciationGain,
    cumulativeCashFlow,
    totalEstimatedReturn,
    valueProjection,
  };
}
