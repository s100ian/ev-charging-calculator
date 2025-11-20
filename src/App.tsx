import { useEffect, useMemo, useState } from "react";
import packageJson from "../package.json"; // Import package.json
import { calculateEnergyAdded } from "./utils/calculations";
import "./App.css";
import CarInfo from "./components/CarInfo";
import ChargingDetails from "./components/ChargingDetails";
import ResultsDisplay from "./components/ResultsDisplay";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

// Helper function to get initial state from localStorage or return default
const getInitialState = (key: string, defaultValue: number): number => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? parseFloat(storedValue) : defaultValue;
};

function AppContent() {
  // Car Info State - Initialize from localStorage or use defaults
  const [usableCapacity, setUsableCapacity] = useState(() =>
    getInitialState("usableCapacity", 72)
  ); // kWh
  const [consumption, setConsumption] = useState(() =>
    getInitialState("consumption", 18)
  ); // kWh/100km
  const [currentSoC, setCurrentSoC] = useState(() =>
    getInitialState("currentSoC", 50)
  ); // %

  // Charging Details State - Initialize from localStorage or use defaults
  const [volts, setVolts] = useState(() => getInitialState("volts", 230)); // V
  const [duration, setDuration] = useState(() =>
    getInitialState("duration", 8)
  ); // hours
  const [amps, setAmps] = useState(() => getInitialState("amps", 10)); // A

  // Derived values (no state updates in effects)
  const chargingPower = useMemo(() => (volts * amps) / 1000, [volts, amps]);
  const energyAddedKwh = useMemo(() => {
    return calculateEnergyAdded(usableCapacity, currentSoC, volts, amps, duration);
  }, [volts, amps, duration, usableCapacity, currentSoC]);
  const chargingSpeedPercent = useMemo(
    () => (energyAddedKwh / usableCapacity) * 100 / duration,
    [energyAddedKwh, usableCapacity, duration]
  );
  const socAfterCharging = useMemo(() => {
    const socAddedPercent = (energyAddedKwh / usableCapacity) * 100;
    return Math.min(currentSoC + socAddedPercent, 100);
  }, [currentSoC, energyAddedKwh, usableCapacity]);
  const chargingSpeedKm = useMemo(
    () => (chargingPower / consumption) * 100,
    [chargingPower, consumption]
  );
  const rangePerSession = useMemo(
    () => (energyAddedKwh / consumption) * 100,
    [energyAddedKwh, consumption]
  );
  const totalRange = useMemo(
    () => (usableCapacity / consumption) * 100,
    [usableCapacity, consumption]
  );

  // Persist inputs to localStorage
  useEffect(() => {
    localStorage.setItem("usableCapacity", usableCapacity.toString());
    localStorage.setItem("consumption", consumption.toString());
    localStorage.setItem("volts", volts.toString());
    localStorage.setItem("duration", duration.toString());
    localStorage.setItem("currentSoC", currentSoC.toString());
    localStorage.setItem("amps", amps.toString());
  }, [usableCapacity, consumption, volts, duration, currentSoC, amps]);

  return (
    <div className="calculator-container">
      {" "}
      {/* Wrap components in container */}
      <div className="header-container">
        <h1 style={{ marginBottom: 0 }}>EV Charging Calculator</h1>
        <ThemeToggle />
      </div>
      <CarInfo
        usableCapacity={usableCapacity}
        setUsableCapacity={setUsableCapacity}
        consumption={consumption}
        setConsumption={setConsumption}
        currentSoC={currentSoC} // Pass currentSoC
        setCurrentSoC={setCurrentSoC} // Pass setCurrentSoC
      />
      <ChargingDetails
        volts={volts}
        setVolts={setVolts}
        duration={duration}
        setDuration={setDuration}
        amps={amps}
        setAmps={setAmps}
      />
      <ResultsDisplay
        socAfterCharging={socAfterCharging}
        chargingPower={chargingPower}
        chargingSpeedPercent={chargingSpeedPercent}
        chargingSpeedKm={chargingSpeedKm}
        rangePerSession={rangePerSession}
        totalRange={totalRange} // Pass totalRange prop
      />
      <div className="app-version">v{packageJson.version}</div>{" "}
      {/* Add version display */}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
