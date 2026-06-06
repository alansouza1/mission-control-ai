import type { EnergyCycleMetrics, EnergySummary, SustainabilityLevel } from '../types/energy';
import {
  BATTERY_CAPACITY_WH,
  MAX_POWER_W,
  RAW_MISSION_DATA,
  SYSTEM_VOLTAGE_V,
} from '../data/missionData';

// ---------------------------------------------------------------------------
// Core energy calculations
// ---------------------------------------------------------------------------

/**
 * Compute stored energy in Wh from battery percentage.
 * Formula: E = capacity × (level / 100)
 *
 * @example
 * computeStoredEnergy(92) // 1840
 */
export function computeStoredEnergy(batteryLevelPct: number): number {
  return roundTo(BATTERY_CAPACITY_WH * (batteryLevelPct / 100), 2);
}

/**
 * Estimate solar panel power output based on battery level as efficiency proxy.
 * Formula: P = P_max × η
 *
 * @example
 * computeGeneratedPower(92) // 460
 */
export function computeGeneratedPower(batteryLevelPct: number): number {
  const efficiency = batteryLevelPct / 100;
  return roundTo(MAX_POWER_W * efficiency, 2);
}

/**
 * Compute system current using Ohm's law: I = P / V
 *
 * @example
 * computeSystemCurrent(460) // 16.43
 */
export function computeSystemCurrent(powerW: number): number {
  return roundTo(powerW / SYSTEM_VOLTAGE_V, 2);
}

// ---------------------------------------------------------------------------
// Sustainability classification
// ---------------------------------------------------------------------------

interface SustainabilityResult {
  level: SustainabilityLevel;
  description: string;
}

/** Classify energy sustainability for a given battery percentage. */
function classifySustainability(batteryLevelPct: number): SustainabilityResult {
  if (batteryLevelPct >= 70) {
    return { level: 'sustainable', description: 'Geração solar suficiente para todos os subsistemas' };
  }
  if (batteryLevelPct >= 40) {
    return { level: 'warning', description: 'Geração solar abaixo do ideal — reduzir consumo não essencial' };
  }
  return { level: 'critical', description: 'Risco de colapso do sistema de energia renovável' };
}

// ---------------------------------------------------------------------------
// Per-cycle energy metrics
// ---------------------------------------------------------------------------

/** Build energy metrics for a single cycle from its battery level. */
function computeCycleEnergy(batteryLevel: number, cycleNumber: number): EnergyCycleMetrics {
  const storedEnergy = computeStoredEnergy(batteryLevel);
  const generatedPower = computeGeneratedPower(batteryLevel);
  const current = computeSystemCurrent(generatedPower);
  const { level, description } = classifySustainability(batteryLevel);

  return {
    cycleNumber,
    batteryLevel,
    storedEnergy,
    generatedPower,
    current,
    sustainabilityLevel: level,
    sustainabilityDescription: description,
  };
}

// ---------------------------------------------------------------------------
// Mission-level energy report
// ---------------------------------------------------------------------------

/**
 * Produce energy metrics for every cycle plus an aggregate summary.
 *
 * @example
 * const { cycleMetrics, summary } = computeEnergyAnalysis();
 */
export function computeEnergyAnalysis(): {
  cycleMetrics: EnergyCycleMetrics[];
  summary: EnergySummary;
} {
  const cycleMetrics = RAW_MISSION_DATA.map((row, i) => computeCycleEnergy(row[2], i + 1));

  const totalBattery = cycleMetrics.reduce((s, m) => s + m.batteryLevel, 0);
  const averageBatteryLevel = roundTo(totalBattery / cycleMetrics.length, 2);

  const totalConsumedEnergy = cycleMetrics.reduce(
    (sum, m) => sum + (BATTERY_CAPACITY_WH - m.storedEnergy),
    0,
  );

  const conclusion = deriveEnergyConclusion(averageBatteryLevel);

  return {
    cycleMetrics,
    summary: {
      averageBatteryLevel,
      averageEfficiency: averageBatteryLevel,
      totalConsumedEnergy: roundTo(totalConsumedEnergy, 2),
      conclusion,
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function deriveEnergyConclusion(avgBattery: number): string {
  if (avgBattery >= 70) return 'Missão operou com alta sustentabilidade.';
  if (avgBattery >= 40) {
    return 'Missão operou com sustentabilidade parcial. Recomenda-se otimizar o consumo dos subsistemas secundários.';
  }
  return 'Missão operou em déficit energético. Revisar capacidade dos painéis e protocolo de economia de energia.';
}
