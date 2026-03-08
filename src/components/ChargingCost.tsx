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
}

const ChargingCost: React.FC<ChargingCostProps> = ({
  pricePerKwh,
  setPricePerKwh,
  currencySymbol,
  setCurrencySymbol,
}) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPricePerKwh(e.target.value);
  };

  return (
    <div className="input-section charging-cost-container">
      <h2>Charging Cost</h2>
      <div className="field-group" data-testid="price-per-kwh-group">
        <label className="field-label" htmlFor="price-per-kwh-input">
          Fixed tariff price per kWh
        </label>
        <input
          id="price-per-kwh-input"
          className="text-input"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0.25"
          value={pricePerKwh}
          onChange={handlePriceChange}
        />
      </div>
      <div className="field-group" data-testid="currency-symbol-group">
        <span className="field-label">
          Currency symbol
        </span>
        <div className="currency-button-group" role="group" aria-label="Currency symbol">
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
  );
};

export default ChargingCost;
