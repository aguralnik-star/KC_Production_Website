import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const footerLinks = {
  Company: [
    { to: '/about', label: 'About Us' },
    { to: '/capabilities', label: 'Capabilities' },
    { to: '/equipment', label: 'Equipment' },
    { to: '/quality', label: 'Quality' },
  ],
  Services: [
    { to: '/capabilities', label: 'CNC Milling' },
    { to: '/capabilities', label: 'CNC Turning' },
    { to: '/capabilities', label: 'Fixtures & Gauges' },
    { to: '/capabilities', label: 'Production Runs' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-charcoal text-white">
      <div className="section-padding pb-8">
        <div className="section-container">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-accent-light">K&amp;C</div>
                <div>
                  <p className="font-bold">K&amp;C Design &amp; Manufacturing</p>
                  <p className="text-xs text-slate-400">Family-owned since 1987</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                American precision manufacturing delivering CNC machined components, fixtures, tooling, and production solutions you can trust.
              </p>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">{title}</h3>
                <ul className="space-y-2.5">
                  {links.map(({ to, label }) => (
                    <li key={label}>
                      <Link to={to} className="text-sm text-slate-400 transition-colors hover:text-white">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">Contact</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-light" />
                  <span>1200 Industrial Parkway<br />Manufacturing District, USA 44101</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-accent-light" />
                  <a href="tel:+15551234567" className="hover:text-white">(555) 123-4567</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-accent-light" />
                  <a href="mailto:quotes@kcdesign.com" className="hover:text-white">quotes@kcdesign.com</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 shrink-0 text-accent-light" />
                  <span>Mon–Fri, 7:00 AM – 4:30 PM</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} K&amp;C Design &amp; Manufacturing. All rights reserved.</p>
            <p className="text-sm text-slate-500">Precision CNC Machining • Fixtures • Tooling • Production Manufacturing</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
