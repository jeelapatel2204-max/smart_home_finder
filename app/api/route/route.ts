type GeocodingResult = {
  lat?: string;
  lon?: string;
  display_name?: string;
};

type RouteResult = {
  distance?: number;
  duration?: number;
};

function validCoordinate(value: string | null, minimum: number, maximum: number) {
  const number = Number(value);
  return Number.isFinite(number) && number >= minimum && number <= maximum ? number : null;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const latitude = validCoordinate(url.searchParams.get("latitude"), -90, 90);
  const longitude = validCoordinate(url.searchParams.get("longitude"), -180, 180);
  const destination = url.searchParams.get("destination")?.trim().slice(0, 160);
  const locality = url.searchParams.get("locality")?.trim().slice(0, 100);

  if (latitude === null || longitude === null || !destination) {
    return Response.json({ message: "Enter a destination to plan a route." }, { status: 400 });
  }

  try {
    async function findDestination(query: string) {
      const geocodeResponse = await fetch(`https://nominatim.openstreetmap.org/search?${new URLSearchParams({ q: query, format: "jsonv2", limit: "1" })}`, {
        headers: { Accept: "application/json", "User-Agent": "SmartHomeFinder/0.1 (destination planner)" },
        next: { revalidate: 86_400 },
        signal: AbortSignal.timeout(12_000),
      });
      if (!geocodeResponse.ok) throw new Error("Destination search unavailable");
      return geocodeResponse.json() as Promise<GeocodingResult[]>;
    }

    const isSpecificSearch = destination.includes(",") || /\d{5}/.test(destination);
    const searchQueries = locality && !isSpecificSearch
      ? [`${destination}, ${locality}`, destination]
      : [destination];
    let matches: GeocodingResult[] = [];
    for (const query of searchQueries) {
      matches = await findDestination(query);
      if (matches.length > 0) break;
    }
    const match = matches[0];
    const destinationLatitude = validCoordinate(match?.lat ?? null, -90, 90);
    const destinationLongitude = validCoordinate(match?.lon ?? null, -180, 180);
    if (destinationLatitude === null || destinationLongitude === null) {
      return Response.json({ message: "We couldn’t find that destination. Try adding a city or ZIP code." }, { status: 404 });
    }

    const routeResponse = await fetch(`https://router.project-osrm.org/route/v1/driving/${longitude},${latitude};${destinationLongitude},${destinationLatitude}?overview=false`, {
      headers: { Accept: "application/json", "User-Agent": "SmartHomeFinder/0.1 (destination planner)" },
      next: { revalidate: 3_600 },
      signal: AbortSignal.timeout(12_000),
    });
    if (!routeResponse.ok) throw new Error("Route service unavailable");

    const routePayload = await routeResponse.json() as { routes?: RouteResult[] };
    const route = routePayload.routes?.[0];
    if (!route?.distance || !route.duration) throw new Error("No route found");

    return Response.json({
      destination: match.display_name ?? destination,
      distanceMiles: route.distance / 1609.344,
      drivingMinutes: Math.max(1, Math.round(route.duration / 60)),
    }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch {
    return Response.json({ message: "Route lookup is temporarily unavailable. Open Google Maps for live directions." }, { status: 503 });
  }
}
