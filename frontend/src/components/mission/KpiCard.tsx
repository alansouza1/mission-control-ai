import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { RiskLevel } from '../../types/mission';
import { computePercentageChange } from '../../utils/calculations';
import StatusBadge from '../layout/StatusBadge';
import './KpiCard.css';

interface KpiCardProps {
  label: string;
  value: number;
  unit: string;
  level: RiskLevel;
  description: string;
  previousValue?: number;
  icon: React.ReactNode;
}

/**
 * Display a single KPI metric card.
 *
 * @example
 * <KpiCard label="Temperatura Interna" value={22} unit="°C" level="normal" description="Temperatura estável" icon={<Thermometer />} />
 */
export default function KpiCard({
  label,
  value,
  unit,
  level,
  description,
  previousValue,
  icon,
}: KpiCardProps) {
  let changeIndicator = null;
  
  if (previousValue !== undefined) {
    const change = computePercentageChange(previousValue, value);
    if (change > 0) {
      changeIndicator = (
        <div className="kpi-trend trend-up">
          <TrendingUp size={14} />
          <span>+{change}%</span>
        </div>
      );
    } else if (change < 0) {
      changeIndicator = (
        <div className="kpi-trend trend-down">
          <TrendingDown size={14} />
          <span>{change}%</span>
        </div>
      );
    } else {
      changeIndicator = (
        <div className="kpi-trend trend-stable">
          <Minus size={14} />
          <span>0%</span>
        </div>
      );
    }
  }

  return (
    <div className={`card kpi-card kpi-card--${level}`}>
      <div className="kpi-header">
        <div className={`kpi-icon-wrapper bg-${level}`}>
          {icon}
        </div>
        <span className="section-title kpi-label">{label}</span>
      </div>
      
      <div className="kpi-body">
        <div className="kpi-value-container">
          <span className="kpi-value">{value}</span>
          <span className="kpi-unit">{unit}</span>
        </div>
        {changeIndicator}
      </div>

      <div className="kpi-footer">
        <StatusBadge status={level} />
        <span className="kpi-description">{description}</span>
      </div>
    </div>
  );
}
