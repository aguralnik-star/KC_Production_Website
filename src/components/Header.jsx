import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import CTAButton from './CTAButton';
import Logo from './Logo';
import { COMPANY } from '../data/company';
import { trapFocus } from '../utils/accessibilityUtils';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/capabilities', label: 'Capabilities' },
  { to: '/equipment', label: 'Equipment' },
  { to: '/quality', label: 'Quality' },
  { to: '/industries', label: 'Industries' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileNavRef = useRef(null);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        return;
      }
      trapFocus(mobileNavRef.current, event);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-charcoal/80 hover:text-accent'}`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="border-b border-slate-100 bg-charcoal text-white">
        <div className="section-container mx-auto flex items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <p className="hidden text-xs text-slate-300 sm:block">
            Precision CNC Machining • Fixtures • Tooling • Production Manufacturing
          </p>
          <div className="flex w-full items-center justify-end gap-4 text-xs sm:w-auto">
            <a href={`tel:${COMPANY.phoneTel}`} className="flex items-center gap-1.5 text-slate-300 hover:text-white">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {COMPANY.phone}
            </a>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-1.5 text-slate-300 hover:text-white">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              {COMPANY.email}
            </a>
          </div>
        </div>
      </div>

      <div className="section-container mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Logo
          variant="default"
          asLink
          showText
          className="h-[38px] w-auto max-w-[min(100%,220px)] shrink-0 object-contain object-left sm:h-12 sm:max-w-none"
          linkClassName="shrink-0 transition-opacity hover:opacity-90"
        />

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Main navigation">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/rfq/status" className="hidden text-sm font-medium text-charcoal/70 hover:text-accent xl:inline">
            Check RFQ Status
          </Link>
          <CTAButton to="/capabilities" variant="secondary">View Capabilities</CTAButton>
          <CTAButton to="/contact">Request a Quote</CTAButton>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-charcoal hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          ref={mobileNavRef}
          className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} end={to === '/'} className={linkClass} onClick={() => setMobileOpen(false)}>
                  <span className="block rounded-lg px-3 py-2.5 hover:bg-slate-50">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
            <CTAButton to="/capabilities" variant="secondary" className="w-full" onClick={() => setMobileOpen(false)}>View Capabilities</CTAButton>
            <CTAButton to="/contact" className="w-full" onClick={() => setMobileOpen(false)}>Request a Quote</CTAButton>
            <Link
              to="/rfq/status"
              className="block rounded-lg px-3 py-2.5 text-center text-sm font-medium text-charcoal hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
            >
              Check RFQ Status
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
