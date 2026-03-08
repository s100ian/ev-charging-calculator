import { useEffect, useState } from "react";
import packageJson from "../package.json"; // Import package.json
import ChargingCost from "./components/ChargingCost";
import CostResults from "./components/CostResults";
import "./App.css";
import CarInfo from "./components/CarInfo";
import ChargingDetails from "./components/ChargingDetails";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import { useChargingResults } from "./hooks/useChargingResults";
import PwaBanner from "./components/PwaBanner";
import ResultsDisplay from "./components/ResultsDisplay";
import { getInitialCurrencySymbol } from "./utils/currency";
import {
  getInitialState,
  getInitialTextState,
  persistCalculatorState,
} from "./utils/storage";

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
  const [pricePerKwh, setPricePerKwh] = useState(() =>
    getInitialTextState("pricePerKwh", "")
  );
  const [currencySymbol, setCurrencySymbol] = useState(() =>
    getInitialCurrencySymbol()
  );

  const {
    chargingPower,
    chargingSpeedKm,
    chargingSpeedPercent,
    costPer100Km,
    displayCurrencySymbol,
    fullChargeCost,
    rangePerSession,
    sessionCost,
    socAfterCharging,
    totalRange,
  } = useChargingResults({
    amps,
    consumption,
    currencySymbol,
    currentSoC,
    duration,
    pricePerKwh,
    usableCapacity,
    volts,
  });

  // Persist inputs to localStorage
  useEffect(() => {
    persistCalculatorState({
      amps,
      consumption,
      currencySymbol,
      currentSoC,
      duration,
      pricePerKwh,
      usableCapacity,
      volts,
    });
  }, [
    usableCapacity,
    consumption,
    volts,
    duration,
    currentSoC,
    amps,
    pricePerKwh,
    currencySymbol,
  ]);

  return (
    <div className="calculator-container">
      {" "}
      {/* Wrap components in container */}
      <div className="header-container">
        <h1 style={{ marginBottom: 0 }}>
          <span className="ev-badge">⚡</span>EV Charging Calculator
        </h1>
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
      <ChargingCost
        pricePerKwh={pricePerKwh}
        setPricePerKwh={setPricePerKwh}
        currencySymbol={currencySymbol}
        setCurrencySymbol={setCurrencySymbol}
      />
      <ResultsDisplay
        socAfterCharging={socAfterCharging}
        chargingPower={chargingPower}
        chargingSpeedPercent={chargingSpeedPercent}
        chargingSpeedKm={chargingSpeedKm}
        rangePerSession={rangePerSession}
        totalRange={totalRange} // Pass totalRange prop
      />
      <CostResults
        currencySymbol={displayCurrencySymbol}
        sessionCost={sessionCost}
        fullChargeCost={fullChargeCost}
        costPer100Km={costPer100Km}
      />
      <PwaBanner />
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
