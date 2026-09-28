import { describe, expect, it } from "vitest";
import { parseCityZhvi } from "./zillow-zhvi";

const csv = `RegionID,RegionName,State,StateName,2026-01-31,2026-02-28
1,Portland,OR,Oregon,500000,505000
2,Portland,ME,Maine,450000,452000`;

describe("parseCityZhvi", () => {
  it("selects the requested city and state and retains valid market observations", () => {
    expect(parseCityZhvi(csv, "Portland", "OR")).toEqual({
      geography: "Portland, OR",
      source: "Zillow Home Value Index",
      latestDate: "2026-02-28",
      points: [
        { date: "2026-01-31", value: 500000 },
        { date: "2026-02-28", value: 505000 },
      ],
    });
  });

  it("returns null when the requested market is absent", () => {
    expect(parseCityZhvi(csv, "Austin", "TX")).toBeNull();
  });
});
