import React from "react";
import Tile from "./Tile";
import TileGrid from "./TileGrid";

interface ResultsDisplayProps {
  socAfterCharging: number;
  chargingPower: number;
  chargingSpeedPercent: number;
  chargingSpeedKm: number;
  rangePerSession: number;
  totalRange: number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  socAfterCharging,
  chargingPower,
  chargingSpeedPercent,
  chargingSpeedKm,
  rangePerSession,
  totalRange,
}) => {
  return (
    <TileGrid title="Results">
      <Tile label="SoC after charging" value={`${socAfterCharging.toFixed(0)} %`}>
        <div className="battery-container">
          <div
            className="battery-level"
            style={{
              width: `${socAfterCharging}%`,
              backgroundColor: getBatteryColor(socAfterCharging),
            }}
          />
        </div>
      </Tile>
      <Tile label="Charging power" value={`${chargingPower.toFixed(2)} kW`} />
      <Tile label="Charging speed" value={`${chargingSpeedPercent.toFixed(1)} %/h`} />
      <Tile label="Charging speed" value={`${chargingSpeedKm.toFixed(1)} km/h`} />
      <Tile label="Range per session" value={`${rangePerSession.toFixed(0)} km`} />
      <Tile label="Total range" value={`${totalRange.toFixed(0)} km`} />
    </TileGrid>
  );
};

const getBatteryColor = (soc: number): string => {
  if (soc < 20) return "#ff4d4d";
  if (soc < 80) return "#ffcc00";
  return "#4dff4d";
};

export default ResultsDisplay;
