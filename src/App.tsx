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
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? parseFloat(storedValue) : defaultValue;
  } catch {
    return defaultValue;
  }
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
  const chargingPower = (volts * amps) / 1000;
  const energyAddedKwh = useMemo(() => {
    return calculateEnergyAdded(usableCapacity, currentSoC, volts, amps, duration);
  }, [volts, amps, duration, usableCapacity, currentSoC]);
  const chargingSpeedPercent = (energyAddedKwh / usableCapacity) * 100 / duration;
  const socAfterCharging = Math.min(currentSoC + (energyAddedKwh / usableCapacity) * 100, 100);
  const chargingSpeedKm = (chargingPower / consumption) * 100;
  const rangePerSession = (energyAddedKwh / consumption) * 100;
  const totalRange = (usableCapacity / consumption) * 100;

  // Persist inputs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("usableCapacity", usableCapacity.toString());
      localStorage.setItem("consumption", consumption.toString());
      localStorage.setItem("volts", volts.toString());
      localStorage.setItem("duration", duration.toString());
      localStorage.setItem("currentSoC", currentSoC.toString());
      localStorage.setItem("amps", amps.toString());
    } catch {
      // localStorage unavailable (incognito, quota exceeded, disabled)
    }
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
