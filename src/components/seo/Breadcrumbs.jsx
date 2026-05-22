import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items = [], className = '', dark = false }) {
  if (!items.length) return null;

  const toneClass = dark ? 'kc-breadcrumbs--dark' : '';

  return (
    <nav aria-label="Breadcrumb" className={`kc-breadcrumbs ${toneClass} ${className}`.trim()}>
      <ol className="kc-breadcrumbs__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="kc-breadcrumbs__item">
              {isLast || !item.to ? (
                <span className="kc-breadcrumbs__current" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="kc-breadcrumbs__link">
                  {item.label}
                </Link>
              )}
              {!isLast ? <ChevronRight className="kc-breadcrumbs__separator" aria-hidden="true" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
