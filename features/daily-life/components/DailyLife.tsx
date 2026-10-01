"use client";

import { useState, type FormEvent } from "react";
import { getNearbyPlaces } from "@/features/nearby-places/lib/nearby-places";
import type { NeighborhoodContext } from "@/features/neighborhoods/lib/context";
import type { Property } from "@/features/properties/data/properties";

function walkingMinutes(distanceMiles: number) {
  return Math.max(2, Math.round(distanceMiles * 20));
}

type RoutePlan = { destination: string; distanceMiles: number; drivingMinutes: number };

export function DailyLife({
  property,
  neighborhoodContext,
}: {
  property: Property;
  neighborhoodContext: NeighborhoodContext | null;
}) {
  const [destination, setDestination] = useState("");
  const [mode, setMode] = useState<"drive" | "transit" | "walk">("drive");
  const [routePlan, setRoutePlan] = useState<RoutePlan | null>(null);
  const [routeStatus, setRouteStatus] = useState<"idle" | "loading" | "error">("idle");
  const [routeError, setRouteError] = useState("");
  const places = getNearbyPlaces(property);
  const essentials = ["Groceries", "Parks", "Coffee"].map((category) => places.find((place) => place.category === category)!);
  const routeMinutes = routePlan
    ? mode === "drive" ? routePlan.drivingMinutes : mode === "transit" ? Math.round(routePlan.drivingMinutes * 1.35 + 5) : walkingMinutes(routePlan.distanceMiles)
    : null;
  const monthlyTransportCost = mode === "drive" && routeMinutes !== null
    ? Math.round((routeMinutes / 60) * 2 * 20 * 0.67)
    : mode === "transit"
      ? 120
      : 0;
  const tags = [
    property.neighborhood.accessibility >= 88 ? "Near transit" : "Car helpful",
    property.neighborhood.amenities >= 88 ? "Daily errands nearby" : "Quieter surroundings",
    property.neighborhood.safety >= 86 ? "Established neighborhood" : "Explore in person",
  ];
  const mapsUrl = destination.trim()
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${property.address}, ${property.city}, ${property.state} ${property.zip}`)}&destination=${encodeURIComponent(destination)}&travelmode=${mode === "drive" ? "driving" : mode === "walk" ? "walking" : "transit"}`
    : null;

  async function planRoute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!destination.trim()) return;
    setRouteStatus("loading");
    setRouteError("");
    try {
      const response = await fetch(`/api/route?${new URLSearchParams({ latitude: String(property.latitude), longitude: String(property.longitude), destination: destination.trim(), locality: `${property.city}, ${property.state}` })}`);
      const result = await response.json() as RoutePlan & { message?: string };
      if (!response.ok) throw new Error(result.message ?? "Unable to plan that route.");
      setRoutePlan(result);
      setRouteStatus("idle");
    } catch (error) {
      setRoutePlan(null);
      setRouteError(error instanceof Error ? error.message : "Unable to plan that route.");
      setRouteStatus("error");
    }
  }

  return (
    <section className="detail-panel daily-life-panel" aria-labelledby="daily-life-title">
      <p className="dossier-eyebrow">Your daily life</p>
      <h2 id="daily-life-title">How this place could feel</h2>
      <div className="daily-life-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="daily-life-essentials">
        {essentials.map((place) => <div key={place.category}><span>{place.category}</span><strong>~{walkingMinutes(place.distanceMiles)} min walk</strong></div>)}
      </div>
      <form className="daily-life-commute" onSubmit={planRoute}>
        <label><span>Where do you want to go?</span><input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="e.g. 1 Market St, San Francisco" /></label>
        <div className="daily-life-inputs">
          <label><span>Travel mode</span><select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}><option value="drive">Drive</option><option value="transit">Transit</option><option value="walk">Walk / bike</option></select></label>
          <button className="daily-life-route-button" type="submit" disabled={routeStatus === "loading"}>{routeStatus === "loading" ? "Finding route…" : "Check distance"}</button>
        </div>
        {routePlan && routeMinutes !== null && <div className="daily-life-result"><span>From this home to {routePlan.destination}</span><strong>{routePlan.distanceMiles.toFixed(1)} mi · ~{routeMinutes} min</strong><small>{mode === "drive" ? `~$${monthlyTransportCost}/mo driving estimate` : mode === "transit" ? "Transit time is a planning estimate; check live schedules." : "Walking/biking time is an estimate."}</small></div>}
        {routeStatus === "error" && <p className="daily-life-route-error" role="status">{routeError}</p>}
        {mapsUrl && <a className="daily-life-maps-link" href={mapsUrl} target="_blank" rel="noreferrer">Open live directions in Google Maps ↗</a>}
      </form>
      <p className="daily-life-note">Distance and driving time use OpenStreetMap routing. Google Maps opens live directions in a new tab. Walk times use nearby-place estimates.{neighborhoodContext ? ` Nearby context includes ${neighborhoodContext.counts.transitStops} transit stops within ${(neighborhoodContext.radiusMeters / 1609.344).toFixed(1)} mi.` : ""}</p>
    </section>
  );
}
