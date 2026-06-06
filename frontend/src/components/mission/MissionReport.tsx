import type { CycleAnalysis, MissionClassification, MissionSummary } from '../../types/mission';
import { AREA_METADATA } from '../../data/missionData';
import { formatClassification, formatRiskLevel, formatDecimal, formatWithUnit } from '../../lib/formatters';
import StatusBadge from '../layout/StatusBadge';
import './MissionReport.css';

interface MissionReportProps {
  cycles: CycleAnalysis[];
  summary: MissionSummary;
}

const CONCLUSION_TEXT: Record<MissionClassification, string> = {
  critical: 'A missão apresentou situações críticas que exigem ações corretivas imediatas.',
  warning: 'A missão apresentou pontos de atenção que exigem monitoramento contínuo.',
  stable: 'A missão permaneceu estável durante todos os ciclos analisados.',
};

/**
 * Render a structured engineering report of the mission analysis.
 *
 * @example
 * <MissionReport cycles={cycles} summary={summary} />
 */
export default function MissionReport({ cycles, summary }: MissionReportProps) {
  return (
    <section className="mission-report">
      <h2 className="mission-report__title">Relatório da Missão</h2>
      <div className="mission-report__meta">
        Missão: {summary.name} · Equipe: {summary.team} · Ciclos analisados: {summary.totalCycles}
      </div>

      <AveragesSection summary={summary} />
      <ResultSection summary={summary} />
      <CyclesSection cycles={cycles} />
    </section>
  );
}

function AveragesSection({ summary }: { summary: MissionSummary }) {
  return (
    <>
      <h3 className="mission-report__section-title">Médias dos Indicadores</h3>
      <table className="mission-report__table">
        <thead>
          <tr>
            <th>Indicador</th>
            <th>Média</th>
          </tr>
        </thead>
        <tbody>
          {AREA_METADATA.map(({ key, label, unit }) => (
            <tr key={key}>
              <td>{label}</td>
              <td>{formatWithUnit(Number(formatDecimal(summary.averages[key], 1)), unit)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function ResultSection({ summary }: { summary: MissionSummary }) {
  return (
    <>
      <h3 className="mission-report__section-title">Resultado</h3>
      <div className="mission-report__result">
        <StatusBadge
          level={summary.finalClassification}
          label={formatClassification(summary.finalClassification)}
        />
      </div>
      <p className="mission-report__trend">{summary.trend}</p>
      <p className="mission-report__conclusion">{CONCLUSION_TEXT[summary.finalClassification]}</p>
    </>
  );
}

function CyclesSection({ cycles }: { cycles: CycleAnalysis[] }) {
  return (
    <>
      <h3 className="mission-report__section-title">Ciclos Detalhados</h3>
      <table className="mission-report__table mission-report__table--cycles">
        <thead>
          <tr>
            <th>Ciclo</th>
            {AREA_METADATA.map(({ key, label }) => (
              <th key={key}>{label}</th>
            ))}
            <th>Risco</th>
            <th>Classificação</th>
          </tr>
        </thead>
        <tbody>
          {cycles.map((cycle) => (
            <CycleRow key={cycle.cycleNumber} cycle={cycle} />
          ))}
        </tbody>
      </table>
    </>
  );
}

function CycleRow({ cycle }: { cycle: CycleAnalysis }) {
  return (
    <tr>
      <td>{cycle.cycleNumber}</td>
      {AREA_METADATA.map(({ key, unit }) => (
        <td key={key}>{formatWithUnit(cycle.readings[key], unit)}</td>
      ))}
      <td>{cycle.totalRisk}</td>
      <td>
        <StatusBadge level={cycle.classification} label={formatClassification(cycle.classification)} />
      </td>
    </tr>
  );
}
