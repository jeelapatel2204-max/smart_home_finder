import { searchGoogleNearbyPlaces } from "@/features/data-providers/google-places";

export async function GET(request: Request) {
  const parameters = new URL(request.url).searchParams;
  const latitude = Number(parameters.get("latitude"));
  const longitude = Number(parameters.get("longitude"));
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return Response.json({ error: "A valid latitude and longitude are required." }, { status: 400 });
  }

  try {
    const places = await searchGoogleNearbyPlaces(latitude, longitude);
    return Response.json({ source: places ? "Google Places" : "sample", places: places ?? [] });
  } catch {
    return Response.json({ source: "unavailable", places: [] }, { status: 503 });
  }
}
