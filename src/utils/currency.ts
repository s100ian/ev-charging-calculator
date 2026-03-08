const currencySymbolsByRegion: Record<string, string> = {
  AT: "€",
  AU: "$",
  BE: "€",
  BG: "€",
  BR: "R$",
  CA: "$",
  CH: "CHF",
  CY: "€",
  CZ: "Kč",
  DE: "€",
  DK: "kr",
  EE: "€",
  ES: "€",
  FI: "€",
  FR: "€",
  GB: "£",
  GR: "€",
  HR: "€",
  HU: "Ft",
  IE: "€",
  IN: "₹",
  IT: "€",
  JP: "¥",
  KR: "₩",
  LT: "€",
  LU: "€",
  LV: "€",
  MT: "€",
  MX: "$",
  NL: "€",
  NO: "kr",
  NZ: "$",
  PL: "zł",
  PT: "€",
  RO: "lei",
  SE: "kr",
  SI: "€",
  SK: "€",
  TR: "₺",
  UA: "₴",
  US: "$",
};

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

const getNavigatorRegions = (): string[] => {
  if (typeof navigator === "undefined") {
    return [];
  }

  const locales = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  return locales
    .map((locale) => locale.match(/[-_]([A-Za-z]{2})$/)?.[1]?.toUpperCase())
    .filter((region): region is string => Boolean(region));
};

export const guessCurrencySymbol = (): SupportedCurrencySymbol => {
  for (const region of getNavigatorRegions()) {
    if (currencySymbolsByRegion[region]) {
      return normalizeCurrencySymbol(currencySymbolsByRegion[region]);
    }
  }

  return "€";
};

export const getInitialCurrencySymbol = (): SupportedCurrencySymbol => {
  const guessedCurrencySymbol = guessCurrencySymbol();

  try {
    const storedValue = localStorage.getItem("currencySymbol");

    if (!storedValue) {
      return guessedCurrencySymbol;
    }

    if (storedValue === "лв" && getNavigatorRegions().includes("BG")) {
      return "€";
    }

    return normalizeCurrencySymbol(storedValue);
  } catch {
    return guessedCurrencySymbol;
  }
};
