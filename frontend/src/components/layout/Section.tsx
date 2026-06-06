import type { ReactNode } from 'react';
import './Section.css';

interface SectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

/**
 * Dashboard section wrapper with a labeled header row.
 *
 * @example
 * <Section title="Análise de Ciclos" icon={<BarChart3 size={14} />}>
 *   <CycleTable />
 * </Section>
 */
export default function Section({ title, children, icon }: SectionProps) {
  return (
    <section className="section">
      <div className="section__header">
        {icon && <span className="section__icon">{icon}</span>}
        <h2 className="section__title">{title}</h2>
      </div>
      {children}
    </section>
  );
}
