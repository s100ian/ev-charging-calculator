import { useMemo } from "react";
import {
  calculateCostPer100Km,
  calculateEnergyAdded,
  calculateEnergyCost,
  calculateFullChargeWallEnergy,
  calculateSessionWallEnergy,
  parseFixedTariffPricing,
} from "../utils/calculations";
import { normalizeCurrencySymbol } from "../utils/currency";

interface UseChargingResultsOptions {
  chargingPowerKw: number;
  consumption: number;
  currencySymbol: string;
  currentSoC: number;
  duration: number;
  pricePerKwh: string;
  usableCapacity: number;
}

export const useChargingResults = ({
  chargingPowerKw,
  consumption,
  currencySymbol,
  currentSoC,
  duration,
  pricePerKwh,
  usableCapacity,
}: UseChargingResultsOptions) => {
  const chargingPower = chargingPowerKw;
  const energyAddedKwh = useMemo(() => {
    return calculateEnergyAdded(usableCapacity, currentSoC, chargingPowerKw, duration);
  }, [chargingPowerKw, currentSoC, duration, usableCapacity]);
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
    return normalizeCurrencySymbol(currencySymbol.trim());
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
