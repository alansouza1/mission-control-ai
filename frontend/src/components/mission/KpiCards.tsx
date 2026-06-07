/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Thermometer, Radio, Battery, Wind, ShieldAlert, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { ComponentTelemetry } from '../../types/mission';

interface KpiCardsProps {
  kpis: ComponentTelemetry[];
  cycleIndex: number;
}

export function KpiCards({ kpis, cycleIndex }: KpiCardsProps) {
  // Map names to specific Lucide Icons
  const getIcon = (name: string) => {
    switch (name) {
      case 'Temperatura':
        return Thermometer;
      case 'Comunicação':
        return Radio;
      case 'Bateria':
        return Battery;
      case 'Oxigênio':
        return Wind;
      case 'Estabilidade':
        return ShieldAlert;
      default:
        return Thermometer;
    }
  };

  // Status colors mapping
  const getStatusBadge = (status: 'Normal' | 'Atenção' | 'Crítico') => {
    switch (status) {
      case 'Crítico':
        return 'text-red-400 bg-red-950/40 border-red-900/60';
      case 'Atenção':
        return 'text-amber-400 bg-amber-950/40 border-amber-900/60';
      default:
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-900/60';
    }
  };

  // Trend mapping
  const getTrendElement = (trend: 'up' | 'down' | 'stable', isHeatFactor = false) => {
    // isHeatFactor is true for temperature (where up is usually worse, down is better)
    // For communication, battery, oxygen, stability: up is better, down is worse.
    if (trend === 'up') {
      const color = isHeatFactor ? 'text-red-400' : 'text-emerald-400';
      return (
        <span className={`inline-flex items-center text-xs font-mono font-medium gap-0.5 ${color}`}>
          <ArrowUpRight className="w-3.5 h-3.5" />
          CRESCENTE
        </span>
      );
    }
    if (trend === 'down') {
      const color = isHeatFactor ? 'text-emerald-400' : 'text-red-400';
      return (
        <span className={`inline-flex items-center text-xs font-mono font-medium gap-0.5 ${color}`}>
          <ArrowDownRight className="w-3.5 h-3.5" />
          DECRESCENTE
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-xs font-mono text-slate-500 font-medium gap-0.5">
        <Minus className="w-3 h-3" />
        ESTÁVEL
      </span>
    );
  };

  return (
    <div className="space-y-4" id="kpi-panel">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">
          Telemetria do Ciclo #{cycleIndex}
        </h3>
        <span className="text-xs text-slate-500 font-mono">Valores Registrados</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const IconComponent = getIcon(kpi.name);
          const isTemp = kpi.name === 'Temperatura';

          return (
            <div
              key={kpi.name}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition-all group"
              id={`kpi-card-${kpi.name.toLowerCase()}`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg group-hover:bg-slate-800 transition-colors">
                  <IconComponent className="w-4 h-4 text-indigo-400" />
                </div>
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${getStatusBadge(kpi.status)}`}>
                  {kpi.status.toUpperCase()}
                </span>
              </div>

              {/* Main value and unit */}
              <div className="my-4">
                <span className="text-[11px] font-mono text-slate-500 block uppercase">{kpi.name}</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-white tracking-tight font-mono">{kpi.value}</span>
                  <span className="text-xs text-slate-400 font-mono">{kpi.unit}</span>
                </div>
              </div>

              {/* Trend and derived risk */}
              <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                {getTrendElement(kpi.trend, isTemp)}
                <span className="text-[10px] font-mono text-slate-500">
                  Risco: <strong className="text-slate-300">{kpi.risk}%</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
