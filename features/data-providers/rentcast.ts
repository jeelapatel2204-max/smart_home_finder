import "server-only";

export type ListingSearch = {
  city?: string;
  state?: string;
  zipCode?: string;
  limit?: number;
};

export type LiveListing = {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFootage: number | null;
  price: number;
  hoaFee: number | null;
  listedDate: string | null;
  lastSeenDate: string | null;
  source: "RentCast";
};

type RentCastListing = {
  id: string;
  formattedAddress: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  propertyType: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  squareFootage?: number | null;
  price: number;
  hoa?: { fee?: number | null } | null;
  listedDate?: string | null;
  lastSeenDate?: string | null;
};

function normalizeListing(listing: RentCastListing): LiveListing {
  return {
    id: listing.id,
    address: listing.formattedAddress,
    city: listing.city,
    state: listing.state,
    zipCode: listing.zipCode,
    latitude: listing.latitude,
    longitude: listing.longitude,
    propertyType: listing.propertyType,
    bedrooms: listing.bedrooms ?? null,
    bathrooms: listing.bathrooms ?? null,
    squareFootage: listing.squareFootage ?? null,
    price: listing.price,
    hoaFee: listing.hoa?.fee ?? null,
    listedDate: listing.listedDate ?? null,
    lastSeenDate: listing.lastSeenDate ?? null,
    source: "RentCast",
  };
}

export async function searchRentCastSaleListings(search: ListingSearch): Promise<LiveListing[] | null> {
  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) return null;

  const parameters = new URLSearchParams({ limit: String(Math.min(search.limit ?? 20, 100)) });
  if (search.city) parameters.set("city", search.city);
  if (search.state) parameters.set("state", search.state);
  if (search.zipCode) parameters.set("zipCode", search.zipCode);

  const response = await fetch(`https://api.rentcast.io/v1/listings/sale?${parameters}`, {
    headers: { Accept: "application/json", "X-Api-Key": apiKey },
    next: { revalidate: 900, tags: ["rentcast-sale-listings"] },
  });
  if (!response.ok) throw new Error(`RentCast listings request failed (${response.status}).`);

  const data = await response.json() as RentCastListing[];
  return data.map(normalizeListing);
}
