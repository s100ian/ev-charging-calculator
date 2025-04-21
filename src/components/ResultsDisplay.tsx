import React from "react";

interface ResultsDisplayProps {
  socAfterCharging: number;
  chargingPower: number;
  chargingSpeedPercent: number;
  chargingSpeedKm: number;
  rangePerSession: number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  socAfterCharging,
  chargingPower,
  chargingSpeedPercent,
  chargingSpeedKm,
  rangePerSession,
}) => {
  return (
    <div>
      <h2>Results</h2>
      <p>SoC after charging: {socAfterCharging.toFixed(0)} %</p>
      <p>Charging power: {chargingPower.toFixed(2)} kW</p>
      <p>Charging speed: {chargingSpeedPercent.toFixed(1)} %/h</p>
      <p>Charging speed: {chargingSpeedKm.toFixed(1)} km/h</p>
      <p>Range per charging session: {rangePerSession.toFixed(0)} km</p>
    </div>
  );
};

export default ResultsDisplay;
