import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/capabilities', label: 'Capabilities' },
  { to: '/equipment', label: 'Equipment' },
  { to: '/quality', label: 'Quality' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-accent' : 'text-charcoal/80 hover:text-accent'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="border-b border-slate-100 bg-charcoal text-white">
        <div className="section-container mx-auto flex items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <p className="hidden text-xs text-slate-300 sm:block">
            Precision CNC Machining • Fixtures • Tooling • Production Manufacturing
          </p>
          <div className="flex w-full items-center justify-end gap-4 text-xs sm:w-auto">
            <a href="tel:+15551234567" className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white">
              <Phone className="h-3.5 w-3.5" />
              (555) 123-4567
            </a>
            <a href="mailto:quotes@kcdesign.com" className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white">
              <Mail className="h-3.5 w-3.5" />
              quotes@kcdesign.com
            </a>
          </div>
        </div>
      </div>

      <div className="section-container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal text-sm font-bold transition-colors group-hover:bg-accent">
            <span className="text-white">K&amp;C</span>
          </div>
          <div>
            <p className="text-base font-bold leading-tight text-charcoal">K&amp;C Design &amp; Manufacturing</p>
            <p className="text-xs text-metallic">Est. 1987</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/capabilities" className="btn-secondary">View Capabilities</Link>
          <Link to="/contact" className="btn-primary">Request a Quote</Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-charcoal transition-colors hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} className={linkClass} onClick={() => setMobileOpen(false)}>
                <span className="block rounded-lg px-3 py-2.5 hover:bg-slate-50">{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
            <Link to="/capabilities" className="btn-secondary w-full" onClick={() => setMobileOpen(false)}>View Capabilities</Link>
            <Link to="/contact" className="btn-primary w-full" onClick={() => setMobileOpen(false)}>Request a Quote</Link>
          </div>
        </div>
      )}
    </header>
  );
}
