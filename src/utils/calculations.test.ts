import { describe, it, expect } from 'vitest';
import {
    calculateChargePlan,
    calculateCostPer100Km,
    calculateEnergyAdded,
    calculateEnergyCost,
    calculateEnergyToFull,
    calculateFullChargeWallEnergy,
    parseFixedTariffPricing,
    calculateReachableSoCForDuration,
    calculateSessionWallEnergy,
    calculateTimeAndEnergyToTarget,
    calculateWallEnergyFromBatteryEnergy,
} from './calculations';

describe('calculateEnergyAdded', () => {
    const capacity = 100; // 100 kWh
    const volts = 230;
    const amps = 32; // 7.36 kW

    it('should calculate normal charging correctly (below 99%)', () => {
        // 1 hour at 7.36 kW = 7.36 kWh
        const result = calculateEnergyAdded(capacity, 50, volts, amps, 1);
        expect(result).toBeCloseTo(7.36, 3);
    });

    it('should handle crossing the 99% threshold', () => {
        // Start at 98%. 1% to 99% = 1 kWh.
        // Time to 99% = 1 / 7.36 ~= 0.13587h
        // Remaining time = 1 - 0.13587 = 0.86413h
        // Trickle power = 230 * 5 / 1000 = 1.15 kW
        // Trickle energy = 1.15 * 0.86413 ~= 0.99375 kWh
        // Total = 1 + 0.99375 = 1.99375 kWh

        // Let's use a specific duration to make math cleaner if possible, 
        // but the logic is robust.
        // Let's use the same duration as the verification script:
        // duration = time_to_99 + 0.5_kwh_at_trickle_time
        const timeTo99 = 1 / 7.36;
        const timeTrickle = 0.5 / 1.15;
        const duration = timeTo99 + timeTrickle;

        const result = calculateEnergyAdded(capacity, 98, volts, amps, duration);
        expect(result).toBeCloseTo(1.5, 3);
    });

    it('should use trickle charging immediately if starting above 99%', () => {
        // Start at 99.5%. 1 hour.
        // Should use 5A (1.15 kW)
        // Energy = 1.15 kWh
        // But capped at 100% (0.5 kWh remaining)
        const result = calculateEnergyAdded(capacity, 99.5, volts, amps, 1);
        expect(result).toBeCloseTo(0.5, 3);
    });

    it('should not exceed 100% capacity', () => {
        // Start at 99.5%. Long duration.
        const result = calculateEnergyAdded(capacity, 99.5, volts, amps, 10);
        expect(result).toBeCloseTo(0.5, 3);
    });

    it('should handle short duration above 99%', () => {
        // 0.1 hour at 1.15 kW = 0.115 kWh
        const result = calculateEnergyAdded(capacity, 99.5, volts, amps, 0.1);
        expect(result).toBeCloseTo(0.115, 3);
    });

    it('should return 0 for zero duration', () => {
        const result = calculateEnergyAdded(capacity, 50, volts, amps, 0);
        expect(result).toBe(0);
    });

    it('should charge normally from 0% SoC', () => {
        // 1 hour at 7.36 kW from empty
        const result = calculateEnergyAdded(capacity, 0, volts, amps, 1);
        expect(result).toBeCloseTo(7.36, 3);
    });

    it('should return 0 when already at 100% SoC', () => {
        const result = calculateEnergyAdded(capacity, 100, volts, amps, 1);
        expect(result).toBeCloseTo(0, 5);
    });

    it('should use trickle charging immediately when starting at exactly 99%', () => {
        // energyTo99 = 0, goes straight to trickle for the full duration
        // 0.5 hour at 1.15 kW = 0.575 kWh; cap = 1 kWh so no capping
        const result = calculateEnergyAdded(capacity, 99, volts, amps, 0.5);
        expect(result).toBeCloseTo(0.575, 3);
    });

    it('should handle duration exactly equal to timeTo99 (boundary)', () => {
        // At exactly timeTo99, branch is (duration <= timeTo99) → normal power only
        const energyTo99 = (99 - 50) * capacity / 100; // 49 kWh
        const powerNormal = (volts * amps) / 1000;      // 7.36 kW
        const timeTo99 = energyTo99 / powerNormal;
        const result = calculateEnergyAdded(capacity, 50, volts, amps, timeTo99);
        expect(result).toBeCloseTo(49, 3);
    });

    it('should calculate correctly with 110V (different voltage)', () => {
        // powerNormal = 110 * 32 / 1000 = 3.52 kW; 1 hour below 99%
        const result = calculateEnergyAdded(capacity, 50, 110, amps, 1);
        expect(result).toBeCloseTo(3.52, 3);
    });

    it('should use 110V trickle power when voltage is 110V', () => {
        // trickle = 110 * 5 / 1000 = 0.55 kW; 0.1h; cap = 0.5 kWh
        // energy = 0.55 * 0.1 = 0.055 kWh (below cap)
        const result = calculateEnergyAdded(capacity, 99.5, 110, amps, 0.1);
        expect(result).toBeCloseTo(0.055, 3);
    });

    it('should return 0 when amps is 0 (no charging power)', () => {
        // With 0 amps, powerNormal=0 so timeTo99=Infinity; the normal-charging
        // branch is always taken and returns powerNormal * duration = 0.
        const result = calculateEnergyAdded(capacity, 50, volts, 0, 1);
        expect(result).toBeCloseTo(0, 3);
    });
});

