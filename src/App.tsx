import { useEffect, useState } from "react";
import "./App.css";
import CarInfo from "./components/CarInfo";
import ChargingDetails from "./components/ChargingDetails";
import ResultsDisplay from "./components/ResultsDisplay";

function App() {
  // Car Info State
  const [usableCapacity, setUsableCapacity] = useState(72); // kWh
  const [consumption, setConsumption] = useState(18); // kWh/100km

  // Charging Details State
  const [volts, setVolts] = useState(230); // V
  const [duration, setDuration] = useState(6.5); // hours
  const [currentSoC, setCurrentSoC] = useState(50); // %
  const [amps, setAmps] = useState(10); // A

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
    </>
  );
}

export default App;
