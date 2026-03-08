export const supportedCurrencySymbols = ["€", "$", "£"] as const;

export type SupportedCurrencySymbol = (typeof supportedCurrencySymbols)[number];

export const normalizeCurrencySymbol = (
  value: string
): SupportedCurrencySymbol => {
  if (supportedCurrencySymbols.includes(value as SupportedCurrencySymbol)) {
    return value as SupportedCurrencySymbol;
  }

  return "€";
};

export const getInitialCurrencySymbol = (): SupportedCurrencySymbol => {
  try {
    const storedValue = localStorage.getItem("currencySymbol");

    if (!storedValue) {
      return "€";
    }

    return normalizeCurrencySymbol(storedValue);
  } catch {
    return "€";
  }
};
