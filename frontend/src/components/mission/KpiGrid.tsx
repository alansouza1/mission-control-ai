import React from 'react';
import { Thermometer, Radio, Battery, Wind, Gauge } from 'lucide-react';
import type { CycleAnalysis } from '../../types/mission';
import { AREA_METADATA } from '../../data/missionData';
import KpiCard from './KpiCard';
import './KpiGrid.css';

interface KpiGridProps {
  cycles: CycleAnalysis[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  temperature: <Thermometer size={18} />,
  communication: <Radio size={18} />,
  battery: <Battery size={18} />,
  oxygen: <Wind size={18} />,
  stability: <Gauge size={18} />,
};

/**
 * Renders the 5 KPI cards for the latest cycle.
 *
 * @example
 * <KpiGrid cycles={missionCycles} />
 */
export default function KpiGrid({ cycles }: KpiGridProps) {
  if (cycles.length === 0) return null;
  
  const latestCycle = cycles[cycles.length - 1];
  const previousCycle = cycles.length > 1 ? cycles[cycles.length - 2] : undefined;

  return (
    <div className="dashboard-grid kpi-grid">
      {AREA_METADATA.map((meta) => {
        const key = meta.key;
        const currentReading = latestCycle.readings[key];
        const analysis = latestCycle.areas[key];
        const previousReading = previousCycle ? previousCycle.readings[key] : undefined;
        
        return (
          <KpiCard
            key={key}
            label={meta.label}
            value={currentReading}
            unit={meta.unit}
            level={analysis.level}
            description={analysis.description}
            previousValue={previousReading}
            icon={ICON_MAP[key]}
          />
        );
      })}
    </div>
  );
}
