import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChargePlanning from "./ChargePlanning";

describe("ChargePlanning", () => {
  it("renders the current target and departure time", () => {
    render(
      <ChargePlanning
        currentSoC={50}
        targetSoC={80}
        setTargetSoC={vi.fn()}
        departureTime="18:30"
        setDepartureTime={vi.fn()}
      />
    );

    expect(screen.getByTestId("target-soc-slider")).toHaveValue("80");
    expect(screen.getByDisplayValue("18:30")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "80%" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("calls setTargetSoC when the slider changes", () => {
    const setTargetSoC = vi.fn();

    render(
      <ChargePlanning
        currentSoC={50}
        targetSoC={80}
        setTargetSoC={setTargetSoC}
        departureTime=""
        setDepartureTime={vi.fn()}
      />
    );

    fireEvent.change(screen.getByTestId("target-soc-slider"), {
      target: { value: "90" },
    });

    expect(setTargetSoC).toHaveBeenCalledWith(90);
  });

  it("disables quick targets below the current SoC", () => {
    const setTargetSoC = vi.fn();

    render(
      <ChargePlanning
        currentSoC={85}
        targetSoC={90}
        setTargetSoC={setTargetSoC}
        departureTime=""
        setDepartureTime={vi.fn()}
      />
    );

    const eightyPercentButton = screen.getByRole("button", { name: "80%" });

    expect(eightyPercentButton).toBeDisabled();

    fireEvent.click(eightyPercentButton);

    expect(setTargetSoC).not.toHaveBeenCalled();
  });

  it("calls setDepartureTime when the departure time changes", () => {
    const setDepartureTime = vi.fn();

    render(
      <ChargePlanning
        currentSoC={50}
        targetSoC={80}
        setTargetSoC={vi.fn()}
        departureTime=""
        setDepartureTime={setDepartureTime}
      />
    );

    fireEvent.change(screen.getByLabelText("Departure time (optional)"), {
      target: { value: "19:45" },
    });

    expect(setDepartureTime).toHaveBeenCalledWith("19:45");
  });
});
