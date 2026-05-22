import { Link } from 'react-router-dom';
import { getIndustriesForServiceSlug } from '../../data/internalLinksData';
import { getIndustryById } from '../../data/industriesData';

export default function RelatedIndustries({
  serviceSlug,
  title = 'Industries That Use This Capability',
  description = 'K&C supports these industrial markets with precision machining, tooling, fixtures, and gauge applications.',
  limit = 6,
  className = 'bg-white',
}) {
  const industryIds = getIndustriesForServiceSlug(serviceSlug).slice(0, limit);
  const industries = industryIds.map(getIndustryById).filter(Boolean);

  if (!industries.length) return null;

  return (
    <section className={`section-padding ${className}`.trim()} aria-labelledby="related-industries-heading">
      <div className="section-container">
        <div className="max-w-3xl">
          <h2 id="related-industries-heading" className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
            {title}
          </h2>
          {description ? <p className="mt-4 text-lg leading-relaxed text-metallic">{description}</p> : null}
        </div>

        <ul className="mt-8 flex flex-wrap gap-3">
          {industries.map((industry) => (
            <li key={industry.id}>
              <Link to="/industries" className="kc-related-industry-pill">
                {industry.name}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-metallic">
          <Link to="/industries" className="font-semibold text-brand-primary hover:text-brand-accent">
            View all industries served
          </Link>
        </p>
      </div>
    </section>
  );
}
