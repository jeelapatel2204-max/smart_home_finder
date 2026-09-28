import { strFromU8, unzipSync } from "fflate";
import { usStateNames, type LocationSuggestion } from "./us-states";

const censusPlacesUrl = "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_place_national.zip";
let placesPromise: Promise<{ name: string; state: string }[]> | undefined;

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

async function getUsPlaces() {
  if (!placesPromise) {
    placesPromise = fetch(censusPlacesUrl, { next: { revalidate: 604800 } })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load U.S. places.");
        const archive = unzipSync(new Uint8Array(await response.arrayBuffer()));
        const file = Object.entries(archive).find(([name]) => name.endsWith(".txt"))?.[1];
        if (!file) throw new Error("U.S. places file is missing.");

        return strFromU8(file).trim().split(/\r?\n/).slice(1).flatMap((row) => {
          const [state, , , , name] = row.split("|");
          return state && name && usStateNames[state] ? [{ name, state }] : [];
        });
      })
      .catch((error) => {
        placesPromise = undefined;
        throw error;
      });
  }

  return placesPromise;
}

export async function getUsLocationSuggestions(query: string): Promise<LocationSuggestion[]> {
  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 2) return [];

  const states = Object.entries(usStateNames)
    .filter(([abbreviation, name]) => normalize(name).startsWith(normalizedQuery) || normalize(abbreviation).startsWith(normalizedQuery))
    .map(([abbreviation, name]) => ({ label: `${name} (${abbreviation})`, value: name, kind: "State" as const }));
  const places = await getUsPlaces();
  const cities = places
    .filter((place) => normalize(place.name).startsWith(normalizedQuery))
    .slice(0, Math.max(0, 8 - states.length))
    .map((place) => {
      const cityName = place.name.replace(/\s+(city|town|village|CDP)$/i, "");
      return { label: `${cityName}, ${place.state}`, value: `${cityName}, ${place.state}`, kind: "City" as const };
    });

  return [...states, ...cities];
}
