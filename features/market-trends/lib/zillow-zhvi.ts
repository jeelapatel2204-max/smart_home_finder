export type MarketValuePoint = {
  date: string;
  value: number;
};

export type MarketTrend = {
  geography: string;
  source: "Zillow Home Value Index";
  latestDate: string;
  points: MarketValuePoint[];
};

const cityZhviUrl = "https://files.zillowstatic.com/research/public_csvs/zhvi/City_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv";

const stateNames: Record<string, string> = {
  CA: "California",
  CO: "Colorado",
  NC: "North Carolina",
  OR: "Oregon",
  TX: "Texas",
  WA: "Washington",
};

function parseCsvRow(row: string) {
  const cells: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < row.length; index += 1) {
    const character = row[index];
    if (character === '"' && row[index + 1] === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      inQuotes = !inQuotes;
    } else if (character === "," && !inQuotes) {
      cells.push(cell);
      cell = "";
    } else {
      cell += character;
    }
  }

  cells.push(cell);
  return cells;
}

export function parseCityZhvi(
  csv: string,
  city: string,
  state: string,
): MarketTrend | null {
  const [headerRow, ...dataRows] = csv.trim().split(/\r?\n/);
  if (!headerRow) {
    return null;
  }

  const headers = parseCsvRow(headerRow);
  const regionNameIndex = headers.indexOf("RegionName");
  const stateIndex = headers.indexOf("State");
  const stateNameIndex = headers.indexOf("StateName");
  const dateColumns = headers
    .map((header, index) => ({ header, index }))
    .filter(({ header }) => /^\d{4}-\d{2}-\d{2}$/.test(header));

  if (regionNameIndex === -1 || dateColumns.length === 0) {
    return null;
  }

  const stateName = stateNames[state] ?? state;
  const matchingRow = dataRows
    .map(parseCsvRow)
    .find((row) => row[regionNameIndex] === city && (
      row[stateIndex] === state || row[stateNameIndex] === stateName
    ));

  if (!matchingRow) {
    return null;
  }

  const points = dateColumns
    .map(({ header, index }) => ({ date: header, value: Number(matchingRow[index]) }))
    .filter((point) => Number.isFinite(point.value) && point.value > 0)
    .slice(-60);

  if (points.length === 0) {
    return null;
  }

  return {
    geography: `${city}, ${state}`,
    source: "Zillow Home Value Index",
    latestDate: points.at(-1)!.date,
    points,
  };
}

export async function getCityMarketTrend(city: string, state: string) {
  try {
    const response = await fetch(cityZhviUrl, {
      next: { revalidate: 86400, tags: ["zillow-zhvi-city"] },
    });

    if (!response.ok) {
      return null;
    }

    return parseCityZhvi(await response.text(), city, state);
  } catch {
    return null;
  }
}
