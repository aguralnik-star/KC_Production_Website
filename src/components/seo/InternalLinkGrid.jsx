import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function InternalLinkGrid({
  title,
  description,
  links = [],
  columns = 2,
  className = '',
  headingId,
  variant = 'card',
}) {
  if (!links.length) return null;

  const gridClass =
    columns === 4
      ? 'sm:grid-cols-2 xl:grid-cols-4'
      : columns === 3
        ? 'sm:grid-cols-2 lg:grid-cols-3'
        : 'sm:grid-cols-2';

  return (
    <section className={`section-padding ${className}`.trim()} aria-labelledby={headingId}>
      <div className="section-container">
        {title ? (
          <div className="max-w-3xl">
            <h2 id={headingId} className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              {title}
            </h2>
            {description ? <p className="mt-4 text-lg leading-relaxed text-metallic">{description}</p> : null}
          </div>
        ) : null}

        <ul className={`mt-8 grid gap-4 ${gridClass}`}>
          {links.map((link) => (
            <li key={link.path}>
              {variant === 'pill' ? (
                <Link to={link.path} className="kc-internal-link-pill">
                  {link.label}
                </Link>
              ) : (
                <Link to={link.path} className="kc-internal-link-card group">
                  <span className="kc-internal-link-card__title">{link.label}</span>
                  {link.description ? (
                    <span className="kc-internal-link-card__description">{link.description}</span>
                  ) : null}
                  <span className="kc-internal-link-card__action">
                    Learn more
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
