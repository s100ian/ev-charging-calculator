import React from "react";
import Tile from "./Tile";
import TileGrid from "./TileGrid";

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

  const summaryHeader = planningSummary !== null ? (
    <p
      className={`planning-summary ${
        isReachableByDeparture ? "planning-summary--success" : "planning-summary--warning"
      }`}
    >
      {planningSummary}
    </p>
  ) : undefined;

  return (
    <TileGrid title="Planning Results" testId="planning-results" header={summaryHeader}>
      <Tile
        label="Time to target"
        value={formatDuration(timeToTargetHours, isTargetReachable)}
        placeholder={!isTargetReachable}
      />
      <Tile
        label="Ready at"
        value={readyAtLabel ?? "—"}
        placeholder={readyAtLabel === null}
      />
      <Tile label="Battery energy" value={formatEnergy(batteryEnergyToTargetKwh)} />
      <Tile label="Wall energy" value={formatEnergy(wallEnergyToTargetKwh)} />
      <Tile
        label="Range at target"
        value={formatRange(rangeAtTargetKm)}
        placeholder={rangeAtTargetKm === null}
      />
      {hasDepartureConstraint && (
        <>
          <Tile
            label="Ready by departure"
            value={isReachableByDeparture ? "Yes" : "No"}
            valueClassName={`planning-status ${
              isReachableByDeparture ? "planning-status--success" : "planning-status--warning"
            }`}
          />
          <Tile
            label="SoC at departure"
            value={formatPercentage(socAtDeparturePercent)}
          />
          <Tile
            label="Shortfall"
            value={formatPercentage(socShortfallPercent)}
          />
        </>
      )}
    </TileGrid>
  );
};

export default PlanningResults;
