/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, Thermometer, Radio, Battery, Wind, ShieldAlert } from 'lucide-react';
import { CycleAnalysis } from '../../types/mission';
import { calculateTempRisk } from '../../domain/calculations';

interface MostAffectedProps {
  timelineData: CycleAnalysis[];
}

export function MostAffected({ timelineData }: MostAffectedProps) {
  if (timelineData.length === 0) return null;

  // Calculate accumulated risk for each of the 5 channels
  let totalTempRisk = 0;
  let totalCommRisk = 0;
  let totalBattRisk = 0;
  let totalOxyRisk = 0;
  let totalStabRisk = 0;

  timelineData.forEach((c) => {
    totalTempRisk += calculateTempRisk(c.temperature);
    totalCommRisk += (100 - c.communication);
    totalBattRisk += (100 - c.battery);
    totalOxyRisk += (100 - c.oxygen);
    totalStabRisk += (100 - c.stability);
  });

  const count = timelineData.length;
  const subsystems = [
    {
      key: 'temperature',
      name: 'Temperatura do Sistema',
      avgRisk: Math.round((totalTempRisk / count) * 10) / 10,
      icon: Thermometer,
      description: 'Responsável pelo monitoramento térmico e integridade operacional do sistema principal sob condições operacionais adversas.',
      colorClass: 'text-red-400 border-red-900 bg-red-950/10',
    },
    {
      key: 'communication',
      name: 'Subsistema de Comunicações',
      avgRisk: Math.round((totalCommRisk / count) * 10) / 10,
      icon: Radio,
      description: 'Mantém o canal de transmissão de dados e telemetria ativa com as estações terrenas de recebimento.',
      colorClass: 'text-blue-400 border-blue-900 bg-blue-950/10',
    },
    {
      key: 'battery',
      name: 'Armazenamento de Energia (Baterias)',
      avgRisk: Math.round((totalBattRisk / count) * 10) / 10,
      icon: Battery,
      description: 'Gerencia o recebimento de energia solar fotovoltaica e o armazenamento de tensão elétrica estável nas baterias.',
      colorClass: 'text-amber-400 border-amber-900 bg-amber-950/10',
    },
    {
      key: 'oxygen',
      name: 'Regulador Atmosférico (Oxigênio)',
      avgRisk: Math.round((totalOxyRisk / count) * 10) / 10,
      icon: Wind,
      description: 'Preserva as taxas nominais de atmosfera pressurizada interna e fornecimento balanceado de oxigênio.',
      colorClass: 'text-emerald-400 border-emerald-900 bg-emerald-950/10',
    },
    {
      key: 'stability',
      name: 'Estabilidade Operacional (Estrutura)',
      avgRisk: Math.round((totalStabRisk / count) * 10) / 10,
      icon: ShieldAlert,
      description: 'Mede e analisa a estabilidade operacional, integridade de componentes estruturais e equilíbrio estrutural global.',
      colorClass: 'text-violet-400 border-violet-900 bg-violet-950/10',
    },
  ];

  // Sort subsystems to find the one with the highest accumulated average risk
  const sorted = [...subsystems].sort((a, b) => b.avgRisk - a.avgRisk);
  const worst = sorted[0];

  const IconComponent = worst.icon;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between h-full" id="most-affected-panel">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-semibold tracking-tight text-white">Subsistema Mais Degradado</h3>
        </div>

        <p className="text-xs text-slate-400 font-mono mb-5 leading-relaxed">
          Determinado algoritmicamente a partir da análise histórica dos indicadores monitorados.
        </p>

        {/* Highlight board for the worst subsystem */}
        <div className={`p-4 border rounded-xl flex items-start gap-3.5 ${worst.colorClass}`}>
          <div className="p-2 border border-slate-800/80 rounded-lg bg-slate-900 shrink-0">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1.5">{worst.name}</h4>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black font-mono leading-none">{worst.avgRisk}%</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">MÉDIA DE DESVIO-RISCO</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{worst.description}</p>
          </div>
        </div>
      </div>

      {/* Grid of all 5 subsystems risk to see comparing ranks */}
      <div className="mt-6 border-t border-slate-900 pt-5 space-y-3">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">ÍNDICES DE DEGRADAÇÃO OPERACIONAL</span>
        <div className="space-y-2">
          {subsystems.map((sub) => (
            <div key={sub.key} className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 truncate max-w-[150px] sm:max-w-xs">{sub.name.split(' (')[0]}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      sub.avgRisk >= 40 ? 'bg-red-500' : sub.avgRisk >= 20 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${sub.avgRisk}%` }}
                  ></div>
                </div>
                <span className="font-bold text-slate-300 w-8 text-right">{sub.avgRisk}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
