import React from "react";

interface CarInfoProps {
  usableCapacity: number;
  setUsableCapacity: (value: number) => void;
  consumption: number;
  setConsumption: (value: number) => void;
  currentSoC: number;
  setCurrentSoC: (value: number) => void;
}

const CarInfo: React.FC<CarInfoProps> = ({
  usableCapacity,
  setUsableCapacity,
  consumption,
  setConsumption,
  currentSoC,
  setCurrentSoC,
}) => {
  const handleDecrement = (
    setter: (value: number) => void,
    value: number,
    min: number
  ) => {
    setter(Math.max(min, value - 1));
  };

  const handleIncrement = (
    setter: (value: number) => void,
    value: number,
    max: number
  ) => {
    setter(Math.min(max, value + 1));
  };

  return (
    <div className="input-section car-info-container">
      <h2>Car Information</h2>
      <div className="slider-group" data-testid="usable-capacity-group">
        <label className="slider-label">
          Usable battery capacity (kWh):{" "}
          <span className="slider-value">{usableCapacity}</span>
        </label>
        <div className="slider-controls">
          <button
            className="control-button"
            onClick={() =>
              handleDecrement(setUsableCapacity, usableCapacity, 5)
            }
          >
            -
          </button>
          <input
            type="range"
            min="5"
            max="200"
            value={usableCapacity}
            onChange={(e) => setUsableCapacity(parseInt(e.target.value, 10))}
            className="slider-input"
            data-testid="usable-capacity-slider"
          />
          <button
            className="control-button"
            onClick={() =>
              handleIncrement(setUsableCapacity, usableCapacity, 200)
            }
          >
            +
          </button>
        </div>
      </div>
      <div className="slider-group">
        <label className="slider-label">
          Consumption (kWh/100km):{" "}
          <span className="slider-value">{consumption}</span>
        </label>
        <div className="slider-controls">
          <button
            className="control-button"
            onClick={() => handleDecrement(setConsumption, consumption, 5)}
          >
            -
          </button>
          <input
            type="range"
            min="5"
            max="50"
            value={consumption}
            onChange={(e) => setConsumption(parseInt(e.target.value, 10))}
            className="slider-input"
          />
          <button
            className="control-button"
            onClick={() => handleIncrement(setConsumption, consumption, 50)}
          >
            +
          </button>
        </div>
      </div>
      <div className="slider-group">
        <label className="slider-label">
          Current SoC (%): <span className="slider-value">{currentSoC}</span>
        </label>
        <div className="slider-controls">
          <button
            className="control-button"
            onClick={() => handleDecrement(setCurrentSoC, currentSoC, 0)}
          >
            -
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={currentSoC}
            onChange={(e) => setCurrentSoC(parseInt(e.target.value, 10))}
            className="slider-input"
          />
          <button
            className="control-button"
            onClick={() => handleIncrement(setCurrentSoC, currentSoC, 100)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarInfo;
