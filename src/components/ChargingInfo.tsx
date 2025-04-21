import React from "react";

interface ChargingInfoProps {
  chargingPower: number;
  setChargingPower: (value: number) => void;
}

const ChargingInfo: React.FC<ChargingInfoProps> = ({
  chargingPower,
  setChargingPower,
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
    <div>
      <h2>Charging Information</h2>
      <div>
        <label>
          Charging Power (kW): {chargingPower}
          <div>
            <button
              onClick={() =>
                handleDecrement(setChargingPower, chargingPower, 1)
              }
            >
              -
            </button>
            <input
              type="range"
              min="1"
              max="350" // Max charging power assumption
              value={chargingPower}
              onChange={(e) => setChargingPower(parseInt(e.target.value, 10))}
            />
            <button
              onClick={() =>
                handleIncrement(setChargingPower, chargingPower, 350)
              }
            >
              +
            </button>
          </div>
        </label>
      </div>
      {/* Placeholder for charging curve input/display */}
    </div>
  );
};

export default ChargingInfo;