describe('charging cost helpers', () => {
    const pricing = { type: 'fixed' as const, pricePerKwh: 0.25 };

    it('parses a valid fixed tariff price', () => {
        expect(parseFixedTariffPricing('0.25')).toEqual(pricing);
    });

    it('returns null for an empty fixed tariff price', () => {
        expect(parseFixedTariffPricing('')).toBeNull();
    });

    it('returns null for an invalid fixed tariff price', () => {
        expect(parseFixedTariffPricing('-1')).toBeNull();
    });

    it('calculates energy to full from current SoC', () => {
        expect(calculateEnergyToFull(72, 50)).toBeCloseTo(36, 3);
    });

    it('returns 0 energy to full when already at 100%', () => {
        expect(calculateEnergyToFull(72, 100)).toBe(0);
    });

    it('treats wall energy as battery energy when efficiency is 1', () => {
        expect(calculateWallEnergyFromBatteryEnergy(12.5)).toBeCloseTo(12.5, 3);
    });

    it('converts battery energy to wall energy when efficiency is below 1', () => {
        expect(calculateWallEnergyFromBatteryEnergy(18, 0.9)).toBeCloseTo(20, 3);
    });

    it('returns 0 wall energy when efficiency is invalid', () => {
        expect(calculateWallEnergyFromBatteryEnergy(18, 0)).toBe(0);
    });

    it('calculates wall energy for a session', () => {
        expect(calculateSessionWallEnergy(7.36)).toBeCloseTo(7.36, 3);
    });

    it('calculates wall energy to full from current SoC', () => {
        expect(calculateFullChargeWallEnergy(72, 50)).toBeCloseTo(36, 3);
    });

    it('calculates wall energy to full with an efficiency factor', () => {
        expect(calculateFullChargeWallEnergy(72, 50, 0.9)).toBeCloseTo(40, 3);
    });

    it('calculates cost for energy', () => {
        expect(calculateEnergyCost(20, pricing)).toBeCloseTo(5, 3);
    });

    it('does not produce negative cost for negative energy', () => {
        expect(calculateEnergyCost(-5, pricing)).toBe(0);
    });

    it('calculates cost per 100 km from consumption', () => {
        expect(calculateCostPer100Km(18, pricing)).toBeCloseTo(4.5, 3);
    });

    it('calculates cost per 100 km with an efficiency factor', () => {
        expect(calculateCostPer100Km(18, pricing, 0.9)).toBeCloseTo(5, 3);
    });
});

describe('target planning helpers', () => {
    it('calculates time and energy to a target below 99%', () => {
        const result = calculateTimeAndEnergyToTarget(72, 50, 80, 230, 10, 0.9);

        expect(result.targetSoC).toBe(80);
        expect(result.batteryEnergyKwh).toBeCloseTo(21.6, 3);
        expect(result.wallEnergyKwh).toBeCloseTo(24, 3);
        expect(result.timeHours).toBeCloseTo(9.391304, 5);
        expect(result.isReachable).toBe(true);
    });

    it('calculates time and energy when the target crosses into trickle charging', () => {
        const result = calculateTimeAndEnergyToTarget(100, 98, 100, 230, 32);

        expect(result.targetSoC).toBe(100);
        expect(result.batteryEnergyKwh).toBeCloseTo(2, 3);
        expect(result.wallEnergyKwh).toBeCloseTo(2, 3);
        expect(result.timeHours).toBeCloseTo((1 / 7.36) + (1 / 1.15), 5);
        expect(result.isReachable).toBe(true);
    });

    it('treats a target below current SoC as the current SoC', () => {
        const result = calculateTimeAndEnergyToTarget(72, 60, 50, 230, 10);

        expect(result.targetSoC).toBe(60);
        expect(result.batteryEnergyKwh).toBe(0);
        expect(result.wallEnergyKwh).toBe(0);
        expect(result.timeHours).toBe(0);
        expect(result.isReachable).toBe(true);
    });

    it('returns an unreachable target result when there is no charging power', () => {
        const result = calculateTimeAndEnergyToTarget(72, 50, 80, 230, 0);

        expect(result.batteryEnergyKwh).toBeCloseTo(21.6, 3);
        expect(result.timeHours).toBe(Infinity);
        expect(result.isReachable).toBe(false);
    });
});

