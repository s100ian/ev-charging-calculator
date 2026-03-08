import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PlanningResults from "./PlanningResults";

describe("PlanningResults", () => {
  it("renders formatted target-planning values", () => {
    render(
      <PlanningResults
        batteryEnergyToTargetKwh={21.6}
        wallEnergyToTargetKwh={24}
        timeToTargetHours={2.5}
        readyAtLabel="18:40"
        rangeAtTargetKm={320}
        planningSummary={null}
        isTargetReachable={true}
        departureTime=""
        isReachableByDeparture={null}
        socAtDeparturePercent={null}
        socShortfallPercent={null}
      />
    );

    expect(screen.getByText("2h 30m")).toBeInTheDocument();
    expect(screen.getByText("18:40")).toBeInTheDocument();
    expect(screen.getByText("21.6 kWh")).toBeInTheDocument();
    expect(screen.getByText("24.0 kWh")).toBeInTheDocument();
    expect(screen.getByText("320 km")).toBeInTheDocument();
  });

  it("renders placeholders when target timing is not reachable", () => {
    render(
      <PlanningResults
        batteryEnergyToTargetKwh={21.6}
        wallEnergyToTargetKwh={24}
        timeToTargetHours={Infinity}
        readyAtLabel={null}
        rangeAtTargetKm={320}
        planningSummary={null}
        isTargetReachable={false}
        departureTime=""
        isReachableByDeparture={null}
        socAtDeparturePercent={null}
        socShortfallPercent={null}
      />
    );

    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(2);
  });

  it("renders departure readiness details when a departure time is set", () => {
    render(
      <PlanningResults
        batteryEnergyToTargetKwh={21.6}
        wallEnergyToTargetKwh={24}
        timeToTargetHours={2.5}
        readyAtLabel="18:40"
        rangeAtTargetKm={320}
        planningSummary="At departure, you'll reach about 76% and remain 4% short of your target."
        isTargetReachable={true}
        departureTime="19:00"
        isReachableByDeparture={false}
        socAtDeparturePercent={76}
        socShortfallPercent={4}
      />
    );

    expect(
      screen.getByText(
        "At departure, you'll reach about 76% and remain 4% short of your target."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.getByText("76 %")).toBeInTheDocument();
    expect(screen.getByText("4 %")).toBeInTheDocument();
  });
});
