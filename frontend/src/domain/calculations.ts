/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RawCycle, CycleAnalysis, ComponentTelemetry, MissionOverviewMetrics, EnergyAverages } from '../types/mission';

/**
 * Calculates the individual risk score for temperature.
 * Risk starts increasing when temperature exceeds 20°C, reaching 100% at 37°C.
 * 
 * @param temp The temperature in degrees Celsius
 * @returns Risk score from 0 to 100
 */
export function calculateTempRisk(temp: number): number {
  if (temp <= 20) {
    return 0;
  }
  return Math.min(100, Math.round((temp - 20) * 5.88 * 10) / 10);
}

/**
 * Analyzes a raw cycle and converts it into structured engineering metrics.
 * 
 * Example:
 * const analysis = analyzeCycle(cycle, 1, previousCycle);
 * 
 * @param current The raw cycle array
 * @param index The 1-based cycle index
 * @param previous The optional previous raw cycle array for trend calculation
 * @returns The fully analyzed CycleAnalysis object
 */
export function analyzeCycle(current: RawCycle, index: number, previous?: RawCycle): CycleAnalysis {
  const [temp, comm, batt, oxy, stab] = current;

  // Component risks
  const tempRisk = calculateTempRisk(temp);
  const commRisk = 100 - comm;
  const battRisk = 100 - batt;
  const oxyRisk = 100 - oxy;
  const stabRisk = 100 - stab;

  // Average risk score across the 5 dimensions
  const riskScore = Math.round(((tempRisk + commRisk + battRisk + oxyRisk + stabRisk) / 5) * 10) / 10;

  // Renewable Energy Panel engineering calculations:
  // 1. Stored Energy (Wh) assuming a 2000 Wh battery capacity
  const storedEnergyWh = Math.round(2000 * (batt / 100));

  // 2. Solar Generation Power (W) based on maximum power (500W) multiplied by efficiency (BatteryLevel / 100)
  const generatedPowerW = Math.round(500 * (batt / 100) * 10) / 10;

  // 3. Current (A) assuming a 28V spacecraft power bus
  const currentA = Math.round((generatedPowerW / 28) * 100) / 100;

  // 4. Operational Sustainability Status
  let sustainabilityStatus = 'Recuperação Emergencial';
  if (batt >= 75 && generatedPowerW >= 375) {
    sustainabilityStatus = 'Sustentabilidade Forte';
  } else if (batt >= 50 && generatedPowerW >= 250) {
    sustainabilityStatus = 'Sustentabilidade Estável';
  } else if (batt >= 35 && generatedPowerW >= 175) {
    sustainabilityStatus = 'Atenção Operacional';
  }

  return {
    index,
    temperature: temp,
    communication: comm,
    battery: batt,
    oxygen: oxy,
    stability: stab,
    riskScore,
    storedEnergyWh,
    generatedPowerW,
    currentA,
    sustainabilityStatus,
  };
}

/**
 * Maps risk score or value to engineering safety thresholds (Normal, Atenção, Crítico).
 */
export function getComponentStatus(component: string, value: number): 'Normal' | 'Atenção' | 'Crítico' {
  switch (component) {
    case 'temperature':
      if (value >= 18 && value <= 30) return 'Normal';
      if (value > 35) return 'Crítico';
      return 'Atenção';
    case 'communication':
      if (value >= 60) return 'Normal';
      if (value >= 30) return 'Atenção';
      return 'Crítico';
    case 'battery':
      if (value >= 50) return 'Normal';
      if (value >= 20) return 'Atenção';
      return 'Crítico';
    case 'oxygen':
      if (value >= 90) return 'Normal';
      if (value >= 80) return 'Atenção';
      return 'Crítico';
    case 'stability':
      if (value >= 70) return 'Normal';
      if (value >= 40) return 'Atenção';
      return 'Crítico';
    default:
      return 'Normal';
  }
}

/**
 * Analyzes component details for the current active cycle.
 * Includes trend indicators compared to the previous cycle.
 */
