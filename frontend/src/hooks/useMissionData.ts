import { useMemo } from 'react';
import { computeMissionAnalysis } from '../domain/missionAnalysis';
import { computeEnergyAnalysis } from '../domain/energyAnalysis';
import type { CycleAnalysis, MissionSummary } from '../types/mission';
import type { EnergyCycleMetrics, EnergySummary } from '../types/energy';

interface MissionDataResult {
  cycles: CycleAnalysis[];
  summary: MissionSummary;
  energyCycles: EnergyCycleMetrics[];
  energySummary: EnergySummary;
}

/**
 * Hook that computes all mission and energy analysis data.
 * Memoized to avoid recomputation on re-renders.
 *
 * @example
 * const { cycles, summary, energyCycles, energySummary } = useMissionData();
 */
export function useMissionData(): MissionDataResult {
  return useMemo(() => {
    const { cycles, summary } = computeMissionAnalysis();
    const { cycleMetrics, summary: energySummary } = computeEnergyAnalysis();

    return {
      cycles,
      summary,
      energyCycles: cycleMetrics,
      energySummary,
    };
  }, []);
}
