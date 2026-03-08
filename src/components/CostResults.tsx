import React from "react";
import Tile from "./Tile";

interface CostResultsProps {
  currencySymbol: string;
  sessionCost: number | null;
  targetCost: number | null;
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
  targetCost,
  fullChargeCost,
  costPer100Km,
}) => {
  return (
    <div className="results-section cost-results-section">
      <h2>Cost</h2>
      <div className="results-grid cost-results-grid">
        <Tile
          label="Session cost"
          value={formatCurrencyValue(sessionCost, currencySymbol)}
          placeholder={sessionCost === null}
        />
        <Tile
          label="Cost to target"
          value={formatCurrencyValue(targetCost, currencySymbol)}
          placeholder={targetCost === null}
        />
        <Tile
          label="Cost to full"
          value={formatCurrencyValue(fullChargeCost, currencySymbol)}
          placeholder={fullChargeCost === null}
        />
        <Tile
          label="Cost per 100 km"
          value={formatCurrencyValue(costPer100Km, currencySymbol, " / 100 km")}
          placeholder={costPer100Km === null}
        />
      </div>
    </div>
  );
};

export default CostResults;
