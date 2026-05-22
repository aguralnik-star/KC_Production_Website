import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/admin/rfqs', label: 'RFQs', match: (location) => location.pathname === '/admin/rfqs' && !location.search.includes('tab=reminders') },
  { to: '/admin/rfq-operations#analytics', label: 'Analytics', match: (location) => location.pathname === '/admin/rfq-operations' && location.hash === '#analytics' },
  { to: '/admin/rfqs?tab=reminders', label: 'Reminders', match: (location) => location.pathname === '/admin/rfqs' && new URLSearchParams(location.search).get('tab') === 'reminders' },
  { to: '/admin/rfq-readiness', label: 'Readiness', match: (location) => location.pathname === '/admin/rfq-readiness' },
  { to: '/admin/rfq-operations', label: 'Operations', match: (location) => location.pathname === '/admin/rfq-operations' && location.hash !== '#analytics' },
  { to: '/admin/launch-checklist', label: 'Launch', match: (location) => location.pathname === '/admin/launch-checklist' },
  { to: '/admin/launch-go-no-go', label: 'Go/No-Go', match: (location) => location.pathname === '/admin/launch-go-no-go' },
  { to: '/admin/handoff', label: 'Handoff', match: (location) => location.pathname === '/admin/handoff' },
  { to: '/admin/go-live', label: 'Go-Live', match: (location) => location.pathname === '/admin/go-live' },
  { to: '/admin/post-launch', label: 'Post-Launch', match: (location) => location.pathname === '/admin/post-launch' },
  { to: '/admin/mobile-browser-qa', label: 'Mobile & Browser QA', match: (location) => location.pathname === '/admin/mobile-browser-qa' },
  { to: '/admin/content-qa', label: 'Content QA', match: (location) => location.pathname === '/admin/content-qa' },
  { to: '/admin/owner-handoff', label: 'Owner Handoff', match: (location) => location.pathname === '/admin/owner-handoff' },
];

export default function AdminNav() {
  const location = useLocation();

  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Admin navigation">
      {NAV_ITEMS.map(({ to, label, match }) => {
        const active = match(location);
        return (
          <Link
            key={to}
            to={to}
            className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${
              active
                ? 'border-accent bg-accent text-white'
                : 'border-slate-200 text-charcoal hover:border-accent hover:text-accent'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
