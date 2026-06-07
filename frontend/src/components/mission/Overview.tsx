/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, RefreshCcw, Activity } from 'lucide-react';
import { MissionOverviewMetrics } from '../../types/mission';

interface OverviewProps {
  overview: MissionOverviewMetrics;
  onReset: () => void;
  canReset: boolean;
}

export function Overview({ overview, onReset, canReset }: OverviewProps) {
  // Translate cumulative trends to Portuguese with custom styling
  const getTrendConfig = (trend: string) => {
    switch (trend) {
      case 'Melhora Contínua':
        return {
          label: 'Fase de Recuperação',
          description: 'A curva de risco aponta redução após ações de mitigação do sistema.',
          icon: TrendingDown,
          colorClass: 'text-emerald-400 bg-emerald-950/20 border-emerald-800/40',
        };
      case 'Declínio Sistêmico':
        return {
          label: 'Deterioração das Variáveis',
          description: 'Os parâmetros estão se afastando dos limites ótimos.',
          icon: TrendingUp,
          colorClass: 'text-red-400 bg-red-950/20 border-red-800/40',
        };
      case 'Estabilidade Crítica':
        return {
          label: 'Estabilidade Limite',
          description: 'Risco estabilizado em patamar fora do limite operacional.',
          icon: Activity,
          colorClass: 'text-amber-400 bg-amber-950/20 border-amber-800/40',
        };
      default:
        return {
          label: 'Estabilidade Operacional',
          description: 'Sem desvios significativos detectados no ciclo recente.',
          icon: Activity,
          colorClass: 'text-slate-300 bg-slate-900 border-slate-700/50',
        };
    }
  };

  const trendConfig = getTrendConfig(overview.trend);
  const TrendIcon = trendConfig.icon;

  return (
    <section className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-sm" id="mission-overview">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white mb-1">Visão Geral da Operação</h2>
          <p className="text-sm text-slate-400">Dados consolidados do projeto de engenharia e integridade agregada dos subsistemas analisados.</p>
        </div>

        {/* Clear/Reset telemetry helper to restore original 6 cycles state */}
        {canReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white rounded-lg transition-colors font-mono"
            title="Restaurar dados oficiais do projeto"
            id="btn-reset-telemetry"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            RESTAURAR TELEMETRIA BASE (6 CICLOS)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* Metric 1: Status */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Status do Sistema</span>
          <div className="mt-2">
            <span className="text-lg font-bold text-white block">
              {overview.status}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Classificação em tempo real
            </span>
          </div>
        </div>

        {/* Metric 2: Mission Trend */}
        <div className={`border rounded-xl p-4 flex flex-col justify-between ${trendConfig.colorClass}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider">Tendência Global</span>
            <TrendIcon className="w-4 h-4 opacity-85" />
          </div>
          <div className="mt-2">
            <span className="text-lg font-bold block">{trendConfig.label}</span>
            <span className="text-[11px] leading-relaxed mt-1 block opacity-80">
              {trendConfig.description}
            </span>
          </div>
        </div>

        {/* Metric 3: Average Cumulative Risk */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Média de Risco Global</span>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {overview.averageRisk}%
              </span>
              <span className="text-xs text-slate-400 font-mono">índice</span>
            </div>
            {/* Simple visual mini progress bar */}
            <div className="w-full bg-slate-800 h-1 rounded overflow-hidden mt-2">
              <div
                className={`h-full ${
                  overview.averageRisk >= 40 ? 'bg-red-500' : overview.averageRisk >= 20 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${overview.averageRisk}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Metric 4: Most Critical Cycle */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Ponto Crítico Histórico</span>
          <div className="mt-2">
            <span className="text-lg font-bold text-white block flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              Ciclo #{overview.mostCriticalCycleIndex}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Com pico de risco de <strong className="text-red-400 font-mono">{overview.mostCriticalCycleRisk}%</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
