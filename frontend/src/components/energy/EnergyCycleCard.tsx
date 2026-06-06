import type { EnergyCycleMetrics, SustainabilityLevel } from '../../types/energy';
import type { RiskLevel } from '../../types/mission';
import { formatDecimal, formatSustainability } from '../../lib/formatters';
import StatusBadge from "../layout/StatusBadge";
import './EnergyCycleCard.css';

interface EnergyCycleCardProps {
  metrics: EnergyCycleMetrics;
}

const SUSTAINABILITY_TO_RISK: Record<SustainabilityLevel, RiskLevel> = {
  sustainable: 'normal',
  warning: 'warning',
  critical: 'critical',
};

const METRIC_ITEMS = [
  { key: 'batteryLevel', label: 'Bateria', unit: '%' },
  { key: 'storedEnergy', label: 'Energia Armazenada', unit: ' Wh' },
  { key: 'generatedPower', label: 'Potência Gerada', unit: ' W' },
  { key: 'current', label: 'Corrente', unit: ' A' },
] as const;

/**
 * Compact card displaying energy metrics for a single monitoring cycle.
 *
 * @example
 * <EnergyCycleCard metrics={energyCycles[0]} />
 */
export default function EnergyCycleCard({ metrics }: EnergyCycleCardProps) {
  const badgeStatus = SUSTAINABILITY_TO_RISK[metrics.sustainabilityLevel];

  return (
    <div className="energy-cycle-card">
      <div className="energy-cycle-card__header">
        <h4 className="energy-cycle-card__cycle-label">Ciclo {metrics.cycleNumber}</h4>
        <StatusBadge status={badgeStatus} label={formatSustainability(metrics.sustainabilityLevel)} />
      </div>
      <div className="energy-cycle-card__metrics">
        {METRIC_ITEMS.map(({ key, label, unit }) => (
          <div key={key} className="energy-cycle-card__metric">
            <span className="energy-cycle-card__metric-label">{label}</span>
            <span className="energy-cycle-card__metric-value">
              {formatDecimal(metrics[key], 1)}{unit}
            </span>
          </div>
        ))}
      </div>
      <p className="energy-cycle-card__description">{metrics.sustainabilityDescription}</p>
    </div>
  );
}
