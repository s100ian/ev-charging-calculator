import { useEffect, useState } from "react";
import packageJson from "../package.json"; // Import package.json
import "./App.css";
import CarInfo from "./components/CarInfo";
import ChargingDetails from "./components/ChargingDetails";
import ResultsDisplay from "./components/ResultsDisplay";

// Helper function to get initial state from localStorage or return default
const getInitialState = (key: string, defaultValue: number): number => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? parseFloat(storedValue) : defaultValue;
};

function App() {
  // Car Info State - Initialize from localStorage or use defaults
  const [usableCapacity, setUsableCapacity] = useState(() =>
    getInitialState("usableCapacity", 72)
  ); // kWh
  const [consumption, setConsumption] = useState(() =>
    getInitialState("consumption", 18)
  ); // kWh/100km

  // Charging Details State - Initialize from localStorage or use defaults
  const [volts, setVolts] = useState(() => getInitialState("volts", 230)); // V
  const [duration, setDuration] = useState(() =>
    getInitialState("duration", 6.5)
  ); // hours
  const [currentSoC, setCurrentSoC] = useState(() =>
    getInitialState("currentSoC", 50)
  ); // %
  const [amps, setAmps] = useState(() => getInitialState("amps", 10)); // A

  // Results State
  const [socAfterCharging, setSocAfterCharging] = useState(0);
  const [chargingPower, setChargingPower] = useState(0);
  const [chargingSpeedPercent, setChargingSpeedPercent] = useState(0);
  const [chargingSpeedKm, setChargingSpeedKm] = useState(0);
  const [rangePerSession, setRangePerSession] = useState(0);

  useEffect(() => {
    // Calculations
    const powerKw = (volts * amps) / 1000;
    const energyAddedKwh = powerKw * duration;
    const socAddedPercent = (energyAddedKwh / usableCapacity) * 100;
    let finalSoC = currentSoC + socAddedPercent;
    finalSoC = Math.min(finalSoC, 100); // Cap SoC at 100%

    const speedPercentPerHour = socAddedPercent / duration;
    const speedKmPerHour = (powerKw / consumption) * 100;
    const rangeAddedKm = (energyAddedKwh / consumption) * 100;

    // Update Results State
    setChargingPower(powerKw);
    setSocAfterCharging(finalSoC);
    setChargingSpeedPercent(speedPercentPerHour);
    setChargingSpeedKm(speedKmPerHour);
    setRangePerSession(rangeAddedKm);

    // Save input state to localStorage
    localStorage.setItem("usableCapacity", usableCapacity.toString());
    localStorage.setItem("consumption", consumption.toString());
    localStorage.setItem("volts", volts.toString());
    localStorage.setItem("duration", duration.toString());
    localStorage.setItem("currentSoC", currentSoC.toString());
    localStorage.setItem("amps", amps.toString());
  }, [usableCapacity, consumption, volts, duration, currentSoC, amps]);

  return (
    <>
      <h1>EV Charging Calculator</h1>
      <CarInfo
        usableCapacity={usableCapacity}
        setUsableCapacity={setUsableCapacity}
        consumption={consumption}
        setConsumption={setConsumption}
      />
      <ChargingDetails
        volts={volts}
        setVolts={setVolts}
        duration={duration}
        setDuration={setDuration}
        currentSoC={currentSoC}
        setCurrentSoC={setCurrentSoC}
        amps={amps}
        setAmps={setAmps}
      />
      <ResultsDisplay
        socAfterCharging={socAfterCharging}
        chargingPower={chargingPower}
        chargingSpeedPercent={chargingSpeedPercent}
        chargingSpeedKm={chargingSpeedKm}
        rangePerSession={rangePerSession}
      />
      <div className="app-version">v{packageJson.version}</div>{" "}
      {/* Add version display */}
    </>
  );
}

export default App;
