import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CarInfo from "./CarInfo";

const defaultProps = {
  usableCapacity: 72,
  setUsableCapacity: vi.fn(),
  consumption: 18,
  setConsumption: vi.fn(),
  currentSoC: 50,
  setCurrentSoC: vi.fn(),
};

describe("CarInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Car Information heading", () => {
    render(<CarInfo {...defaultProps} />);
    expect(screen.getByText("Car Information")).toBeInTheDocument();
  });

  it("displays current usable capacity value", () => {
    render(<CarInfo {...defaultProps} />);
    expect(screen.getByTestId("usable-capacity-group")).toHaveTextContent("72");
  });

  it("displays current consumption value", () => {
    render(<CarInfo {...defaultProps} />);
    expect(screen.getByTestId("consumption-group")).toHaveTextContent("18");
  });

  it("displays current SoC value", () => {
    render(<CarInfo {...defaultProps} />);
    expect(screen.getByTestId("current-soc-group")).toHaveTextContent("50");
  });

  it("capacity + button calls setUsableCapacity with value + 1", () => {
    const setUsableCapacity = vi.fn();
    render(<CarInfo {...defaultProps} setUsableCapacity={setUsableCapacity} />);
    const plusButton = within(screen.getByTestId("usable-capacity-group")).getByText("+");
    fireEvent.click(plusButton);
    expect(setUsableCapacity).toHaveBeenCalledWith(73);
  });

  it("capacity - button calls setUsableCapacity with value - 1", () => {
    const setUsableCapacity = vi.fn();
    render(<CarInfo {...defaultProps} setUsableCapacity={setUsableCapacity} />);
    const minusButton = within(screen.getByTestId("usable-capacity-group")).getByText("-");
    fireEvent.click(minusButton);
    expect(setUsableCapacity).toHaveBeenCalledWith(71);
  });

  it("capacity - button clamps at minimum (5)", () => {
    const setUsableCapacity = vi.fn();
    render(<CarInfo {...defaultProps} usableCapacity={5} setUsableCapacity={setUsableCapacity} />);
    const minusButton = within(screen.getByTestId("usable-capacity-group")).getByText("-");
    fireEvent.click(minusButton);
    expect(setUsableCapacity).toHaveBeenCalledWith(5);
  });

  it("capacity + button clamps at maximum (200)", () => {
    const setUsableCapacity = vi.fn();
    render(<CarInfo {...defaultProps} usableCapacity={200} setUsableCapacity={setUsableCapacity} />);
    const plusButton = within(screen.getByTestId("usable-capacity-group")).getByText("+");
    fireEvent.click(plusButton);
    expect(setUsableCapacity).toHaveBeenCalledWith(200);
  });

  it("capacity slider onChange calls setUsableCapacity with parsed int", () => {
    const setUsableCapacity = vi.fn();
    render(<CarInfo {...defaultProps} setUsableCapacity={setUsableCapacity} />);
    const slider = screen.getByTestId("usable-capacity-slider");
    fireEvent.change(slider, { target: { value: "100" } });
    expect(setUsableCapacity).toHaveBeenCalledWith(100);
  });

  it("consumption + button calls setConsumption with value + 1", () => {
    const setConsumption = vi.fn();
    render(<CarInfo {...defaultProps} setConsumption={setConsumption} />);
    const plusButton = within(screen.getByTestId("consumption-group")).getByText("+");
    fireEvent.click(plusButton);
    expect(setConsumption).toHaveBeenCalledWith(19);
  });

  it("consumption - button clamps at minimum (5)", () => {
    const setConsumption = vi.fn();
    render(<CarInfo {...defaultProps} consumption={5} setConsumption={setConsumption} />);
    const minusButton = within(screen.getByTestId("consumption-group")).getByText("-");
    fireEvent.click(minusButton);
    expect(setConsumption).toHaveBeenCalledWith(5);
  });

  it("consumption + button clamps at maximum (50)", () => {
    const setConsumption = vi.fn();
    render(<CarInfo {...defaultProps} consumption={50} setConsumption={setConsumption} />);
    const plusButton = within(screen.getByTestId("consumption-group")).getByText("+");
    fireEvent.click(plusButton);
    expect(setConsumption).toHaveBeenCalledWith(50);
  });

  it("consumption slider onChange calls setConsumption with parsed int", () => {
    const setConsumption = vi.fn();
    render(<CarInfo {...defaultProps} setConsumption={setConsumption} />);
    const slider = screen.getByTestId("consumption-slider");
    fireEvent.change(slider, { target: { value: "25" } });
    expect(setConsumption).toHaveBeenCalledWith(25);
  });

  it("SoC + button calls setCurrentSoC with value + 1", () => {
    const setCurrentSoC = vi.fn();
    render(<CarInfo {...defaultProps} setCurrentSoC={setCurrentSoC} />);
    const plusButton = within(screen.getByTestId("current-soc-group")).getByText("+");
    fireEvent.click(plusButton);
    expect(setCurrentSoC).toHaveBeenCalledWith(51);
  });

  it("SoC - button clamps at minimum (0)", () => {
    const setCurrentSoC = vi.fn();
    render(<CarInfo {...defaultProps} currentSoC={0} setCurrentSoC={setCurrentSoC} />);
    const minusButton = within(screen.getByTestId("current-soc-group")).getByText("-");
    fireEvent.click(minusButton);
    expect(setCurrentSoC).toHaveBeenCalledWith(0);
  });

  it("SoC + button clamps at maximum (100)", () => {
    const setCurrentSoC = vi.fn();
    render(<CarInfo {...defaultProps} currentSoC={100} setCurrentSoC={setCurrentSoC} />);
    const plusButton = within(screen.getByTestId("current-soc-group")).getByText("+");
    fireEvent.click(plusButton);
    expect(setCurrentSoC).toHaveBeenCalledWith(100);
  });

  it("SoC slider onChange calls setCurrentSoC with parsed int", () => {
    const setCurrentSoC = vi.fn();
    render(<CarInfo {...defaultProps} setCurrentSoC={setCurrentSoC} />);
    const slider = screen.getByTestId("current-soc-slider");
    fireEvent.change(slider, { target: { value: "75" } });
    expect(setCurrentSoC).toHaveBeenCalledWith(75);
  });
});
