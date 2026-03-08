import React from "react";

interface ChargePlanningProps {
  currentSoC: number;
  targetSoC: number;
  setTargetSoC: (value: number) => void;
  departureTime: string;
  setDepartureTime: (value: string) => void;
}

const presetTargets = [80, 90, 100];

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

  const handleTargetSoCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetSoC(clampTargetSoC(parseInt(e.target.value, 10)));
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
      <div className="slider-group" data-testid="target-soc-group">
        <label className="slider-label" htmlFor="target-soc-slider">
          Target SoC (%): <span className="slider-value">{targetSoC}</span>
        </label>
        <div className="slider-controls">
          <button
            className="control-button"
            onClick={handleTargetSoCDecrement}
            type="button"
          >
            -
          </button>
          <input
            id="target-soc-slider"
            type="range"
            min={minTargetSoC}
            max="100"
            value={targetSoC}
            onChange={handleTargetSoCChange}
            className="slider-input"
            data-testid="target-soc-slider"
          />
          <button
            className="control-button"
            onClick={handleTargetSoCIncrement}
            type="button"
          >
            +
          </button>
        </div>
      </div>
      <div className="field-group" data-testid="target-presets-group">
        <span className="field-label">Quick targets</span>
        <div className="currency-button-group" role="group" aria-label="Quick target SoC presets">
          {presetTargets.map((preset) => {
            const effectivePreset = clampTargetSoC(preset);
            const isDisabled = preset < minTargetSoC;
            const isActive = !isDisabled && targetSoC === effectivePreset;

            return (
              <button
                key={preset}
                type="button"
                className={`currency-button${isActive ? " currency-button--active" : ""}`}
                aria-pressed={isActive}
                disabled={isDisabled}
                onClick={() => setTargetSoC(effectivePreset)}
              >
                {preset}%
              </button>
            );
          })}
        </div>
      </div>
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
