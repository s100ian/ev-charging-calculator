export const getInitialState = (key: string, defaultValue: number): number => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? parseFloat(storedValue) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const getStoredNumber = (key: string): number | null => {
  try {
    const storedValue = localStorage.getItem(key);

    if (storedValue === null) {
      return null;
    }

    const parsedValue = parseFloat(storedValue);

    return Number.isFinite(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
};

export const getInitialChargingPowerKw = (defaultValue: number): number => {
  const storedChargingPowerKw = getStoredNumber("chargingPowerKw");

  if (storedChargingPowerKw !== null) {
    return storedChargingPowerKw;
  }

  const storedVolts = getStoredNumber("volts");
  const storedAmps = getStoredNumber("amps");

  if (storedVolts !== null && storedAmps !== null) {
    return (storedVolts * storedAmps) / 1000;
  }

  return defaultValue;
};

export const getInitialTextState = (key: string, defaultValue: string): string => {
  try {
    return localStorage.getItem(key) ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

interface PersistCalculatorStateOptions {
  chargingPowerKw: number;
  consumption: number;
  currencySymbol: string;
  currentSoC: number;
  departureTime: string;
  duration: number;
  pricePerKwh: string;
  targetSoC: number;
  usableCapacity: number;
}

export const persistCalculatorState = ({
  chargingPowerKw,
  consumption,
  currencySymbol,
  currentSoC,
  departureTime,
  duration,
  pricePerKwh,
  targetSoC,
  usableCapacity,
}: PersistCalculatorStateOptions): void => {
  try {
    localStorage.setItem("usableCapacity", usableCapacity.toString());
    localStorage.setItem("consumption", consumption.toString());
    localStorage.setItem("chargingPowerKw", chargingPowerKw.toString());
    localStorage.setItem("duration", duration.toString());
    localStorage.setItem("currentSoC", currentSoC.toString());
    localStorage.setItem("targetSoC", targetSoC.toString());
    localStorage.removeItem("volts");
    localStorage.removeItem("amps");

    if (pricePerKwh.trim() === "") {
      localStorage.removeItem("pricePerKwh");
    } else {
      localStorage.setItem("pricePerKwh", pricePerKwh);
    }

    if (departureTime.trim() === "") {
      localStorage.removeItem("departureTime");
    } else {
      localStorage.setItem("departureTime", departureTime);
    }

    if (currencySymbol.trim() === "") {
      localStorage.removeItem("currencySymbol");
    } else {
      localStorage.setItem("currencySymbol", currencySymbol);
    }
  } catch {
    return;
  }
};
