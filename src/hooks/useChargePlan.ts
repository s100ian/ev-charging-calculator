import { useMemo } from "react";
import {
  calculateChargePlan,
  calculateEnergyCost,
  parseFixedTariffPricing,
} from "../utils/calculations";

interface UseChargePlanOptions {
  chargingPowerKw: number;
  consumption: number;
  currentSoC: number;
  departureTime: string;
  pricePerKwh: string;
  targetSoC: number;
  usableCapacity: number;
}

const getAvailableDurationHours = (departureTime: string): number | null => {
  const normalizedDepartureTime = departureTime.trim();

  if (normalizedDepartureTime === "") {
    return null;
  }

  const [hoursValue, minutesValue] = normalizedDepartureTime.split(":");
  const hours = Number(hoursValue);
  const minutes = Number(minutesValue);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  const now = new Date();
  const departureDate = new Date(now);

  departureDate.setHours(hours, minutes, 0, 0);

  if (departureDate.getTime() <= now.getTime()) {
    departureDate.setDate(departureDate.getDate() + 1);
  }

  return (departureDate.getTime() - now.getTime()) / (1000 * 60 * 60);
};

const getReadyAtLabel = (timeToTargetHours: number, isTargetReachable: boolean) => {
  if (!isTargetReachable || !Number.isFinite(timeToTargetHours)) {
    return null;
  }

  const readyAt = new Date(Date.now() + timeToTargetHours * 60 * 60 * 1000);

  return `${String(readyAt.getHours()).padStart(2, "0")}:${String(
    readyAt.getMinutes()
  ).padStart(2, "0")}`;
};

const calculateRangeAtSoC = (
  usableCapacity: number,
  consumption: number,
  soc: number
) => {
  if (consumption <= 0) {
    return null;
  }

  return ((usableCapacity * soc) / 100 / consumption) * 100;
};

const getPlanningSummary = (
  departureTime: string,
  isReachableByDeparture: boolean | null,
  socAtDeparturePercent: number | null,
  socShortfallPercent: number | null
) => {
  if (departureTime.trim() === "") {
    return null;
  }

  if (isReachableByDeparture === true) {
    return "Target should be ready before departure.";
  }

  if (
    isReachableByDeparture === false &&
    socAtDeparturePercent !== null &&
    socShortfallPercent !== null
  ) {
    return `At departure, you'll reach about ${socAtDeparturePercent.toFixed(0)}% and remain ${socShortfallPercent.toFixed(0)}% short of your target.`;
  }

  return null;
};

export const useChargePlan = ({
  chargingPowerKw,
  consumption,
  currentSoC,
  departureTime,
  pricePerKwh,
  targetSoC,
  usableCapacity,
}: UseChargePlanOptions) => {
  const normalizedTargetSoC = Math.min(100, Math.max(currentSoC, targetSoC));
  const availableDurationHours = useMemo(() => {
    return getAvailableDurationHours(departureTime);
  }, [departureTime]);
  const chargePlan = useMemo(() => {
    return calculateChargePlan({
      chargingPowerKw,
      availableDurationHours,
      currentSoC,
      targetSoC: normalizedTargetSoC,
      usableCapacity,
    });
  }, [
    chargingPowerKw,
    availableDurationHours,
    currentSoC,
    normalizedTargetSoC,
    usableCapacity,
  ]);
  const rangeAtTargetKm = useMemo(() => {
    return calculateRangeAtSoC(usableCapacity, consumption, chargePlan.targetSoC);
  }, [chargePlan.targetSoC, consumption, usableCapacity]);
  const readyAtLabel = useMemo(() => {
    return getReadyAtLabel(chargePlan.timeToTargetHours, chargePlan.isTargetReachable);
  }, [chargePlan.isTargetReachable, chargePlan.timeToTargetHours]);
  const fixedTariffPricing = useMemo(() => {
    return parseFixedTariffPricing(pricePerKwh);
  }, [pricePerKwh]);
  const targetCost = useMemo(() => {
    return fixedTariffPricing
      ? calculateEnergyCost(chargePlan.wallEnergyToTargetKwh, fixedTariffPricing)
      : null;
  }, [chargePlan.wallEnergyToTargetKwh, fixedTariffPricing]);
  const planningSummary = useMemo(() => {
    return getPlanningSummary(
      departureTime,
      chargePlan.isReachableByDeparture,
      chargePlan.socAtDeparturePercent,
      chargePlan.socShortfallPercent
    );
  }, [
    departureTime,
    chargePlan.isReachableByDeparture,
    chargePlan.socAtDeparturePercent,
    chargePlan.socShortfallPercent,
  ]);

  return {
    availableDurationHours,
    chargePlan,
    normalizedTargetSoC,
    planningSummary,
    rangeAtTargetKm,
    readyAtLabel,
    targetCost,
  };
};
