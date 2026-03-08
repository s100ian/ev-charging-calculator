import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChargingDetails from "./ChargingDetails";

const defaultProps = {
  chargingPowerKw: 2.3,
  setChargingPowerKw: vi.fn(),
  duration: 8.0,
  setDuration: vi.fn(),
  pricePerKwh: "0.25",
  setPricePerKwh: vi.fn(),
  currencySymbol: "€" as const,
  setCurrencySymbol: vi.fn(),
};

describe("ChargingDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Charging Details heading", () => {
    render(<ChargingDetails {...defaultProps} />);
    expect(screen.getByText("Charging Details")).toBeInTheDocument();
  });

  it("displays current charging power value", () => {
    render(<ChargingDetails {...defaultProps} />);
    expect(screen.getByTestId("charging-power-group")).toHaveTextContent("2.3");
  });

  it("displays current duration value with one decimal", () => {
    render(<ChargingDetails {...defaultProps} />);
    expect(screen.getByTestId("duration-group")).toHaveTextContent("8.0");
  });

  it("renders charging cost inputs inside Charging Details", () => {
    render(<ChargingDetails {...defaultProps} />);
    expect(screen.getByLabelText("Fixed tariff (€/kWh)")).toHaveValue(0.25);
    expect(screen.getByRole("button", { name: "€" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("calls setChargingPowerKw when the slider changes", () => {
    const setChargingPowerKw = vi.fn();

    render(<ChargingDetails {...defaultProps} setChargingPowerKw={setChargingPowerKw} />);

    fireEvent.change(screen.getByTestId("charging-power-slider"), {
      target: { value: "7.4" },
    });

    expect(setChargingPowerKw).toHaveBeenCalledWith(7.4);
  });

  it("renders the charging power quick-set buttons", () => {
    render(<ChargingDetails {...defaultProps} />);

    expect(screen.getByRole("button", { name: "2.3" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "4.6" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "7.4" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "11.0" })).not.toBeInTheDocument();
  });

  it("calls setChargingPowerKw when a quick-set button is clicked", () => {
    const setChargingPowerKw = vi.fn();

    render(<ChargingDetails {...defaultProps} setChargingPowerKw={setChargingPowerKw} />);

    fireEvent.click(screen.getByRole("button", { name: "7.4" }));

    expect(setChargingPowerKw).toHaveBeenCalledWith(7.4);
  });

  it("charging power + button clamps at maximum (7.4)", () => {
    const setChargingPowerKw = vi.fn();

    render(
      <ChargingDetails {...defaultProps} chargingPowerKw={7.4} setChargingPowerKw={setChargingPowerKw} />
    );

    const plusButton = within(screen.getByTestId("charging-power-group")).getByText("+");
    fireEvent.click(plusButton);

    expect(setChargingPowerKw).toHaveBeenCalledWith(7.4);
  });

  // Duration (step 0.1, toFixed(1))
  it("duration + button calls setDuration with value + 0.1", () => {
    const setDuration = vi.fn();
    render(<ChargingDetails {...defaultProps} setDuration={setDuration} />);
    const plusButton = within(screen.getByTestId("duration-group")).getByText("+");
    fireEvent.click(plusButton);
    expect(setDuration).toHaveBeenCalledWith(8.1);
  });

  it("duration - button calls setDuration with value - 0.1", () => {
    const setDuration = vi.fn();
    render(<ChargingDetails {...defaultProps} setDuration={setDuration} />);
    const minusButton = within(screen.getByTestId("duration-group")).getByText("-");
    fireEvent.click(minusButton);
    expect(setDuration).toHaveBeenCalledWith(7.9);
  });

  it("duration - button clamps at minimum (1.0)", () => {
    const setDuration = vi.fn();
    render(<ChargingDetails {...defaultProps} duration={1.0} setDuration={setDuration} />);
    const minusButton = within(screen.getByTestId("duration-group")).getByText("-");
    fireEvent.click(minusButton);
    expect(setDuration).toHaveBeenCalledWith(1.0);
  });

  it("duration + button clamps at maximum (50.0)", () => {
    const setDuration = vi.fn();
    render(<ChargingDetails {...defaultProps} duration={50.0} setDuration={setDuration} />);
    const plusButton = within(screen.getByTestId("duration-group")).getByText("+");
    fireEvent.click(plusButton);
    expect(setDuration).toHaveBeenCalledWith(50.0);
  });

  it("duration slider onChange calls setDuration with parsed float", () => {
    const setDuration = vi.fn();
    render(<ChargingDetails {...defaultProps} setDuration={setDuration} />);
    const slider = screen.getByTestId("duration-slider");
    fireEvent.change(slider, { target: { value: "12.5" } });
    expect(setDuration).toHaveBeenCalledWith(12.5);
  });

  it("calls setPricePerKwh when the price changes", () => {
    const setPricePerKwh = vi.fn();

    render(
      <ChargingDetails {...defaultProps} pricePerKwh="" setPricePerKwh={setPricePerKwh} />
    );

    fireEvent.change(screen.getByLabelText("Fixed tariff (€/kWh)"), {
      target: { value: "0.31" },
    });

    expect(setPricePerKwh).toHaveBeenCalledWith("0.31");
  });

  it("calls setCurrencySymbol when a currency button is clicked", () => {
    const setCurrencySymbol = vi.fn();

    render(
      <ChargingDetails
        {...defaultProps}
        currencySymbol="€"
        setCurrencySymbol={setCurrencySymbol}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "£" }));

    expect(setCurrencySymbol).toHaveBeenCalledWith("£");
  });
});
