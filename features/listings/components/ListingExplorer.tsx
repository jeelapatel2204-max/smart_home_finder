"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { BudgetRulesPanel } from "@/features/budget-rules/components/BudgetRulesPanel";
import { ComparisonPanel } from "@/features/comparison/components/ComparisonPanel";
import { comparisonLimit, toggleComparisonSelection } from "@/features/comparison/lib/selection";
import { createDefaultBudgetProfile, type BudgetProfile } from "@/features/budget-rules/lib/preference-profile";
import { calculateTrueMonthlyCost } from "@/features/financials/lib/true-monthly-cost";
import { properties, type Property } from "@/features/properties/data/properties";
import {
  evaluateProperty,
  shouldShowForMatchFilter,
  type MatchResult,
} from "@/features/property-matching/lib/evaluate-property";
import { usStateNames, type LocationSuggestion } from "@/features/location-search/lib/us-states";
import { AccountMenu } from "@/features/accounts/components/AccountMenu";
import { SavedSearchPanel } from "@/features/accounts/components/SavedSearchPanel";
import { loadAccountData, saveAccountProfile, setAccountFavorite } from "@/features/accounts/lib/account-data";
import { getSupabaseBrowserClient } from "@/features/accounts/lib/supabase-browser";

const PropertyMap = dynamic(
  () => import("@/features/properties/components/PropertyMap").then((module) => module.PropertyMap),
  { ssr: false },
);

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function NeighborhoodScoreProgress({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="score-detail-row">
      <div className="score-detail-label-row">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="score-progress-track" aria-hidden="true">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function NeighborhoodScoreModal({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        className="neighborhood-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="neighborhood-score-title"
      >
        <button
          type="button"
          className="modal-close-button"
          aria-label="Close neighborhood score dialog"
          onClick={onClose}
        >
          ×
        </button>

        <div className="modal-header">
          <p className="eyebrow modal-eyebrow"><span /> Neighborhood Score</p>
          <h3 id="neighborhood-score-title">{property.city}</h3>
        </div>

        <div className="modal-score-summary">
          <span className="modal-score-label">Overall Neighborhood Score</span>
          <div className="modal-score-value">
            <strong>{property.score}</strong>
            <span>/100</span>
          </div>
        </div>

        <div className="modal-score-breakdown">
          <NeighborhoodScoreProgress label="Schools" value={property.neighborhood.schools} />
          <NeighborhoodScoreProgress label="Safety" value={property.neighborhood.safety} />
          <NeighborhoodScoreProgress label="Amenities" value={property.neighborhood.amenities} />
          <NeighborhoodScoreProgress label="Accessibility" value={property.neighborhood.accessibility} />
          <NeighborhoodScoreProgress label="Housing Value" value={property.neighborhood.housingValue} />
        </div>

        <div className="modal-note">
          <h4>About this score</h4>
          <p>
            This version uses sample neighborhood data to preview how scores could be
            presented. In the future, these scores will be calculated from real
            neighborhood data.
          </p>
        </div>
      </div>
    </div>
  );
}

function PropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
  onViewNeighborhoodScore,
  onViewProperty,
  match,
  isCompared,
  canCompare,
  onToggleCompare,
}: {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onViewNeighborhoodScore: (property: Property) => void;
  onViewProperty: (id: number) => void;
  match: MatchResult;
  isCompared: boolean;
  canCompare: boolean;
  onToggleCompare: (id: number) => void;
}) {
  const trueMonthlyCost = calculateTrueMonthlyCost(
    {
      purchasePrice: property.price,
      downPaymentPercent: property.defaultDownPaymentPercent,
      annualInterestRatePercent: property.defaultInterestRate,
      loanTermYears: 30,
    },
    property.financials,
  );

  return (
    <article
      className="property-card property-card-link"
      role="button"
      tabIndex={0}
      onClick={() => onViewProperty(property.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onViewProperty(property.id);
        }
      }}
    >
      <div
        className="property-photo"
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
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(property.id);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.8 8.8c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10a4.8 4.8 0 0 1 8.8-2.6 4.8 4.8 0 0 1 8.8 2.6Z" />
          </svg>
        </button>
      </div>
      <div className="property-details">
        <p className="property-price">{formatPrice(property.price)}</p>
        <p className="property-address">{property.address}</p>
        <p className="property-location">
          {property.city}, {property.state} {property.zip}
        </p>
        <div className="property-facts" aria-label="Property details">
          <span><strong>{property.beds}</strong> beds</span>
          <span><strong>{property.baths}</strong> baths</span>
          <span><strong>{property.squareFeet.toLocaleString()}</strong> sqft</span>
        </div>
        <div className="property-monthly-cost">
          <span>Estimated monthly cost</span>
          <strong>
            {trueMonthlyCost.total === null
              ? "Unavailable"
              : `${formatPrice(trueMonthlyCost.total)}/mo`}
          </strong>
        </div>
        {match.evaluatedRuleCount > 0 && (
          <div className={`property-match${match.eligible ? "" : " is-ineligible"}`}>
            <span>{match.eligible ? "Home match" : "Near match"}</span>
            <strong>{match.score}%</strong>
          </div>
        )}
        <button
          className="compare-property-button"
          type="button"
          disabled={!isCompared && !canCompare}
          onClick={(event) => { event.stopPropagation(); onToggleCompare(property.id); }}
        >
          {isCompared ? "Remove from compare" : "Compare home"}
        </button>
        <span className="property-investment-label">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 12.5h12M3.5 10V7.5M8 10V3.5M12.5 10V5" />
          </svg>
          Investment Analysis
        </span>
        <button
          className="score-row score-row-button"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onViewNeighborhoodScore(property);
          }}
          aria-label={`Open neighborhood score details for ${property.city}`}
        >
          <span className="score-caption">Neighborhood Score</span>
          <span className="score-value">
            <strong>{property.score}</strong><span>/100</span>
          </span>
        </button>
        <div className="score-track" aria-hidden="true">
          <span style={{ width: `${property.score}%` }} />
        </div>
      </div>
    </article>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M7 12h10m-7 5h4" />
      <circle cx="8" cy="7" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="11" cy="17" r="1.5" />
    </svg>
  );
}

