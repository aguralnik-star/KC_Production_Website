import { SERVICE_NAV_LINKS } from './seoServicePages';

export const FOOTER_BRAND = {
  tagline:
    'Dedicated to quality precision machining, responsive service, and long-term customer relationships across the Midwest.',
};

export const FOOTER_NAV_COLUMNS = [
  {
    id: 'company',
    title: 'Company',
    ariaLabel: 'Company footer links',
    links: [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About' },
      { to: '/quality', label: 'Quality' },
      { to: '/equipment', label: 'Equipment' },
      { to: '/industries', label: 'Industries' },
      { to: '/projects', label: 'Projects' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    id: 'capabilities',
    title: 'Capabilities',
    ariaLabel: 'Capabilities footer links',
    links: SERVICE_NAV_LINKS.map(({ slug, label }) => ({
      to: `/services/${slug}`,
      label,
    })),
  },
  {
    id: 'rfq-support',
    title: 'RFQ & Support',
    ariaLabel: 'RFQ and support footer links',
    links: [
      { to: '/contact', label: 'Request a Quote', trackAs: 'cta', ctaLabel: 'Request a Quote' },
      { to: '/rfq/status', label: 'Check RFQ Status', trackAs: 'cta', ctaLabel: 'Check RFQ Status' },
      { to: '/capabilities', label: 'Capabilities' },
      { to: '/projects', label: 'Project Showcase' },
      { to: '/contact', label: 'Contact K&C', trackAs: 'contact' },
    ],
  },
];
