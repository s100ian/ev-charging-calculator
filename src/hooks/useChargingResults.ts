import { useMemo } from "react";
import {
  calculateCostPer100Km,
  calculateEnergyAdded,
  calculateEnergyCost,
  calculateFullChargeWallEnergy,
  calculateSessionWallEnergy,
  parseFixedTariffPricing,
} from "../utils/calculations";
import {
  guessCurrencySymbol,
  normalizeCurrencySymbol,
} from "../utils/currency";

interface UseChargingResultsOptions {
  amps: number;
  consumption: number;
  currencySymbol: string;
  currentSoC: number;
  duration: number;
  pricePerKwh: string;
  usableCapacity: number;
  volts: number;
}

export const useChargingResults = ({
  amps,
  consumption,
  currencySymbol,
  currentSoC,
  duration,
  pricePerKwh,
  usableCapacity,
  volts,
}: UseChargingResultsOptions) => {
  const chargingPower = (volts * amps) / 1000;
  const energyAddedKwh = useMemo(() => {
    return calculateEnergyAdded(usableCapacity, currentSoC, volts, amps, duration);
  }, [amps, currentSoC, duration, usableCapacity, volts]);
  const chargingSpeedPercent = (energyAddedKwh / usableCapacity) * 100 / duration;
  const socAfterCharging = Math.min(
    currentSoC + (energyAddedKwh / usableCapacity) * 100,
    100
  );
  const chargingSpeedKm = (chargingPower / consumption) * 100;
  const rangePerSession = (energyAddedKwh / consumption) * 100;
  const totalRange = (usableCapacity / consumption) * 100;
  const fixedTariffPricing = useMemo(() => {
    return parseFixedTariffPricing(pricePerKwh);
  }, [pricePerKwh]);
  const displayCurrencySymbol = useMemo(() => {
    return normalizeCurrencySymbol(currencySymbol.trim() || guessCurrencySymbol());
  }, [currencySymbol]);
  const sessionWallEnergyKwh = useMemo(() => {
    return calculateSessionWallEnergy(energyAddedKwh);
  }, [energyAddedKwh]);
  const fullChargeWallEnergyKwh = useMemo(() => {
    return calculateFullChargeWallEnergy(usableCapacity, currentSoC);
  }, [currentSoC, usableCapacity]);
  const sessionCost = useMemo(() => {
    return fixedTariffPricing
      ? calculateEnergyCost(sessionWallEnergyKwh, fixedTariffPricing)
      : null;
  }, [fixedTariffPricing, sessionWallEnergyKwh]);
  const fullChargeCost = useMemo(() => {
    return fixedTariffPricing
      ? calculateEnergyCost(fullChargeWallEnergyKwh, fixedTariffPricing)
      : null;
  }, [fixedTariffPricing, fullChargeWallEnergyKwh]);
  const costPer100Km = useMemo(() => {
    return fixedTariffPricing
      ? calculateCostPer100Km(consumption, fixedTariffPricing)
      : null;
  }, [consumption, fixedTariffPricing]);

  return {
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
  };
};
