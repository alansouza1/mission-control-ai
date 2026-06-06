import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CycleAnalysis } from '../../types/mission';
import './MissionTimeline.css';

interface MissionTimelineProps {
  cycles: CycleAnalysis[];
}

interface ChartDataPoint {
  name: string;
  Temperatura: number;
  Comunicação: number;
  Bateria: number;
  Oxigênio: number;
  Estabilidade: number;
}

const LINE_CONFIG = [
  { dataKey: 'Temperatura', color: '#ef4444' },
  { dataKey: 'Comunicação', color: '#3b82f6' },
  { dataKey: 'Bateria', color: '#f59e0b' },
  { dataKey: 'Oxigênio', color: '#10b981' },
  { dataKey: 'Estabilidade', color: '#8b5cf6' },
] as const;

/** Transforms cycle analysis data into the flat format Recharts expects. */
function buildChartData(cycles: CycleAnalysis[]): ChartDataPoint[] {
  return cycles.map((c) => ({
    name: `Ciclo ${c.cycleNumber}`,
    Temperatura: c.readings.temperature,
    Comunicação: c.readings.communication,
    Bateria: c.readings.battery,
    Oxigênio: c.readings.oxygen,
    Estabilidade: c.readings.stability,
  }));
}

/**
 * Line chart displaying all five monitored areas across mission cycles.
 *
 * @example
 * <MissionTimeline cycles={cycles} />
 */
export default function MissionTimeline({ cycles }: MissionTimelineProps) {
  const chartData = buildChartData(cycles);

  return (
    <div className="mission-timeline">
      <h3 className="mission-timeline__title">Linha do Tempo da Missão</h3>
      <div className="mission-timeline__chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                color: 'var(--color-text-primary)',
              }}
            />
            <Legend wrapperStyle={{ color: 'var(--color-text-secondary)', fontSize: 13 }} />
            {LINE_CONFIG.map(({ dataKey, color }) => (
              <Line
                key={dataKey}
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 4, fill: color }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
