import { describe, expect, it } from "vitest";
import { calculateNeighborhoodScore } from "./score";

describe("calculateNeighborhoodScore", () => {
  it("equally weights all five neighborhood dimensions", () => {
    const result = calculateNeighborhoodScore({
      schools: 90,
      safety: 80,
      amenities: 70,
      accessibility: 60,
      housingValue: 50,
    });

    expect(result.score).toBe(70);
    expect(result.strongestFactors).toEqual(["Schools", "Safety"]);
    expect(result.lowerFactors).toEqual(["Housing value", "Accessibility"]);
  });

  it("keeps malformed source values inside the 0 to 100 score range", () => {
    const result = calculateNeighborhoodScore({
      schools: 125,
      safety: -10,
      amenities: 100,
      accessibility: 50,
      housingValue: 25,
    });

    expect(result.score).toBe(55);
  });
});
