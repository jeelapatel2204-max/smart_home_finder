import type { Property } from "@/features/properties/data/properties";

export const nearbyRadiusMiles = 30;

export type NearbyPlace = {
  id: string;
  name: string;
  category: string;
  detail: string;
  latitude: number;
  longitude: number;
  distanceMiles: number;
};

const placeTemplates = [
  { category: "Parks", name: "Neighborhood Park", detail: "Green space and walking paths", distanceMiles: 1.2, bearing: 25 },
  { category: "Groceries", name: "Local Market", detail: "Everyday groceries and essentials", distanceMiles: 2.4, bearing: 88 },
  { category: "Coffee", name: "Main Street Coffee", detail: "Coffee, pastries, and seating", distanceMiles: 3.8, bearing: 146 },
  { category: "Restaurants", name: "Local Dining District", detail: "Restaurants and casual dining", distanceMiles: 6.1, bearing: 205 },
  { category: "Schools", name: "Area School", detail: "Public school nearby", distanceMiles: 9.7, bearing: 268 },
  { category: "Healthcare", name: "Medical Center", detail: "Primary and urgent care", distanceMiles: 15.4, bearing: 324 },
] as const;

function destinationPoint(latitude: number, longitude: number, miles: number, bearing: number) {
  const earthRadiusMiles = 3958.8;
  const angularDistance = miles / earthRadiusMiles;
  const bearingRadians = (bearing * Math.PI) / 180;
  const latitudeRadians = (latitude * Math.PI) / 180;
  const longitudeRadians = (longitude * Math.PI) / 180;

  const destinationLatitude = Math.asin(
    Math.sin(latitudeRadians) * Math.cos(angularDistance)
    + Math.cos(latitudeRadians) * Math.sin(angularDistance) * Math.cos(bearingRadians),
  );
  const destinationLongitude = longitudeRadians + Math.atan2(
    Math.sin(bearingRadians) * Math.sin(angularDistance) * Math.cos(latitudeRadians),
    Math.cos(angularDistance) - Math.sin(latitudeRadians) * Math.sin(destinationLatitude),
  );

  return {
    latitude: (destinationLatitude * 180) / Math.PI,
    longitude: (destinationLongitude * 180) / Math.PI,
  };
}

export function getNearbyPlaces(property: Property): NearbyPlace[] {
  return placeTemplates.map((place) => ({
    id: `${property.id}-${place.category.toLowerCase()}`,
    name: `${property.city} ${place.name}`,
    category: place.category,
    detail: place.detail,
    distanceMiles: place.distanceMiles,
    ...destinationPoint(property.latitude, property.longitude, place.distanceMiles, place.bearing),
  }));
}
