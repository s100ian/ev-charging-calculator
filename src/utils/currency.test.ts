import { afterEach, describe, expect, it, vi } from "vitest";
import { getInitialCurrencySymbol, normalizeCurrencySymbol } from "./currency";

describe("currency utils", () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("defaults to euro when no stored currency exists", () => {
    expect(getInitialCurrencySymbol()).toBe("€");
  });

  it("uses a stored supported currency symbol", () => {
    localStorage.setItem("currencySymbol", "£");

    expect(getInitialCurrencySymbol()).toBe("£");
  });

  it("falls back to euro for unsupported stored currency symbols", () => {
    localStorage.setItem("currencySymbol", "CHF");

    expect(getInitialCurrencySymbol()).toBe("€");
  });

  it("falls back to euro when localStorage access fails", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });

    expect(getInitialCurrencySymbol()).toBe("€");
  });

  it("normalizes empty values to euro", () => {
    expect(normalizeCurrencySymbol("")).toBe("€");
  });
});
