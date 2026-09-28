export type NeighborhoodMetricsInput = {
  schools: number;
  safety: number;
  amenities: number;
  accessibility: number;
  housingValue: number;
};

export type NeighborhoodScoreBreakdown = {
  score: number;
  strongestFactors: string[];
  lowerFactors: string[];
};

const factors = [
  ["Schools", "schools"],
  ["Safety", "safety"],
  ["Amenities", "amenities"],
  ["Accessibility", "accessibility"],
  ["Housing value", "housingValue"],
] as const;

function boundedScore(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function calculateNeighborhoodScore(metrics: NeighborhoodMetricsInput): NeighborhoodScoreBreakdown {
  const scoredFactors = factors.map(([label, key]) => ({ label, value: boundedScore(metrics[key]) }));
  const score = Math.round(scoredFactors.reduce((total, factor) => total + factor.value, 0) / scoredFactors.length);
  const ordered = [...scoredFactors].sort((first, second) => second.value - first.value);

  return {
    score,
    strongestFactors: ordered.slice(0, 2).map((factor) => factor.label),
    lowerFactors: ordered.slice(-2).reverse().map((factor) => factor.label),
  };
}
