import React from "react";
import {
  supportedCurrencySymbols,
  SupportedCurrencySymbol,
} from "../utils/currency";

interface ChargingCostProps {
  pricePerKwh: string;
  setPricePerKwh: (value: string) => void;
  currencySymbol: SupportedCurrencySymbol;
  setCurrencySymbol: (value: SupportedCurrencySymbol) => void;
  embedded?: boolean;
}

const ChargingCost: React.FC<ChargingCostProps> = ({
  pricePerKwh,
  setPricePerKwh,
  currencySymbol,
  setCurrencySymbol,
  embedded = false,
}) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPricePerKwh(e.target.value);
  };

  const priceLabel = `Fixed tariff (${currencySymbol}/kWh)`;

  const controls = (
    <div className="charging-cost-controls">
      <div className="field-group" data-testid="price-per-kwh-group">
        <label className="field-label" htmlFor="price-per-kwh-input">
          {priceLabel}
        </label>
        <div className="text-input-wrapper text-input-wrapper--joined">
          <input
            id="price-per-kwh-input"
            className="text-input text-input--joined"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="0.25"
            value={pricePerKwh}
            onChange={handlePriceChange}
          />
          <div
            className="currency-button-group currency-button-group--joined"
            role="group"
            aria-label="Currency symbol"
          >
            {supportedCurrencySymbols.map((option) => (
              <button
                key={option}
                type="button"
                className={`currency-button${currencySymbol === option ? " currency-button--active" : ""}`}
                aria-pressed={currencySymbol === option}
                onClick={() => setCurrencySymbol(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return controls;
  }

  return (
    <div className="input-section charging-cost-container">
      <h2>Charging Cost</h2>
      {controls}
    </div>
  );
};

export default ChargingCost;
