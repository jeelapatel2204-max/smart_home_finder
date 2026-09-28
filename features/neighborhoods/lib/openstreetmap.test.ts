import { describe, expect, it } from "vitest";
import { countContext } from "./context";

describe("countContext", () => {
  it("sorts OpenStreetMap tags into neighborhood context categories", () => {
    expect(countContext([
      { tags: { amenity: "school" } },
      { tags: { leisure: "park" } },
      { tags: { shop: "supermarket" } },
      { tags: { amenity: "clinic" } },
      { tags: { highway: "bus_stop" } },
    ])).toEqual({ schools: 1, parks: 1, groceries: 1, healthcare: 1, transitStops: 1 });
  });
});