describe('duration planning helpers', () => {
    it('calculates reachable SoC for a duration that stays below 99%', () => {
        const result = calculateReachableSoCForDuration(72, 50, 230, 10, 2, 0.9);

        expect(result.achievedSoC).toBeCloseTo(56.388889, 5);
        expect(result.batteryEnergyKwh).toBeCloseTo(4.6, 3);
        expect(result.wallEnergyKwh).toBeCloseTo(5.111111, 5);
        expect(result.durationHours).toBe(2);
    });

    it('calculates reachable SoC for a duration that enters trickle charging', () => {
        const result = calculateReachableSoCForDuration(100, 98, 230, 32, 1);

        expect(result.achievedSoC).toBeCloseTo(99.99375, 5);
        expect(result.batteryEnergyKwh).toBeCloseTo(1.99375, 5);
        expect(result.wallEnergyKwh).toBeCloseTo(1.99375, 5);
    });

    it('returns the current SoC when there is no available duration', () => {
        const result = calculateReachableSoCForDuration(72, 50, 230, 10, 0);

        expect(result.achievedSoC).toBe(50);
        expect(result.batteryEnergyKwh).toBe(0);
        expect(result.wallEnergyKwh).toBe(0);
    });

    it('returns the current SoC when there is no charging power', () => {
        const result = calculateReachableSoCForDuration(72, 50, 230, 0, 4);

        expect(result.achievedSoC).toBe(50);
        expect(result.batteryEnergyKwh).toBe(0);
        expect(result.wallEnergyKwh).toBe(0);
    });
});

describe('calculateChargePlan', () => {
    it('returns target-only planning results when no departure duration is provided', () => {
        const result = calculateChargePlan({
            usableCapacity: 72,
            currentSoC: 50,
            targetSoC: 80,
            volts: 230,
            amps: 10,
            chargingEfficiency: 0.9,
        });

        expect(result.targetSoC).toBe(80);
        expect(result.batteryEnergyToTargetKwh).toBeCloseTo(21.6, 3);
        expect(result.wallEnergyToTargetKwh).toBeCloseTo(24, 3);
        expect(result.timeToTargetHours).toBeCloseTo(9.391304, 5);
        expect(result.isTargetReachable).toBe(true);
        expect(result.availableDurationHours).toBeNull();
        expect(result.isReachableByDeparture).toBeNull();
        expect(result.socAtDeparturePercent).toBeNull();
    });

    it('marks the plan as reachable when the available duration is enough', () => {
        const result = calculateChargePlan({
            usableCapacity: 72,
            currentSoC: 50,
            targetSoC: 80,
            volts: 230,
            amps: 10,
            availableDurationHours: 10,
        });

        expect(result.isReachableByDeparture).toBe(true);
        expect(result.socAtDeparturePercent).toBe(80);
        expect(result.batteryEnergyByDepartureKwh).toBeCloseTo(21.6, 3);
        expect(result.wallEnergyByDepartureKwh).toBeCloseTo(21.6, 3);
        expect(result.socShortfallPercent).toBe(0);
    });

    it('returns the best achievable SoC when the target is not reachable by departure', () => {
        const result = calculateChargePlan({
            usableCapacity: 72,
            currentSoC: 50,
            targetSoC: 80,
            volts: 230,
            amps: 10,
            availableDurationHours: 2,
            chargingEfficiency: 0.9,
        });

        expect(result.isReachableByDeparture).toBe(false);
        expect(result.socAtDeparturePercent).toBeCloseTo(56.388889, 5);
        expect(result.batteryEnergyByDepartureKwh).toBeCloseTo(4.6, 3);
        expect(result.wallEnergyByDepartureKwh).toBeCloseTo(5.111111, 5);
        expect(result.socShortfallPercent).toBeCloseTo(23.611111, 5);
    });

    it('handles zero available duration as an immediate departure constraint', () => {
        const result = calculateChargePlan({
            usableCapacity: 72,
            currentSoC: 50,
            targetSoC: 80,
            volts: 230,
            amps: 10,
            availableDurationHours: 0,
        });

        expect(result.isReachableByDeparture).toBe(false);
        expect(result.socAtDeparturePercent).toBe(50);
        expect(result.batteryEnergyByDepartureKwh).toBe(0);
        expect(result.wallEnergyByDepartureKwh).toBe(0);
        expect(result.socShortfallPercent).toBe(30);
    });
});
