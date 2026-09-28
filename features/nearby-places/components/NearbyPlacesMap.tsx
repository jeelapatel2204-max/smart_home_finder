"use client";

import { useEffect } from "react";
import L from "leaflet";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { nearbyRadiusMiles, type NearbyPlace } from "@/features/nearby-places/lib/nearby-places";
import type { Property } from "@/features/properties/data/properties";

const radiusMeters = nearbyRadiusMiles * 1609.344;

function CenterMap({ property }: { property: Property }) {
  const map = useMap();

  useEffect(() => {
    const latitudeOffset = nearbyRadiusMiles / 69;
    const longitudeOffset = nearbyRadiusMiles / (69 * Math.cos((property.latitude * Math.PI) / 180));

    map.fitBounds([
      [property.latitude - latitudeOffset, property.longitude - longitudeOffset],
      [property.latitude + latitudeOffset, property.longitude + longitudeOffset],
    ], {
      padding: [20, 20],
    });
  }, [map, property.latitude, property.longitude]);

  return null;
}

const homeIcon = L.divIcon({
  className: "nearby-place-marker nearby-place-marker-home",
  html: '<div></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const placeIcon = L.divIcon({
  className: "nearby-place-marker",
  html: '<div></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export function NearbyPlacesMap({ property, places }: { property: Property; places: NearbyPlace[] }) {
  return (
    <div className="nearby-places-map" aria-label={`Map of places within ${nearbyRadiusMiles} miles of this home`}>
      <MapContainer center={[property.latitude, property.longitude]} zoom={10} scrollWheelZoom className="nearby-places-leaflet-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CenterMap property={property} />
        <Circle center={[property.latitude, property.longitude]} radius={radiusMeters} pathOptions={{ color: "#327462", fillColor: "#75aa95", fillOpacity: 0.1 }} />
        <Marker position={[property.latitude, property.longitude]} icon={homeIcon}>
          <Popup>Your selected home</Popup>
        </Marker>
        {places.map((place) => (
          <Marker key={place.id} position={[place.latitude, place.longitude]} icon={placeIcon}>
            <Popup><strong>{place.name}</strong><br />{place.distanceMiles.toFixed(1)} miles away</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
