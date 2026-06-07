/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/layout/Header';
import { Overview } from './components/mission/Overview';
import { KpiCards } from './components/mission/KpiCards';
import { MissionTimeline } from './components/charts/MissionTimeline';
import { RenewablePanel } from './components/energy/RenewablePanel';
import { TelemetrySimulator } from './components/mission/TelemetrySimulator';
import { MostAffected } from './components/mission/MostAffected';
import { MissionReport } from './components/mission/MissionReport';
import { Footer } from './components/layout/Footer';

import { INITIAL_CYCLES, MISSION_NAME, MISSION_TEAM } from './data/initialData';
import { RawCycle } from './types/mission';
import { analyzeCycle, getActiveKPIs, calculateMissionOverview } from './domain/calculations';
import { Info, HelpCircle } from 'lucide-react';

export default function App() {
  const [cycles, setCycles] = useState<RawCycle[]>(INITIAL_CYCLES);
  const [selectedCycleIndex, setSelectedCycleIndex] = useState<number>(INITIAL_CYCLES.length);

  // Compute all cycle analyses React-style to guarantee consistent updates
  const analyzedCycles = useMemo(() => {
    return cycles.map((c, idx) => {
      const prev = idx > 0 ? cycles[idx - 1] : undefined;
      return analyzeCycle(c, idx + 1, prev);
    });
  }, [cycles]);

  // Aggregate global mission statistics from all current cycles
  const overview = useMemo(() => {
    return calculateMissionOverview(cycles);
  }, [cycles]);

  // Extract active cycle data to render SERS and KPI panels
  const activeCycle = useMemo(() => {
    // Falls back to latest cycle if selectedIndex goes out of bounds
    const found = analyzedCycles.find((c) => c.index === selectedCycleIndex);
    return found || analyzedCycles[analyzedCycles.length - 1];
  }, [analyzedCycles, selectedCycleIndex]);

  // Read active raw values to propagate KPI cards
  const activeRawCycle = useMemo(() => {
    const idx = activeCycle.index - 1;
    return cycles[idx] || cycles[cycles.length - 1];
  }, [cycles, activeCycle]);

  const previousRawCycle = useMemo(() => {
    const idx = activeCycle.index - 2;
    return idx >= 0 ? cycles[idx] : undefined;
  }, [cycles, activeCycle]);

  const activeKPIs = useMemo(() => {
    return getActiveKPIs(activeRawCycle, previousRawCycle);
  }, [activeRawCycle, previousRawCycle]);

  // Callback to append a simulated cycle in real-time
  const handleAddCycle = (newCycle: RawCycle) => {
    const updatedCycles = [...cycles, newCycle];
    setCycles(updatedCycles);
    // Automatically select the newly simulated cycle
    setSelectedCycleIndex(updatedCycles.length);
  };

  // Restores base 6 cycles official data
  const handleReset = () => {
    setCycles(INITIAL_CYCLES);
    setSelectedCycleIndex(INITIAL_CYCLES.length);
  };

  const isDataModified = cycles.length !== INITIAL_CYCLES.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="mission-app">
      {/* Top Banner Control Deck */}
      <Header missionName={MISSION_NAME} teamName={MISSION_TEAM} overview={overview} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-6 space-y-6">
        {/* Academic Mission Statement Notice Card */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950/30 border border-indigo-900/40 p-4 rounded-xl flex items-start gap-3.5 shadow-md">
          <div className="p-2 bg-indigo-950 border border-indigo-800 rounded-lg text-indigo-400 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Console de Monitoramento Integrado</h2>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              Esta plataforma representa o monitoramento analítico do sistema <strong>{MISSION_NAME}</strong> operado pela equipe <strong>{MISSION_TEAM}</strong>. Os dados iniciais refletem exatamente o processamento de análise de risco e os algoritmos de comportamento operacional implementados no protótipo em Python do projeto Mission Control AI. Utilize o simulador inferior para injetar parâmetros operacionais simulados e analisar o comportamento elétrico SERS em tempo real.
            </p>
          </div>
        </div>

        {/* 1. Global Aggregated Metrics */}
        <Overview overview={overview} onReset={handleReset} canReset={isDataModified} />

        {/* 2. Interactive KPI Deck for the selected cycle */}
        <KpiCards kpis={activeKPIs} cycleIndex={activeCycle.index} />

        {/* 3. Primary Data Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-grid">
          {/* Main timeline historical graph - takes 2 cols on desktop */}
          <div className="lg:col-span-2">
            <MissionTimeline
              timelineData={analyzedCycles}
              selectedIndex={activeCycle.index}
              onSelectCycle={setSelectedCycleIndex}
            />
          </div>

          {/* Subsystems diagnostics rank */}
          <div className="lg:col-span-1">
            <MostAffected timelineData={analyzedCycles} />
          </div>
        </div>

        {/* 4. Power & Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="subsystem-modules-grid">
          {/* Renewable SERS Panel */}
          <RenewablePanel activeCycle={activeCycle} />

          {/* New Cycle Telemetry Injector Link */}
          <TelemetrySimulator onAddCycle={handleAddCycle} nextIndex={cycles.length + 1} />
        </div>

        {/* Manual Direct Cycle Quick Selector buttons */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6" id="quick-cycle-selector-panel">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Navegar por Ciclos Estáticos</span>
            <span className="text-xs text-slate-500 font-mono">Clique para fixar visualização</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analyzedCycles.map((cy) => (
              <button
                key={cy.index}
                onClick={() => setSelectedCycleIndex(cy.index)}
                className={`py-2 px-3 rounded-lg border font-mono text-xs font-semibold transition-all ${
                  selectedCycleIndex === cy.index
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                id={`btn-select-cycle-${cy.index}`}
              >
                Ciclo #{cy.index} ({cy.riskScore}% Risco)
              </button>
            ))}
          </div>
        </div>

        {/* 5. Printable Comprehensive Mission Report */}
        <MissionReport timelineData={analyzedCycles} overview={overview} />
      </main>

      <Footer />
    </div>
  );
}
