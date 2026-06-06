import { Leaf } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { EnergyCycleMetrics, EnergySummary } from '../../types/energy';
import { formatDecimal } from '../../lib/formatters';
import EnergyCycleCard from './EnergyCycleCard';
import './EnergyPanel.css';

interface EnergyPanelProps {
  cycleMetrics: EnergyCycleMetrics[];
  summary: EnergySummary;
}

interface BatteryChartPoint {
  name: string;
  battery: number;
  level: string;
}

/** Returns the bar color based on battery percentage thresholds. */
function getBatteryColor(battery: number): string {
  if (battery >= 70) return 'var(--color-success)';
  if (battery >= 40) return 'var(--color-warning)';
  return 'var(--color-critical)';
}

/** Builds chart data from cycle metrics. */
function buildBatteryData(cycles: EnergyCycleMetrics[]): BatteryChartPoint[] {
  return cycles.map((c) => ({
    name: `Ciclo ${c.cycleNumber}`,
    battery: c.batteryLevel,
    level: c.sustainabilityLevel,
  }));
}

const SYSTEM_PARAMS = [
  { label: 'Potência Máxima dos Painéis', value: '500 W' },
  { label: 'Tensão Nominal', value: '28 V' },
  { label: 'Capacidade da Bateria', value: '2000 Wh' },
  { label: 'Fonte', value: 'Solar Fotovoltaica (Renovável)' },
] as const;

/**
 * Full renewable energy monitoring panel with summary, chart, and cycle cards.
 *
 * @example
 * <EnergyPanel cycleMetrics={energyCycles} summary={energySummary} />
 */
export default function EnergyPanel({ cycleMetrics, summary }: EnergyPanelProps) {
  const chartData = buildBatteryData(cycleMetrics);

  return (
    <div className="energy-panel">
      <div className="energy-panel__header">
        <h3 className="energy-panel__title">Painel de Energia Renovável — SERS</h3>
        <p className="energy-panel__subtitle">
          Sistema: Painéis Solares Fotovoltaicos + Bateria de Íon-Lítio
        </p>
      </div>

      <div className="energy-panel__summary">
        <div className="energy-panel__summary-metrics">
          <SummaryMetric
            label="Nível Médio de Bateria"
            value={`${formatDecimal(summary.averageBatteryLevel, 1)}%`}
          />
          <SummaryMetric
            label="Eficiência Fotovoltaica Média"
            value={`${formatDecimal(summary.averageEfficiency, 1)}%`}
          />
          <SummaryMetric
            label="Energia Total Consumida"
            value={`${formatDecimal(summary.totalConsumedEnergy, 1)} Wh`}
          />
          <SummaryMetric label="Fonte de Energia" value="Solar Fotovoltaica" />
        </div>
        <div className="energy-panel__eco-badge">
          <Leaf size={16} />
          <span>Impacto Ambiental: Zero emissões de CO₂</span>
        </div>
        <p className="energy-panel__conclusion">{summary.conclusion}</p>
      </div>

      <div className="energy-panel__chart">
        <h4 className="energy-panel__chart-title">Nível de Bateria por Ciclo</h4>
        <div className="energy-panel__chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  color: 'var(--color-text-primary)',
                }}
                formatter={(value: number) => [`${formatDecimal(value, 1)}%`, 'Bateria']}
              />
              <Bar dataKey="battery" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={getBatteryColor(entry.battery)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="energy-panel__cycle-grid">
        {cycleMetrics.map((m) => (
          <EnergyCycleCard key={m.cycleNumber} metrics={m} />
        ))}
      </div>

      <div className="energy-panel__params">
        <h4 className="energy-panel__params-title">Parâmetros do Sistema</h4>
        <div className="energy-panel__params-grid">
          {SYSTEM_PARAMS.map(({ label, value }) => (
            <div key={label} className="energy-panel__param">
              <span className="energy-panel__param-label">{label}</span>
              <span className="energy-panel__param-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="energy-panel__summary-metric">
      <span className="energy-panel__summary-label">{label}</span>
      <span className="energy-panel__summary-value">{value}</span>
    </div>
  );
}
