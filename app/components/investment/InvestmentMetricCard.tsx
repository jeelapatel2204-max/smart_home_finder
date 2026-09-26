import { InvestmentInfoTip } from "./InvestmentInfoTip";

type InvestmentMetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  info?: string;
  sentiment?: "positive" | "negative";
};

export function InvestmentMetricCard({
  label,
  value,
  detail,
  info,
  sentiment,
}: InvestmentMetricCardProps) {
  return (
    <article className={`investment-metric${sentiment ? ` is-${sentiment}` : ""}`}>
      <div className="investment-metric-heading">
        <p>{label}</p>
        {info && <InvestmentInfoTip label={label} text={info} />}
      </div>
      <strong>{value}</strong>
      {detail && <span>{detail}</span>}
    </article>
  );
}
