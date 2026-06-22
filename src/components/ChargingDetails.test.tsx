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
    localStorage.clear();
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

  // Amps / kW unit toggle
  it("defaults to kW mode and shows the equivalent amperage as a hint", () => {
    render(<ChargingDetails {...defaultProps} chargingPowerKw={2.3} />);

    const group = screen.getByTestId("charging-power-group");
    expect(group).toHaveTextContent("2.3 kW");
    expect(group).toHaveTextContent("10 A"); // 2.3 kW ÷ 230 V
    expect(
      screen.getByRole("button", { name: "kW" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("switches the slider to amps when the A toggle is clicked", () => {
    render(<ChargingDetails {...defaultProps} chargingPowerKw={3.68} />);

    fireEvent.click(screen.getByRole("button", { name: "A" }));

    const group = screen.getByTestId("charging-power-group");
    expect(group).toHaveTextContent("16 A"); // 3.68 kW ÷ 230 V
    expect(group).toHaveTextContent("3.7 kW");
    expect(screen.getByTestId("charging-power-slider")).toHaveValue("16");
  });

  it("converts amps to kW when the amps slider changes", () => {
    const setChargingPowerKw = vi.fn();

    render(
      <ChargingDetails {...defaultProps} setChargingPowerKw={setChargingPowerKw} />
    );

    fireEvent.click(screen.getByRole("button", { name: "A" }));
    fireEvent.change(screen.getByTestId("charging-power-slider"), {
      target: { value: "16" },
    });

    expect(setChargingPowerKw).toHaveBeenCalledWith(3.68); // 16 A × 230 V
  });

  it("renders amp quick-set buttons in amps mode and converts on click", () => {
    const setChargingPowerKw = vi.fn();

    render(
      <ChargingDetails {...defaultProps} setChargingPowerKw={setChargingPowerKw} />
    );

    fireEvent.click(screen.getByRole("button", { name: "A" }));
    fireEvent.click(screen.getByRole("button", { name: "32" }));

    expect(setChargingPowerKw).toHaveBeenCalledWith(7.36); // 32 A × 230 V
  });

  it("amps + button increments the current by 1 A", () => {
    const setChargingPowerKw = vi.fn();

    render(
      <ChargingDetails
        {...defaultProps}
        chargingPowerKw={3.68}
        setChargingPowerKw={setChargingPowerKw}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "A" }));
    const plusButton = within(
      screen.getByTestId("charging-power-group")
    ).getByText("+");
    fireEvent.click(plusButton);

    expect(setChargingPowerKw).toHaveBeenCalledWith(3.91); // 17 A × 230 V
  });

  it("persists the selected unit to localStorage and restores it", () => {
    const { unmount } = render(<ChargingDetails {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "A" }));
    expect(localStorage.getItem("chargingPowerUnit")).toBe("A");

    unmount();
    render(<ChargingDetails {...defaultProps} />);

    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
