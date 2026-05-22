import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { SERVICE_NAV_LINKS } from '../../data/seoServicePages';
import { trapFocus } from '../../utils/accessibilityUtils';

function servicePath(slug) {
  return `/services/${slug}`;
}

export function ServicesNavDropdown({ linkClass, onNavigate }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (menuRef.current?.contains(event.target) || buttonRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      trapFocus(menuRef.current, event);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleItemClick = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        className={`${typeof linkClass === 'function' ? linkClass({ isActive: false }) : linkClass} inline-flex items-center gap-1`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="services-nav-menu"
        onClick={() => setOpen((value) => !value)}
      >
        Services
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open ? (
        <div
          id="services-nav-menu"
          ref={menuRef}
          className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg"
          role="menu"
        >
          {SERVICE_NAV_LINKS.map(({ slug, label }) => (
            <NavLink
              key={slug}
              to={servicePath(slug)}
              className="block px-4 py-2.5 text-sm text-charcoal/80 transition-colors hover:bg-slate-50 hover:text-accent"
              role="menuitem"
              onClick={handleItemClick}
            >
              {label}
            </NavLink>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ServicesMobileSection({ linkClass, onNavigate }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li>
      <button
        type="button"
        className={`${typeof linkClass === 'function' ? linkClass({ isActive: false }) : linkClass} flex w-full items-center justify-between rounded-lg px-3 py-2.5 hover:bg-slate-50`}
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        Services
        <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {expanded ? (
        <ul className="mb-2 ml-3 border-l border-slate-200 pl-3">
          {SERVICE_NAV_LINKS.map(({ slug, label }) => (
            <li key={slug}>
              <Link
                to={servicePath(slug)}
                className="block rounded-lg px-3 py-2 text-sm text-charcoal/70 hover:bg-slate-50 hover:text-accent"
                onClick={onNavigate}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
