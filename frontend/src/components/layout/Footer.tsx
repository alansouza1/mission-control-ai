/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal, Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/40 py-8 px-6 mt-12 text-slate-500 font-mono text-[11px]" id="mission-footer">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Humble engineering attributes */}
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-650" />
          <span>MISSION CONTROL AI • CONSOLE DE ENGENHARIA v4.2.0</span>
        </div>

        <div className="flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-slate-500" />
          <span>Projeto de Engenharia – Equipe Horizon</span>
        </div>

        <div>
          <span>© 2026 Projeto Orion Sentinel • Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
}
