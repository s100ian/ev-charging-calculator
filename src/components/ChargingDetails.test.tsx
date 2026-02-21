import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChargingDetails from "./ChargingDetails";

const defaultProps = {
  volts: 230,
  setVolts: vi.fn(),
  duration: 8.0,
  setDuration: vi.fn(),
  amps: 10,
  setAmps: vi.fn(),
};

describe("ChargingDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Charging Details heading", () => {
    render(<ChargingDetails {...defaultProps} />);
    expect(screen.getByText("Charging Details")).toBeInTheDocument();
  });

  it("displays current volts value", () => {
    render(<ChargingDetails {...defaultProps} />);
    expect(screen.getByTestId("volts-group")).toHaveTextContent("230");
  });

  it("displays current amps value", () => {
    render(<ChargingDetails {...defaultProps} />);
    expect(screen.getByTestId("amps-group")).toHaveTextContent("10");
  });

  it("displays current duration value with one decimal", () => {
    render(<ChargingDetails {...defaultProps} />);
    expect(screen.getByTestId("duration-group")).toHaveTextContent("8.0");
  });

  // Volts
  it("volts + button calls setVolts with value + 1", () => {
    const setVolts = vi.fn();
    render(<ChargingDetails {...defaultProps} setVolts={setVolts} />);
    const plusButton = within(screen.getByTestId("volts-group")).getByText("+");
    fireEvent.click(plusButton);
    expect(setVolts).toHaveBeenCalledWith(231);
  });

  it("volts - button calls setVolts with value - 1", () => {
    const setVolts = vi.fn();
    render(<ChargingDetails {...defaultProps} setVolts={setVolts} />);
    const minusButton = within(screen.getByTestId("volts-group")).getByText("-");
    fireEvent.click(minusButton);
    expect(setVolts).toHaveBeenCalledWith(229);
  });

  it("volts - button clamps at minimum (110)", () => {
    const setVolts = vi.fn();
    render(<ChargingDetails {...defaultProps} volts={110} setVolts={setVolts} />);
    const minusButton = within(screen.getByTestId("volts-group")).getByText("-");
    fireEvent.click(minusButton);
    expect(setVolts).toHaveBeenCalledWith(110);
  });

  it("volts + button clamps at maximum (240)", () => {
    const setVolts = vi.fn();
    render(<ChargingDetails {...defaultProps} volts={240} setVolts={setVolts} />);
    const plusButton = within(screen.getByTestId("volts-group")).getByText("+");
    fireEvent.click(plusButton);
    expect(setVolts).toHaveBeenCalledWith(240);
  });

  it("volts slider onChange calls setVolts with parsed int", () => {
    const setVolts = vi.fn();
    render(<ChargingDetails {...defaultProps} setVolts={setVolts} />);
    const slider = screen.getByTestId("volts-slider");
    fireEvent.change(slider, { target: { value: "120" } });
    expect(setVolts).toHaveBeenCalledWith(120);
  });

  // Amps
  it("amps + button calls setAmps with value + 1", () => {
    const setAmps = vi.fn();
    render(<ChargingDetails {...defaultProps} setAmps={setAmps} />);
    const plusButton = within(screen.getByTestId("amps-group")).getByText("+");
    fireEvent.click(plusButton);
    expect(setAmps).toHaveBeenCalledWith(11);
  });

  it("amps - button clamps at minimum (5)", () => {
    const setAmps = vi.fn();
    render(<ChargingDetails {...defaultProps} amps={5} setAmps={setAmps} />);
    const minusButton = within(screen.getByTestId("amps-group")).getByText("-");
    fireEvent.click(minusButton);
    expect(setAmps).toHaveBeenCalledWith(5);
  });

  it("amps + button clamps at maximum (32)", () => {
    const setAmps = vi.fn();
    render(<ChargingDetails {...defaultProps} amps={32} setAmps={setAmps} />);
    const plusButton = within(screen.getByTestId("amps-group")).getByText("+");
    fireEvent.click(plusButton);
    expect(setAmps).toHaveBeenCalledWith(32);
  });

  it("amps slider onChange calls setAmps with parsed int", () => {
    const setAmps = vi.fn();
    render(<ChargingDetails {...defaultProps} setAmps={setAmps} />);
    const slider = screen.getByTestId("amps-slider");
    fireEvent.change(slider, { target: { value: "16" } });
    expect(setAmps).toHaveBeenCalledWith(16);
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
});
