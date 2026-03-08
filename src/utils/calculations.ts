
const TRICKLE_SOC_THRESHOLD = 99;
const TRICKLE_AMPS = 5;

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

export interface TimeAndEnergyToTargetResult {
    targetSoC: number;
    batteryEnergyKwh: number;
    wallEnergyKwh: number;
    timeHours: number;
    isReachable: boolean;
}

export interface ReachableSoCForDurationResult {
    achievedSoC: number;
    batteryEnergyKwh: number;
    wallEnergyKwh: number;
    durationHours: number;
}

export interface ChargePlanInput {
    usableCapacity: number;
    currentSoC: number;
    targetSoC: number;
    volts: number;
    amps: number;
    availableDurationHours?: number | null;
    chargingEfficiency?: number;
}

export interface ChargePlanResult {
    targetSoC: number;
    batteryEnergyToTargetKwh: number;
    wallEnergyToTargetKwh: number;
    timeToTargetHours: number;
    isTargetReachable: boolean;
    availableDurationHours: number | null;
    isReachableByDeparture: boolean | null;
    socAtDeparturePercent: number | null;
    batteryEnergyByDepartureKwh: number | null;
    wallEnergyByDepartureKwh: number | null;
    socShortfallPercent: number | null;
}

export function calculateTimeAndEnergyToTarget(
    usableCapacity: number,
    currentSoC: number,
    targetSoC: number,
    volts: number,
    amps: number,
    chargingEfficiency: number = 1
): TimeAndEnergyToTargetResult {
    const safeCurrentSoC = clampPercentage(currentSoC);
    const safeTargetSoC = Math.max(safeCurrentSoC, clampPercentage(targetSoC));
    const normalPowerKw = getNormalChargingPowerKw(volts, amps);
    const tricklePowerKw = getTrickleChargingPowerKw(volts, normalPowerKw);
    const normalPhaseTargetSoC = Math.min(safeTargetSoC, TRICKLE_SOC_THRESHOLD);
    const tricklePhaseStartSoC = Math.max(safeCurrentSoC, TRICKLE_SOC_THRESHOLD);
    const batteryEnergyNormalKwh = calculateBatteryEnergyBetweenSoC(
        usableCapacity,
        safeCurrentSoC,
        normalPhaseTargetSoC
    );
    const batteryEnergyTrickleKwh = safeTargetSoC > TRICKLE_SOC_THRESHOLD
        ? calculateBatteryEnergyBetweenSoC(
            usableCapacity,
            tricklePhaseStartSoC,
            safeTargetSoC
        )
        : 0;
    const timeNormalHours = batteryEnergyNormalKwh === 0
        ? 0
        : normalPowerKw > 0
            ? batteryEnergyNormalKwh / normalPowerKw
            : Infinity;
    const timeTrickleHours = batteryEnergyTrickleKwh === 0
        ? 0
        : tricklePowerKw > 0
            ? batteryEnergyTrickleKwh / tricklePowerKw
            : Infinity;
    const batteryEnergyKwh = batteryEnergyNormalKwh + batteryEnergyTrickleKwh;
    const timeHours = timeNormalHours + timeTrickleHours;

    return {
        targetSoC: safeTargetSoC,
        batteryEnergyKwh,
        wallEnergyKwh: calculateWallEnergyFromBatteryEnergy(
            batteryEnergyKwh,
            chargingEfficiency
        ),
        timeHours,
        isReachable: Number.isFinite(timeHours),
    };
}

export function calculateReachableSoCForDuration(
    usableCapacity: number,
    currentSoC: number,
    volts: number,
    amps: number,
    durationHours: number,
    chargingEfficiency: number = 1
): ReachableSoCForDurationResult {
    const safeCurrentSoC = clampPercentage(currentSoC);
    const safeUsableCapacity = Math.max(0, usableCapacity);
    const safeDurationHours = Math.max(0, durationHours);
    const normalPowerKw = getNormalChargingPowerKw(volts, amps);
    const tricklePowerKw = getTrickleChargingPowerKw(volts, normalPowerKw);

    if (safeDurationHours === 0 || safeUsableCapacity === 0 || normalPowerKw <= 0) {
        return {
            achievedSoC: safeCurrentSoC,
            batteryEnergyKwh: 0,
            wallEnergyKwh: 0,
            durationHours: safeDurationHours,
        };
    }

    const batteryEnergyTo99Kwh = calculateBatteryEnergyBetweenSoC(
        safeUsableCapacity,
        safeCurrentSoC,
        TRICKLE_SOC_THRESHOLD
    );
    const timeTo99Hours = batteryEnergyTo99Kwh / normalPowerKw;
    const batteryEnergyAddedKwh = safeDurationHours <= timeTo99Hours
        ? normalPowerKw * safeDurationHours
        : batteryEnergyTo99Kwh + (tricklePowerKw * (safeDurationHours - timeTo99Hours));
    const maxBatteryEnergyKwh = calculateBatteryEnergyBetweenSoC(
        safeUsableCapacity,
        safeCurrentSoC,
        100
    );
    const safeBatteryEnergyAddedKwh = Math.min(
        batteryEnergyAddedKwh,
        maxBatteryEnergyKwh
    );
    const achievedSoC = Math.min(
        100,
        safeCurrentSoC + ((safeBatteryEnergyAddedKwh / safeUsableCapacity) * 100)
    );

    return {
        achievedSoC,
        batteryEnergyKwh: safeBatteryEnergyAddedKwh,
        wallEnergyKwh: calculateWallEnergyFromBatteryEnergy(
            safeBatteryEnergyAddedKwh,
            chargingEfficiency
        ),
        durationHours: safeDurationHours,
    };
}

