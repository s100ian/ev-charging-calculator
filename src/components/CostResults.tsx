import React from "react";
import Tile from "./Tile";
import TileGrid from "./TileGrid";

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
    <TileGrid title="Cost" testId="cost-results">
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
    </TileGrid>
  );
};

export default CostResults;
