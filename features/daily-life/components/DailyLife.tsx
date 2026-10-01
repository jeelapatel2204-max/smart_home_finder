"use client";

import { useState } from "react";
import { getNearbyPlaces } from "@/features/nearby-places/lib/nearby-places";
import type { NeighborhoodContext } from "@/features/neighborhoods/lib/context";
import type { Property } from "@/features/properties/data/properties";

function walkingMinutes(distanceMiles: number) {
  return Math.max(2, Math.round(distanceMiles * 20));
}

export function DailyLife({
  property,
  neighborhoodContext,
}: {
  property: Property;
  neighborhoodContext: NeighborhoodContext | null;
}) {
  const [destination, setDestination] = useState("");
  const [commuteMinutes, setCommuteMinutes] = useState(25);
  const [mode, setMode] = useState<"drive" | "transit" | "walk">("drive");
  const places = getNearbyPlaces(property);
  const essentials = ["Groceries", "Parks", "Coffee"].map((category) => places.find((place) => place.category === category)!);
  const monthlyTransportCost = mode === "drive"
    ? Math.round((commuteMinutes / 60) * 25 * 2 * 20 * 0.67)
    : mode === "transit"
      ? 120
      : 0;
  const tags = [
    property.neighborhood.accessibility >= 88 ? "Near transit" : "Car helpful",
    property.neighborhood.amenities >= 88 ? "Daily errands nearby" : "Quieter surroundings",
    property.neighborhood.safety >= 86 ? "Established neighborhood" : "Explore in person",
  ];

  return (
    <section className="detail-panel daily-life-panel" aria-labelledby="daily-life-title">
      <p className="dossier-eyebrow">Your daily life</p>
      <h2 id="daily-life-title">How this place could feel</h2>
      <div className="daily-life-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="daily-life-essentials">
        {essentials.map((place) => <div key={place.category}><span>{place.category}</span><strong>~{walkingMinutes(place.distanceMiles)} min walk</strong></div>)}
      </div>
      <div className="daily-life-commute">
        <label>
          <span>Work, school, or frequent destination</span>
          <input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="e.g. Downtown office" />
        </label>
        <div className="daily-life-inputs">
          <label><span>Typical one-way commute</span><input type="number" min="0" max="180" value={commuteMinutes} onChange={(event) => setCommuteMinutes(Math.min(180, Math.max(0, Number(event.target.value) || 0)))} /><em>min</em></label>
          <label><span>Travel mode</span><select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}><option value="drive">Drive</option><option value="transit">Transit</option><option value="walk">Walk / bike</option></select></label>
        </div>
        <div className="daily-life-result"><span>{destination ? `Your plan for ${destination}` : "Your commute plan"}</span><strong>{commuteMinutes} min each way</strong><small>{mode === "drive" ? `~${monthlyTransportCost}/mo driving estimate` : mode === "transit" ? `~$${monthlyTransportCost}/mo transit estimate` : "No transportation cost estimate"}</small></div>
      </div>
      <p className="daily-life-note">Walk times use nearby-place estimates. Commute time is your planning input; connect live routing before relying on it for a decision.{neighborhoodContext ? ` Nearby context includes ${neighborhoodContext.counts.transitStops} transit stops within ${(neighborhoodContext.radiusMeters / 1609.344).toFixed(1)} mi.` : ""}</p>
    </section>
  );
}
