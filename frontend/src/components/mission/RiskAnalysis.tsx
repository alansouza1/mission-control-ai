/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, ShieldCheck, ZapOff, Sparkles, HelpCircle } from 'lucide-react';
import { CycleAnalysis } from '../../types/mission';

interface RiskAnalysisProps {
  timelineData: CycleAnalysis[];
  averageRisk: number;
}

export function RiskAnalysis({ timelineData, averageRisk }: RiskAnalysisProps) {
  // Identify critical cycles with a risk score >= 40%
  const criticalCycles = timelineData.filter((c) => c.riskScore >= 40);

  // Find the single absolute peak risk point
  const absolutePeak = timelineData.reduce(
    (peak, current) => (current.riskScore > peak.riskScore ? current : peak),
    timelineData[0] || { index: 1, riskScore: 0 }
  );

  // Generate dynamic, realistic, academically sound engineering recommendations
  const getDynamicRecommendations = (cycles: CycleAnalysis[]) => {
    const list: { id: string; title: string; desc: string; severity: 'critical' | 'warning' | 'info' }[] = [];
    const latest = cycles[cycles.length - 1];

    if (!latest) return list;

    // 1. Oxygen recommendation
    if (latest.oxygen < 88) {
      list.push({
        id: 'oxy',
        title: 'Ajuste de Fluxo de Oxigênio Primário',
        desc: `Nível crítico de O₂ a ${latest.oxygen}%. É recomendada a verificação dos sistemas de pressurização interna e regulagem dos níveis de oxigênio do sistema.`,
        severity: 'critical',
      });
    }

    // 2. Battery recommendation
    if (latest.battery < 55) {
      list.push({
        id: 'batt',
        title: 'Gerenciamento de Carga de Bateria',
        desc: `Reserva energética reduzida (${latest.battery}%). Recomenda-se acionar protocolos de gerenciamento de carga ativa SERS e priorização de sensores principais.`,
        severity: 'critical',
      });
    }

    // 3. Thermal recommendation
    if (latest.temperature > 30) {
      list.push({
        id: 'temp',
        title: 'Dissipação Térmica do Sistema',
        desc: `Temperatura interna de ${latest.temperature}°C está acima do nível desejável. Ativar os acoplamentos de ventilação secundária e monitorar o resfriamento.`,
        severity: 'warning',
      });
    }

    // 4. Stability recommendation
    if (latest.stability < 65) {
      list.push({
        id: 'stab',
        title: 'Estabilidade Operacional',
        desc: `Estabilidade operacional em nível desfavorável (${latest.stability}%). Recomendado atenuar vibrações mecânicas externas e calibrar os sensores de nivelamento estrutural.`,
        severity: 'warning',
      });
    }

    // 5. Comm recommendation
    if (latest.communication < 70) {
      list.push({
        id: 'comm',
        title: 'Varredura de Frequência de Rede',
        desc: `Canal de rede em ${latest.communication}% de intensidade de transmissão. Reajustar frequência de recepção técnica e recalibrar antenas de alinhamento com a estação terrena.`,
        severity: 'warning',
      });
    }

    // If everything is completely normal
    if (list.length === 0) {
      list.push({
        id: 'normal',
        title: 'Estabilidade Operacional Mantida',
        desc: 'Todos os subsistemas analisados operam dentro dos limites nominais de segurança. Continue o monitoramento local dos indicadores.',
        severity: 'info',
      });
    }

    return list;
  };

  const recommendations = getDynamicRecommendations(timelineData);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-sm" id="risk-analysis-panel">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-indigo-400" />
        <h3 className="text-base font-semibold tracking-tight text-white">Análise de Risco Operacional</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk diagnostics statistics */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">ÍNDICE DE CRITICIDADE</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
                {criticalCycles.length}
              </span>
              <span className="text-sm text-slate-400 font-mono">Ciclos Críticos</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Ciclos com o Risco superior ao patamar limite de segurança de <span className="text-red-400 font-mono">40%</span>.
            </p>
          </div>

          <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">PICO ABSOLUTO EXTREMO</span>
            <div className="flex items-baseline justify-between mt-2">
              <div>
                <span className="text-lg font-bold text-slate-200">Ciclo #{absolutePeak.index}</span>
                <span className="text-xs text-slate-400 block">Risco máximo alcançado</span>
              </div>
              <span className="text-2xl font-mono font-black text-rose-500">{absolutePeak.riskScore}%</span>
            </div>
          </div>

          {/* Critical Cycles Timeline Warning */}
          {criticalCycles.length > 0 ? (
            <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-lg text-rose-300 text-xs font-mono">
              <div className="font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 text-red-400">
                <ShieldCheck className="w-3.5 h-3.5 rotate-180 text-red-500 shrink-0" />
                Pontos Críticos Registrados:
              </div>
              Ciclos: {criticalCycles.map((c) => `#${c.index}`).join(', ')} requerem atenção profunda e ajuste ativo dos subsistemas.
            </div>
          ) : (
            <div className="p-3 bg-emerald-950/20 border border-emerald-950/30 rounded-lg text-emerald-300 text-xs font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Nenhum ciclo crítico ativo acima dos limites técnicos recomendados.</span>
            </div>
          )}
        </div>

        {/* Dynamic Engineering Recommendations */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">DIRETRIZES DE MITIGAÇÃO DA RECOMENDAÇÃO</span>

          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
                  rec.severity === 'critical'
                    ? 'border-red-9D text-slate-300 bg-red-950/15 border-red-900/50'
                    : rec.severity === 'warning'
                    ? 'border-amber-9D text-slate-300 bg-amber-950/15 border-amber-900/40'
                    : 'border-slate-800 text-slate-300 bg-slate-900/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      rec.severity === 'critical'
                        ? 'bg-red-500 animate-pulse'
                        : rec.severity === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-indigo-400'
                    }`}
                  ></span>
                  <strong className="text-white font-semibold font-sans">{rec.title}</strong>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{rec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
