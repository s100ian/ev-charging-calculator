import React from "react";
import SliderField from "./SliderField";

interface ChargePlanningProps {
  currentSoC: number;
  targetSoC: number;
  setTargetSoC: (value: number) => void;
  departureTime: string;
  setDepartureTime: (value: string) => void;
}

const presetTargets = [60, 80, 100];

const ChargePlanning: React.FC<ChargePlanningProps> = ({
  currentSoC,
  targetSoC,
  setTargetSoC,
  departureTime,
  setDepartureTime,
}) => {
  const minTargetSoC = Math.min(100, Math.max(0, Math.ceil(currentSoC)));

  const clampTargetSoC = (value: number) => {
    return Math.min(100, Math.max(minTargetSoC, value));
  };

  const handleTargetSoCChange = (value: number) => {
    setTargetSoC(clampTargetSoC(Math.round(value)));
  };

  const handleTargetSoCDecrement = () => {
    setTargetSoC(clampTargetSoC(targetSoC - 1));
  };

  const handleTargetSoCIncrement = () => {
    setTargetSoC(clampTargetSoC(targetSoC + 1));
  };

  const handleDepartureTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepartureTime(e.target.value);
  };

  return (
    <div className="input-section charge-planning-container">
      <h2>Charge Planning</h2>
      <SliderField
        groupTestId="target-soc-group"
        label="Target SoC (%)"
        value={targetSoC}
        sliderId="target-soc-slider"
        sliderTestId="target-soc-slider"
        min={minTargetSoC}
        max={100}
        onSliderChange={handleTargetSoCChange}
        onDecrement={handleTargetSoCDecrement}
        onIncrement={handleTargetSoCIncrement}
        quickSetGroupTestId="target-presets-group"
        quickSetLabel="Quick targets"
        quickSetAriaLabel="Quick target SoC presets"
        quickSetOptions={presetTargets.map((preset) => ({
          label: `${preset}`,
          value: clampTargetSoC(preset),
          disabled: preset < minTargetSoC,
        }))}
      />
      <div className="field-group" data-testid="departure-time-group">
        <label className="field-label" htmlFor="departure-time-input">
          Departure time (optional)
        </label>
        <input
          id="departure-time-input"
          className="text-input"
          type="time"
          value={departureTime}
          onChange={handleDepartureTimeChange}
        />
      </div>
      <p className="planner-helper-text">
        See how long it takes to reach your target and whether it will be ready before departure.
      </p>
    </div>
  );
};

export default ChargePlanning;
