"use client";

import { useState, type ChangeEvent } from "react";
import type { Property } from "@/features/properties/data/properties";
import {
  calculateInvestment,
  type InvestmentAssumptions,
} from "../lib/investment-calculations";
import { InvestmentInfoTip } from "./InvestmentInfoTip";
import { InvestmentMetricCard } from "./InvestmentMetricCard";
import { PropertyValueChart } from "./PropertyValueChart";
import { MarketValueTrendChart } from "@/features/market-trends/components/MarketValueTrendChart";
import type { MarketTrend } from "@/features/market-trends/lib/zillow-zhvi";

type InputField = {
  key: keyof InvestmentAssumptions;
  label: string;
  unit?: string;
  min: number;
  max: number;
  step: number;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return `${value < 0 ? "−" : ""}${currency.format(Math.abs(value))}`;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

function getDefaultAssumptions(property: Property): InvestmentAssumptions {
  return {
    purchasePrice: property.price,
    downPaymentPercent: property.defaultDownPaymentPercent,
    interestRate: property.defaultInterestRate,
    loanTermYears: 30,
    monthlyRent: property.estimatedMonthlyRent,
    vacancyRate: property.defaultVacancyRate,
    maintenanceRate: property.defaultMaintenanceRate,
    annualAppreciationRate: property.defaultAnnualAppreciationRate,
    holdingPeriodYears: 5,
  };
}

export function InvestmentAnalysis({
  property,
  marketTrend,
}: {
  property: Property;
  marketTrend: MarketTrend | null;
}) {
  const [assumptions, setAssumptions] = useState<InvestmentAssumptions>(
    () => getDefaultAssumptions(property),
  );

  const results = calculateInvestment(
    assumptions,
    (property.financials.annualPropertyTax ?? 0) / 12
      + (property.financials.monthlyInsurance ?? 0)
      + (property.financials.monthlyHoa ?? 0),
  );
  const negativeCashFlow = results.monthlyCashFlow < 0;
  const negativeTotalReturn = results.totalEstimatedReturn < 0;

  const fields: InputField[] = [
    { key: "purchasePrice", label: "Purchase Price", unit: "$", min: 1, max: 100000000, step: 1000 },
    { key: "downPaymentPercent", label: "Down Payment", unit: "%", min: 0, max: 100, step: 0.5 },
    { key: "interestRate", label: "Interest Rate", unit: "%", min: 0, max: 30, step: 0.05 },
    { key: "loanTermYears", label: "Loan Term", unit: "years", min: 1, max: 40, step: 1 },
    { key: "monthlyRent", label: "Expected Monthly Rent", unit: "$", min: 0, max: 1000000, step: 50 },
    { key: "vacancyRate", label: "Vacancy Rate", unit: "%", min: 0, max: 100, step: 0.5 },
    { key: "maintenanceRate", label: "Maintenance Rate", unit: "%", min: 0, max: 100, step: 0.5 },
    { key: "annualAppreciationRate", label: "Annual Appreciation", unit: "%", min: -20, max: 30, step: 0.1 },
    { key: "holdingPeriodYears", label: "Holding Period", unit: "years", min: 1, max: 10, step: 1 },
  ];

  function updateAssumption(field: InputField, event: ChangeEvent<HTMLInputElement>) {
    const rawValue = Number(event.currentTarget.value);
    const boundedValue = Math.min(field.max, Math.max(field.min, Number.isFinite(rawValue) ? rawValue : field.min));
    const value = field.key === "holdingPeriodYears" || field.key === "loanTermYears"
      ? Math.round(boundedValue)
      : boundedValue;
    setAssumptions((current) => ({ ...current, [field.key]: value }));
  }

  return (
    <section className="detail-panel investment-analysis" aria-labelledby="investment-analysis-title">
      <div className="investment-heading">
        <div>
          <p className="eyebrow investment-eyebrow"><span /> Sample scenario planner</p>
          <h2 id="investment-analysis-title">Investment Analysis</h2>
          <p className="investment-subtitle">
            Estimate rental performance and potential long-term returns using adjustable assumptions.
          </p>
        </div>
        <div className="investment-heading-actions">
          <span className="investment-sample-badge">MOCK / SAMPLE DATA</span>
          <button
            type="button"
            className="investment-reset-button"
            onClick={() => setAssumptions(getDefaultAssumptions(property))}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 5.5A5.5 5.5 0 1 1 2.7 9M3 2.5v3h3" />
            </svg>
            Reset assumptions
          </button>
        </div>
      </div>

      <div className="investment-inputs" aria-label="Investment assumptions">
        {fields.map((field) => (
          <label key={field.key} className="investment-input">
            <span>{field.label}</span>
            <span className="investment-input-control">
              {field.unit === "$" && <span aria-hidden="true">$</span>}
              <input
                type="number"
                min={field.min}
                max={field.max}
                step={field.step}
                value={assumptions[field.key]}
                onChange={(event) => updateAssumption(field, event)}
                aria-label={field.label}
              />
              {field.unit && field.unit !== "$" && <span aria-hidden="true">{field.unit}</span>}
            </span>
          </label>
        ))}
      </div>

      <div className="investment-metrics">
        <InvestmentMetricCard
          label="Monthly Cash Flow"
          value={formatCurrency(results.monthlyCashFlow)}
          detail="After estimated debt service"
          sentiment={results.monthlyCashFlow >= 0 ? "positive" : "negative"}
        />
        <InvestmentMetricCard
          label="Cap Rate"
          value={formatPercent(results.capRate)}
          detail="Annual NOI / purchase price"
          info="Annual net operating income divided by purchase price. NOI excludes mortgage payments."
        />
        <InvestmentMetricCard
          label="Cash-on-Cash Return"
          value={formatPercent(results.cashOnCashReturn)}
          detail="Annual cash flow / down payment"
          info="Annual cash flow after mortgage principal and interest, divided by the initial down payment."
          sentiment={results.cashOnCashReturn >= 0 ? "positive" : "negative"}
        />
        <InvestmentMetricCard
          label="Annual NOI"
          value={formatCurrency(results.annualNOI)}
          detail="Before financing costs"
          info="Annual rental income after vacancy, minus property taxes, insurance, HOA, and maintenance. Mortgage payments are excluded."
          sentiment={results.annualNOI >= 0 ? "positive" : "negative"}
        />
        <InvestmentMetricCard label="Projected Property Value" value={formatCurrency(results.projectedPropertyValue)} detail={`In ${assumptions.holdingPeriodYears} years`} />
        <InvestmentMetricCard
          label="Projected Equity"
          value={formatCurrency(results.projectedEquity)}
          detail="Value less remaining loan"
          info="Estimated property value at the end of the holding period minus the remaining mortgage balance."
        />
      </div>

      {(negativeCashFlow || negativeTotalReturn) && (
        <p className="investment-negative-note" role="status">
          {negativeCashFlow
            ? "Based on these assumptions, estimated expenses and financing costs exceed rental income."
            : "Based on these assumptions, projected equity and cumulative cash flow do not recover the initial down payment."}
        </p>
      )}

      <div className="investment-result-strip">
        <span>Estimated monthly rental income <strong>{formatCurrency(results.effectiveMonthlyRent)}</strong></span>
        <span>Monthly operating expenses <strong>{formatCurrency(results.monthlyOperatingExpenses)}</strong></span>
        <span>Net Operating Income (monthly) <strong>{formatCurrency(results.monthlyNOI)}</strong></span>
        <span>Monthly principal + interest <strong>{formatCurrency(results.monthlyMortgagePayment)}</strong></span>
        <span>Annual cash flow <strong>{formatCurrency(results.annualCashFlow)}</strong></span>
        <span>Loan amount <strong>{formatCurrency(results.loanAmount)}</strong></span>
      </div>

      <div className="investment-break-even">
        <span>Break-even monthly rent</span>
        <strong>
          {results.breakEvenMonthlyRent === null
            ? "Not achievable with these assumptions"
            : formatCurrency(results.breakEvenMonthlyRent)}
        </strong>
        <span>Approximate gross rent needed to cover operating expenses and principal + interest.</span>
      </div>

      {marketTrend && (
        <section className="investment-subsection market-trend-section" aria-labelledby="market-trend-title">
          <div className="investment-subsection-heading">
            <div>
              <h3 id="market-trend-title">Current Local Market Trend</h3>
              <p>{marketTrend.geography} · latest available month: {marketTrend.latestDate}</p>
            </div>
          </div>
          <MarketValueTrendChart trend={marketTrend} listingPrice={property.price} />
        </section>
      )}

      <div className="investment-visual-grid">
        <section className="investment-subsection" aria-labelledby="property-value-title">
          <div className="investment-subsection-heading">
            <div>
              <h3 id="property-value-title">Projected Property Value</h3>
              <p>Illustrative value paths from year 0 through year {assumptions.holdingPeriodYears}</p>
            </div>
          </div>
          <PropertyValueChart points={results.valueProjection} />
        </section>

        <section className="investment-subsection projection-summary" aria-labelledby="projection-summary-title">
          <div className="investment-subsection-heading">
            <div>
              <h3 id="projection-summary-title">{assumptions.holdingPeriodYears}-Year Projection</h3>
              <p>Estimated position at the end of the holding period</p>
            </div>
          </div>
          <dl>
            <div><dt>Current property value</dt><dd>{formatCurrency(assumptions.purchasePrice)}</dd></div>
            <div><dt>Projected property value</dt><dd>{formatCurrency(results.projectedPropertyValue)}</dd></div>
            <div><dt>Estimated appreciation gain</dt><dd>{formatCurrency(results.estimatedAppreciationGain)}</dd></div>
            <div><dt>Estimated cumulative cash flow</dt><dd>{formatCurrency(results.cumulativeCashFlow)}</dd></div>
            <div><dt>Estimated remaining mortgage</dt><dd>{formatCurrency(results.remainingMortgageBalance)}</dd></div>
            <div><dt>Estimated owner equity</dt><dd>{formatCurrency(results.projectedEquity)}</dd></div>
            <div className="projection-total">
              <dt>
                <span className="projection-label-with-info">
                  Total estimated return
                  <InvestmentInfoTip
                    label="Total Estimated Return"
                    text="Projected owner equity plus cumulative cash flow over the holding period, minus the initial down payment."
                  />
                </span>
              </dt>
              <dd>{formatCurrency(results.totalEstimatedReturn)}</dd>
            </div>
          </dl>
        </section>
      </div>

      <p className="investment-disclaimer">
        Investment estimates are for informational and educational purposes only. Projections are based on sample data and user-selected assumptions and do not guarantee future property values, rental income, or investment returns.
      </p>
      <p className="investment-data-note">
        Current rent, property expenses, and market assumptions are MOCK/SAMPLE data until real market-data integrations are added.
      </p>
    </section>
  );
}
