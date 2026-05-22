import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Printer } from 'lucide-react';
import Logo from './Logo';
import { COMPANY } from '../data/company';

const footerLinks = {
  Company: [
    { to: '/about', label: 'About Us' },
    { to: '/capabilities', label: 'Capabilities' },
    { to: '/projects', label: 'Projects' },
    { to: '/equipment', label: 'Equipment' },
    { to: '/quality', label: 'Quality' },
    { to: '/industries', label: 'Industries' },
  ],
  Services: [
    { to: '/contact', label: 'Request a Quote' },
    { to: '/rfq/status', label: 'Check RFQ Status' },
    { to: '/capabilities', label: 'CNC Machining' },
    { to: '/capabilities', label: 'Fixtures & Gauges' },
    { to: '/capabilities', label: 'Production Tooling' },
    { to: '/capabilities', label: 'Prototype Machining' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-charcoal text-white">
      <div className="section-padding pb-8">
        <div className="section-container">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4">
                <Logo
                  variant="white"
                  showText
                  className="h-11 w-auto max-w-[240px] object-contain object-left"
                />
                <p className="mt-3 text-sm font-medium text-slate-200">{COMPANY.name}</p>
                <p className="text-xs text-slate-400">Founded {COMPANY.founded} • Addison, IL</p>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                Dedicated to quality precision machining, responsive service, and long-term customer relationships across the Midwest.
              </p>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <nav key={title} aria-label={`${title} footer links`}>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">{title}</h2>
                <ul className="space-y-2.5">
                  {links.map(({ to, label }) => (
                    <li key={label}>
                      <Link to={to} className="text-sm text-slate-400 hover:text-white">{label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">Contact</h2>
              <address className="space-y-3 text-sm not-italic text-slate-400">
                <p className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-light" aria-hidden="true" />
                  <span>{COMPANY.address}<br />{COMPANY.city}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-accent-light" aria-hidden="true" />
                  <a href={`tel:${COMPANY.phoneTel}`} className="hover:text-white">{COMPANY.phone}</a>
                </p>
                <p className="flex items-center gap-2.5">
                  <Printer className="h-4 w-4 shrink-0 text-accent-light" aria-hidden="true" />
                  <span>Fax: {COMPANY.fax}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-accent-light" aria-hidden="true" />
                  <a href={`mailto:${COMPANY.email}`} className="hover:text-white">{COMPANY.email}</a>
                </p>
              </address>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} {COMPANY.name} All rights reserved.</p>
            <p className="text-sm text-slate-500">Addison, IL • Midwest USA Manufacturing Partner</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
