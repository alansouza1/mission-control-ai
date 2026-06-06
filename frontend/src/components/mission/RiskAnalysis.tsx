import type { CycleAnalysis, MissionSummary } from '../../types/mission';
import { formatDecimal } from '../../lib/formatters';
import './RiskAnalysis.css';

interface RiskAnalysisProps {
  cycles: CycleAnalysis[];
  summary: MissionSummary;
}

type BarLevel = 'normal' | 'warning' | 'critical';

/**
 * Render a risk analysis card with summary stats and per-cycle risk bars.
 *
 * @example
 * <RiskAnalysis cycles={cycles} summary={summary} />
 */
export default function RiskAnalysis({ cycles, summary }: RiskAnalysisProps) {
  return (
    <section className="risk-analysis">
      <h2 className="risk-analysis__title">Análise de Risco</h2>
      <div className="risk-analysis__stats">
        <StatBox
          label="Ciclo Mais Crítico"
          value={`Ciclo ${summary.mostCriticalCycle.cycleNumber}`}
          sub={`Risco: ${summary.mostCriticalCycle.risk}`}
        />
        <StatBox label="Risco Médio" value={formatDecimal(summary.averageRisk, 1)} />
        <StatBox
          label="Ciclos Críticos"
          value={String(summary.criticalCyclesCount)}
          sub={`de ${summary.totalCycles} ciclos`}
        />
      </div>
      <div className="risk-analysis__bars">
        {cycles.map((cycle) => (
          <RiskBar key={cycle.cycleNumber} cycle={cycle} />
        ))}
      </div>
    </section>
  );
}

function StatBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="risk-analysis__stat-box">
      <div className="risk-analysis__stat-label">{label}</div>
      <div className="risk-analysis__stat-value">{value}</div>
      {sub && <div className="risk-analysis__stat-sub">{sub}</div>}
    </div>
  );
}

function classifyBarLevel(risk: number): BarLevel {
  if (risk >= 6) return 'critical';
  if (risk >= 3) return 'warning';
  return 'normal';
}

function RiskBar({ cycle }: { cycle: CycleAnalysis }) {
  const level = classifyBarLevel(cycle.totalRisk);
  const widthPercent = Math.min((cycle.totalRisk / 10) * 100, 100);

  return (
    <div className="risk-analysis__bar-row">
      <span className="risk-analysis__bar-label">Ciclo {cycle.cycleNumber}</span>
      <div className="risk-analysis__bar-track">
        <div
          className={`risk-analysis__bar-fill risk-analysis__bar-fill--${level}`}
          style={{ width: `${widthPercent}%` }}
        />
      </div>
      <span className="risk-analysis__bar-score">{cycle.totalRisk}</span>
    </div>
  );
}
