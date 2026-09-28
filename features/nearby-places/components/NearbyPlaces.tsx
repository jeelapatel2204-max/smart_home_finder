"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { getNearbyPlaces, nearbyRadiusMiles } from "@/features/nearby-places/lib/nearby-places";
import type { Property } from "@/features/properties/data/properties";

const NearbyPlacesMap = dynamic(
  () => import("./NearbyPlacesMap").then((module) => module.NearbyPlacesMap),
  { ssr: false, loading: () => <div className="nearby-places-map-loading">Loading map…</div> },
);

export function NearbyPlaces({ property }: { property: Property }) {
  const places = getNearbyPlaces(property);
  const carouselRef = useRef<HTMLDivElement>(null);

  function moveCarousel(direction: "previous" | "next") {
    carouselRef.current?.scrollBy({
      left: direction === "next" ? 320 : -320,
      behavior: "smooth",
    });
  }

  return (
    <section className="detail-panel nearby-places-panel" aria-labelledby="nearby-places-title">
      <div className="nearby-places-heading">
        <div>
          <h2 id="nearby-places-title">Map &amp; Nearby Places</h2>
          <p>Explore sample places within a {nearbyRadiusMiles}-mile radius of {property.address}.</p>
        </div>
        <span className="nearby-radius-badge">Within {nearbyRadiusMiles} mi</span>
      </div>

      <NearbyPlacesMap property={property} places={places} />

      <div className="nearby-places-carousel-heading">
        <span>Nearby places</span>
        <div className="nearby-places-controls">
          <button type="button" aria-label="Show previous nearby places" onClick={() => moveCarousel("previous")}>←</button>
          <button type="button" aria-label="Show more nearby places" onClick={() => moveCarousel("next")}>→</button>
        </div>
      </div>
      <div className="nearby-places-carousel" ref={carouselRef} tabIndex={0} aria-label="Nearby places, scroll horizontally">
        {places.map((place) => (
          <article className="nearby-place-card" key={place.id}>
            <span className="nearby-place-category">{place.category}</span>
            <h3>{place.name}</h3>
            <p>{place.detail}</p>
            <strong>{place.distanceMiles.toFixed(1)} mi away</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
