type InvestmentMetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  sentiment?: "positive" | "negative";
};

export function InvestmentMetricCard({
  label,
  value,
  detail,
  sentiment,
}: InvestmentMetricCardProps) {
  return (
    <article className={`investment-metric${sentiment ? ` is-${sentiment}` : ""}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      {detail && <span>{detail}</span>}
    </article>
  );
}
