/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Represent a single raw telemetry cycle:
 * [temperature, communication, battery, oxygen, stability]
 */
export type RawCycle = [number, number, number, number, number];

export interface ComponentTelemetry {
  name: string;
  value: number;
  unit: string;
  status: 'Normal' | 'Atenção' | 'Crítico';
  risk: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CycleAnalysis {
  index: number;
  temperature: number;
  communication: number;
  battery: number;
  oxygen: number;
  stability: number;
  riskScore: number;
  // Energy metrics
  storedEnergyWh: number;
  generatedPowerW: number;
  currentA: number;
  sustainabilityStatus: string;
}

export interface MissionOverviewMetrics {
  status: 'Operação Estável' | 'Monitoramento Intensivo' | 'Alerta Crítico';
  trend: 'Melhora Contínua' | 'Estabilidade Crítica' | 'Declínio Sistêmico' | 'Estabilização';
  averageRisk: number;
  mostCriticalCycleIndex: number;
  mostCriticalCycleRisk: number;
  totalCycles: number;
}

export interface EnergyAverages {
  currentBattery: number;
  storedEnergyWh: number;
  generatedPowerW: number;
  currentA: number;
  sustainabilityStatus: string;
}
