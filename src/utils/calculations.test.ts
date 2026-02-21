import { describe, it, expect } from 'vitest';
import { calculateEnergyAdded } from './calculations';

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
