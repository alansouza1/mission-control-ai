/** Sustainability classification for the energy subsystem. */
export type SustainabilityLevel = 'sustainable' | 'warning' | 'critical';

/** Computed energy metrics for a single monitoring cycle. */
export interface EnergyCycleMetrics {
  cycleNumber: number;
  batteryLevel: number;
  storedEnergy: number;
  generatedPower: number;
  current: number;
  sustainabilityLevel: SustainabilityLevel;
  sustainabilityDescription: string;
}

/** Aggregate energy statistics for the entire mission. */
export interface EnergySummary {
  averageBatteryLevel: number;
  averageEfficiency: number;
  totalConsumedEnergy: number;
  conclusion: string;
}
