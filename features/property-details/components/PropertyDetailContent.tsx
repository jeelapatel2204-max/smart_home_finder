"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  calculateTrueMonthlyCost,
} from "@/features/financials/lib/true-monthly-cost";
import { InvestmentAnalysis } from "@/features/investment-analysis/components/InvestmentAnalysis";
import { loadBudgetProfile, saveBudgetProfile } from "@/features/budget-rules/lib/browser-profile";
import { createDefaultBudgetProfile, type BudgetProfile } from "@/features/budget-rules/lib/preference-profile";
import { BudgetRulesPanel } from "@/features/budget-rules/components/BudgetRulesPanel";
import { evaluateProperty } from "@/features/property-matching/lib/evaluate-property";
import { NearbyPlaces } from "@/features/nearby-places/components/NearbyPlaces";
import type { MarketTrend } from "@/features/market-trends/lib/zillow-zhvi";
import type { Property } from "@/features/properties/data/properties";
import { calculateNeighborhoodScore } from "@/features/neighborhoods/lib/score";
import { NeighborhoodContext } from "@/features/neighborhoods/components/NeighborhoodContext";
import { DailyLife } from "@/features/daily-life/components/DailyLife";
import { getAssignedAgent } from "@/features/agents/lib/assigned-agent";
import type { NeighborhoodContext as NeighborhoodContextData } from "@/features/neighborhoods/lib/context";
import { calculateMortgagePayment } from "@/features/financials/lib/mortgage";
import { SmartHomeAdvisor } from "@/features/home-advisor/components/SmartHomeAdvisor";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatCost(value: number | null) {
  return value === null ? "Not available" : formatPrice(value);
}

function getMaximumOffer(
  monthlyLimit: number | null,
  property: Property,
  assumptions: { downPaymentPercent: number; annualInterestRatePercent: number; loanTermYears: number },
) {
  if (!monthlyLimit) return null;
  const fixedCosts = (property.financials.annualPropertyTax ?? 0) / 12
    + (property.financials.monthlyInsurance ?? 0)
    + (property.financials.monthlyHoa ?? 0)
    + (property.financials.estimatedMonthlyMaintenance ?? 0);
  const paymentLimit = Math.max(0, monthlyLimit - fixedCosts);
  let low = 0;
  let high = property.price * 2;
  for (let iteration = 0; iteration < 40; iteration += 1) {
    const middle = (low + high) / 2;
    const payment = calculateMortgagePayment({ purchasePrice: middle, ...assumptions });
    if (payment <= paymentLimit) low = middle;
    else high = middle;
  }
  return Math.round(low / 1000) * 1000;
}

function NeighborhoodDetailRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="detail-score-row">
      <div className="detail-score-header">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="detail-score-track" aria-hidden="true">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function PropertyDetailContent({
  property,
  marketTrend,
  neighborhoodContext,
}: {
  property: Property;
  marketTrend: MarketTrend | null;
  neighborhoodContext: NeighborhoodContextData | null;
}) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared">("idle");
  const [showCostAdjustments, setShowCostAdjustments] = useState(false);
  const [showPropertyFilters, setShowPropertyFilters] = useState(false);
  const [showTourForm, setShowTourForm] = useState(false);
  const [tourRequested, setTourRequested] = useState(false);
  const [renterInsurance, setRenterInsurance] = useState(18);
  const [petFees, setPetFees] = useState(0);
  const [rentalCareReserve, setRentalCareReserve] = useState(0);
  const [futurePlan, setFuturePlan] = useState<"stay" | "family" | "flexibility">("stay");
  const [rateStressPoints, setRateStressPoints] = useState(1);
  const [hoaStressPercent, setHoaStressPercent] = useState(15);
  const [reserveMonths, setReserveMonths] = useState(6);
  const [liveMarketTrend, setLiveMarketTrend] = useState(marketTrend);
  const [liveNeighborhoodContext, setLiveNeighborhoodContext] = useState(neighborhoodContext);
  const [budgetProfile, setBudgetProfile] = useState<BudgetProfile>(createDefaultBudgetProfile);
  const [mortgageAssumptions, setMortgageAssumptions] = useState({
    downPaymentPercent: property.defaultDownPaymentPercent,
    annualInterestRatePercent: property.defaultInterestRate,
    loanTermYears: 30,
  });
  const trueMonthlyCost = calculateTrueMonthlyCost(
    { purchasePrice: property.price, ...mortgageAssumptions },
    property.financials,
  );
  const match = evaluateProperty(property, budgetProfile);
  const isRental = property.listingIntent === "rent";
  const rentalBasePrice = property.monthlyRentPrice ?? property.price;
  const rentalAllInCost = rentalBasePrice + renterInsurance + petFees + rentalCareReserve;
  const assignedAgent = getAssignedAgent(property);
  const propertyBudgetStorageKey = `smart-home-finder:property-${property.id}:budget-profile:v1`;
  const neighborhoodScore = calculateNeighborhoodScore(property.neighborhood);
  const monthlyLimitRule = budgetProfile.rules.maxMonthlyHousingCost;
  const monthlyLimit = monthlyLimitRule.level === "NO_PREFERENCE" ? null : monthlyLimitRule.value;
  const monthlyHeadroom = trueMonthlyCost.total !== null && monthlyLimit !== null
    ? monthlyLimit - trueMonthlyCost.total
    : null;
  const estimatedCashToClose = property.price * ((mortgageAssumptions.downPaymentPercent + 3) / 100);
  const recommendedReserve = (trueMonthlyCost.total ?? 0) * reserveMonths;
  const rateStressCost = calculateTrueMonthlyCost(
    { ...mortgageAssumptions, purchasePrice: property.price, annualInterestRatePercent: mortgageAssumptions.annualInterestRatePercent + rateStressPoints },
    property.financials,
  ).total;
  const hoaStressCost = calculateTrueMonthlyCost(
    { purchasePrice: property.price, ...mortgageAssumptions },
    { ...property.financials, monthlyHoa: property.financials.monthlyHoa === null ? null : property.financials.monthlyHoa * (1 + hoaStressPercent / 100) },
  ).total;
  const maxOffer = getMaximumOffer(monthlyLimit, property, mortgageAssumptions);
  const verdict = match.evaluatedRuleCount === 0
    ? { label: "Set your fit", tone: "neutral", detail: "Add your priorities to see a decision built around you." }
    : !match.eligible
      ? { label: "Stretch", tone: "caution", detail: "It misses one or more of your non-negotiables." }
      : monthlyHeadroom !== null && monthlyHeadroom < 0
        ? { label: "Stretch", tone: "caution", detail: "It meets your preferences but exceeds your monthly ceiling." }
        : { label: "Strong fit", tone: "good", detail: "It meets your non-negotiables and fits your stated priorities." };
  const futureFit = futurePlan === "family"
    ? `${property.beds >= 3 ? "The bedroom count supports" : "The bedroom count may constrain"} a growing household; verify school boundaries and usable storage.`
    : futurePlan === "flexibility"
      ? `${property.squareFeet >= 1800 ? "The layout has room" : "The footprint is tighter"} for a dedicated work or flex space; confirm the room layout in person.`
      : `A ${property.squareFeet.toLocaleString()} sq ft ${property.propertyType.toLowerCase()} can suit a multi-year stay; validate condition and planned maintenance before committing.`;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setBudgetProfile(loadBudgetProfile(propertyBudgetStorageKey)), 0);
    return () => window.clearTimeout(timeoutId);
  }, [propertyBudgetStorageKey]);

  useEffect(() => {
    const storageKey = "smart-home-finder:saved-properties:v1";
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as unknown;
      const timeoutId = window.setTimeout(() => {
        if (Array.isArray(saved)) setIsFavorite(saved.includes(property.id));
      }, 0);
      return () => window.clearTimeout(timeoutId);
    } catch {
      // Saving still works for the current session if storage is unavailable.
    }
    return undefined;
  }, [property.id]);

  useEffect(() => {
    if (liveMarketTrend && liveNeighborhoodContext) return undefined;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      fetch(`/api/property-context?id=${property.id}`, { signal: controller.signal })
        .then((response) => response.ok ? response.json() : null)
        .then((context: { marketTrend: MarketTrend | null; neighborhoodContext: NeighborhoodContextData | null } | null) => {
          if (!context) return;
          setLiveMarketTrend(context.marketTrend);
          setLiveNeighborhoodContext(context.neighborhoodContext);
        })
        .catch(() => undefined);
    }, 800);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [liveMarketTrend, liveNeighborhoodContext, property.id]);

  const monthlyCostRows: { label: string; value: number | null }[] = [
    { label: "Mortgage principal + interest", value: trueMonthlyCost.mortgagePrincipalAndInterest },
    { label: "Property taxes", value: trueMonthlyCost.propertyTax },
    { label: "Homeowners insurance", value: trueMonthlyCost.insurance },
    { label: "HOA", value: trueMonthlyCost.hoa },
    { label: "Estimated maintenance", value: trueMonthlyCost.maintenance },
    { label: "True monthly cost", value: trueMonthlyCost.total },
  ];

  function updateMortgageAssumption(
    field: keyof typeof mortgageAssumptions,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const value = Number(event.currentTarget.value);
    if (!Number.isFinite(value)) {
      return;
    }

    setMortgageAssumptions((current) => ({
      ...current,
      [field]: field === "loanTermYears"
        ? Math.min(40, Math.max(1, Math.round(value)))
        : field === "downPaymentPercent"
          ? Math.min(100, Math.max(0, value))
          : Math.min(30, Math.max(0, value)),
    }));
  }

  function adjustMonthlyLimit(change: number) {
    const currentLimit = monthlyLimit ?? Math.ceil((trueMonthlyCost.total ?? property.price / 360) / 250) * 250;
    const nextLimit = Math.max(250, currentLimit + change);
    setBudgetProfile((current) => {
      const nextProfile = {
        ...current,
        rules: {
          ...current.rules,
          maxMonthlyHousingCost: {
            value: nextLimit,
            level: current.rules.maxMonthlyHousingCost.level === "NO_PREFERENCE" ? "PREFER" as const : current.rules.maxMonthlyHousingCost.level,
          },
        },
      };
      saveBudgetProfile(nextProfile, propertyBudgetStorageKey);
      return nextProfile;
    });
  }

  function resetDossierScenarios() {
    const defaultProfile = createDefaultBudgetProfile();
    setBudgetProfile(defaultProfile);
    saveBudgetProfile(defaultProfile, propertyBudgetStorageKey);
    setFuturePlan("stay");
    setRateStressPoints(1);
    setHoaStressPercent(15);
    setReserveMonths(6);
  }

  function toggleSavedProperty() {
    setIsFavorite((currentlySaved) => {
      const nextSaved = !currentlySaved;
      try {
        const storageKey = "smart-home-finder:saved-properties:v1";
        const existing = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as unknown;
        const savedIds = Array.isArray(existing) ? existing.filter((id): id is number => typeof id === "number") : [];
        window.localStorage.setItem(storageKey, JSON.stringify(nextSaved ? [...new Set([...savedIds, property.id])] : savedIds.filter((id) => id !== property.id)));
      } catch {
        // The in-session saved state remains available.
      }
      return nextSaved;
    });
  }

  async function shareProperty() {
    const url = window.location.href;
    const shareData = { title: property.address, text: `Take a look at ${property.address} on Smart Home Finder.`, url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("shared");
      } else {
        await navigator.clipboard.writeText(url);
        setShareStatus("copied");
      }
    } catch {
      // Closing a native share sheet is not an error the user needs to see.
    }
  }

  function submitTourRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const details = `Tour request for ${property.address}\nPreferred date: ${form.get("tour-date")}\nPreferred time: ${form.get("tour-time")}\nName: ${form.get("name")}\nEmail: ${form.get("email")}\n\nQuestion: ${form.get("message") || "None"}`;
    window.location.href = `mailto:${assignedAgent.email}?subject=${encodeURIComponent(`Tour request: ${property.address}`)}&body=${encodeURIComponent(details)}`;
    setTourRequested(true);
  }

  return (
    <main className="property-detail-page">
      <header className="site-header detail-header">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="Smart Home Finder home">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 36 36">
                <path d="m5 16 13-11 13 11v14H5V16Z" />
                <path d="M14 30V19h8v11M3 16 18 3l15 13" />
              </svg>
            </span>
            <span>Smart Home Finder</span>
          </Link>
          <button type="button" className="sign-in-button" onClick={() => router.push("/")}>
            Back to listings
          </button>
        </div>
      </header>

      <div className="property-detail-shell">
        <button type="button" className="detail-back-button" onClick={() => router.push("/")}>
          ← Back to listings
        </button>

        <div className="property-detail-hero">
          <div
            className="property-detail-photo"
            role="img"
            aria-label={property.imageAlt}
            style={{ backgroundImage: `url("${property.image}")` }}
          >
            <span className="photo-label">{property.label}</span>
            <button
              className={`favorite-button${isFavorite ? " is-favorite" : ""}`}
              type="button"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={isFavorite}
              onClick={toggleSavedProperty}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.8 8.8c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10a4.8 4.8 0 0 1 8.8-2.6 4.8 4.8 0 0 1 8.8 2.6Z" />
              </svg>
            </button>
          </div>

          <div className="property-detail-summary">
            <p className="property-detail-price">{isRental ? `${formatPrice(property.monthlyRentPrice ?? property.price)}/mo` : formatPrice(property.price)}</p>
            <p className="property-detail-address">{property.address}</p>
            <p className="property-detail-location">
              {property.city}, {property.zip}
            </p>

            <div className="property-detail-meta" aria-label="Property details">
              <span><strong>{property.beds}</strong> Bedrooms</span>
              <span><strong>{property.baths}</strong> Bathrooms</span>
              <span><strong>{property.squareFeet.toLocaleString()}</strong> sq ft</span>
              <span><strong>{property.propertyType}</strong></span>
            </div>

            <div className="property-detail-about">
              <h2>About This Home</h2>
              <p>{property.description}</p>
            </div>
            <div className="property-detail-actions">
              <button type="button" className="property-save-button" onClick={toggleSavedProperty}>{isFavorite ? "Saved" : "Save home"}</button>
              <button type="button" className="property-share-button" onClick={() => void shareProperty()}>{shareStatus === "copied" ? "Link copied" : shareStatus === "shared" ? "Shared" : "Share"}</button>
            </div>
          </div>
        </div>

        <div className="detail-content-grid">
          {isRental ? (
            <section className="decision-dossier rental-dossier" aria-labelledby="rental-dossier-title">
              <div className="dossier-heading">
                <div>
                  <p className="dossier-eyebrow">Rental snapshot</p>
                  <h2 id="rental-dossier-title">A clearer view of this rental</h2>
                </div>
              </div>
              <div className="dossier-grid">
                <div><span>Monthly rent</span><strong>{formatPrice(property.monthlyRentPrice ?? property.price)}</strong><small>Base rent shown before utilities and renter’s insurance.</small></div>
                <div><span>Home type</span><strong>{property.propertyType}</strong><small>{property.beds} beds · {property.baths} baths · {property.squareFeet.toLocaleString()} sq ft</small></div>
                <div><span>Next step</span><strong>Tour it</strong><small>Choose a time and send a question to the listing agent.</small><button className="rental-tour-button" type="button" onClick={() => { setTourRequested(false); setShowTourForm(true); }}>Request a tour</button></div>
              </div>
              <div className="rental-affordability-box">
                <div>
                  <p className="dossier-eyebrow">Rental affordability</p>
                  <h3>Estimate your all-in monthly cost</h3>
                </div>
                <strong className="rental-all-in-cost">{formatPrice(rentalAllInCost)}<small>/mo</small></strong>
                <div className="rental-cost-controls">
                  <div><span>Renter’s insurance</span><div><button type="button" aria-label="Lower renter's insurance" onClick={() => setRenterInsurance((value) => Math.max(0, value - 5))}>−</button><strong>{formatPrice(renterInsurance)}</strong><button type="button" aria-label="Raise renter's insurance" onClick={() => setRenterInsurance((value) => value + 5)}>+</button></div></div>
                  <div><span>Monthly pet fees</span><div><button type="button" aria-label="Lower pet fees" onClick={() => setPetFees((value) => Math.max(0, value - 25))}>−</button><strong>{formatPrice(petFees)}</strong><button type="button" aria-label="Raise pet fees" onClick={() => setPetFees((value) => value + 25)}>+</button></div></div>
                  <div><span>Home-care reserve</span><div><button type="button" aria-label="Lower home-care reserve" onClick={() => setRentalCareReserve((value) => Math.max(0, value - 25))}>−</button><strong>{formatPrice(rentalCareReserve)}</strong><button type="button" aria-label="Raise home-care reserve" onClick={() => setRentalCareReserve((value) => value + 25)}>+</button></div></div>
                </div>
                <p>Adjust these planning estimates for your situation. Utilities, deposits, and one-time move-in costs are not included.</p>
              </div>
            </section>
          ) : (
          <section className="decision-dossier" aria-labelledby="decision-dossier-title">
            <div className="dossier-heading">
              <div>
                <p className="dossier-eyebrow">Your decision dossier</p>
                <h2 id="decision-dossier-title">Can you live well with this home?</h2>
              </div>
              <button className="dossier-reset-button" type="button" onClick={resetDossierScenarios}>Reset dossier</button>
            </div>
            <p className="dossier-intro">{verdict.detail}</p>
            <div className="dossier-grid">
              <div>
                <span>All-in monthly cost</span>
                <strong>{formatCost(trueMonthlyCost.total)}</strong>
                <small>{monthlyHeadroom === null ? "Set a monthly limit to see your breathing room." : monthlyHeadroom >= 0 ? `${formatPrice(monthlyHeadroom)} below your limit` : `${formatPrice(Math.abs(monthlyHeadroom))} above your limit`}</small>
              </div>
              <div>
                <span>Cash to close</span>
                <strong>{formatPrice(estimatedCashToClose)}</strong>
                <small>Down payment plus a 3% closing-cost estimate</small>
              </div>
              <div>
                <span>Six-month reserve</span>
                <strong>{formatPrice(recommendedReserve)}</strong>
                <small>A suggested cushion based on this home’s all-in cost</small>
              </div>
            </div>
            <div className="dossier-controls" aria-label="Personalize this decision">
              <div className="dossier-control">
                <span>Your monthly comfort limit</span>
                <div><button type="button" aria-label="Lower monthly comfort limit by 250 dollars" onClick={() => adjustMonthlyLimit(-250)}>−</button><strong>{monthlyLimit === null ? "Set a limit" : `${formatPrice(monthlyLimit)}/mo`}</strong><button type="button" aria-label="Raise monthly comfort limit by 250 dollars" onClick={() => adjustMonthlyLimit(250)}>+</button><span className={`dossier-inline-verdict is-${verdict.tone}`}>{verdict.label}</span></div>
              </div>
              <div className="dossier-control">
                <span>Reserve target</span>
                <div className="dossier-choice-buttons">{[3, 6, 9].map((months) => <button className={reserveMonths === months ? "is-selected" : ""} type="button" key={months} onClick={() => setReserveMonths(months)}>{months} mo</button>)}</div>
              </div>
            </div>
            <div className="dossier-action-grid">
              <div className="dossier-action-card dossier-stress-card">
                <p className="dossier-eyebrow">Home stress test</p>
                <h3>See the pressure points</h3>
                <div className="stress-list">
                  <div><span>Rate rises {rateStressPoints.toFixed(1)} points</span><strong>{formatCost(rateStressCost)}</strong><small>{rateStressCost !== null && trueMonthlyCost.total !== null ? `+${formatPrice(rateStressCost - trueMonthlyCost.total)}/mo` : "Estimate unavailable"}</small><div className="stress-adjuster"><button type="button" aria-label="Lower rate shock" onClick={() => setRateStressPoints((current) => Math.max(0, Number((current - 0.5).toFixed(1))))}>−</button><button type="button" aria-label="Increase rate shock" onClick={() => setRateStressPoints((current) => Math.min(5, Number((current + 0.5).toFixed(1))))}>+</button></div></div>
                  <div><span>HOA rises {hoaStressPercent}%</span><strong>{formatCost(hoaStressCost)}</strong><small>{hoaStressCost !== null && trueMonthlyCost.total !== null ? `+${formatPrice(hoaStressCost - trueMonthlyCost.total)}/mo` : "No HOA cost recorded"}</small><div className="stress-adjuster"><button type="button" aria-label="Lower HOA increase" onClick={() => setHoaStressPercent((current) => Math.max(0, current - 5))}>−</button><button type="button" aria-label="Increase HOA increase" onClick={() => setHoaStressPercent((current) => Math.min(50, current + 5))}>+</button></div></div>
                </div>
                <p>Planning scenarios only; each one changes a single input.</p>
              </div>
              <div className="dossier-action-card dossier-future-card">
                <p className="dossier-eyebrow">FutureFit</p>
                <h3>Will it keep fitting?</h3>
                <div className="future-fit-controls" aria-label="Choose a future plan">
                  <button className={futurePlan === "stay" ? "is-selected" : ""} type="button" onClick={() => setFuturePlan("stay")}>Longer stay</button>
                  <button className={futurePlan === "family" ? "is-selected" : ""} type="button" onClick={() => setFuturePlan("family")}>Growing family</button>
                  <button className={futurePlan === "flexibility" ? "is-selected" : ""} type="button" onClick={() => setFuturePlan("flexibility")}>Work flexibility</button>
                </div>
                <p>{futureFit}</p>
              </div>
              <div className="dossier-action-card">
                <p className="dossier-eyebrow">Offer guardrail</p>
                <h3>Keep the offer grounded</h3>
                {maxOffer === null ? <p>Set a maximum monthly cost in your profile and we’ll calculate an offer ceiling using your current assumptions and this home’s known carrying costs.</p> : <><div className="offer-amount"><span>Your payment-based ceiling</span><strong>{formatPrice(maxOffer)}</strong></div><p>{maxOffer >= property.price ? `That is ${formatPrice(maxOffer - property.price)} above the list price.` : `That is ${formatPrice(property.price - maxOffer)} below the list price.`} Treat this as a personal guardrail, then validate comparable sales and the inspection result.</p></>}
              </div>
              <div className="dossier-action-card">
                <p className="dossier-eyebrow">Before you offer</p>
                <h3>What could change your mind?</h3>
                <ul>
                  <li>Request age and service records for major systems and renovations.</li>
                  <li>Confirm taxes, insurance, disclosures, permits, and HOA documents.</li>
                  <li>Visit at your normal commute time; check noise, parking, and drainage.</li>
                </ul>
              </div>
            </div>
          </section>
          )}

          <SmartHomeAdvisor
            property={property}
            isRental={isRental}
            monthlyCost={isRental ? rentalAllInCost : trueMonthlyCost.total}
            monthlyLimit={monthlyLimit}
            neighborhoodScore={neighborhoodScore.score}
          />

          {!isRental && <section className="detail-panel match-detail-panel horizontal-match-panel">
            <div className="match-detail-heading">
              <div>
                <h2>Why This Home Matches You</h2>
                <p>
                  {match.evaluatedRuleCount === 0
                    ? "Use filters to see how this home fits your needs."
                    : match.eligible
                      ? "Meets your Must Have rules."
                      : "A near match that misses one or more Must Have rules."}
                </p>
              </div>
              <div className="match-detail-actions">
                <button className="detail-filters-button" type="button" onClick={() => setShowPropertyFilters(true)}>Filters</button>
                {match.evaluatedRuleCount > 0 && (
                  <strong className={match.eligible ? "" : "is-ineligible"}>{match.score}%</strong>
                )}
              </div>
            </div>
            <div className="match-detail-groups">
              {match.failedMustHaves.length > 0 && (
                <div className="match-detail-group is-failure">
                  <h3>Must Have gaps</h3>
                  <ul>{match.failedMustHaves.map((reason) => <li key={reason}>{reason}</li>)}</ul>
                </div>
              )}
              {match.evaluatedRuleCount > 0 && (
                <div className="match-detail-group">
                  <h3>Strong matches</h3>
                  <ul>{match.strengths.slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}</ul>
                </div>
              )}
              {match.concerns.length > 0 && (
                <div className="match-detail-group">
                  <h3>Tradeoffs</h3>
                  <ul>{match.concerns.slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}</ul>
                </div>
              )}
            </div>
          </section>}

          {!isRental && <section className="detail-panel tour-summary-panel">
            <p className="dossier-eyebrow">See it in person</p>
            <h2>Tour this home</h2>
            <div className="tour-summary-agent"><span>{assignedAgent.initials}</span><div><strong>{assignedAgent.name}</strong><small>{assignedAgent.title}</small></div></div>
            <p>Choose a date and time, then send a question directly to the assigned property advisor.</p>
            <small className="tour-response-note">Agent replies can take up to 2–3 business days.</small>
            <button type="button" className="tour-summary-button" onClick={() => { setTourRequested(false); setShowTourForm(true); }}>Request a tour</button>
          </section>}

          <section className="detail-panel neighborhood-detail-panel">
            <h2>Neighborhood</h2>
            <div className="detail-score-summary">
              <span>Overall Neighborhood Score</span>
              <div className="detail-score-value">
                <strong>{neighborhoodScore.score}</strong>
                <span>/100</span>
              </div>
            </div>
            <div className="detail-score-list">
              <NeighborhoodDetailRow label="Schools" value={property.neighborhood.schools} />
              <NeighborhoodDetailRow label="Safety" value={property.neighborhood.safety} />
              <NeighborhoodDetailRow label="Amenities" value={property.neighborhood.amenities} />
              <NeighborhoodDetailRow label="Accessibility" value={property.neighborhood.accessibility} />
              <NeighborhoodDetailRow label="Housing Value" value={property.neighborhood.housingValue} />
            </div>
            <p className="detail-score-note">
              Each category counts for 20% of this score. Strongest factors: {neighborhoodScore.strongestFactors.join(" and ")}. Areas to explore: {neighborhoodScore.lowerFactors.join(" and ")}.
            </p>
            <NeighborhoodContext context={liveNeighborhoodContext} />
          </section>

          <DailyLife property={property} neighborhoodContext={liveNeighborhoodContext} />

          {!isRental && <section className="detail-panel monthly-cost-panel">
            <h2>True Monthly Cost</h2>
            <p className="detail-estimate-note">
              An estimate based on the assumptions below and sample property data.
            </p>
            <div className="monthly-cost-list">
              {monthlyCostRows.map((row) => (
                <div key={row.label} className="monthly-cost-row">
                  <span>{row.label}</span>
                  <strong>{formatCost(row.value)}</strong>
                </div>
              ))}
            </div>
            <button
              className="monthly-cost-adjust-button"
              type="button"
              aria-expanded={showCostAdjustments}
              aria-controls="monthly-cost-assumptions"
              onClick={() => setShowCostAdjustments((current) => !current)}
            >
              <span>Adjust your assumptions</span>
              <span aria-hidden="true">{showCostAdjustments ? "−" : "+"}</span>
            </button>
            {showCostAdjustments && (
              <div id="monthly-cost-assumptions" className="monthly-cost-assumptions" aria-label="Monthly cost assumptions">
                <label>
                  <span>Down payment</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={mortgageAssumptions.downPaymentPercent}
                    onChange={(event) => updateMortgageAssumption("downPaymentPercent", event)}
                  />
                  <em>%</em>
                </label>
                <label>
                  <span>Interest rate</span>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.05"
                    value={mortgageAssumptions.annualInterestRatePercent}
                    onChange={(event) => updateMortgageAssumption("annualInterestRatePercent", event)}
                  />
                  <em>%</em>
                </label>
                <label>
                  <span>Loan term</span>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    step="1"
                    value={mortgageAssumptions.loanTermYears}
                    onChange={(event) => updateMortgageAssumption("loanTermYears", event)}
                  />
                  <em>years</em>
                </label>
                <button
                  className="monthly-cost-reset-button"
                  type="button"
                  onClick={() => setMortgageAssumptions({
                    downPaymentPercent: property.defaultDownPaymentPercent,
                    annualInterestRatePercent: property.defaultInterestRate,
                    loanTermYears: 30,
                  })}
                >
                  Reset assumptions
                </button>
              </div>
            )}
            <ul className="monthly-cost-notes">
              {trueMonthlyCost.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}
              {trueMonthlyCost.unavailableInputs.map((input) => (
                <li key={input}>{input} is not available, so no total is shown.</li>
              ))}
            </ul>
          </section>}

          <NearbyPlaces property={property} />
        </div>
        {!isRental && <InvestmentAnalysis property={property} marketTrend={liveMarketTrend} />}

        {showPropertyFilters && (
          <div
            className="modal-backdrop filters-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setShowPropertyFilters(false);
            }}
            role="presentation"
          >
            <div className="filters-modal" role="dialog" aria-modal="true" aria-labelledby="property-filters-title">
              <button
                type="button"
                className="modal-close-button"
                aria-label="Close property filters"
                onClick={() => setShowPropertyFilters(false)}
              >
                ×
              </button>
              <div className="property-filter-modal-heading">
                <p>Filters for this home only</p>
                <h2 id="property-filters-title">See how this home fits you</h2>
              </div>
              <BudgetRulesPanel
                storageKey={propertyBudgetStorageKey}
                savedStatusLabel="Saved for this home only"
                onProfileChange={setBudgetProfile}
                onSearch={(profile) => {
                  setBudgetProfile(profile);
                  setShowPropertyFilters(false);
                }}
              />
            </div>
          </div>
        )}

        {showTourForm && (
          <div
            className="modal-backdrop filters-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setShowTourForm(false);
            }}
            role="presentation"
          >
            <div className="tour-modal" role="dialog" aria-modal="true" aria-labelledby="tour-request-title">
              <button type="button" className="modal-close-button" aria-label="Close tour request" onClick={() => setShowTourForm(false)}>×</button>
              {tourRequested ? (
                <div className="tour-confirmation">
                  <p className="dossier-eyebrow">Request sent</p>
                  <h2 id="tour-request-title">We’ll connect you with an agent.</h2>
                  <p>Your email app has opened with the tour request addressed to {assignedAgent.name}. Send it to contact your assigned agent.</p>
                  <button type="button" className="tour-submit-button" onClick={() => setShowTourForm(false)}>Done</button>
                </div>
              ) : (
                <form className="tour-form" onSubmit={submitTourRequest}>
                  <p className="dossier-eyebrow">Request a tour</p>
                  <h2 id="tour-request-title">See {property.address} in person</h2>
                  <p>Tell the property advisor when you would like to visit. There is no commitment to move forward.</p>
                  <p className="tour-response-note">Agent replies can take up to 2–3 business days.</p>
                  <div className="assigned-agent-card"><span>{assignedAgent.initials}</span><div><strong>{assignedAgent.name}</strong><small>{assignedAgent.title} · {assignedAgent.phone}</small></div></div>
                  <div className="tour-form-grid">
                    <label>Preferred date<input name="tour-date" type="date" required min={new Date().toISOString().slice(0, 10)} /></label>
                    <label>Preferred time<select name="tour-time" required defaultValue=""><option value="" disabled>Select a time</option><option>Morning (9–11 AM)</option><option>Midday (11 AM–2 PM)</option><option>Afternoon (2–5 PM)</option><option>Evening (5–7 PM)</option></select></label>
                    <label>Your name<input name="name" type="text" autoComplete="name" required placeholder="Name" /></label>
                    <label>Email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
                  </div>
                  <label className="tour-message-label">Question for the agent<textarea name="message" placeholder="Ask about lease terms, pets, parking, or anything else." /></label>
                  <button className="tour-submit-button" type="submit">Send tour request</button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