export function calculateChargePlan(
    input: ChargePlanInput
): ChargePlanResult {
    const chargingEfficiency = input.chargingEfficiency ?? 1;
    const targetResult = calculateTimeAndEnergyToTarget(
        input.usableCapacity,
        input.currentSoC,
        input.targetSoC,
        input.volts,
        input.amps,
        chargingEfficiency
    );
    const safeAvailableDurationHours = input.availableDurationHours == null
        ? null
        : Math.max(0, input.availableDurationHours);

    if (safeAvailableDurationHours === null) {
        return {
            targetSoC: targetResult.targetSoC,
            batteryEnergyToTargetKwh: targetResult.batteryEnergyKwh,
            wallEnergyToTargetKwh: targetResult.wallEnergyKwh,
            timeToTargetHours: targetResult.timeHours,
            isTargetReachable: targetResult.isReachable,
            availableDurationHours: null,
            isReachableByDeparture: null,
            socAtDeparturePercent: null,
            batteryEnergyByDepartureKwh: null,
            wallEnergyByDepartureKwh: null,
            socShortfallPercent: null,
        };
    }

    if (targetResult.isReachable && safeAvailableDurationHours >= targetResult.timeHours) {
        return {
            targetSoC: targetResult.targetSoC,
            batteryEnergyToTargetKwh: targetResult.batteryEnergyKwh,
            wallEnergyToTargetKwh: targetResult.wallEnergyKwh,
            timeToTargetHours: targetResult.timeHours,
            isTargetReachable: targetResult.isReachable,
            availableDurationHours: safeAvailableDurationHours,
            isReachableByDeparture: true,
            socAtDeparturePercent: targetResult.targetSoC,
            batteryEnergyByDepartureKwh: targetResult.batteryEnergyKwh,
            wallEnergyByDepartureKwh: targetResult.wallEnergyKwh,
            socShortfallPercent: 0,
        };
    }

    const departureResult = calculateReachableSoCForDuration(
        input.usableCapacity,
        input.currentSoC,
        input.volts,
        input.amps,
        safeAvailableDurationHours,
        chargingEfficiency
    );

    return {
        targetSoC: targetResult.targetSoC,
        batteryEnergyToTargetKwh: targetResult.batteryEnergyKwh,
        wallEnergyToTargetKwh: targetResult.wallEnergyKwh,
        timeToTargetHours: targetResult.timeHours,
        isTargetReachable: targetResult.isReachable,
        availableDurationHours: safeAvailableDurationHours,
        isReachableByDeparture: false,
        socAtDeparturePercent: departureResult.achievedSoC,
        batteryEnergyByDepartureKwh: departureResult.batteryEnergyKwh,
        wallEnergyByDepartureKwh: departureResult.wallEnergyKwh,
        socShortfallPercent: Math.max(
            0,
            targetResult.targetSoC - departureResult.achievedSoC
        ),
    };
}

function clampPercentage(value: number): number {
    return Math.min(100, Math.max(0, value));
}

function calculateBatteryEnergyBetweenSoC(
    usableCapacity: number,
    startSoC: number,
    endSoC: number
): number {
    const safeUsableCapacity = Math.max(0, usableCapacity);
    const safeStartSoC = clampPercentage(startSoC);
    const safeEndSoC = clampPercentage(endSoC);

    return Math.max(0, ((safeEndSoC - safeStartSoC) * safeUsableCapacity) / 100);
}

function getNormalChargingPowerKw(volts: number, amps: number): number {
    return Math.max(0, (volts * amps) / 1000);
}

function getTrickleChargingPowerKw(volts: number, normalPowerKw: number): number {
    if (normalPowerKw <= 0) {
        return 0;
    }

    return Math.max(0, (volts * TRICKLE_AMPS) / 1000);
}

export interface FixedTariffPricing {
    type: "fixed";
    pricePerKwh: number;
}

export function parseFixedTariffPricing(
    pricePerKwh: string
): FixedTariffPricing | null {
    const normalizedPrice = pricePerKwh.trim();

    if (normalizedPrice === "") {
        return null;
    }

    const parsedPrice = parseFloat(normalizedPrice);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        return null;
    }

    return {
        type: "fixed",
        pricePerKwh: parsedPrice,
    };
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