const listingZipSuggestions = Array.from(new Map(
  properties.flatMap((property) => [
    [`zip-${property.zip}`, { label: property.zip, value: property.zip, kind: "ZIP code" }],
  ]),
).values()).sort((first, second) => first.label.localeCompare(second.label));

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function ListingExplorer() {
  const router = useRouter();
  const [locationInput, setLocationInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [appliedLocation, setAppliedLocation] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeNeighborhoodProperty, setActiveNeighborhoodProperty] = useState<Property | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [budgetProfile, setBudgetProfile] = useState<BudgetProfile>(createDefaultBudgetProfile);
  const [comparisonIds, setComparisonIds] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [matchFilterApplied, setMatchFilterApplied] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [accountUserId, setAccountUserId] = useState<string | null>(null);
  const [accountDataLoaded, setAccountDataLoaded] = useState(false);
  const [profileOverride, setProfileOverride] = useState<BudgetProfile | null>(null);

  useEffect(() => {
    if (!activeNeighborhoodProperty) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveNeighborhoodProperty(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeNeighborhoodProperty]);

  useEffect(() => {
    if (!showFilters) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowFilters(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showFilters]);

  useEffect(() => {
    const query = locationInput.trim();
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      if (query.length < 2) {
        setLocationSuggestions([]);
        return;
      }

      fetch(`/api/location-suggestions?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((response) => response.ok ? response.json() : { suggestions: [] })
        .then((data: { suggestions: LocationSuggestion[] }) => setLocationSuggestions(data.suggestions))
        .catch((error: unknown) => {
          if (!(error instanceof DOMException && error.name === "AbortError")) setLocationSuggestions([]);
        });
    }, query.length < 2 ? 0 : 180);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [locationInput]);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return undefined;
    const authenticatedClient = client;

    async function syncAccount(userId: string | null | undefined) {
      setAccountUserId(userId ?? null);
      setAccountDataLoaded(false);
      if (!userId) return;

      const { favorites: savedFavorites, profile } = await loadAccountData(authenticatedClient, userId);
      setFavorites(savedFavorites);
      setProfileOverride(profile);
      setAccountDataLoaded(true);
    }

    client.auth.getUser().then(({ data }) => void syncAccount(data.user?.id));
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => void syncAccount(session?.user?.id));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!accountUserId || !accountDataLoaded) return undefined;

    const timeoutId = window.setTimeout(() => {
      const supabase = getSupabaseBrowserClient();
      if (supabase) void saveAccountProfile(supabase, accountUserId, budgetProfile);
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [accountDataLoaded, accountUserId, budgetProfile]);

  const matches = Object.fromEntries(properties.map((property) => [property.id, evaluateProperty(property, budgetProfile)])) as Record<number, MatchResult>;

  const filteredProperties = properties.filter((property) => {
    const query = normalizeSearchText(appliedLocation);
    const matchesLocation =
      !query ||
      normalizeSearchText(`${property.address} ${property.city} ${property.state} ${usStateNames[property.state]} ${property.zip}`)
        .includes(query);
    const matchesPrice =
      appliedMaxPrice === null || property.price <= appliedMaxPrice;
    const matchesFavorites =
      !showFavoritesOnly || favorites.includes(property.id);
    const matchesBudget =
      !matchFilterApplied || shouldShowForMatchFilter(matches[property.id]);

    return matchesLocation && matchesPrice && matchesFavorites && matchesBudget;
  });

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedLocation(locationInput.trim());
    setShowLocationSuggestions(false);
    const price = Number(maxPriceInput);
    setAppliedMaxPrice(maxPriceInput && price > 0 ? price : null);
    setShowFavoritesOnly(false);
  }

  function toggleFavorite(id: number) {
    setFavorites((current) => {
      const isFavorite = !current.includes(id);
      if (accountUserId) {
        const supabase = getSupabaseBrowserClient();
        if (supabase) void setAccountFavorite(supabase, accountUserId, id, isFavorite);
      }
      return isFavorite ? [...current, id] : current.filter((favoriteId) => favoriteId !== id);
    });
  }

  function showAllHomes() {
    setShowFavoritesOnly(false);
  }

  function handleViewNeighborhoodScore(property: Property) {
    setActiveNeighborhoodProperty(property);
  }

  function handleViewProperty(propertyId: number) {
    router.push(`/property/${propertyId}`);
  }

  const comparedProperties = properties.filter((property) => comparisonIds.includes(property.id));

  function renderListings() {
    return filteredProperties.length > 0 ? (
      <div className="property-grid">
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            match={matches[property.id]}
            isCompared={comparisonIds.includes(property.id)}
            canCompare={comparisonIds.length < comparisonLimit}
            onToggleCompare={(id) => setComparisonIds((current) => toggleComparisonSelection(current, id))}
            isFavorite={favorites.includes(property.id)}
            onToggleFavorite={toggleFavorite}
            onViewNeighborhoodScore={handleViewNeighborhoodScore}
            onViewProperty={handleViewProperty}
          />
        ))}
      </div>
    ) : (
      <div className="empty-state">
        <span className="empty-icon"><SearchIcon /></span>
          <h3>{showFavoritesOnly ? "No saved homes yet" : matchFilterApplied ? "No homes meet these filters" : "No homes found"}</h3>
          <p>
            {showFavoritesOnly
              ? "Tap the heart on a home to keep it here."
              : matchFilterApplied
                ? "Try adjusting your rules, or reset filters to see every home."
                : "Try another city, state, or ZIP code, or raise your maximum price."}
          </p>
        {showFavoritesOnly && (
          <button type="button" className="text-button" onClick={showAllHomes}>
            Browse all homes
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="Smart Home Finder home">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 36 36">
                <path d="m5 16 13-11 13 11v14H5V16Z" />
                <path d="M14 30V19h8v11M3 16 18 3l15 13" />
              </svg>
            </span>
            <span>Smart Home Finder</span>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            <a className="nav-link active" href="#homes" onClick={showAllHomes}>Buy</a>
            <a className="nav-link" href="#homes" onClick={showAllHomes}>Rent</a>
            <a className="nav-link" href="#neighborhood-score">Neighborhoods</a>
            <a
              className={`nav-link favorites-link${showFavoritesOnly ? " active" : ""}`}
              href="#homes"
              onClick={() => setShowFavoritesOnly(true)}
            >
              Favorites{favorites.length > 0 && <span>{favorites.length}</span>}
            </a>
          </nav>
          <AccountMenu />
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow"><span /> A more thoughtful way home</p>
              <h1>Find a home in a neighborhood you&apos;ll love.</h1>
              <p className="hero-description">
                Find the right place to call home, with the neighborhood details
                that help you feel good about where you land.
              </p>
            </div>
            <form className="search-form" onSubmit={handleSearch}>
              <label className="search-field location-field">
                <span>City, state, or ZIP code</span>
                <span className="input-with-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <input
                    type="search"
                    placeholder="Try “Portland”, “OR”, or “97211”"
                    value={locationInput}
                    role="combobox"
                    aria-autocomplete="list"
                    aria-controls="location-suggestions"
                    aria-expanded={showLocationSuggestions && locationInput.trim().length > 0}
                    onChange={(event) => {
                      setLocationInput(event.target.value);
                      setShowLocationSuggestions(true);
                    }}
                    onFocus={() => setShowLocationSuggestions(true)}
                    onBlur={() => window.setTimeout(() => setShowLocationSuggestions(false), 100)}
                  />
                </span>
                {showLocationSuggestions && locationInput.trim() && (
                  <div id="location-suggestions" className="location-suggestions" role="listbox" aria-label="Location suggestions">
                    {[...locationSuggestions, ...listingZipSuggestions.filter((suggestion) => suggestion.value.includes(locationInput.trim()))]
                      .slice(0, 6)
                      .map((suggestion) => (
                        <button
                          key={`${suggestion.kind}-${suggestion.value}`}
                          type="button"
                          role="option"
                          aria-selected={locationInput === suggestion.value}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            setLocationInput(suggestion.value);
                            setShowLocationSuggestions(false);
                          }}
                        >
                          <span>{suggestion.label}</span>
                          <small>{suggestion.kind}</small>
                        </button>
                      ))}
                  </div>
                )}
              </label>
              <label className="search-field price-field">
                <span>Maximum price</span>
                <span className="price-input-wrap">
                  <span aria-hidden="true">$</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Any price"
                    value={maxPriceInput}
                    onChange={(event) => setMaxPriceInput(event.target.value)}
                  />
                </span>
              </label>
              <button className="search-button" type="submit">
                <SearchIcon />
                <span>Search homes</span>
              </button>
              <button
                className="search-button filters-button"
                type="button"
                aria-haspopup="dialog"
                onClick={() => setShowFilters(true)}
              >
                <FilterIcon />
                <span>Filters</span>
              </button>
            </form>
            <div className="hero-footnote">
              <span className="footnote-dot" />
              <span>Thoughtful home search starts with the whole picture.</span>
            </div>
          </div>
        </section>

        <section className="listings-section" id="homes">
          <div className="section-heading">
            <div>
              <p className="eyebrow section-eyebrow">A good place to begin</p>
              <h2>{showFavoritesOnly ? "Your saved homes" : "Homes worth a closer look"}</h2>
              <p className="section-description">
                {showFavoritesOnly
                  ? "The homes you have saved for later."
                  : "Thoughtfully picked homes, with the neighborhood context to match."}
              </p>
            </div>
            <div className="listing-controls">
              <div className="listing-view-toggle" aria-label="Listing view options">
                <button
                  type="button"
                  className={viewMode === "list" ? "active" : ""}
                  onClick={() => setViewMode("list")}
                >
                  List View
                </button>
                <button
                  type="button"
                  className={viewMode === "map" ? "active" : ""}
                  onClick={() => setViewMode("map")}
                >
                  Map View
                </button>
              </div>
              <div className="listing-count" aria-live="polite">
                <span>{filteredProperties.length.toString().padStart(2, "0")}</span>
                {showFavoritesOnly ? " saved homes" : " homes"}
              </div>
            </div>
          </div>

          {viewMode === "map" ? (
            <div className="listings-map-layout">
              <div className="listings-map-column listings-map-list">{renderListings()}</div>
              <div className="listings-map-column listings-map-panel">
                <PropertyMap properties={filteredProperties} onViewProperty={handleViewProperty} />
              </div>
            </div>
          ) : (
            renderListings()
          )}
          {matchFilterApplied && !showFavoritesOnly && (
            <button type="button" className="text-button" onClick={() => setMatchFilterApplied(false)}>
              Show all homes
            </button>
          )}
        </section>

        <section className="neighborhood-section" id="neighborhood-score">
          <div className="neighborhood-inner">
            <div className="neighborhood-copy">
              <p className="eyebrow light-eyebrow">More than an address</p>
              <h2>What is a Neighborhood Score?</h2>
              <p>
                A home is only part of the picture. The Neighborhood Score brings
                useful local information together, making it easier to compare
                the places around each home.
              </p>
              <div className="score-topics">
                <span>Schools</span>
                <span>Safety</span>
                <span>Amenities</span>
                <span>Accessibility</span>
                <span>Home value</span>
              </div>
              <p className="mock-data-note">Scores shown are sample data for this preview.</p>
            </div>
            <div className="neighborhood-graphic" aria-hidden="true">
              <div className="graphic-label">A clearer picture of the place</div>
              <div className="graphic-score">
                <span className="graphic-score-label">NEIGHBORHOOD SCORE</span>
                <strong>92</strong>
                <span className="graphic-score-outof">out of 100</span>
              </div>
              <div className="graphic-rule"><span /></div>
              <div className="graphic-bottom">
                <span>Local context</span>
                <span>All in one place <span aria-hidden="true">↗</span></span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {activeNeighborhoodProperty && (
        <NeighborhoodScoreModal
          property={activeNeighborhoodProperty}
          onClose={() => setActiveNeighborhoodProperty(null)}
        />
      )}

      {showFilters && (
        <div
          className="modal-backdrop filters-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowFilters(false);
            }
          }}
          role="presentation"
        >
          <div
            className="filters-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="budget-rules-title"
          >
            <button
              type="button"
              className="modal-close-button"
              aria-label="Close filters"
              onClick={() => setShowFilters(false)}
            >
              ×
            </button>
          <BudgetRulesPanel
            onProfileChange={setBudgetProfile}
            profileOverride={profileOverride}
            onSearch={(profile) => {
              setBudgetProfile(profile);
              setMatchFilterApplied(true);
              setShowFavoritesOnly(false);
              setShowFilters(false);
            }}
            onReset={() => setMatchFilterApplied(false)}
          />
          <ComparisonPanel
            properties={comparedProperties}
            matches={matches}
            onRemove={(id) => setComparisonIds((current) => toggleComparisonSelection(current, id))}
          />
          <SavedSearchPanel
            userId={accountUserId}
            criteria={{ location: appliedLocation, maxPrice: appliedMaxPrice, budgetProfile }}
            onApply={(criteria) => {
              setLocationInput(criteria.location);
              setAppliedLocation(criteria.location);
              setMaxPriceInput(criteria.maxPrice?.toString() ?? "");
              setAppliedMaxPrice(criteria.maxPrice);
              setBudgetProfile(criteria.budgetProfile);
              setProfileOverride(criteria.budgetProfile);
              setMatchFilterApplied(true);
              setShowFavoritesOnly(false);
              setShowFilters(false);
            }}
          />
          </div>
        </div>
      )}

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 36 36">
              <path d="m5 16 13-11 13 11v14H5V16Z" />
              <path d="M14 30V19h8v11M3 16 18 3l15 13" />
            </svg>
          </span>
          <span>Smart Home Finder</span>
        </a>
        <span>Find your place. Feel good about the neighborhood.</span>
        <span>© 2026 Smart Home Finder</span>
      </footer>
    </>
  );
}
