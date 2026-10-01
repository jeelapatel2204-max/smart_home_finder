import { notFound } from "next/navigation";
import { PropertyDetailContent } from "@/features/property-details/components/PropertyDetailContent";
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

  // Listing details should never wait for optional third-party market or map data.
  // The client requests that context after the primary decision experience is visible.
  return <PropertyDetailContent property={property} marketTrend={null} neighborhoodContext={null} />;
}

export type { Property };
