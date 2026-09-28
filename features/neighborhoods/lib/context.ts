export type NeighborhoodContext = {
  source: "OpenStreetMap";
  fetchedAt: string;
  radiusMeters: number;
  counts: {
    schools: number;
    parks: number;
    groceries: number;
    healthcare: number;
    transitStops: number;
  };
};

type OpenStreetMapElement = { tags?: Record<string, string> };

export function countContext(elements: OpenStreetMapElement[]): NeighborhoodContext["counts"] {
  const counts = { schools: 0, parks: 0, groceries: 0, healthcare: 0, transitStops: 0 };

  elements.forEach(({ tags = {} }) => {
    if (tags.amenity === "school" || tags.amenity === "kindergarten") counts.schools += 1;
    if (tags.leisure === "park") counts.parks += 1;
    if (tags.shop === "supermarket" || tags.shop === "convenience") counts.groceries += 1;
    if (["hospital", "clinic", "doctors", "pharmacy"].includes(tags.amenity ?? "")) counts.healthcare += 1;
    if (tags.highway === "bus_stop" || tags.public_transport === "platform" || tags.railway === "station") counts.transitStops += 1;
  });

  return counts;
}
