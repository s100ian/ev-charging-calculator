import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { useChargePlan } from "./useChargePlan";

describe("useChargePlan", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("derives charge-plan results and target cost from the planner inputs", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-08T12:00:00"));

    const { result } = renderHook(() =>
      useChargePlan({
        chargingPowerKw: 2.3,
        consumption: 18,
        currentSoC: 50,
        departureTime: "",
        pricePerKwh: "0.25",
        targetSoC: 80,
        usableCapacity: 72,
      })
    );

    expect(result.current.chargePlan.targetSoC).toBe(80);
    expect(result.current.chargePlan.batteryEnergyToTargetKwh).toBeCloseTo(21.6, 3);
    expect(result.current.rangeAtTargetKm).toBeCloseTo(320, 3);
    expect(result.current.targetCost).toBeCloseTo(5.4, 3);
    expect(result.current.planningSummary).toBeNull();
    expect(result.current.readyAtLabel).toBe("21:23");
  });

  it("produces a departure summary and rolls past times to the next day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-08T22:30:00"));

    const { result } = renderHook(() =>
      useChargePlan({
        chargingPowerKw: 2.3,
        consumption: 18,
        currentSoC: 50,
        departureTime: "22:00",
        pricePerKwh: "0.25",
        targetSoC: 80,
        usableCapacity: 72,
      })
    );

    expect(result.current.availableDurationHours).toBeCloseTo(23.5, 3);
    expect(result.current.chargePlan.isReachableByDeparture).toBe(true);
    expect(result.current.planningSummary).toBe(
      "Target should be ready before departure."
    );
  });

  it("returns an unreachable departure summary when time is insufficient", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-08T12:00:00"));

    const { result } = renderHook(() =>
      useChargePlan({
        chargingPowerKw: 2.3,
        consumption: 18,
        currentSoC: 50,
        departureTime: "13:00",
        pricePerKwh: "0.25",
        targetSoC: 90,
        usableCapacity: 72,
      })
    );

    expect(result.current.chargePlan.isReachableByDeparture).toBe(false);
    expect(result.current.planningSummary).toContain("remain");
    expect(result.current.targetCost).toBeCloseTo(7.2, 3);
  });
});
