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
  return (
    <div>
      <h2>Charging Details</h2>
      <div>
        <label>
          Volts (V): {volts}
          <input
            type="range"
            min="110"
            max="240"
            value={volts}
            onChange={(e) => setVolts(parseInt(e.target.value, 10))}
          />
        </label>
      </div>
      <div>
        <label>
          Charging duration (hours): {duration}
          <input
            type="range"
            min="1"
            max="50"
            step="0.1"
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Current SoC (%): {currentSoC}
          <input
            type="range"
            min="0"
            max="100"
            value={currentSoC}
            onChange={(e) => setCurrentSoC(parseInt(e.target.value, 10))}
          />
        </label>
      </div>
      <div>
        <label>
          Amps (A): {amps}
          <input
            type="range"
            min="5"
            max="32"
            value={amps}
            onChange={(e) => setAmps(parseInt(e.target.value, 10))}
          />
        </label>
      </div>
    </div>
  );
};

export default ChargingDetails;
