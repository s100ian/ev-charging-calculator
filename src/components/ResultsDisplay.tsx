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
      <h2>Results</h2>
      <div className="results-grid">
        {" "}
        {/* Added grid container */}
        <div className="result-tile">
          {" "}
          {/* Changed p to div, added class */}
          <span>SoC after charging</span>
          <strong>{socAfterCharging.toFixed(0)} %</strong>
        </div>
        <div className="result-tile">
          {" "}
          {/* Changed p to div, added class */}
          <span>Charging power</span>
          <strong>{chargingPower.toFixed(2)} kW</strong>
        </div>
        <div className="result-tile">
          {" "}
          {/* Changed p to div, added class */}
          <span>Charging speed</span>
          <strong>{chargingSpeedPercent.toFixed(1)} %/h</strong>
        </div>
        <div className="result-tile">
          {" "}
          {/* Changed p to div, added class */}
          <span>Charging speed</span>
          <strong>{chargingSpeedKm.toFixed(1)} km/h</strong>
        </div>
        <div className="result-tile">
          {" "}
          {/* Changed p to div, added class */}
          <span>Range per session</span>
          <strong>{rangePerSession.toFixed(0)} km</strong>
        </div>
        <div className="result-tile">
          {" "}
          {/* Changed p to div, added class */}
          <span>Total range</span>
          <strong>{totalRange.toFixed(0)} km</strong>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
