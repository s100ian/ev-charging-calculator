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
});
