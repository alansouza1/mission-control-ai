/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Radio, Shield, Users, Clock } from 'lucide-react';
import { MissionOverviewMetrics } from '../../types/mission';

interface HeaderProps {
  missionName: string;
  teamName: string;
  overview: MissionOverviewMetrics;
}

export function Header({ missionName, teamName, overview }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('2026-06-06 23:04:30');

  useEffect(() => {
    // Keep a ticking clock in standard ISO format for logging synchronization
    const interval = setInterval(() => {
      const now = new Date();
      const utcString = now.toISOString().replace('T', ' ').substring(0, 19);
      setCurrentTime(utcString);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Status-dependent visual pills
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Alerta Crítico':
        return 'bg-red-950/40 text-red-400 border border-red-800/60';
      case 'Monitoramento Intensivo':
        return 'bg-amber-950/40 text-amber-400 border border-amber-800/60';
      default:
        return 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/60';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'Alerta Crítico':
        return 'bg-red-500 animate-pulse';
      case 'Monitoramento Intensivo':
        return 'bg-amber-500 animate-pulse';
      default:
        return 'bg-emerald-500';
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4" id="mission-header">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Name and Designation */}
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-slate-900 border border-slate-700/50 rounded-xl shadow-inner">
            <Radio className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">PROJETO ACADÊMICO HORIZON</span>
              <span className="text-[10px] py-0.5 px-2 bg-slate-800 border border-slate-700 text-slate-300 rounded font-mono">
                TELEMETRIA ATIVA
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Missão {missionName}
            </h1>
          </div>
        </div>

        {/* Operational Status Panel */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Active Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium ${getStatusClasses(overview.status)}`}>
            <span className={`w-2 h-2 rounded-full ${getStatusIndicator(overview.status)}`}></span>
            <span>{overview.status.toUpperCase()}</span>
          </div>

          {/* Team Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Equipe:</span>
            <span className="font-semibold text-white">{teamName}</span>
          </div>

          {/* Analyzed Cycles Counter */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-500">Ciclos Analisados:</span>
            <span className="font-bold text-white">{overview.totalCycles}</span>
          </div>

          {/* Mission MET / UTC */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">UTC:</span>
            <span className="text-slate-200">{currentTime}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
