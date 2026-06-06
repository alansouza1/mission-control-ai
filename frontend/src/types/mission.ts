/** Severity levels for individual area readings. */
export type RiskLevel = 'normal' | 'warning' | 'critical';

/** Overall mission classification based on aggregate risk score. */
export type MissionClassification = 'stable' | 'warning' | 'critical';

/** The five monitored subsystems of the spacecraft. */
export type MonitoredArea =
  | 'temperature'
  | 'communication'
  | 'battery'
  | 'oxygen'
  | 'stability';

/** Raw sensor readings for a single monitoring cycle. */
export interface CycleReading {
  temperature: number;
  communication: number;
  battery: number;
  oxygen: number;
  stability: number;
}

/** Analysis result for a single monitored area within a cycle. */
export interface AreaAnalysis {
  points: number;
  level: RiskLevel;
  description: string;
}

/** Complete analysis output for a single monitoring cycle. */
export interface CycleAnalysis {
  cycleNumber: number;
  readings: CycleReading;
  areas: Record<MonitoredArea, AreaAnalysis>;
  totalRisk: number;
  classification: MissionClassification;
  recommendation: string;
}

/** Summary statistics aggregated across all mission cycles. */
export interface MissionSummary {
  name: string;
  team: string;
  totalCycles: number;
  averages: Record<MonitoredArea, number>;
  mostCriticalCycle: { cycleNumber: number; risk: number };
  averageRisk: number;
  criticalCyclesCount: number;
  trend: string;
  accumulatedScores: { area: MonitoredArea; points: number }[];
  mostAffectedAreas: MonitoredArea[];
  finalClassification: MissionClassification;
}

/** Display metadata for a monitored area (labels, units, icons). */
export interface AreaMetadata {
  key: MonitoredArea;
  label: string;
  unit: string;
}
