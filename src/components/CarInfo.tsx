import React from "react";

interface CarInfoProps {
  usableCapacity: number;
  setUsableCapacity: (value: number) => void;
  consumption: number;
  setConsumption: (value: number) => void;
}

const CarInfo: React.FC<CarInfoProps> = ({
  usableCapacity,
  setUsableCapacity,
  consumption,
  setConsumption,
}) => {
  const handleDecrement = (setter: (value: number) => void, value: number, min: number) => {
    setter(Math.max(min, value - 1));
  };

  const handleIncrement = (setter: (value: number) => void, value: number, max: number) => {
    setter(Math.min(max, value + 1));
  };

  return (
    <div>
      <h2>Car Information</h2>
      <div>
        <label>
          Usable capacity (kWh): {usableCapacity}
          <div>
            <button onClick={() => handleDecrement(setUsableCapacity, usableCapacity, 5)}>-</button>
            <input
              type="range"
              min="5"
              max="200"
              value={usableCapacity}
              onChange={(e) => setUsableCapacity(parseInt(e.target.value, 10))}
            />
            <button onClick={() => handleIncrement(setUsableCapacity, usableCapacity, 200)}>+</button>
          </div>
        </label>
      </div>
      <div>
        <label>
          Consumption (kWh/100km): {consumption}
          <div></div>
            <button onClick={() => handleDecrement(setConsumption, consumption, 5)}>-</button>
            <input
              type="range"
              min="5"
              max="50"
              value={consumption}
              onChange={(e) => setConsumption(parseInt(e.target.value, 10))}
            />
            <button onClick={() => handleIncrement(setConsumption, consumption, 50)}>+</button>
          </div>
        </label>
      </div>
    </div>
  );
};

export default CarInfo;
