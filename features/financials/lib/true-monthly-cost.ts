import { calculateMortgagePayment, type MortgageAssumptions } from "./mortgage";

export type PropertyFinancials = {
  annualPropertyTax: number | null;
  monthlyInsurance: number | null;
  monthlyHoa: number | null;
  estimatedMonthlyMaintenance: number | null;
};

export type TrueMonthlyCostResult = {
  mortgagePrincipalAndInterest: number;
  propertyTax: number | null;
  insurance: number | null;
  hoa: number | null;
  maintenance: number | null;
  total: number | null;
  assumptions: string[];
  unavailableInputs: string[];
};

export function calculateTrueMonthlyCost(
  mortgage: MortgageAssumptions,
  financials: PropertyFinancials,
): TrueMonthlyCostResult {
  const propertyTax = financials.annualPropertyTax === null
    ? null
    : Math.max(0, financials.annualPropertyTax) / 12;
  const insurance = financials.monthlyInsurance === null
    ? null
    : Math.max(0, financials.monthlyInsurance);
  const hoa = financials.monthlyHoa === null ? null : Math.max(0, financials.monthlyHoa);
  const maintenance = financials.estimatedMonthlyMaintenance === null
    ? null
    : Math.max(0, financials.estimatedMonthlyMaintenance);
  const mortgagePrincipalAndInterest = calculateMortgagePayment(mortgage);
  const unavailableInputs = [
    propertyTax === null ? "Property tax" : null,
    insurance === null ? "Homeowners insurance" : null,
    hoa === null ? "HOA" : null,
    maintenance === null ? "Maintenance estimate" : null,
  ].filter((input): input is string => input !== null);

  return {
    mortgagePrincipalAndInterest,
    propertyTax,
    insurance,
    hoa,
    maintenance,
    total: unavailableInputs.length === 0
      ? mortgagePrincipalAndInterest + propertyTax! + insurance! + hoa! + maintenance!
      : null,
    assumptions: [
      `${mortgage.downPaymentPercent}% down payment`,
      `${mortgage.annualInterestRatePercent}% fixed interest rate`,
      `${mortgage.loanTermYears}-year loan term`,
      "Maintenance is an estimate.",
    ],
    unavailableInputs,
  };
}
