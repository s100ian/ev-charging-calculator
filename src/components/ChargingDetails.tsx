import React from "react";
import ChargingCost from "./ChargingCost";
import SliderField from "./SliderField";
import { SupportedCurrencySymbol } from "../utils/currency";

const quickSetChargingPowerOptions = [2.3, 4.6, 7.4] as const;

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
  const clampChargingPowerKw = (value: number) => {
    return Math.min(7.4, Math.max(0, value));
  };

  const handleChargingPowerChange = (value: number) => {
    setChargingPowerKw(clampChargingPowerKw(parseFloat(value.toFixed(1))));
  };

  const handleChargingPowerDecrement = () => {
    setChargingPowerKw(clampChargingPowerKw(parseFloat((chargingPowerKw - 0.1).toFixed(1))));
  };

  const handleChargingPowerIncrement = () => {
    setChargingPowerKw(clampChargingPowerKw(parseFloat((chargingPowerKw + 0.1).toFixed(1))));
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

  return (
    <div className="input-section charging-details-container">
      <h2>Charging Details</h2>
      <SliderField
        groupTestId="charging-power-group"
        label="Charging power (kW)"
        value={chargingPowerKw}
        displayValue={chargingPowerKw.toFixed(1)}
        sliderId="charging-power-slider"
        sliderTestId="charging-power-slider"
        min={0}
        max={7.4}
        step={0.1}
        onSliderChange={handleChargingPowerChange}
        onDecrement={handleChargingPowerDecrement}
        onIncrement={handleChargingPowerIncrement}
        quickSetGroupTestId="charging-power-presets-group"
        quickSetLabel="Quick power"
        quickSetAriaLabel="Charging power quick set"
        quickSetOptions={quickSetChargingPowerOptions.map((option) => ({
          label: option.toFixed(1),
          value: option,
        }))}
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
