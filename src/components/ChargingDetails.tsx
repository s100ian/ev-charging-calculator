import React from "react";

interface ChargingDetailsProps {
  volts: number;
  setVolts: (value: number) => void;
  duration: number;
  setDuration: (value: number) => void;
  currentSoC: number;
  setCurrentSoC: (value: number) => void;
  amps: number;
  setAmps: (value: number) => void;
}

const ChargingDetails: React.FC<ChargingDetailsProps> = ({
  volts,
  setVolts,
  duration,
  setDuration,
  currentSoC,
  setCurrentSoC,
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
    <div>
      <h2>Charging Details</h2>
      <div className="slider-group">
        <label>Volts (V): {volts}</label>
        <div className="slider-controls">
          <button onClick={() => handleDecrement(setVolts, volts, 110)}>
            -
          </button>
          <input
            type="range"
            min="110"
            max="240"
            value={volts}
            onChange={(e) => setVolts(parseInt(e.target.value, 10))}
          />
          <button onClick={() => handleIncrement(setVolts, volts, 240)}>
            +
          </button>
        </div>
      </div>
      <div className="slider-group">
        <label>Amps (A): {amps}</label>
        <div className="slider-controls">
          <button onClick={() => handleDecrement(setAmps, amps, 5)}>-</button>
          <input
            type="range"
            min="5"
            max="32"
            value={amps}
            onChange={(e) => setAmps(parseInt(e.target.value, 10))}
          />
          <button onClick={() => handleIncrement(setAmps, amps, 32)}>+</button>
        </div>
      </div>
      <div className="slider-group">
        <label>Charging duration (hours): {duration.toFixed(1)}</label>
        <div className="slider-controls">
          <button onClick={handleDurationDecrement}>-</button>
          <input
            type="range"
            min="1"
            max="50"
            step="0.1"
            value={duration}
            onChange={handleDurationChange}
          />
          <button onClick={handleDurationIncrement}>+</button>
        </div>
      </div>
      <div className="slider-group">
        <label>Current SoC (%): {currentSoC}</label>
        <div className="slider-controls">
          <button onClick={() => handleDecrement(setCurrentSoC, currentSoC, 0)}>
            -
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={currentSoC}
            onChange={(e) => setCurrentSoC(parseInt(e.target.value, 10))}
          />
          <button
            onClick={() => handleIncrement(setCurrentSoC, currentSoC, 100)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChargingDetails;
