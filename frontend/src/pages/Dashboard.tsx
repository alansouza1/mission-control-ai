import React from 'react';
import { Activity, BarChart3, Clock, AlertTriangle, Target, Zap, FileText } from 'lucide-react';
import Header from '../components/layout/Header';
import Section from '../components/layout/Section';
import MissionOverview from '../components/mission/MissionOverview';
import KpiGrid from '../components/mission/KpiGrid';
import MissionTimeline from '../components/charts/MissionTimeline';
import RiskAnalysis from '../components/mission/RiskAnalysis';
import AffectedAreas from '../components/mission/AffectedAreas';
import EnergyPanel from '../components/energy/EnergyPanel';
import MissionReport from '../components/mission/MissionReport';
import { useMissionData } from '../hooks/useMissionData';
import './Dashboard.css';

export default function Dashboard() {
  const { cycles, summary, energyCycles, energySummary } = useMissionData();

  return (
    <div className="dashboard-layout">
      <Header 
        missionName={summary.name} 
        teamName={summary.team} 
        totalCycles={summary.totalCycles} 
        classification={summary.finalClassification} 
      />
      
      <main className="dashboard-main">
        <Section title="Visão Geral da Missão" icon={<Activity />}>
          <MissionOverview summary={summary} />
        </Section>
        
        <Section title="Indicadores Atuais" icon={<BarChart3 />}>
          <KpiGrid cycles={cycles} />
        </Section>
        
        <Section title="Linha do Tempo" icon={<Clock />}>
          <MissionTimeline cycles={cycles} />
        </Section>
        
        <div className="dashboard-two-col">
          <Section title="Análise de Risco" icon={<AlertTriangle />}>
            <RiskAnalysis cycles={cycles} summary={summary} />
          </Section>
          
          <Section title="Áreas Afetadas" icon={<Target />}>
            <AffectedAreas summary={summary} />
          </Section>
        </div>
        
        <Section title="Energia Renovável" icon={<Zap />}>
          <EnergyPanel cycleMetrics={energyCycles} summary={energySummary} />
        </Section>
        
        <Section title="Relatório da Missão" icon={<FileText />}>
          <MissionReport cycles={cycles} summary={summary} />
        </Section>
      </main>

      <footer className="dashboard-footer">
        <p>© 2026 Equipe Horizon — Global Solution FIAP</p>
      </footer>
    </div>
  );
}
