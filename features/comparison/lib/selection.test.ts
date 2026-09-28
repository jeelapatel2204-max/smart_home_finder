import { describe, expect, it } from "vitest";
import { comparisonLimit, toggleComparisonSelection } from "./selection";

describe("comparison selection", () => {
  it("adds and removes a property", () => {
    expect(toggleComparisonSelection([], 1)).toEqual([1]);
    expect(toggleComparisonSelection([1], 1)).toEqual([]);
  });

  it("limits comparison to four properties", () => {
    expect(toggleComparisonSelection([1, 2, 3, 4], 5)).toHaveLength(comparisonLimit);
  });
});
