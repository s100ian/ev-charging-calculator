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
});
