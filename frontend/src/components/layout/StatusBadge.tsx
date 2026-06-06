import './StatusBadge.css';

type BadgeStatus = 'normal' | 'warning' | 'critical' | 'sustainable';

interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
}

const DEFAULT_LABELS: Record<BadgeStatus, string> = {
  normal: 'Normal',
  warning: 'Atenção',
  critical: 'Crítico',
  sustainable: 'Sustentável',
};

/**
 * Colored pill badge indicating an operational status.
 *
 * @example
 * <StatusBadge status="critical" />
 * <StatusBadge status="sustainable" label="Energia OK" />
 */
export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const displayLabel = label ?? DEFAULT_LABELS[status];

  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge__dot" />
      {displayLabel}
    </span>
  );
}
