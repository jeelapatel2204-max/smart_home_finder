import { notFound } from "next/navigation";
import { getPropertyById, type Property } from "../../data/properties";
import { PropertyDetailContent } from "./property-detail-content";

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

  return <PropertyDetailContent property={property} />;
}

export type { Property };
