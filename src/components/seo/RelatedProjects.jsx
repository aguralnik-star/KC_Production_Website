import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PROJECT_TYPES = [
  'Machined components',
  'Production tooling',
  'Inspection fixtures',
  'Custom gauges',
  'Prototype parts',
  'Production components',
];

export default function RelatedProjects({
  title = 'Representative Project Types',
  description = 'Browse representative machining, tooling, fixture, and gauge examples from K&C.',
  className = 'bg-slate-50',
}) {
  return (
    <section className={`section-padding ${className}`.trim()} aria-labelledby="related-projects-heading">
      <div className="section-container">
        <div className="kc-related-projects-panel">
          <div className="max-w-2xl">
            <h2 id="related-projects-heading" className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
              {title}
            </h2>
            {description ? <p className="mt-4 text-lg leading-relaxed text-metallic">{description}</p> : null}
          </div>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Representative project types">
            {PROJECT_TYPES.map((type) => (
              <li key={type}>
                <span className="kc-related-project-type">{type}</span>
              </li>
            ))}
          </ul>

          <Link to="/projects" className="kc-related-projects-link mt-6 inline-flex items-center gap-2">
            View project showcase
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
