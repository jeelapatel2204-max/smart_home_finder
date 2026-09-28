import { searchRentCastSaleListings } from "@/features/data-providers/rentcast";

export async function GET(request: Request) {
  const parameters = new URL(request.url).searchParams;
  const city = parameters.get("city") ?? undefined;
  const state = parameters.get("state") ?? undefined;
  const zipCode = parameters.get("zipCode") ?? undefined;

  try {
    const listings = await searchRentCastSaleListings({ city, state, zipCode });
    return Response.json({ source: listings ? "RentCast" : "sample", listings: listings ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Live listings are temporarily unavailable.";
    return Response.json({ source: "unavailable", listings: [], message }, { status: 503 });
  }
}
