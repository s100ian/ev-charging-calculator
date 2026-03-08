
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
    const timeTo99 = powerNormal > 0 ? energyTo99 / powerNormal : Infinity;

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

export interface FixedTariffPricing {
    type: "fixed";
    pricePerKwh: number;
}

export function calculateEnergyToFull(
    usableCapacity: number,
    currentSoC: number
): number {
    return Math.max(0, ((100 - currentSoC) * usableCapacity) / 100);
}

export function calculateWallEnergyFromBatteryEnergy(
    batteryEnergyKwh: number,
    chargingEfficiency: number = 1
): number {
    const safeBatteryEnergy = Math.max(0, batteryEnergyKwh);

    if (chargingEfficiency <= 0) {
        return 0;
    }

    return safeBatteryEnergy / chargingEfficiency;
}

export function calculateSessionWallEnergy(
    batteryEnergyAddedKwh: number,
    chargingEfficiency: number = 1
): number {
    return calculateWallEnergyFromBatteryEnergy(
        batteryEnergyAddedKwh,
        chargingEfficiency
    );
}

export function calculateFullChargeWallEnergy(
    usableCapacity: number,
    currentSoC: number,
    chargingEfficiency: number = 1
): number {
    return calculateWallEnergyFromBatteryEnergy(
        calculateEnergyToFull(usableCapacity, currentSoC),
        chargingEfficiency
    );
}

export function calculateEnergyCost(
    energyKwh: number,
    pricing: FixedTariffPricing
): number {
    return Math.max(0, energyKwh) * pricing.pricePerKwh;
}

export function calculateCostPer100Km(
    consumption: number,
    pricing: FixedTariffPricing,
    chargingEfficiency: number = 1
): number {
    return calculateEnergyCost(
        calculateWallEnergyFromBatteryEnergy(consumption, chargingEfficiency),
        pricing
    );
}
