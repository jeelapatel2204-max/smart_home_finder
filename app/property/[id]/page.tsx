import { notFound } from "next/navigation";
import { PropertyDetailContent } from "@/features/property-details/components/PropertyDetailContent";
import { getCityMarketTrend } from "@/features/market-trends/lib/zillow-zhvi";
import { getOpenStreetMapNeighborhoodContext } from "@/features/neighborhoods/lib/openstreetmap";
import { getPropertyById, type Property } from "@/features/properties/data/properties";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = getPropertyById(Number(id));

  if (!property) {
    notFound();
  }

  const [marketTrend, neighborhoodContext] = await Promise.all([
    getCityMarketTrend(property.city, property.state),
    getOpenStreetMapNeighborhoodContext(property.latitude, property.longitude),
  ]);

  return <PropertyDetailContent property={property} marketTrend={marketTrend} neighborhoodContext={neighborhoodContext} />;
}

export type { Property };
