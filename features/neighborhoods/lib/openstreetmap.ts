import "server-only";
import { countContext, type NeighborhoodContext } from "./context";

const radiusMeters = 3_000;

export async function getOpenStreetMapNeighborhoodContext(
  latitude: number,
  longitude: number,
): Promise<NeighborhoodContext | null> {
  const query = `[out:json][timeout:15];(
    nwr(around:${radiusMeters},${latitude},${longitude})["amenity"~"school|kindergarten|hospital|clinic|doctors|pharmacy"];
    nwr(around:${radiusMeters},${latitude},${longitude})["leisure"="park"];
    nwr(around:${radiusMeters},${latitude},${longitude})["shop"~"supermarket|convenience"];
    nwr(around:${radiusMeters},${latitude},${longitude})["highway"="bus_stop"];
    nwr(around:${radiusMeters},${latitude},${longitude})["public_transport"="platform"];
    nwr(around:${radiusMeters},${latitude},${longitude})["railway"="station"];
  );out tags;`;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "SmartHomeFinder/0.1 (neighborhood context)",
      },
      body: new URLSearchParams({ data: query }),
      next: { revalidate: 86_400, tags: ["openstreetmap-neighborhoods"] },
    });
    if (!response.ok) return null;

    const payload = await response.json() as { elements?: Parameters<typeof countContext>[0] };
    return {
      source: "OpenStreetMap",
      fetchedAt: new Date().toISOString(),
      radiusMeters,
      counts: countContext(payload.elements ?? []),
    };
  } catch {
    return null;
  }
}
