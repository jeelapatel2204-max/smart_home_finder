type InvestmentInfoTipProps = {
  label: string;
  text: string;
};

export function InvestmentInfoTip({ label, text }: InvestmentInfoTipProps) {
  const tooltipId = `investment-info-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <span className="investment-info-wrap">
      <button
        type="button"
        className="investment-info-button"
        aria-label={`About ${label}`}
        aria-describedby={tooltipId}
        title={text}
      >
        i
      </button>
      <span className="investment-info-tooltip" id={tooltipId} role="tooltip">
        {text}
      </span>
    </span>
  );
}
