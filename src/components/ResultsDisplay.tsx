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
          <strong className="result-value">
            {socAfterCharging.toFixed(0)} %
          </strong>
          <div className="battery-container">
            <div
              className="battery-level"
              style={{
                width: `${socAfterCharging}%`,
                backgroundColor: getBatteryColor(socAfterCharging),
              }}
            />
          </div>
        </div>
        <div className="result-tile">
          {" "}
          {/* Changed p to div, added class */}
          <span>Charging power</span>
          <strong className="result-value">
            {chargingPower.toFixed(2)} kW
          </strong>
        </div>
        <div className="result-tile">
          {" "}
          {/* Changed p to div, added class */}
          <span>Charging speed</span>
          <strong className="result-value">
            {chargingSpeedPercent.toFixed(1)} %/h
          </strong>
        </div>
        <div className="result-tile">
          {" "}
          {/* Changed p to div, added class */}
          <span>Charging speed</span>
          <strong className="result-value">
            {chargingSpeedKm.toFixed(1)} km/h
          </strong>
        </div>
        <div className="result-tile">
          {" "}
          {/* Changed p to div, added class */}
          <span>Range per session</span>
          <strong className="result-value">
            {rangePerSession.toFixed(0)} km
          </strong>
        </div>
        <div className="result-tile">
          {" "}
          {/* Changed p to div, added class */}
          <span>Total range</span>
          <strong className="result-value">{totalRange.toFixed(0)} km</strong>
        </div>
      </div>
    </div>
  );
};

const getBatteryColor = (soc: number): string => {
  if (soc < 20) return "#ff4d4d";
  if (soc < 80) return "#ffcc00";
  return "#4dff4d";
};

export default ResultsDisplay;
