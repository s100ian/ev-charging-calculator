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
  return (
    <div>
      <h2>Car Information</h2>
      <div>
        <label>
          Usable capacity (kWh): {usableCapacity}
          <input
            type="range"
            min="5"
            max="200"
            value={usableCapacity}
            onChange={(e) => setUsableCapacity(parseInt(e.target.value, 10))}
          />
        </label>
      </div>
      <div>
        <label>
          Consumption (kWh/100km): {consumption}
          <input
            type="range"
            min="5"
            max="50"
            value={consumption}
            onChange={(e) => setConsumption(parseInt(e.target.value, 10))}
          />
        </label>
      </div>
    </div>
  );
};

export default CarInfo;
