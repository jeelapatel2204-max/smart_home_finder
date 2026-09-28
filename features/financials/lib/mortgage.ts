export type MortgageAssumptions = {
  purchasePrice: number;
  downPaymentPercent: number;
  annualInterestRatePercent: number;
  loanTermYears: number;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));
}

function getNormalizedAssumptions(assumptions: MortgageAssumptions) {
  const purchasePrice = Math.max(1, assumptions.purchasePrice);
  const downPaymentPercent = clamp(assumptions.downPaymentPercent, 0, 100);
  const annualInterestRatePercent = clamp(assumptions.annualInterestRatePercent, 0, 30);
  const loanTermYears = clamp(assumptions.loanTermYears, 1, 40);

  return { purchasePrice, downPaymentPercent, annualInterestRatePercent, loanTermYears };
}

export function calculateLoanAmount(assumptions: MortgageAssumptions) {
  const { purchasePrice, downPaymentPercent } = getNormalizedAssumptions(assumptions);
  return purchasePrice * (1 - downPaymentPercent / 100);
}

export function calculateMortgagePayment(assumptions: MortgageAssumptions) {
  const { annualInterestRatePercent, loanTermYears } = getNormalizedAssumptions(assumptions);
  const loanAmount = calculateLoanAmount(assumptions);
  const monthlyInterestRate = annualInterestRatePercent / 100 / 12;
  const loanTermMonths = loanTermYears * 12;

  if (loanAmount === 0) {
    return 0;
  }

  if (monthlyInterestRate === 0) {
    return loanAmount / loanTermMonths;
  }

  return loanAmount * monthlyInterestRate / (1 - (1 + monthlyInterestRate) ** -loanTermMonths);
}

export function calculateRemainingLoanBalance(
  assumptions: MortgageAssumptions,
  elapsedMonths: number,
) {
  const { annualInterestRatePercent, loanTermYears } = getNormalizedAssumptions(assumptions);
  const loanAmount = calculateLoanAmount(assumptions);
  const monthlyInterestRate = annualInterestRatePercent / 100 / 12;
  const loanTermMonths = loanTermYears * 12;
  const paidMonths = Math.min(loanTermMonths, Math.max(0, Math.round(elapsedMonths)));
  const monthlyPayment = calculateMortgagePayment(assumptions);

  if (loanAmount === 0) {
    return 0;
  }

  if (monthlyInterestRate === 0) {
    return Math.max(0, loanAmount - monthlyPayment * paidMonths);
  }

  return Math.max(
    0,
    loanAmount * (1 + monthlyInterestRate) ** paidMonths
      - monthlyPayment * (((1 + monthlyInterestRate) ** paidMonths - 1) / monthlyInterestRate),
  );
}
