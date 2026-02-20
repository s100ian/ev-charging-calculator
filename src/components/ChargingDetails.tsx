import React from "react";

interface ChargingDetailsProps {
  volts: number;
  setVolts: (value: number) => void;
  duration: number;
  setDuration: (value: number) => void;
  amps: number;
  setAmps: (value: number) => void;
}

const ChargingDetails: React.FC<ChargingDetailsProps> = ({
  volts,
  setVolts,
  duration,
  setDuration,
  amps,
  setAmps,
}) => {
  const handleDecrement = (
    setter: (value: number) => void,
    value: number,
    min: number,
    step: number = 1
  ) => {
    setter(Math.max(min, value - step));
  };

  const handleIncrement = (
    setter: (value: number) => void,
    value: number,
    max: number,
    step: number = 1
  ) => {
    setter(Math.min(max, value + step));
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(parseFloat(e.target.value));
  };

  const handleDurationDecrement = () => {
    setDuration(Math.max(1, parseFloat((duration - 0.1).toFixed(1))));
  };

  const handleDurationIncrement = () => {
    setDuration(Math.min(50, parseFloat((duration + 0.1).toFixed(1))));
  };

  return (
    <div className="input-section charging-details-container">
      <h2>Charging Details</h2>
      <div className="slider-group">
        <label className="slider-label">
          Volts (V): <span className="slider-value">{volts}</span>
        </label>
        <div className="slider-controls">
          <button
            className="control-button"
            onClick={() => handleDecrement(setVolts, volts, 110)}
          >
            -
          </button>
          <input
            type="range"
            min="110"
            max="240"
            value={volts}
            onChange={(e) => setVolts(parseInt(e.target.value, 10))}
            className="slider-input"
          />
          <button
            className="control-button"
            onClick={() => handleIncrement(setVolts, volts, 240)}
          >
            +
          </button>
        </div>
      </div>
      <div className="slider-group">
        <label className="slider-label">
          Amps (A): <span className="slider-value">{amps}</span>
        </label>
        <div className="slider-controls">
          <button
            className="control-button"
            onClick={() => handleDecrement(setAmps, amps, 5)}
          >
            -
          </button>
          <input
            type="range"
            min="5"
            max="32"
            value={amps}
            onChange={(e) => setAmps(parseInt(e.target.value, 10))}
            className="slider-input"
            data-testid="amps-slider"
          />
          <button
            className="control-button"
            onClick={() => handleIncrement(setAmps, amps, 32)}
          >
            +
          </button>
        </div>
      </div>
      <div className="slider-group">
        <label className="slider-label">
          Charging duration (hours):{" "}
          <span className="slider-value">{duration.toFixed(1)}</span>
        </label>
        <div className="slider-controls">
          <button className="control-button" onClick={handleDurationDecrement}>
            -
          </button>
          <input
            type="range"
            min="1"
            max="50"
            step="0.1"
            value={duration}
            onChange={handleDurationChange}
            className="slider-input"
          />
          <button className="control-button" onClick={handleDurationIncrement}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChargingDetails;
