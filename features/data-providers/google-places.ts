import "server-only";

export type NearbyPlace = {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  types: string[];
  source: "Google Places";
};

export async function searchGoogleNearbyPlaces(latitude: number, longitude: number, radiusMeters = 48_280): Promise<NearbyPlace[] | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  const response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.types",
    },
    body: JSON.stringify({
      includedTypes: ["restaurant"],
      maxResultCount: 20,
      rankPreference: "DISTANCE",
      locationRestriction: { circle: { center: { latitude, longitude }, radius: Math.min(radiusMeters, 50_000) } },
    }),
    next: { revalidate: 3600, tags: ["google-nearby-places"] },
  });
  if (!response.ok) throw new Error(`Google Places request failed (${response.status}).`);

  const data = await response.json() as { places?: Array<{ id: string; displayName?: { text?: string }; formattedAddress?: string; location?: { latitude?: number; longitude?: number }; types?: string[] }> };
  return (data.places ?? []).flatMap((place) => {
    if (!place.id || !place.displayName?.text || place.location?.latitude === undefined || place.location.longitude === undefined) return [];
    return [{
      id: place.id,
      name: place.displayName.text,
      address: place.formattedAddress ?? null,
      latitude: place.location.latitude,
      longitude: place.location.longitude,
      types: place.types ?? [],
      source: "Google Places" as const,
    }];
  });
}
