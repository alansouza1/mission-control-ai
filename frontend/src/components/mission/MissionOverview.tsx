import type { MissionSummary } from '../../types/mission';
import { formatClassification } from '../../lib/formatters';
import { formatDecimal } from '../../lib/formatters';
import StatusBadge from "../layout/StatusBadge";
import './MissionOverview.css';

interface MissionOverviewProps {
  summary: MissionSummary;
}

/**
 * Render the top-level mission overview card with key stats.
 *
 * @example
 * <MissionOverview summary={summary} />
 */
export default function MissionOverview({ summary }: MissionOverviewProps) {
  return (
    <section className="mission-overview">
      <div className="mission-overview__header">
        <h1 className="mission-overview__name">{summary.name}</h1>
        <StatusBadge
          level={summary.finalClassification}
          label={formatClassification(summary.finalClassification)}
        />
      </div>
      <div className="mission-overview__stats">
        <StatItem label="Equipe" value={summary.team} />
        <StatItem label="Ciclos Analisados" value={String(summary.totalCycles)} />
        <StatItem label="Risco Médio" value={formatDecimal(summary.averageRisk, 1)} />
        <StatItem label="Tendência" value={summary.trend} />
      </div>
    </section>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="mission-overview__stat">
      <span className="mission-overview__stat-label">{label}</span>
      <span className="mission-overview__stat-value">{value}</span>
    </div>
  );
}
