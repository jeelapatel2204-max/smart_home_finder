import { getUsLocationSuggestions } from "@/features/location-search/lib/us-places";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  try {
    return Response.json({ suggestions: await getUsLocationSuggestions(query) });
  } catch {
    return Response.json({ suggestions: [] }, { status: 503 });
  }
}
