import { getCityMarketTrend } from "@/features/market-trends/lib/zillow-zhvi";
import { getOpenStreetMapNeighborhoodContext } from "@/features/neighborhoods/lib/openstreetmap";
import { getPropertyById } from "@/features/properties/data/properties";

export async function GET(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  const property = getPropertyById(id);

  if (!property) {
    return Response.json({ error: "Property not found." }, { status: 404 });
  }

  const [marketTrend, neighborhoodContext] = await Promise.all([
    getCityMarketTrend(property.city, property.state),
    getOpenStreetMapNeighborhoodContext(property.latitude, property.longitude),
  ]);

  return Response.json(
    { marketTrend, neighborhoodContext },
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
  );
}
