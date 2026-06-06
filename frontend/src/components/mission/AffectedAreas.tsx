import type { MissionSummary, MonitoredArea } from '../../types/mission';
import { AREA_METADATA_MAP } from '../../data/missionData';
import './AffectedAreas.css';

interface AffectedAreasProps {
  summary: MissionSummary;
}

const MAX_POSSIBLE_POINTS = 12;

/**
 * Render a card listing accumulated risk scores per area, sorted descending.
 *
 * @example
 * <AffectedAreas summary={summary} />
 */
export default function AffectedAreas({ summary }: AffectedAreasProps) {
  const sorted = [...summary.accumulatedScores].sort((a, b) => b.points - a.points);

  return (
    <section className="affected-areas">
      <h2 className="affected-areas__title">Áreas Mais Afetadas</h2>
      <div className="affected-areas__list">
        {sorted.map(({ area, points }) => (
          <AreaRow
            key={area}
            area={area}
            points={points}
            highlighted={summary.mostAffectedAreas.includes(area)}
          />
        ))}
      </div>
    </section>
  );
}

function AreaRow({ area, points, highlighted }: { area: MonitoredArea; points: number; highlighted: boolean }) {
  const meta = AREA_METADATA_MAP.get(area);
  const label = meta?.label ?? area;
  const widthPercent = (points / MAX_POSSIBLE_POINTS) * 100;

  return (
    <div className={`affected-areas__item ${highlighted ? 'affected-areas__item--highlight' : ''}`}>
      <div className="affected-areas__row">
        <span className="affected-areas__label">{label}</span>
        <span className="affected-areas__points">{points} pts</span>
      </div>
      <div className="affected-areas__bar-track">
        <div className="affected-areas__bar-fill" style={{ width: `${widthPercent}%` }} />
      </div>
    </div>
  );
}
