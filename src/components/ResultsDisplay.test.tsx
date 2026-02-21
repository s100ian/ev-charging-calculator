import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ResultsDisplay from "./ResultsDisplay";

const defaultProps = {
  socAfterCharging: 85,
  chargingPower: 7.36,
  chargingSpeedPercent: 12.5,
  chargingSpeedKm: 45.3,
  rangePerSession: 150,
  totalRange: 320,
};

describe("ResultsDisplay", () => {
  it("renders SoC after charging", () => {
    render(<ResultsDisplay {...defaultProps} />);
    expect(screen.getByText("85 %")).toBeInTheDocument();
  });

  it("renders charging power", () => {
    render(<ResultsDisplay {...defaultProps} />);
    expect(screen.getByText("7.36 kW")).toBeInTheDocument();
  });

  it("renders total range", () => {
    render(<ResultsDisplay {...defaultProps} />);
    expect(screen.getByText("320 km")).toBeInTheDocument();
  });

  it("renders range per session", () => {
    render(<ResultsDisplay {...defaultProps} />);
    expect(screen.getByText("150 km")).toBeInTheDocument();
  });

  it("renders charging speed in %/h", () => {
    render(<ResultsDisplay {...defaultProps} />);
    expect(screen.getByText("12.5 %/h")).toBeInTheDocument();
  });

  it("renders charging speed in km/h", () => {
    render(<ResultsDisplay {...defaultProps} />);
    expect(screen.getByText("45.3 km/h")).toBeInTheDocument();
  });

  it("sets battery level width based on SoC", () => {
    const { container } = render(<ResultsDisplay {...defaultProps} />);
    const batteryLevel = container.querySelector(".battery-level");
    expect(batteryLevel).toHaveStyle({ width: "85%" });
  });

  it("shows green battery color for high SoC", () => {
    const { container } = render(<ResultsDisplay {...defaultProps} />);
    const batteryLevel = container.querySelector(".battery-level");
    expect(batteryLevel).toHaveStyle({ backgroundColor: "#4dff4d" });
  });

  it("shows yellow battery color for medium SoC", () => {
    const { container } = render(
      <ResultsDisplay {...defaultProps} socAfterCharging={50} />
    );
    const batteryLevel = container.querySelector(".battery-level");
    expect(batteryLevel).toHaveStyle({ backgroundColor: "#ffcc00" });
  });

  it("shows red battery color for low SoC", () => {
    const { container } = render(
      <ResultsDisplay {...defaultProps} socAfterCharging={15} />
    );
    const batteryLevel = container.querySelector(".battery-level");
    expect(batteryLevel).toHaveStyle({ backgroundColor: "#ff4d4d" });
  });

  // Boundary: soc < 20 is red, soc >= 20 is yellow
  it("shows yellow battery color at exactly 20% SoC (boundary)", () => {
    const { container } = render(
      <ResultsDisplay {...defaultProps} socAfterCharging={20} />
    );
    const batteryLevel = container.querySelector(".battery-level");
    expect(batteryLevel).toHaveStyle({ backgroundColor: "#ffcc00" });
  });

  it("shows red battery color at 19% SoC (just below boundary)", () => {
    const { container } = render(
      <ResultsDisplay {...defaultProps} socAfterCharging={19} />
    );
    const batteryLevel = container.querySelector(".battery-level");
    expect(batteryLevel).toHaveStyle({ backgroundColor: "#ff4d4d" });
  });

  // Boundary: soc < 80 is yellow, soc >= 80 is green
  it("shows green battery color at exactly 80% SoC (boundary)", () => {
    const { container } = render(
      <ResultsDisplay {...defaultProps} socAfterCharging={80} />
    );
    const batteryLevel = container.querySelector(".battery-level");
    expect(batteryLevel).toHaveStyle({ backgroundColor: "#4dff4d" });
  });

  it("shows yellow battery color at 79% SoC (just below boundary)", () => {
    const { container } = render(
      <ResultsDisplay {...defaultProps} socAfterCharging={79} />
    );
    const batteryLevel = container.querySelector(".battery-level");
    expect(batteryLevel).toHaveStyle({ backgroundColor: "#ffcc00" });
  });

  it("shows 0% battery width at SoC 0", () => {
    const { container } = render(
      <ResultsDisplay {...defaultProps} socAfterCharging={0} />
    );
    const batteryLevel = container.querySelector(".battery-level");
    expect(batteryLevel).toHaveStyle({ width: "0%" });
    expect(batteryLevel).toHaveStyle({ backgroundColor: "#ff4d4d" });
  });

  it("shows 100% battery width at SoC 100", () => {
    const { container } = render(
      <ResultsDisplay {...defaultProps} socAfterCharging={100} />
    );
    const batteryLevel = container.querySelector(".battery-level");
    expect(batteryLevel).toHaveStyle({ width: "100%" });
    expect(batteryLevel).toHaveStyle({ backgroundColor: "#4dff4d" });
  });

  it("formats SoC as integer (toFixed(0))", () => {
    render(<ResultsDisplay {...defaultProps} socAfterCharging={85.7} />);
    expect(screen.getByText("86 %")).toBeInTheDocument();
  });

  it("formats charging power with 2 decimal places", () => {
    render(<ResultsDisplay {...defaultProps} chargingPower={2.3} />);
    expect(screen.getByText("2.30 kW")).toBeInTheDocument();
  });

  it("formats charging speed percent with 1 decimal place", () => {
    render(<ResultsDisplay {...defaultProps} chargingSpeedPercent={3.0} />);
    expect(screen.getByText("3.0 %/h")).toBeInTheDocument();
  });
});
