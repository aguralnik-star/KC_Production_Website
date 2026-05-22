import { Link } from 'react-router-dom';
import { FOOTER_NAV_COLUMNS } from '../../data/footerNavigationData';
import { trackCTAClick } from '../../utils/analytics';

function handleLinkClick(link) {
  if (link.trackAs === 'cta' && link.ctaLabel) {
    trackCTAClick(link.ctaLabel, 'footer', link.to);
  }
}

export default function SEOFooterLinks() {
  return (
    <>
      {FOOTER_NAV_COLUMNS.map((column) => (
        <nav key={column.id} aria-label={column.ariaLabel}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">{column.title}</h2>
          <ul className="space-y-2.5">
            {column.links.map((link) => (
              <li key={`${column.id}-${link.label}`}>
                <Link
                  to={link.to}
                  className="text-sm text-slate-400 hover:text-white"
                  onClick={() => handleLinkClick(link)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </>
  );
}
