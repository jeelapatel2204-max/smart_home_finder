import type { ValueProjectionPoint } from "../../lib/investment-calculations";

type PropertyValueChartProps = {
  points: ValueProjectionPoint[];
};

const chartWidth = 720;
const chartHeight = 260;
const padding = { top: 16, right: 22, bottom: 34, left: 72 };

function formatAxisValue(value: number) {
  return `$${Math.round(value / 1000)}k`;
}

export function PropertyValueChart({ points }: PropertyValueChartProps) {
  const values = points.flatMap((point) => [
    point.conservative,
    point.expected,
    point.optimistic,
  ]);
  const minimum = Math.min(...values) * 0.97;
  const maximum = Math.max(...values) * 1.03;
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const x = (index: number) => padding.left + (index / Math.max(1, points.length - 1)) * plotWidth;
  const y = (value: number) => padding.top + ((maximum - value) / Math.max(1, maximum - minimum)) * plotHeight;
  const series = [
    { key: "conservative", label: "Conservative", color: "#8b9bb0" },
    { key: "expected", label: "Expected", color: "#163a5f" },
    { key: "optimistic", label: "Optimistic", color: "#4b927d" },
  ] as const;
  const axisValues = [maximum, (maximum + minimum) / 2, minimum];

  return (
    <div className="investment-chart-wrap">
      <div className="investment-chart-legend" aria-label="Projection scenarios">
        {series.map((scenario) => (
          <span key={scenario.key}>
            <i style={{ backgroundColor: scenario.color }} />
            {scenario.label}
          </span>
        ))}
      </div>
      <svg
        className="investment-chart"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        role="img"
        aria-label={`Projected property value scenarios from year zero through year ${points.at(-1)?.year ?? 0}`}
      >
        {axisValues.map((value) => (
          <g key={value}>
            <line
              x1={padding.left}
              x2={chartWidth - padding.right}
              y1={y(value)}
              y2={y(value)}
              className="investment-chart-gridline"
            />
            <text x={padding.left - 10} y={y(value) + 4} textAnchor="end" className="investment-chart-label">
              {formatAxisValue(value)}
            </text>
          </g>
        ))}
        {points.map((point, index) => (
          <text
            key={point.year}
            x={x(index)}
            y={chartHeight - 8}
            textAnchor="middle"
            className="investment-chart-label"
          >
            {point.year}
          </text>
        ))}
        {series.map((scenario) => (
          <g key={scenario.key}>
            <polyline
              points={points.map((point, index) => `${x(index)},${y(point[scenario.key])}`).join(" ")}
              fill="none"
              stroke={scenario.color}
              strokeWidth={scenario.key === "expected" ? 3 : 2}
              strokeDasharray={scenario.key === "expected" ? undefined : "5 5"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map((point, index) => (
              <circle
                key={`${scenario.key}-${point.year}`}
                cx={x(index)}
                cy={y(point[scenario.key])}
                r={scenario.key === "expected" ? 3 : 2.5}
                fill={scenario.color}
              />
            ))}
          </g>
        ))}
      </svg>
      <div className="investment-chart-axis-note"><span>Year</span><span>Estimated market value</span></div>
    </div>
  );
}
