import React from "react";

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
    <div className="results-section">
      {" "}
      {/* Added results-section class */}
      <h2>Results</h2>
      <p className="result-item">
        {" "}
        {/* Added result-item class */}
        <span>SoC after charging:</span>{" "}
        <strong>{socAfterCharging.toFixed(0)} %</strong>
      </p>
      <p className="result-item">
        {" "}
        {/* Added result-item class */}
        <span>Charging power:</span>{" "}
        <strong>{chargingPower.toFixed(2)} kW</strong>
      </p>
      <p className="result-item">
        {" "}
        {/* Added result-item class */}
        <span>Charging speed:</span>{" "}
        <strong>{chargingSpeedPercent.toFixed(1)} %/h</strong>
      </p>
      <p className="result-item">
        {" "}
        {/* Added result-item class */}
        <span>Charging speed:</span>{" "}
        <strong>{chargingSpeedKm.toFixed(1)} km/h</strong>
      </p>
      <p className="result-item">
        {" "}
        {/* Added result-item class */}
        <span>Range per charging session:</span>{" "}
        <strong>{rangePerSession.toFixed(0)} km</strong>
      </p>
      <p className="result-item">
        {" "}
        {/* Added result-item class */}
        <span>Total range:</span> <strong>{totalRange.toFixed(0)} km</strong>
      </p>
    </div>
  );
};

export default ResultsDisplay;
