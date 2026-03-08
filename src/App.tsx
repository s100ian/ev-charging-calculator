import { useEffect, useState } from "react";
import packageJson from "../package.json"; // Import package.json
import ChargePlanning from "./components/ChargePlanning";
import CostResults from "./components/CostResults";
import "./App.css";
import CarInfo from "./components/CarInfo";
import ChargingDetails from "./components/ChargingDetails";
import PlanningResults from "./components/PlanningResults";
import ResultsDisplay from "./components/ResultsDisplay";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import { useChargePlan } from "./hooks/useChargePlan";
import { useChargingResults } from "./hooks/useChargingResults";
import PwaBanner from "./components/PwaBanner";
import {
  getInitialCurrencySymbol,
} from "./utils/currency";
import {
  getInitialChargingPowerKw,
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
  const [chargingPowerKw, setChargingPowerKw] = useState(() =>
    getInitialChargingPowerKw(2.3)
  );
  const [duration, setDuration] = useState(() =>
    getInitialState("duration", 8)
  ); // hours
  const [targetSoC, setTargetSoC] = useState(() =>
    Math.min(100, Math.max(0, getInitialState("targetSoC", 80)))
  );
  const [departureTime, setDepartureTime] = useState(() =>
    getInitialTextState("departureTime", "")
  );
  const [pricePerKwh, setPricePerKwh] = useState(() =>
    getInitialTextState("pricePerKwh", "")
  );
  const [currencySymbol, setCurrencySymbol] = useState(() =>
    getInitialCurrencySymbol()
  );
  const { chargePlan, planningSummary, readyAtLabel, targetCost, rangeAtTargetKm } =
    useChargePlan({
      chargingPowerKw,
      consumption,
      currentSoC,
      departureTime,
      pricePerKwh,
      targetSoC,
      usableCapacity,
    });

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
    chargingPowerKw,
    consumption,
    currencySymbol,
    currentSoC,
    duration,
    pricePerKwh,
    usableCapacity,
  });

  // Persist inputs to localStorage
  useEffect(() => {
    persistCalculatorState({
      chargingPowerKw,
      consumption,
      currencySymbol,
      currentSoC,
      departureTime,
      duration,
      pricePerKwh,
      targetSoC,
      usableCapacity,
    });
  }, [
    usableCapacity,
    consumption,
    chargingPowerKw,
    duration,
    currentSoC,
    pricePerKwh,
    currencySymbol,
    targetSoC,
    departureTime,
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
        chargingPowerKw={chargingPowerKw}
        setChargingPowerKw={setChargingPowerKw}
        duration={duration}
        setDuration={setDuration}
        pricePerKwh={pricePerKwh}
        setPricePerKwh={setPricePerKwh}
        currencySymbol={currencySymbol}
        setCurrencySymbol={setCurrencySymbol}
      />
      <ChargePlanning
        currentSoC={currentSoC}
        targetSoC={chargePlan.targetSoC}
        setTargetSoC={setTargetSoC}
        departureTime={departureTime}
        setDepartureTime={setDepartureTime}
      />
      <ResultsDisplay
        socAfterCharging={socAfterCharging}
        chargingPower={chargingPower}
        chargingSpeedPercent={chargingSpeedPercent}
        chargingSpeedKm={chargingSpeedKm}
        rangePerSession={rangePerSession}
        totalRange={totalRange} // Pass totalRange prop
      />
      <PlanningResults
        batteryEnergyToTargetKwh={chargePlan.batteryEnergyToTargetKwh}
        wallEnergyToTargetKwh={chargePlan.wallEnergyToTargetKwh}
        timeToTargetHours={chargePlan.timeToTargetHours}
        readyAtLabel={readyAtLabel}
        rangeAtTargetKm={rangeAtTargetKm}
        planningSummary={planningSummary}
        isTargetReachable={chargePlan.isTargetReachable}
        departureTime={departureTime}
        isReachableByDeparture={chargePlan.isReachableByDeparture}
        socAtDeparturePercent={chargePlan.socAtDeparturePercent}
        socShortfallPercent={chargePlan.socShortfallPercent}
      />
      <CostResults
        currencySymbol={displayCurrencySymbol}
        sessionCost={sessionCost}
        targetCost={targetCost}
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
