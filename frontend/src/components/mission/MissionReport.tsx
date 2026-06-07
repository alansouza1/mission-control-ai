/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { BookOpen, FileText, Printer, CheckSquare, Award } from 'lucide-react';
import { CycleAnalysis, MissionOverviewMetrics } from '../../types/mission';

interface MissionReportProps {
  timelineData: CycleAnalysis[];
  overview: MissionOverviewMetrics;
}

export function MissionReport({ timelineData, overview }: MissionReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  // Generate a dynamic narrative analysis based on telemetries
  const generateNarrative = (cycles: CycleAnalysis[]) => {
    const total = cycles.length;
    if (total === 0) return 'Nenhum registro de telemetria carregado para análise.';

    let narrative = `O projeto Mission Control AI apresenta a análise consolidada de dados operacionais do sistema ${cycles[0]?.temperature !== undefined ? 'Orion Sentinel' : 'N/A'} em cenários operacionais simulados. `;

    // Analyze the initial 6 cycles (the default official telemetry)
    narrative += `Os ciclos 1 a 6 documentam um cenário de monitoramento de sistemas em ambiente operacional simulado: `;
    narrative += `os Ciclos 1 e 2 apresentavam plena conformidade operacional, com temperatura entre 22°C-25°C e reserva elétrica superior a 85%. `;
    narrative += `A partir do Ciclo 3, iniciou-se uma variação dos indicadores que culminou no Ciclo 5 com Temperatura de 37°C e alteração nas comunicações (45%) e baterias (41%). `;
    narrative += `A estabilização operacional foi registrada no Ciclo 6, com a recuperação dos parâmetros monitorados para 35°C de temperatura e 63% de estabilidade. `;

    // Incorporate user-simulated cycles dynamically
    if (total > 6) {
      const addedCount = total - 6;
      const simulatedList = cycles.slice(6);
      const averageSimulatedRisk = Math.round((simulatedList.reduce((acc, c) => acc + c.riskScore, 0) / addedCount) * 10) / 10;

      narrative += ` Posteriormente, nos ${addedCount} ciclo(s) simulados pelo operador, o sistema de carregamento e bateria comportou-se com risco médio induzido de ${averageSimulatedRisk}%. `;

      const last = cycles[total - 1];
      if (last.riskScore < 25) {
        narrative += `A telemetria mais recente do ciclo #${last.index} confirma que as medidas de contingência restabeleceram as condições ótimas operacionais (Risco atual em ${last.riskScore}%). O sistema encontra-se em regime térmico de segurança.`;
      } else if (last.riskScore >= 45) {
        narrative += `O ciclo final #${last.index} indica uma persistência de anomalia ativa sob risco crítico de ${last.riskScore}%. É urgente a intervenção técnica ou reorientação das cargas de potência do sistema.`;
      } else {
        narrative += `As variáveis atuais mantêm-se em patamar de monitoramento intensivo, aguardando acomodação das reservas de oxigênio de cabine (${last.oxygen}%).`;
      }
    } else {
      narrative += ` O sistema monitorado mantém as diretrizes de recuperação sob coordenação direta da Equipe Horizon.`;
    }

    return narrative;
  };

  // Quick print handler triggering standard browser print on the report frame
  const handlePrint = () => {
    const printContent = reportRef.current?.innerHTML;
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Relatório de Telemetria - Mission Control AI</title>');
      printWindow.document.write('<style>');
      printWindow.document.write(`
        body { background-color: #ffffff; color: #000000; font-family: monospace; padding: 20px; line-height: 1.5; }
        .text-white { color: #000000 !important; }
        .text-slate-400 { color: #475569 !important; }
        .border-slate-800 { border-color: #cbd5e1 !important; }
        .bg-slate-950, .bg-slate-900 { background-color: #f8fafc !important; border: 1px solid #cbd5e1; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px; }
        th, td { border: 1px solid #94a3b8; padding: 8px; text-align: left; font-size: 11px; }
        h1, h2, h3 { font-family: sans-serif; color: #0f172a; }
      `);
      printWindow.document.write('</style></head><body>');
      printWindow.document.write(printContent);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6" id="report-panel">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-semibold text-white">Relatório Técnico de Telemetria</h3>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 rounded font-mono transition-colors"
          title="Exportar relatório formatado para impressão"
          id="btn-print-report"
        >
          <Printer className="w-3.5 h-3.5" />
          IMPRIMIR RELATÓRIO
        </button>
      </div>

      {/* Embedded Printable Report Document */}
      <div
        ref={reportRef}
        className="bg-slate-950 border border-slate-850 p-6 rounded-lg font-mono text-xs text-slate-300 leading-relaxed shadow-inner max-h-[450px] overflow-y-auto"
        id="report-document-body"
      >
        {/* Document Header */}
        <div className="border-b-2 border-slate-700 pb-4 mb-6">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
            <span>REGISTRO DE TELEMETRIA: SENTINEL-MC-AI</span>
          </div>
          <h2 className="text-md sm:text-lg font-black text-white uppercase text-center tracking-wider">
            RELATÓRIO TÉCNICO DE MONITORAMENTO SISTÊMICO
          </h2>
          <p className="text-center text-[10px] text-slate-400 uppercase mt-1">
            Projeto Mission Control AI • Equipe Horizon
          </p>
        </div>

        {/* General Meta Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 border-b border-slate-900 pb-5">
          <div>
            <span className="text-slate-500 block uppercase text-[10px]">SISTEMA MONITORADO:</span>
            <strong className="text-white">Orion Sentinel</strong>
          </div>
          <div>
            <span className="text-slate-500 block uppercase text-[10px]">EQUIPE RESPONSÁVEL:</span>
            <strong className="text-white">Horizon</strong>
          </div>
          <div>
            <span className="text-slate-500 block uppercase text-[10px]">CICLOS EM BASE DE DADOS:</span>
            <strong className="text-white font-mono">{timelineData.length} unidades</strong>
          </div>
        </div>

        {/* Dynamic Summary Section */}
        <div className="space-y-4">
          <h4 className="text-white font-bold uppercase text-[11px] border-b border-slate-900 pb-1">
            I. RESUMO OPERACIONAL
          </h4>
          <p className="text-justify text-slate-300 leading-relaxed font-mono text-[11px]">
            {generateNarrative(timelineData)}
          </p>

          <h4 className="text-white font-bold uppercase text-[11px] border-b border-slate-900 pb-1 pt-2">
            II. DADOS ARITMÉTICOS DE TELEMETRIA E RENDIMENTO
          </h4>

          {/* Telemetries statistics Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-800 text-[10px]">
              <thead>
                <tr className="bg-slate-900 text-slate-400 font-mono">
                  <th className="p-2 border border-slate-850">CICLO</th>
                  <th className="p-2 border border-slate-850 text-right">TEMP (°C)</th>
                  <th className="p-2 border border-slate-850 text-right">COMM (%)</th>
                  <th className="p-2 border border-slate-850 text-right">BATT (%)</th>
                  <th className="p-2 border border-slate-850 text-right">ESTAB (%)</th>
                  <th className="p-2 border border-slate-850 text-right">RISCO (%)</th>
                  <th className="p-2 border border-slate-850 text-right">POTÊNCIA (W)</th>
                </tr>
              </thead>
              <tbody>
                {timelineData.map((cycle) => (
                  <tr key={cycle.index} className="hover:bg-slate-900/40 border-b border-slate-900 font-mono text-slate-300">
                    <td className="p-2 border border-slate-850 font-bold text-white">#{cycle.index}</td>
                    <td className="p-2 border border-slate-850 text-right">{cycle.temperature}°C</td>
                    <td className="p-2 border border-slate-850 text-right">{cycle.communication}%</td>
                    <td className="p-2 border border-slate-850 text-right">{cycle.battery}%</td>
                    <td className="p-2 border border-slate-850 text-right">{cycle.stability}%</td>
                    <td className={`p-2 border border-slate-850 text-right font-bold ${
                      cycle.riskScore >= 45 ? 'text-red-400' : cycle.riskScore >= 20 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {cycle.riskScore}%
                    </td>
                    <td className="p-2 border border-slate-850 text-right">{cycle.generatedPowerW}W</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-white font-bold uppercase text-[11px] border-b border-slate-900 pb-1 pt-2">
            III. CONCLUSÃO DE INTEGRIDADE DO SISTEMA MONITORADO
          </h4>
          <p className="text-justify text-slate-400 leading-relaxed text-[11px] font-mono">
            Este relatório consolida a integridade operacional do sistema monitorado no projeto Mission Control AI. O índice médio acumulado de risco
            operacional situa-se atualmente em <strong className="text-slate-200">{overview.averageRisk}%</strong>. As curvas de telemetria
            permanecem registradas no histórico local de telemetria da equipe Horizon para análise e validação dos resultados.
          </p>

          <div className="flex items-center justify-between pt-8 border-t border-slate-900 text-slate-500 text-[10px]">
            <span>Equipe Horizon (HSO)</span>
            <span>Relatório gerado automaticamente pelo sistema</span>
          </div>
        </div>
      </div>
    </div>
  );
}
