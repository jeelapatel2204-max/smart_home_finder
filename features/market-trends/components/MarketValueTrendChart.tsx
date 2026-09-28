"use client";

import { useState } from "react";
import type { MarketTrend } from "@/features/market-trends/lib/zillow-zhvi";

type MarketValueTrendChartProps = {
  trend: MarketTrend;
  listingPrice: number;
};

const chartWidth = 720;
const chartHeight = 280;
const padding = { top: 18, right: 24, bottom: 38, left: 82 };
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00`));
}

export function MarketValueTrendChart({ trend, listingPrice }: MarketValueTrendChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const latestIndexValue = trend.points.at(-1)?.value ?? listingPrice;
  const points = trend.points.map((point) => ({
    ...point,
    rebasedValue: listingPrice * (point.value / latestIndexValue),
  }));
  const values = points.map((point) => point.rebasedValue);
  const minimum = Math.min(...values) * 0.98;
  const maximum = Math.max(...values) * 1.02;
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const x = (index: number) => padding.left + (index / Math.max(1, points.length - 1)) * plotWidth;
  const y = (value: number) => padding.top + ((maximum - value) / Math.max(1, maximum - minimum)) * plotHeight;
  const axisValues = [maximum, (maximum + minimum) / 2, minimum];
  const labelIndices = [0, Math.floor((points.length - 1) / 2), points.length - 1];
  const latestChange = points.length > 12
    ? ((latestIndexValue / points.at(-13)!.value) - 1) * 100
    : null;
  const activePoint = activeIndex === null ? null : points[activeIndex];
  const tooltipX = activeIndex === null
    ? 0
    : Math.min(chartWidth - padding.right - 154, Math.max(padding.left, x(activeIndex) - 77));

  return (
    <div className="investment-chart-wrap market-trend-chart-wrap">
      <div className="investment-chart-legend" aria-label="Local market trend">
        <span>
          <i className="market-trend-legend-mark" />
          Current local market trend
        </span>
        {latestChange !== null && (
          <strong className="market-trend-change">
            {latestChange >= 0 ? "+" : ""}{latestChange.toFixed(1)}% in the last year
          </strong>
        )}
      </div>
      <svg
        className="investment-chart"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        role="img"
        aria-label={`${trend.geography} market value trend through ${formatDate(trend.latestDate)}`}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {axisValues.map((value) => (
          <g key={value}>
            <line x1={padding.left} x2={chartWidth - padding.right} y1={y(value)} y2={y(value)} className="investment-chart-gridline" />
            <text x={padding.left - 10} y={y(value) + 4} textAnchor="end" className="investment-chart-label">
              {currency.format(value)}
            </text>
          </g>
        ))}
        {activeIndex !== null && activePoint && (
          <g className="investment-chart-tooltip">
            <line
              x1={x(activeIndex)}
              x2={x(activeIndex)}
              y1={padding.top}
              y2={chartHeight - padding.bottom}
              className="investment-chart-crosshair"
            />
            <rect x={tooltipX} y={padding.top + 4} width="154" height="42" rx="6" />
            <text x={tooltipX + 10} y={padding.top + 21}>{formatDate(activePoint.date)}</text>
            <text x={tooltipX + 10} y={padding.top + 35}>{currency.format(activePoint.rebasedValue)}</text>
          </g>
        )}
        <polyline
          points={points.map((point, index) => `${x(index)},${y(point.rebasedValue)}`).join(" ")}
          fill="none"
          stroke="#4b927d"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, index) => (
          <circle
            key={point.date}
            cx={x(index)}
            cy={y(point.rebasedValue)}
            r="2.5"
            fill="#4b927d"
            tabIndex={0}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
          />
        ))}
        {labelIndices.map((index) => (
          <text key={points[index].date} x={x(index)} y={chartHeight - 8} textAnchor="middle" className="investment-chart-label">
            {formatDate(points[index].date)}
          </text>
        ))}
      </svg>
      <div className="investment-chart-axis-note">
        <span>Month</span>
        <span>Market value indexed to listing price</span>
      </div>
      <p className="market-trend-note">
        Zillow&apos;s Home Value Index measures typical home values in {trend.geography}. The line is rebased to this home&apos;s listing price for comparison; it is not an address-level appraisal.
      </p>
    </div>
  );
}
