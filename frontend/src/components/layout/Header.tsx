import { Rocket, Users, Activity, Clock } from 'lucide-react';
import type { MissionClassification } from '../../types/mission';
import './Header.css';

interface HeaderProps {
  missionName: string;
  teamName: string;
  totalCycles: number;
  classification: MissionClassification;
}

/**
 * Top-level dashboard header displaying mission branding and metadata.
 *
 * @example
 * <Header missionName="Orion IV" teamName="Alpha" totalCycles={10} classification="stable" />
 */
export default function Header({ missionName, teamName, totalCycles, classification }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__bar">
        <Brand />
        <MetaPills
          missionName={missionName}
          teamName={teamName}
          totalCycles={totalCycles}
        />
      </div>
      <div className={`header__status-strip header__status-strip--${classification}`} />
    </header>
  );
}

function Brand() {
  return (
    <div className="header__brand">
      <Rocket size={20} className="header__icon" />
      <span className="header__title">Mission Control AI</span>
    </div>
  );
}

interface MetaPillsProps {
  missionName: string;
  teamName: string;
  totalCycles: number;
}

function MetaPills({ missionName, teamName, totalCycles }: MetaPillsProps) {
  return (
    <div className="header__meta">
      <Pill icon={<Activity size={12} />} text={missionName} />
      <Pill icon={<Users size={12} />} text={teamName} />
      <Pill icon={<Clock size={12} />} text={`${totalCycles} ciclos`} />
    </div>
  );
}

interface PillProps {
  icon: React.ReactNode;
  text: string;
}

function Pill({ icon, text }: PillProps) {
  return (
    <span className="header__pill">
      <span className="header__pill-icon">{icon}</span>
      {text}
    </span>
  );
}
