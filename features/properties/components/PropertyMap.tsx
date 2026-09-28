"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { Property } from "@/features/properties/data/properties";
import { calculateNeighborhoodScore } from "@/features/neighborhoods/lib/score";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function FitMapToMarkers({ properties }: { properties: Property[] }) {
  const map = useMap();

  useEffect(() => {
    if (!properties.length) {
      return;
    }

    const bounds = L.latLngBounds(
      properties.map((property) => [property.latitude, property.longitude] as [number, number]),
    );

    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 12 });
  }, [map, properties]);

  return null;
}

function createMarkerIcon() {
  return L.divIcon({
    className: "property-map-marker",
    html: '<div class="map-marker-bubble"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}

export function PropertyMap({
  properties,
  onViewProperty,
}: {
  properties: Property[];
  onViewProperty: (id: number) => void;
}) {
  return (
    <div className="property-map-shell">
      <div className="property-map-header">
        <span>Map view</span>
      </div>
      <div className="property-map-container">
        <MapContainer
          center={[39.146, -84.54]}
          zoom={10}
          scrollWheelZoom
          className="property-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitMapToMarkers properties={properties} />

          {properties.map((property) => (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={createMarkerIcon()}
            >
              <Popup className="property-map-popup">
                <div className="property-popup-card">
                  <p className="property-popup-price">{formatPrice(property.price)}</p>
                  <p className="property-popup-address">{property.address}</p>
                  <div className="property-popup-meta">
                    <span>{property.beds} bd</span>
                    <span>{property.baths} ba</span>
                  </div>
                  <div className="property-popup-score">
                    <span>Neighborhood Score</span>
                    <strong>{calculateNeighborhoodScore(property.neighborhood).score}</strong>
                  </div>
                  <button
                    type="button"
                    className="property-popup-button"
                    onClick={() => onViewProperty(property.id)}
                  >
                    View property
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
