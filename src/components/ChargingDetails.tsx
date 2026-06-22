import React, { useState } from "react";
import ChargingCost from "./ChargingCost";
import SliderField from "./SliderField";
import { SupportedCurrencySymbol } from "../utils/currency";

// Charging power and current are two views of the same value. The app models
// single-phase AC charging at 230 V, so kW = A × 230 ÷ 1000 (and vice versa).
const SINGLE_PHASE_VOLTAGE = 230;
const MAX_CHARGING_POWER_KW = 7.4;
const MAX_CHARGING_AMPS = 32;

type ChargingPowerUnit = "kW" | "A";

const kwToAmps = (kw: number) => (kw * 1000) / SINGLE_PHASE_VOLTAGE;
const ampsToKw = (amps: number) => (amps * SINGLE_PHASE_VOLTAGE) / 1000;

const quickSetPowerOptionsKw = [2.3, 4.6, 7.4] as const;
const quickSetPowerOptionsAmps = [10, 16, 32] as const;

const getInitialUnit = (): ChargingPowerUnit => {
  try {
    return localStorage.getItem("chargingPowerUnit") === "A" ? "A" : "kW";
  } catch {
    return "kW";
  }
};

interface ChargingDetailsProps {
  chargingPowerKw: number;
  setChargingPowerKw: (value: number) => void;
  duration: number;
  setDuration: (value: number) => void;
  pricePerKwh: string;
  setPricePerKwh: (value: string) => void;
  currencySymbol: SupportedCurrencySymbol;
  setCurrencySymbol: (value: SupportedCurrencySymbol) => void;
}

const ChargingDetails: React.FC<ChargingDetailsProps> = ({
  chargingPowerKw,
  setChargingPowerKw,
  duration,
  setDuration,
  pricePerKwh,
  setPricePerKwh,
  currencySymbol,
  setCurrencySymbol,
}) => {
  const [unit, setUnit] = useState<ChargingPowerUnit>(getInitialUnit);

  const handleUnitChange = (nextUnit: ChargingPowerUnit) => {
    setUnit(nextUnit);
    try {
      localStorage.setItem("chargingPowerUnit", nextUnit);
    } catch {
      // Ignore persistence errors (e.g. private mode).
    }
  };

  const clampChargingPowerKw = (value: number) =>
    Math.min(MAX_CHARGING_POWER_KW, Math.max(0, value));
  const clampAmps = (value: number) =>
    Math.min(MAX_CHARGING_AMPS, Math.max(0, value));

  // kW is always the source of truth; amps is derived for display/editing.
  const amps = Math.round(kwToAmps(chargingPowerKw));

  const handleChargingPowerChange = (value: number) => {
    setChargingPowerKw(clampChargingPowerKw(parseFloat(value.toFixed(1))));
  };

  const handleChargingPowerDecrement = () => {
    setChargingPowerKw(clampChargingPowerKw(parseFloat((chargingPowerKw - 0.1).toFixed(1))));
  };

  const handleChargingPowerIncrement = () => {
    setChargingPowerKw(clampChargingPowerKw(parseFloat((chargingPowerKw + 0.1).toFixed(1))));
  };

  const setChargingPowerFromAmps = (value: number) => {
    setChargingPowerKw(clampChargingPowerKw(ampsToKw(clampAmps(value))));
  };

  const handleAmpsChange = (value: number) => {
    setChargingPowerFromAmps(Math.round(value));
  };

  const handleAmpsDecrement = () => {
    setChargingPowerFromAmps(amps - 1);
  };

  const handleAmpsIncrement = () => {
    setChargingPowerFromAmps(amps + 1);
  };

  const handleDurationChange = (value: number) => {
    setDuration(value);
  };

  const handleDurationDecrement = () => {
    setDuration(Math.max(1, parseFloat((duration - 0.1).toFixed(1))));
  };

  const handleDurationIncrement = () => {
    setDuration(Math.min(50, parseFloat((duration + 0.1).toFixed(1))));
  };

  const powerKwDisplay = (
    <>
      {`${chargingPowerKw.toFixed(1)} kW`}
      <span className="slider-value-hint">≈ {amps} A</span>
    </>
  );

  const ampsDisplay = (
    <>
      {`${amps} A`}
      <span className="slider-value-hint">≈ {chargingPowerKw.toFixed(1)} kW</span>
    </>
  );

  const unitToggle = (
    <div
      className="unit-toggle"
      role="group"
      aria-label="Charging power unit"
      data-testid="charging-power-unit-toggle"
    >
      {(["kW", "A"] as const).map((option) => (
        <button
          key={option}
          type="button"
          className={`unit-toggle-button${unit === option ? " unit-toggle-button--active" : ""}`}
          aria-pressed={unit === option}
          onClick={() => handleUnitChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );

  const chargingPowerSliderProps =
    unit === "A"
      ? {
          label: "Charging current",
          value: amps,
          displayValue: ampsDisplay,
          min: 0,
          max: MAX_CHARGING_AMPS,
          step: 1,
          onSliderChange: handleAmpsChange,
          onDecrement: handleAmpsDecrement,
          onIncrement: handleAmpsIncrement,
          quickSetLabel: "Quick current",
          quickSetAriaLabel: "Charging current quick set",
          quickSetOptions: quickSetPowerOptionsAmps.map((option) => ({
            label: `${option}`,
            value: option,
          })),
        }
      : {
          label: "Charging power",
          value: chargingPowerKw,
          displayValue: powerKwDisplay,
          min: 0,
          max: MAX_CHARGING_POWER_KW,
          step: 0.1,
          onSliderChange: handleChargingPowerChange,
          onDecrement: handleChargingPowerDecrement,
          onIncrement: handleChargingPowerIncrement,
          quickSetLabel: "Quick power",
          quickSetAriaLabel: "Charging power quick set",
          quickSetOptions: quickSetPowerOptionsKw.map((option) => ({
            label: option.toFixed(1),
            value: option,
          })),
        };

  return (
    <div className="input-section charging-details-container">
      <h2>Charging Details</h2>
      <SliderField
        groupTestId="charging-power-group"
        headerAction={unitToggle}
        sliderId="charging-power-slider"
        sliderTestId="charging-power-slider"
        quickSetGroupTestId="charging-power-presets-group"
        {...chargingPowerSliderProps}
      />
      <SliderField
        groupTestId="duration-group"
        label="Charging duration (hours)"
        value={duration}
        displayValue={duration.toFixed(1)}
        sliderId="duration-slider"
        sliderTestId="duration-slider"
        min={1}
        max={50}
        step={0.1}
        onSliderChange={handleDurationChange}
        onDecrement={handleDurationDecrement}
        onIncrement={handleDurationIncrement}
      />
      <ChargingCost
        pricePerKwh={pricePerKwh}
        setPricePerKwh={setPricePerKwh}
        currencySymbol={currencySymbol}
        setCurrencySymbol={setCurrencySymbol}
        embedded
      />
    </div>
  );
};

export default ChargingDetails;
