import React from "react";

interface CostResultsProps {
  currencySymbol: string;
  sessionCost: number | null;
  fullChargeCost: number | null;
  costPer100Km: number | null;
}

const formatCurrencyValue = (
  value: number | null,
  currencySymbol: string,
  suffix: string = ""
): string => {
  if (value === null) {
    return "—";
  }

  return `${currencySymbol}${value.toFixed(2)}${suffix}`;
};

const CostResults: React.FC<CostResultsProps> = ({
  currencySymbol,
  sessionCost,
  fullChargeCost,
  costPer100Km,
}) => {
  return (
    <div className="results-section cost-results-section">
      <h2>Cost</h2>
      <div className="results-grid cost-results-grid">
        <div className="result-tile">
          <span>Session cost</span>
          <strong
            className={`result-value${sessionCost === null ? " result-value--placeholder" : ""}`}
          >
            {formatCurrencyValue(sessionCost, currencySymbol)}
          </strong>
        </div>
        <div className="result-tile">
          <span>Cost to full</span>
          <strong
            className={`result-value${fullChargeCost === null ? " result-value--placeholder" : ""}`}
          >
            {formatCurrencyValue(fullChargeCost, currencySymbol)}
          </strong>
        </div>
        <div className="result-tile">
          <span>Cost per 100 km</span>
          <strong
            className={`result-value${costPer100Km === null ? " result-value--placeholder" : ""}`}
          >
            {formatCurrencyValue(costPer100Km, currencySymbol, " / 100 km")}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default CostResults;
