import { CalendarDays, ClipboardList, Cog, FileSearch, Send } from 'lucide-react';
import { SHARED_PROCESS } from '../../data/seoServicePages';

const STEP_ICONS = [Send, FileSearch, ClipboardList, CalendarDays, Cog];

export default function ServiceProcess() {
  return (
    <section className="section-padding" aria-labelledby="service-process-heading">
      <div className="section-container">
        <h2 id="service-process-heading" className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
          {SHARED_PROCESS.title}
        </h2>

        <ol className="capability-process-strip mt-10">
          {SHARED_PROCESS.steps.map(({ number, title }, index) => {
            const Icon = STEP_ICONS[index] ?? Cog;
            return (
              <li key={title} className="capability-process-strip__step card">
                <div className="capability-process-strip__icon-wrap" aria-hidden="true">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="capability-process-strip__number">Step {number}</p>
                <p className="capability-process-strip__title">{title}</p>
                {index < SHARED_PROCESS.steps.length - 1 ? (
                  <span className="capability-process-strip__connector hidden lg:block" aria-hidden="true" />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
