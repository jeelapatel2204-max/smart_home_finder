"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Property } from "../../data/properties";
import { InvestmentAnalysis } from "../../components/investment/InvestmentAnalysis";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
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

export function PropertyDetailContent({ property }: { property: Property }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const monthlyCostRows = [
    { label: "Mortgage payment", value: property.monthlyCost.mortgage },
    { label: "Property taxes", value: property.monthlyCost.propertyTaxes },
    { label: "Home insurance", value: property.monthlyCost.insurance },
    { label: "HOA", value: property.monthlyCost.hoa },
    { label: "Total estimated monthly payment", value: property.monthlyCost.total },
  ];

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
              onClick={() => setIsFavorite((current) => !current)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.8 8.8c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10a4.8 4.8 0 0 1 8.8-2.6 4.8 4.8 0 0 1 8.8 2.6Z" />
              </svg>
            </button>
          </div>

          <div className="property-detail-summary">
            <p className="property-detail-price">{formatPrice(property.price)}</p>
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
          </div>
        </div>

        <div className="detail-content-grid">
          <section className="detail-panel">
            <h2>About This Home</h2>
            <p>{property.description}</p>
          </section>

          <section className="detail-panel">
            <h2>Neighborhood</h2>
            <div className="detail-score-summary">
              <span>Overall Neighborhood Score</span>
              <div className="detail-score-value">
                <strong>{property.score}</strong>
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
          </section>

          <section className="detail-panel">
            <h2>Estimated Monthly Cost</h2>
            <p className="detail-estimate-note">Estimates are sample data for this preview.</p>
            <div className="monthly-cost-list">
              {monthlyCostRows.map((row) => (
                <div key={row.label} className="monthly-cost-row">
                  <span>{row.label}</span>
                  <strong>{formatPrice(row.value)}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="detail-panel">
            <h2>Map &amp; Nearby Places</h2>
            <div className="map-placeholder" aria-label="Map placeholder for nearby places">
              <span>Map view coming soon</span>
            </div>
          </section>
        </div>
        <InvestmentAnalysis property={property} />
      </div>
    </main>
  );
}
