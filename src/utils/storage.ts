export const getInitialState = (key: string, defaultValue: number): number => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? parseFloat(storedValue) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const getInitialTextState = (key: string, defaultValue: string): string => {
  try {
    return localStorage.getItem(key) ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

interface PersistCalculatorStateOptions {
  amps: number;
  consumption: number;
  currencySymbol: string;
  currentSoC: number;
  duration: number;
  pricePerKwh: string;
  usableCapacity: number;
  volts: number;
}

export const persistCalculatorState = ({
  amps,
  consumption,
  currencySymbol,
  currentSoC,
  duration,
  pricePerKwh,
  usableCapacity,
  volts,
}: PersistCalculatorStateOptions): void => {
  try {
    localStorage.setItem("usableCapacity", usableCapacity.toString());
    localStorage.setItem("consumption", consumption.toString());
    localStorage.setItem("volts", volts.toString());
    localStorage.setItem("duration", duration.toString());
    localStorage.setItem("currentSoC", currentSoC.toString());
    localStorage.setItem("amps", amps.toString());

    if (pricePerKwh.trim() === "") {
      localStorage.removeItem("pricePerKwh");
    } else {
      localStorage.setItem("pricePerKwh", pricePerKwh);
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
