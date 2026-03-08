import React from "react";

interface PlanningResultsProps {
  batteryEnergyToTargetKwh: number;
  wallEnergyToTargetKwh: number;
  timeToTargetHours: number;
  readyAtLabel: string | null;
  rangeAtTargetKm: number | null;
  planningSummary: string | null;
  isTargetReachable: boolean;
  departureTime: string;
  isReachableByDeparture: boolean | null;
  socAtDeparturePercent: number | null;
  socShortfallPercent: number | null;
}

const formatDuration = (value: number, isReachable: boolean): string => {
  if (!isReachable || !Number.isFinite(value)) {
    return "—";
  }

  const totalMinutes = Math.max(0, Math.round(value * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
};

const formatEnergy = (value: number): string => {
  return `${value.toFixed(1)} kWh`;
};

const formatRange = (value: number | null): string => {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }

  return `${value.toFixed(0)} km`;
};

const formatPercentage = (value: number | null): string => {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }

  return `${value.toFixed(0)} %`;
};

const PlanningResults: React.FC<PlanningResultsProps> = ({
  batteryEnergyToTargetKwh,
  wallEnergyToTargetKwh,
  timeToTargetHours,
  readyAtLabel,
  rangeAtTargetKm,
  planningSummary,
  isTargetReachable,
  departureTime,
  isReachableByDeparture,
  socAtDeparturePercent,
  socShortfallPercent,
}) => {
  const hasDepartureConstraint = departureTime.trim() !== "";

  return (
    <div className="results-section planning-results-section">
      <h2>Planning Results</h2>
      {planningSummary !== null && (
        <p
          className={`planning-summary ${
            isReachableByDeparture ? "planning-summary--success" : "planning-summary--warning"
          }`}
        >
          {planningSummary}
        </p>
      )}
      <div className="results-grid planning-results-grid">
        <div className="result-tile">
          <span>Time to target</span>
          <strong
            className={`result-value${!isTargetReachable ? " result-value--placeholder" : ""}`}
          >
            {formatDuration(timeToTargetHours, isTargetReachable)}
          </strong>
        </div>
        <div className="result-tile">
          <span>Ready at</span>
          <strong
            className={`result-value${readyAtLabel === null ? " result-value--placeholder" : ""}`}
          >
            {readyAtLabel ?? "—"}
          </strong>
        </div>
        <div className="result-tile">
          <span>Battery energy</span>
          <strong className="result-value">{formatEnergy(batteryEnergyToTargetKwh)}</strong>
        </div>
        <div className="result-tile">
          <span>Wall energy</span>
          <strong className="result-value">{formatEnergy(wallEnergyToTargetKwh)}</strong>
        </div>
        <div className="result-tile">
          <span>Range at target</span>
          <strong
            className={`result-value${rangeAtTargetKm === null ? " result-value--placeholder" : ""}`}
          >
            {formatRange(rangeAtTargetKm)}
          </strong>
        </div>
        {hasDepartureConstraint && (
          <>
            <div className="result-tile">
              <span>Ready by departure</span>
              <strong
                className={`result-value planning-status ${
                  isReachableByDeparture ? "planning-status--success" : "planning-status--warning"
                }`}
              >
                {isReachableByDeparture ? "Yes" : "No"}
              </strong>
            </div>
            <div className="result-tile">
              <span>SoC at departure</span>
              <strong className="result-value">
                {formatPercentage(socAtDeparturePercent)}
              </strong>
            </div>
            <div className="result-tile">
              <span>Shortfall</span>
              <strong className="result-value">
                {formatPercentage(socShortfallPercent)}
              </strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlanningResults;
