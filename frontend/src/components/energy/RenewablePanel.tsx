/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Battery, Gauge, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { CycleAnalysis } from '../../types/mission';

interface RenewablePanelProps {
  activeCycle: CycleAnalysis;
}

export function RenewablePanel({ activeCycle }: RenewablePanelProps) {
  // Map Sustainability Status to elegant styling
  const getSustainabilityBadge = (status: string) => {
    switch (status) {
      case 'Sustentabilidade Forte':
        return {
          bg: 'bg-emerald-950/40 text-emerald-400 border-emerald-900',
          indicator: 'bg-emerald-500 animate-pulse',
          description: 'Energia suficiente para operação normal.',
        };
      case 'Sustentabilidade Estável':
        return {
          bg: 'bg-blue-950/40 text-blue-400 border-blue-900',
          indicator: 'bg-blue-500',
          description: 'Nível de energia adequado.',
        };
      case 'Atenção Operacional':
        return {
          bg: 'bg-amber-950/40 text-amber-400 border-amber-950/60',
          indicator: 'bg-amber-500',
          description: 'Energia em atenção. Recomenda-se monitorar o consumo.',
        };
      default:
        return {
          bg: 'bg-rose-950/40 text-rose-400 border-rose-900',
          indicator: 'bg-rose-500 animate-pulse',
          description: 'Baixa reserva energética. Ativar protocolos de economia.',
        };
    }
  };

  const badgeConfig = getSustainabilityBadge(activeCycle.sustainabilityStatus);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-sm" id="sers-panel">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-950/50 border border-indigo-900 rounded-lg">
            <Sun className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-white">Painel de Energia Renovável</h3>
            <p className="text-xs text-slate-400 font-mono">Subsistema Solar e Armazenamento por Baterias de Íon-Lítio.</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium ${badgeConfig.bg}`}>
          <span className={`w-2 h-2 rounded-full ${badgeConfig.indicator}`}></span>
          <span>{activeCycle.sustainabilityStatus.toUpperCase()}</span>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 mb-6 leading-relaxed bg-slate-900/40 border border-slate-850 p-3 rounded-lg font-mono">
        <p className="font-bold text-white mb-1">Sistema de Cálculo:</p>
        <p>• Potência Gerada = Potência Máxima × Eficiência (com Potência Máxima = 500 W e Eficiência = Nível da Bateria / 100)</p>
        <p>• Energia Armazenada = Capacidade × (Nível da Bateria / 100) (com Capacidade = 2000 Wh)</p>
        <p>• Corrente Estimada = Potência Gerada / Tensão Nominal (com Tensão Nominal = 28 V)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Battery storage capacity */}
        <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Nível de Carga</span>
            <Battery className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white font-mono">{activeCycle.battery}%</span>
            <span className="text-[10px] text-slate-400 mt-1 block uppercase">Sistema de Íon-Lítio</span>
          </div>
        </div>

        {/* Metric 2: Estimated stored Wh */}
        <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Energia Armazenada</span>
            <Gauge className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white font-mono">{activeCycle.storedEnergyWh} Wh</span>
            <span className="text-[10px] text-slate-400 mt-1 block uppercase">Estimativa de Energia (Wh)</span>
          </div>
        </div>

        {/* Metric 3: Estimated Watts generated */}
        <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Geração de Potência</span>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white font-mono">{activeCycle.generatedPowerW} W</span>
            <span className="text-[10px] text-slate-400 mt-1 block uppercase">Painéis Fotovoltaicos (W)</span>
          </div>
        </div>

        {/* Metric 4: Estimated Current (A) */}
        <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Corrente Estimada</span>
            <Gauge className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white font-mono">{activeCycle.currentA} A</span>
            <span className="text-[10px] text-slate-400 mt-1 block uppercase">Estimativa de Corrente (A)</span>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 font-mono mt-4 text-right">
        Status correspondente: <strong>{badgeConfig.description}</strong>
      </p>
    </div>
  );
}
