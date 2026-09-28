import { describe, expect, it } from "vitest";
import { matchesPlaceQuery } from "./us-places";

describe("matchesPlaceQuery", () => {
  const springfield = { name: "Springfield city", state: "IL" };

  it("matches a city name as the user types", () => {
    expect(matchesPlaceQuery(springfield, "spr")).toBe(true);
  });

  it("matches a city with its state abbreviation or state name", () => {
    expect(matchesPlaceQuery(springfield, "springfield il")).toBe(true);
    expect(matchesPlaceQuery(springfield, "springfield illinois")).toBe(true);
  });
});
