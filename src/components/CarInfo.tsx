import React from "react";
import SliderField from "./SliderField";

interface CarInfoProps {
  usableCapacity: number;
  setUsableCapacity: (value: number) => void;
  consumption: number;
  setConsumption: (value: number) => void;
  currentSoC: number;
  setCurrentSoC: (value: number) => void;
}

const CarInfo: React.FC<CarInfoProps> = ({
  usableCapacity,
  setUsableCapacity,
  consumption,
  setConsumption,
  currentSoC,
  setCurrentSoC,
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
    <div className="input-section car-info-container">
      <h2>Car Information</h2>
      <SliderField
        groupTestId="usable-capacity-group"
        label="Usable battery capacity (kWh)"
        value={usableCapacity}
        sliderId="usable-capacity-slider"
        sliderTestId="usable-capacity-slider"
        min={5}
        max={200}
        onSliderChange={setUsableCapacity}
        onDecrement={() => handleDecrement(setUsableCapacity, usableCapacity, 5)}
        onIncrement={() => handleIncrement(setUsableCapacity, usableCapacity, 200)}
      />
      <SliderField
        groupTestId="consumption-group"
        label="Consumption (kWh/100km)"
        value={consumption}
        sliderId="consumption-slider"
        sliderTestId="consumption-slider"
        min={5}
        max={50}
        onSliderChange={setConsumption}
        onDecrement={() => handleDecrement(setConsumption, consumption, 5)}
        onIncrement={() => handleIncrement(setConsumption, consumption, 50)}
      />
      <SliderField
        groupTestId="current-soc-group"
        label="Current SoC (%)"
        value={currentSoC}
        sliderId="current-soc-slider"
        sliderTestId="current-soc-slider"
        min={0}
        max={100}
        onSliderChange={setCurrentSoC}
        onDecrement={() => handleDecrement(setCurrentSoC, currentSoC, 0)}
        onIncrement={() => handleIncrement(setCurrentSoC, currentSoC, 100)}
      />
    </div>
  );
};

export default CarInfo;
