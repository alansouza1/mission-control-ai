import type {
  AreaAnalysis,
  CycleAnalysis,
  CycleReading,
  MissionClassification,
  MissionSummary,
  MonitoredArea,
  RiskLevel,
} from '../types/mission';
import { AREA_KEYS, MISSION_NAME, RAW_MISSION_DATA, TEAM_NAME } from '../data/missionData';

// ---------------------------------------------------------------------------
// Individual area analyzers
// ---------------------------------------------------------------------------

interface AnalysisResult {
  points: number;
  level: RiskLevel;
  description: string;
}

/** Classify temperature reading against operational thresholds. */
function analyzeTemperature(value: number): AnalysisResult {
  if (value > 35) return { points: 2, level: 'critical', description: 'Risco de superaquecimento' };
  if (value > 30) return { points: 1, level: 'warning', description: 'Temperatura elevada' };
  if (value < 18) return { points: 1, level: 'warning', description: 'Temperatura abaixo do ideal' };
  return { points: 0, level: 'normal', description: 'Temperatura estável' };
}

/** Classify communication signal strength. */
function analyzeCommunication(value: number): AnalysisResult {
  if (value < 30) return { points: 2, level: 'critical', description: 'Comunicação em nível crítico' };
  if (value < 60) return { points: 1, level: 'warning', description: 'Comunicação instável' };
  return { points: 0, level: 'normal', description: 'Comunicação estável' };
}

/** Classify battery charge level. */
function analyzeBattery(value: number): AnalysisResult {
  if (value < 20) return { points: 2, level: 'critical', description: 'Bateria em nível crítico' };
  if (value < 50) return { points: 1, level: 'warning', description: 'Bateria abaixo do recomendado' };
  return { points: 0, level: 'normal', description: 'Energia estável' };
}

/** Classify oxygen support level. */
function analyzeOxygen(value: number): AnalysisResult {
  if (value < 80) return { points: 2, level: 'critical', description: 'Oxigênio em nível crítico' };
  if (value < 90) return { points: 1, level: 'warning', description: 'Oxigênio abaixo do ideal' };
  return { points: 0, level: 'normal', description: 'Oxigênio adequado' };
}

/** Classify operational stability percentage. */
function analyzeStability(value: number): AnalysisResult {
  if (value < 40) return { points: 2, level: 'critical', description: 'Estabilidade crítica' };
  if (value < 70) return { points: 1, level: 'warning', description: 'Estabilidade reduzida' };
  return { points: 0, level: 'normal', description: 'Estabilidade adequada' };
}

/** Lookup table mapping each area to its analyzer function. */
const AREA_ANALYZERS: Record<MonitoredArea, (value: number) => AnalysisResult> = {
  temperature: analyzeTemperature,
  communication: analyzeCommunication,
  battery: analyzeBattery,
  oxygen: analyzeOxygen,
  stability: analyzeStability,
};

// ---------------------------------------------------------------------------
// Cycle-level analysis
// ---------------------------------------------------------------------------

/** Convert a raw data row into a typed CycleReading. */
function parseCycleReading(row: number[]): CycleReading {
  return {
    temperature: row[0],
    communication: row[1],
    battery: row[2],
    oxygen: row[3],
    stability: row[4],
  };
}

/**
 * Analyze all five areas of a single cycle.
 *
 * @example
 * const areas = analyzeAllAreas({ temperature: 37, communication: 45, battery: 41, oxygen: 84, stability: 58 });
 */
function analyzeAllAreas(readings: CycleReading): Record<MonitoredArea, AreaAnalysis> {
  const result = {} as Record<MonitoredArea, AreaAnalysis>;

  for (const key of AREA_KEYS) {
    const { points, level, description } = AREA_ANALYZERS[key](readings[key]);
    result[key] = { points, level, description };
  }

  return result;
}

/** Sum the risk points across all areas for a cycle. */
function computeTotalRisk(areas: Record<MonitoredArea, AreaAnalysis>): number {
  return AREA_KEYS.reduce((sum, key) => sum + areas[key].points, 0);
}

/** Map a numeric risk score to a mission classification. */
export function classifyRisk(risk: number): MissionClassification {
  if (risk >= 6) return 'critical';
  if (risk >= 3) return 'warning';
  return 'stable';
}

