import type { RiskLevel } from '../types/mission';

/**
 * Compute percentage change between two values.
 *
 * @example
 * computePercentageChange(90, 95) // 5.56
 */
export function computePercentageChange(previous: number, current: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / Math.abs(previous)) * 10000) / 100;
}

/**
 * Determine the trend direction from a percentage change.
 *
 * @example
 * determineTrendDirection(5.56) // 'up'
 */
export function determineTrendDirection(change: number): 'up' | 'down' | 'stable' {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'stable';
}

/**
 * Determine the worst (most severe) risk level from an array.
 *
 * @example
 * worstRiskLevel(['normal', 'warning', 'normal']) // 'warning'
 */
export function worstRiskLevel(levels: RiskLevel[]): RiskLevel {
  if (levels.includes('critical')) return 'critical';
  if (levels.includes('warning')) return 'warning';
  return 'normal';
}
