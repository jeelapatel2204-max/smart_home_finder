import { describe, expect, it } from "vitest";
import { properties } from "@/features/properties/data/properties";
import { getNearbyPlaces, nearbyRadiusMiles } from "./nearby-places";

describe("getNearbyPlaces", () => {
  it("returns places inside the advertised 30-mile radius", () => {
    const places = getNearbyPlaces(properties[0]);

    expect(places).toHaveLength(6);
    expect(places.every((place) => place.distanceMiles <= nearbyRadiusMiles)).toBe(true);
    expect(places.every((place) => Number.isFinite(place.latitude) && Number.isFinite(place.longitude))).toBe(true);
  });
});