/** Generate a pt-BR recommendation string based on cycle data. */
function generateRecommendation(readings: CycleReading, risk: number): string {
  const actions: string[] = [];

  if (readings.temperature > 35) actions.push('verificar controle térmico');
  if (readings.communication < 30) actions.push('restabelecer contato com a base');
  if (readings.battery < 20) actions.push('ativar modo de economia de energia');
  if (readings.oxygen < 80) actions.push('acionar protocolo de suporte à vida');
  if (readings.stability < 40) actions.push('reduzir operações não essenciais');

  if (risk >= 6) {
    return actions.length > 0
      ? `Ativar modo de segurança: ${actions.join(', ')}.`
      : 'Ativar modo de segurança e priorizar sistemas essenciais.';
  }

  if (risk >= 3) {
    return actions.length > 0
      ? `Monitoramento intensificado: ${actions.join(', ')}.`
      : 'Monitorar sistemas em atenção e preparar plano de contingência.';
  }

  return 'Manter operação normal e continuar monitoramento.';
}

/** Produce a full CycleAnalysis from a raw data row. */
function analyzeCycle(row: number[], cycleNumber: number): CycleAnalysis {
  const readings = parseCycleReading(row);
  const areas = analyzeAllAreas(readings);
  const totalRisk = computeTotalRisk(areas);
  const classification = classifyRisk(totalRisk);
  const recommendation = generateRecommendation(readings, totalRisk);

  return { cycleNumber, readings, areas, totalRisk, classification, recommendation };
}

// ---------------------------------------------------------------------------
// Mission-level aggregation
// ---------------------------------------------------------------------------

/**
 * Analyze all cycles and produce per-cycle results plus a mission summary.
 * This is the main entry point consumed by the UI.
 *
 * @example
 * const { cycles, summary } = computeMissionAnalysis();
 */
export function computeMissionAnalysis(): {
  cycles: CycleAnalysis[];
  summary: MissionSummary;
} {
  const cycles = RAW_MISSION_DATA.map((row, i) => analyzeCycle(row, i + 1));
  const risks = cycles.map((c) => c.totalRisk);

  const averages = computeAverages();
  const { cycleNumber: critCycle, risk: critRisk } = findMostCriticalCycle(risks);
  const averageRisk = roundTo(risks.reduce((a, b) => a + b, 0) / risks.length, 2);
  const criticalCyclesCount = risks.filter((r) => r >= 6).length;
  const trend = determineTrend(risks);
  const { scores, mostAffected } = computeAccumulatedScores(cycles);

  const summary: MissionSummary = {
    name: MISSION_NAME,
    team: TEAM_NAME,
    totalCycles: cycles.length,
    averages,
    mostCriticalCycle: { cycleNumber: critCycle, risk: critRisk },
    averageRisk,
    criticalCyclesCount,
    trend,
    accumulatedScores: scores,
    mostAffectedAreas: mostAffected,
    finalClassification: classifyRisk(Math.round(averageRisk)),
  };

  return { cycles, summary };
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function computeAverages(): Record<MonitoredArea, number> {
  const result = {} as Record<MonitoredArea, number>;
  const rowCount = RAW_MISSION_DATA.length;

  for (let col = 0; col < AREA_KEYS.length; col++) {
    const total = RAW_MISSION_DATA.reduce((sum, row) => sum + row[col], 0);
    result[AREA_KEYS[col]] = roundTo(total / rowCount, 2);
  }

  return result;
}

function findMostCriticalCycle(risks: number[]): { cycleNumber: number; risk: number } {
  let maxRisk = risks[0];
  let maxIndex = 0;

  for (let i = 1; i < risks.length; i++) {
    if (risks[i] > maxRisk) {
      maxRisk = risks[i];
      maxIndex = i;
    }
  }

  return { cycleNumber: maxIndex + 1, risk: maxRisk };
}

function determineTrend(risks: number[]): string {
  const first = risks[0];
  const last = risks[risks.length - 1];

  if (last > first) return 'A missão apresentou tendência de piora.';
  if (last < first) return 'A missão apresentou tendência de melhora.';
  return 'A missão permaneceu estável em relação ao início.';
}

function computeAccumulatedScores(cycles: CycleAnalysis[]): {
  scores: { area: MonitoredArea; points: number }[];
  mostAffected: MonitoredArea[];
} {
  const totals: Record<MonitoredArea, number> = {
    temperature: 0,
    communication: 0,
    battery: 0,
    oxygen: 0,
    stability: 0,
  };

  for (const cycle of cycles) {
    for (const key of AREA_KEYS) {
      totals[key] += cycle.areas[key].points;
    }
  }

  const scores = AREA_KEYS.map((key) => ({ area: key, points: totals[key] }));
  const maxPoints = Math.max(...scores.map((s) => s.points));
  const mostAffected = scores.filter((s) => s.points === maxPoints).map((s) => s.area);

  return { scores, mostAffected };
}
