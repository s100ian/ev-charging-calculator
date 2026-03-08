import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChargingCost from "./ChargingCost";

describe("ChargingCost", () => {
  it("renders the current price and the available currency buttons", () => {
    render(
      <ChargingCost
        pricePerKwh="0.25"
        setPricePerKwh={vi.fn()}
        currencySymbol="€"
        setCurrencySymbol={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Fixed tariff (€/kWh)")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0.25")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "€" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "$" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "£" })).toBeInTheDocument();
  });

  it("renders the currency selector inside the price input group", () => {
    render(
      <ChargingCost
        pricePerKwh="0.25"
        setPricePerKwh={vi.fn()}
        currencySymbol="£"
        setCurrencySymbol={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Fixed tariff (£/kWh)")).toBeInTheDocument();
    expect(
      within(screen.getByTestId("price-per-kwh-group")).getByRole("group", {
        name: "Currency symbol",
      })
    ).toBeInTheDocument();
  });

  it("calls setPricePerKwh when the price changes", () => {
    const setPricePerKwh = vi.fn();

    render(
      <ChargingCost
        pricePerKwh=""
        setPricePerKwh={setPricePerKwh}
        currencySymbol="€"
        setCurrencySymbol={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText("Fixed tariff (€/kWh)"), {
      target: { value: "0.31" },
    });

    expect(setPricePerKwh).toHaveBeenCalledWith("0.31");
  });

  it("calls setCurrencySymbol when a currency button is clicked", () => {
    const setCurrencySymbol = vi.fn();

    render(
      <ChargingCost
        pricePerKwh="0.25"
        setPricePerKwh={vi.fn()}
        currencySymbol="€"
        setCurrencySymbol={setCurrencySymbol}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "£" }));

    expect(setCurrencySymbol).toHaveBeenCalledWith("£");
  });
});
