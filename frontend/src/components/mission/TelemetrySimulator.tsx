/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlusCircle, Info, RefreshCw } from 'lucide-react';
import { RawCycle } from '../../types/mission';

interface TelemetrySimulatorProps {
  onAddCycle: (cycle: RawCycle) => void;
  nextIndex: number;
}

export function TelemetrySimulator({ onAddCycle, nextIndex }: TelemetrySimulatorProps) {
  // Controlled form states for telemetry variables initialized with safe operational averages
  const [temp, setTemp] = useState<number>(24);
  const [comm, setComm] = useState<number>(90);
  const [batt, setBatt] = useState<number>(85);
  const [oxy, setOxy] = useState<number>(96);
  const [stab, setStab] = useState<number>(90);

  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Comprehensive boundary verification
    if (temp < 10 || temp > 50) {
      setErrorMsg('Temperatura fora da tolerância aceitável (10°C a 50°C).');
      return;
    }
    if (comm < 0 || comm > 100 || batt < 0 || batt > 100 || oxy < 0 || oxy > 100 || stab < 0 || stab > 100) {
      setErrorMsg('Os parâmetros percentuais devem se situar estritamente entre 0% e 100%.');
      return;
    }

    setErrorMsg('');
    const newCycle: RawCycle = [temp, comm, batt, oxy, stab];
    onAddCycle(newCycle);

    // Reset controls to safe, neutral operational parameters
    setTemp(25);
    setComm(85);
    setBatt(80);
    setOxy(94);
    setStab(88);
  };

  // Helper presets to allow quick demonstration of different operational scenarios
  const applyPreset = (preset: 'nominal' | 'unstable_comm' | 'reduced_energy' | 'high_temp' | 'low_oxygen') => {
    switch (preset) {
      case 'nominal':
        setTemp(21);
        setComm(98);
        setBatt(95);
        setOxy(99);
        setStab(97);
        break;
      case 'unstable_comm':
        setTemp(25);
        setComm(30);
        setBatt(85);
        setOxy(95);
        setStab(80);
        break;
      case 'reduced_energy':
        setTemp(22);
        setComm(80);
        setBatt(25);
        setOxy(92);
        setStab(85);
        break;
      case 'high_temp':
        setTemp(44);
        setComm(85);
        setBatt(70);
        setOxy(90);
        setStab(75);
        break;
      case 'low_oxygen':
        setTemp(26);
        setComm(82);
        setBatt(60);
        setOxy(45);
        setStab(88);
        break;
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-sm" id="telemetry-simulator">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-semibold text-white">Simulador de Telemetria</h3>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">SIMULAR CICLO DE ENTRADA</span>
      </div>

      {/* Preset Buttons for rapid testing */}
      <div className="mb-6">
        <label className="text-[10px] font-mono text-slate-500 uppercase block mb-2">Carregar Cenários Operacionais</label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset('nominal')}
            className="px-2.5 py-1.5 bg-emerald-950/20 text-emerald-400 border border-emerald-900/60 text-xs font-mono rounded hover:bg-emerald-900/15 transition-colors"
          >
            Operação Nominal
          </button>
          <button
            type="button"
            onClick={() => applyPreset('unstable_comm')}
            className="px-2.5 py-1.5 bg-blue-950/20 text-blue-400 border border-blue-900/60 text-xs font-mono rounded hover:bg-blue-900/15 transition-colors"
          >
            Comunicação Instável
          </button>
          <button
            type="button"
            onClick={() => applyPreset('reduced_energy')}
            className="px-2.5 py-1.5 bg-amber-950/20 text-amber-400 border border-amber-900/60 text-xs font-mono rounded hover:bg-amber-900/15 transition-colors"
          >
            Redução de Energia
          </button>
          <button
            type="button"
            onClick={() => applyPreset('high_temp')}
            className="px-2.5 py-1.5 bg-red-950/20 text-red-400 border border-red-900/60 text-xs font-mono rounded hover:bg-red-900/15 transition-colors"
          >
            Temperatura Elevada
          </button>
          <button
            type="button"
            onClick={() => applyPreset('low_oxygen')}
            className="px-2.5 py-1.5 bg-purple-950/20 text-purple-400 border border-purple-900/60 text-xs font-mono rounded hover:bg-purple-900/15 transition-colors"
          >
            Baixo Nível de Oxigênio
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Temperature Slider */}
          <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-lg">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Temperatura</span>
              <span className="font-bold text-white">{temp} °C</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="1"
              value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
              className="w-full accent-slate-400 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
            />
            <span className="text-[9px] text-slate-500 font-mono block mt-1.5 text-right">Limite: 10 a 50 °C</span>
          </div>

          {/* Communication Slider */}
          <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-lg">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Comunicação</span>
              <span className="font-bold text-white">{comm} %</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={comm}
              onChange={(e) => setComm(Number(e.target.value))}
              className="w-full accent-slate-400 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
            />
            <span className="text-[9px] text-slate-500 font-mono block mt-1.5 text-right w-full">Limite: 0 a 100 %</span>
          </div>

          {/* Battery Slider */}
          <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-lg">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Bateria (SERS)</span>
              <span className="font-bold text-white">{batt} %</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={batt}
              onChange={(e) => setBatt(Number(e.target.value))}
              className="w-full accent-slate-400 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
            />
            <span className="text-[9px] text-slate-500 font-mono block mt-1.5 text-right w-full">Limite: 0 a 100 %</span>
          </div>

          {/* Oxygen Slider */}
          <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-lg">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Oxigênio</span>
              <span className="font-bold text-white">{oxy} %</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={oxy}
              onChange={(e) => setOxy(Number(e.target.value))}
              className="w-full accent-slate-400 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
            />
            <span className="text-[9px] text-slate-500 font-mono block mt-1.5 text-right w-full">Limite: 0 a 100 %</span>
          </div>

          {/* Stability Slider */}
          <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-lg">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Estabilidade</span>
              <span className="font-bold text-white">{stab} %</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={stab}
              onChange={(e) => setStab(Number(e.target.value))}
              className="w-full accent-slate-400 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
            />
            <span className="text-[9px] text-slate-500 font-mono block mt-1.5 text-right w-full">Limite: 0 a 100 %</span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-red-950/30 border border-red-900 text-red-400 rounded text-xs">
            {errorMsg}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
            <Info className="w-3.5 h-3.5 text-indigo-400/80 shrink-0" />
            <span>Inserir este ciclo gerará o <strong>Ciclo #{nextIndex}</strong> nos gráficos em tempo real.</span>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono rounded-lg transition-colors text-xs font-bold shrink-0 shadow-md border border-indigo-500/30"
            id="btn-simulate-submit"
          >
            INJETAR REGISTRO DE TELEMETRIA
          </button>
        </div>
      </form>
    </div>
  );
}
