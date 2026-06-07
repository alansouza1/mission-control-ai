/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CycleAnalysis } from '../../types/mission';
import { Activity, ShieldAlert, Thermometer, Radio, Battery, Wind, Settings2 } from 'lucide-react';

interface MissionTimelineProps {
  timelineData: CycleAnalysis[];
  selectedIndex: number;
  onSelectCycle: (index: number) => void;
}

export function MissionTimeline({ timelineData, selectedIndex, onSelectCycle }: MissionTimelineProps) {
  const [selectedParam, setSelectedParam] = useState<string>('all');

  const paramOptions = [
    { value: 'all', label: 'Ver Todos os Sinais', icon: Settings2 },
    { value: 'riskScore', label: 'Evolução de Risco (%)', icon: ShieldAlert, color: '#f43f5e' },
    { value: 'temperature', label: 'Temperatura (°C)', icon: Thermometer, color: '#f87171' },
    { value: 'communication', label: 'Sinal de Comunicações (%)', icon: Radio, color: '#60a5fa' },
    { value: 'battery', label: 'Carga da Bateria (%)', icon: Battery, color: '#fbbf24' },
    { value: 'oxygen', label: 'Nível de Oxigênio (%)', icon: Wind, color: '#34d399' },
    { value: 'stability', label: 'Estabilidade Estrutural (%)', icon: Activity, color: '#a78bfa' },
  ];

  // Colors for multi-line view
  const colors = {
    riskScore: '#f43f5e',
    temperature: '#f87171',
    communication: '#60a5fa',
    battery: '#fbbf24',
    oxygen: '#34d399',
    stability: '#a78bfa',
  };

  // Custom tooltips in Brazilian Portuguese with Mission Control styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-slate-800 p-4 rounded-xl shadow-2xl font-mono text-xs max-w-xs">
          <p className="text-white font-bold mb-2 border-b border-slate-800 pb-1">CICLO #{label}</p>
          <div className="space-y-1.5">
            {payload.map((p: any) => (
              <div key={p.name} className="flex items-center justify-between gap-4">
                <span className="text-slate-400 text-[10px] uppercase">{p.name}:</span>
                <span className="font-bold font-mono" style={{ color: p.color || p.stroke }}>
                  {p.value}
                  {p.name === 'Temperatura' ? ' °C' : ' %'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-slate-500 mt-2 italic text-right">Clique no ponto para fixar KPI</p>
        </div>
      );
    };
    return null;
  };

  const handleChartClick = (state: any) => {
    if (state && state.activeTooltipIndex !== undefined) {
      // Find cycle number matching clicked point
      const clickedData = timelineData[state.activeTooltipIndex];
      if (clickedData) {
        onSelectCycle(clickedData.index);
      }
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between h-full" id="mission-timeline">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-white mb-1">Evolução Temporal de Telemetria</h3>
            <p className="text-xs text-slate-400 font-mono">Histórico completo de ciclos monitorados e comportamento operacional.</p>
          </div>

          {/* Metric Selector for Single/Multi signal */}
          <div className="flex flex-wrap gap-1.5 bg-slate-900/60 p-1 rounded-lg border border-slate-800/80 max-w-md">
            {paramOptions.map((opt) => {
              const active = selectedParam === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSelectedParam(opt.value)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${active
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  id={`btn-chart-filter-${opt.value}`}
                >
                  <opt.icon className="w-3.5 h-3.5" style={active ? {} : { color: opt.color }} />
                  {opt.label.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Highlight Bar */}
        <div className="mb-4 py-1.5 px-3 bg-indigo-950/20 border border-indigo-900/40 rounded-lg text-[11px] font-mono text-indigo-300 flex items-center justify-between">
          <span>Ciclo Ativo selecionado no painel: <strong>Ciclo #{selectedIndex}</strong></span>
          <span className="text-[10px] text-indigo-400/80 uppercase">Interativo: Clique no gráfico para alternar ciclo</span>
        </div>
      </div>

      <div className="w-full text-slate-300" id="recharts-wrapper">
        <ResponsiveContainer width="100%" height={300} minWidth={0}>
          <LineChart
            data={timelineData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            onClick={handleChartClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="index"
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fontFamily: 'monospace' }}
            />
            <YAxis
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fontFamily: 'monospace' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 10, fontFamily: 'monospace', paddingTop: 10 }}
              iconType="circle"
              iconSize={8}
            />

            {/* Conditionally render line based on selected param */}
            {(selectedParam === 'all' || selectedParam === 'riskScore') && (
              <Line
                name="Score de Risco"
                type="monotone"
                dataKey="riskScore"
                stroke={colors.riskScore}
                strokeWidth={selectedParam === 'riskScore' ? 3 : 2}
                dot={{ r: 4, strokeWidth: 1 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            )}

            {(selectedParam === 'all' || selectedParam === 'temperature') && (
              <Line
                name="Temperatura"
                type="monotone"
                dataKey="temperature"
                stroke={colors.temperature}
                strokeWidth={selectedParam === 'temperature' ? 3 : 1.5}
                dot={{ r: selectedIndex === -1 ? 3 : (state) => (timelineData[state.index]?.index === selectedIndex ? 6 : 3) }}
              />
            )}

            {(selectedParam === 'all' || selectedParam === 'communication') && (
              <Line
                name="Comunicação"
                type="monotone"
                dataKey="communication"
                stroke={colors.communication}
                strokeWidth={selectedParam === 'communication' ? 3 : 1.5}
                dot={{ r: 3 }}
              />
            )}

            {(selectedParam === 'all' || selectedParam === 'battery') && (
              <Line
                name="Bateria"
                type="monotone"
                dataKey="battery"
                stroke={colors.battery}
                strokeWidth={selectedParam === 'battery' ? 3 : 1.5}
                dot={{ r: 3 }}
              />
            )}

            {(selectedParam === 'all' || selectedParam === 'oxygen') && (
              <Line
                name="Oxigênio"
                type="monotone"
                dataKey="oxygen"
                stroke={colors.oxygen}
                strokeWidth={selectedParam === 'oxygen' ? 3 : 1.5}
                dot={{ r: 3 }}
              />
            )}

            {(selectedParam === 'all' || selectedParam === 'stability') && (
              <Line
                name="Estabilidade"
                type="monotone"
                dataKey="stability"
                stroke={colors.stability}
                strokeWidth={selectedParam === 'stability' ? 3 : 1.5}
                dot={{ r: 3 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