export function getActiveKPIs(current: RawCycle, previous?: RawCycle): ComponentTelemetry[] {
  const [tCurr, cCurr, bCurr, oCurr, sCurr] = current;
  const [tPrev, cPrev, bPrev, oPrev, sPrev] = previous || current;

  // Trend calculates physical direction
  const getTrend = (curr: number, prev: number, invert = false): 'up' | 'down' | 'stable' => {
    if (curr > prev) return 'up';
    if (curr < prev) return 'down';
    return 'stable';
  };

  return [
    {
      name: 'Temperatura',
      value: tCurr,
      unit: '°C',
      status: getComponentStatus('temperature', tCurr),
      risk: calculateTempRisk(tCurr),
      trend: getTrend(tCurr, tPrev),
    },
    {
      name: 'Comunicação',
      value: cCurr,
      unit: '%',
      status: getComponentStatus('communication', cCurr),
      risk: 100 - cCurr,
      trend: getTrend(cCurr, cPrev),
    },
    {
      name: 'Bateria',
      value: bCurr,
      unit: '%',
      status: getComponentStatus('battery', bCurr),
      risk: 100 - bCurr,
      trend: getTrend(bCurr, bPrev),
    },
    {
      name: 'Oxigênio',
      value: oCurr,
      unit: '%',
      status: getComponentStatus('oxygen', oCurr),
      risk: 100 - oCurr,
      trend: getTrend(oCurr, oPrev),
    },
    {
      name: 'Estabilidade',
      value: sCurr,
      unit: '%',
      status: getComponentStatus('stability', sCurr),
      risk: 100 - sCurr,
      trend: getTrend(sCurr, sPrev),
    },
  ];
}

/**
 * Calculates overall aggregated metrics for the entire mission based on cumulative history.
 * 
 * @param rawCycles The list of raw cycles
 * @returns The overall aggregated mission metrics
 */
export function calculateMissionOverview(rawCycles: RawCycle[]): MissionOverviewMetrics {
  const count = rawCycles.length;
  if (count === 0) {
    return {
      status: 'Operação Estável',
      trend: 'Estabilização',
      averageRisk: 0,
      mostCriticalCycleIndex: 1,
      mostCriticalCycleRisk: 0,
      totalCycles: 0,
    };
  }

  // Map each raw cycle to its analysis score
  const analyzed = rawCycles.map((c, idx) => analyzeCycle(c, idx + 1, idx > 0 ? rawCycles[idx - 1] : undefined));

  // Average cumulative risk index
  const totalRiskSum = analyzed.reduce((sum, item) => sum + item.riskScore, 0);
  const averageRisk = Math.round((totalRiskSum / count) * 10) / 10;

  // Find cycle with highest risk score
  let mostCriticalIndex = 0;
  let maxRisk = -1;
  analyzed.forEach((item, idx) => {
    if (item.riskScore > maxRisk) {
      maxRisk = item.riskScore;
      mostCriticalIndex = idx;
    }
  });

  // Calculate trends comparing last cycle to the previous one
  const lastCycle = analyzed[count - 1];
  const prevCycle = count > 1 ? analyzed[count - 2] : undefined;

  let trend: 'Melhora Contínua' | 'Estabilidade Crítica' | 'Declínio Sistêmico' | 'Estabilização' = 'Estabilização';
  if (prevCycle) {
    const delta = lastCycle.riskScore - prevCycle.riskScore;
    if (delta < -2) {
      trend = 'Melhora Contínua'; // Risk is falling back down
    } else if (delta > 2) {
      trend = 'Declínio Sistêmico'; // Risk is rising
    } else if (lastCycle.riskScore > 40) {
      trend = 'Estabilidade Crítica'; // Risk is high and flatlined
    } else {
      trend = 'Estabilização'; // Risk is low and flatlined
    }
  }

  // Overall mission safety classification
  // Aligned with Python logic: 0-2 (0-20%) Stable, 3-5 (30-50%) Attention, 6-10 (60-100%) Critical
  let status: 'Operação Estável' | 'Monitoramento Intensivo' | 'Alerta Crítico' = 'Operação Estável';
  if (lastCycle.riskScore >= 60) {
    status = 'Alerta Crítico';
  } else if (lastCycle.riskScore >= 30 || averageRisk >= 30) {
    status = 'Monitoramento Intensivo';
  }

  return {
    status,
    trend,
    averageRisk,
    mostCriticalCycleIndex: mostCriticalIndex + 1,
    mostCriticalCycleRisk: maxRisk,
    totalCycles: count,
  };
}
