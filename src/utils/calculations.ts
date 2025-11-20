
export function calculateEnergyAdded(
    usableCapacity: number,
    currentSoC: number,
    volts: number,
    amps: number,
    duration: number
): number {
    const capacityKwh = usableCapacity;
    const startSoC = currentSoC;
    const targetSoC99 = 99;

    // Energy needed to reach 99%
    const energyTo99 = Math.max(0, ((targetSoC99 - startSoC) * capacityKwh) / 100);

    // Power at normal amps
    const powerNormal = (volts * amps) / 1000;

    // Time to reach 99% at normal power
    const timeTo99 = powerNormal > 0 ? energyTo99 / powerNormal : 0;

    if (duration <= timeTo99) {
        // We don't reach 99% (or barely do), so all charging is at normal power
        return powerNormal * duration;
    } else {
        // We pass 99%, so split calculation
        // 1. Energy up to 99%
        let totalEnergy = energyTo99;

        // 2. Remaining time at trickle power (5A)
        const remainingTime = duration - timeTo99;
        const powerTrickle = (volts * 5) / 1000; // Fixed 5A

        totalEnergy += powerTrickle * remainingTime;

        // Cap at 100% capacity (energy needed to reach 100% from start)
        const energyTo100 = ((100 - startSoC) * capacityKwh) / 100;
        return Math.min(totalEnergy, energyTo100);
    }
}
