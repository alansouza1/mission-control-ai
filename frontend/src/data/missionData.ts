import type { AreaMetadata, MonitoredArea } from '../types/mission';

export const MISSION_NAME = 'Orion Sentinel';
export const TEAM_NAME = 'Horizon';

/** Maximum power output of the solar panels in watts. */
export const MAX_POWER_W = 500;

/** Nominal voltage of the spacecraft electrical system in volts. */
export const SYSTEM_VOLTAGE_V = 28;

/** Total battery storage capacity in watt-hours. */
export const BATTERY_CAPACITY_WH = 2000;

/**
 * Raw mission telemetry organized as [temperature, communication, battery, oxygen, stability].
 * Each row represents one monitoring cycle.
 */
export const RAW_MISSION_DATA: number[][] = [
  [22, 95, 92, 98, 96], // Ciclo 1 — início da missão
  [25, 89, 85, 95, 91], // Ciclo 2 — estabilização dos sistemas
  [29, 76, 72, 93, 84], // Ciclo 3 — queda parcial de comunicação
  [33, 61, 57, 89, 73], // Ciclo 4 — alerta de energia
  [37, 45, 41, 84, 58], // Ciclo 5 — risco operacional
  [35, 52, 48, 86, 63], // Ciclo 6 — tentativa de recuperação
];

/** Ordered list mapping column indices to monitored area keys. */
export const AREA_KEYS: MonitoredArea[] = [
  'temperature',
  'communication',
  'battery',
  'oxygen',
  'stability',
];

/** Display metadata for each monitored area (pt-BR labels). */
export const AREA_METADATA: AreaMetadata[] = [
  { key: 'temperature', label: 'Temperatura Interna', unit: '°C' },
  { key: 'communication', label: 'Comunicação com a Base', unit: '%' },
  { key: 'battery', label: 'Sistema de Energia', unit: '%' },
  { key: 'oxygen', label: 'Suporte de Oxigênio', unit: '%' },
  { key: 'stability', label: 'Estabilidade Operacional', unit: '%' },
];

/**
 * Maps a MonitoredArea key to its display metadata.
 *
 * @example
 * const meta = AREA_METADATA_MAP.get('battery');
 * // { key: 'battery', label: 'Sistema de Energia', unit: '%' }
 */
export const AREA_METADATA_MAP: ReadonlyMap<MonitoredArea, AreaMetadata> = new Map(
  AREA_METADATA.map((m) => [m.key, m]),
);
