import { COMPANY } from '../data/company';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.kcdesignmfg.com').replace(/\/$/, '');

export const BRAND = {
  primaryBlue: '#0D4F8B',
  navy: '#0A2745',
  steelGray: '#6B7280',
  lightGray: '#F3F5F7',
  white: '#FFFFFF',
  accentBlue: '#2E6DA4',
};

export const HERO_CONTENT = {
  eyebrow: 'Precision CNC Machining • Tooling • Fixtures • Gauges',
  headline: 'Precision Manufacturing Built on Quality, Service, and Long-Term Trust',
  subheadline:
    'K&C Design and Manufacturing provides precision CNC machining, tooling, fixtures, gauges, and custom manufacturing services for Midwest manufacturers.',
  primaryCta: 'Request a Quote',
  secondaryCta: 'View Capabilities',
};

export const DEFAULT_SEO = {
  title: 'K&C Design and Manufacturing | Precision CNC Machining in Addison, IL',
  description:
    'K&C Design and Manufacturing provides precision CNC machining, tooling, fixtures, gauges, and custom manufacturing services for Midwest manufacturers.',
  keywords:
    'precision machining, CNC machining, CNC milling, CNC turning, manufacturing fixtures, inspection gauges, Addison IL machine shop, Midwest CNC machining',
  ogImage: `${SITE_URL}/kc-logo.svg`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
};

export const PAGE_SEO = {
  home: {
    title: 'K&C Design and Manufacturing | Precision CNC Machining in Addison, IL',
    description: HERO_CONTENT.subheadline,
    path: '/',
    schema: 'localBusiness',
    ogImage: `${SITE_URL}/kc-logo.svg`,
  },
  about: {
    title: 'About K&C Design and Manufacturing | Family-Owned Since 1987',
    description:
      'Learn about K&C Design and Manufacturing, a family-owned precision machining partner serving Midwest manufacturers since 1987.',
    path: '/about',
  },
  capabilities: {
    title: 'CNC Machining Capabilities | K&C Design and Manufacturing',
    description:
      'Explore CNC milling, turning, prototype machining, production runs, fixtures, gauges, and custom tooling from K&C Design and Manufacturing.',
    path: '/capabilities',
  },
  equipment: {
    title: 'CNC Equipment & Inspection | K&C Design and Manufacturing',
    description:
      'Haas CNC machining centers, CMM inspection, optical comparator, Mastercam programming, and precision gauging at K&C Design and Manufacturing.',
    path: '/equipment',
  },
  quality: {
    title: 'Quality & Inspection | K&C Design and Manufacturing',
    description:
      'First-class quality, precision inspection, repeatability, and responsive service from K&C Design and Manufacturing in Addison, IL.',
    path: '/quality',
  },
  industries: {
    title: 'Industries Served | K&C Design and Manufacturing',
    description:
      'Precision machined components for transportation, medical, automotive, industrial equipment, hydraulics, electronics, and more.',
    path: '/industries',
  },
  projects: {
    title: 'Project Showcase | K&C Design and Manufacturing',
    description:
      'Representative machining, tooling, fixture, gauge, prototype, and production component projects from K&C Design and Manufacturing.',
    path: '/projects',
  },
  contact: {
    title: 'Request a Quote | K&C Design and Manufacturing',
    description:
      'Submit an RFQ for precision CNC machining, fixtures, gauges, or production tooling. K&C Design and Manufacturing — Addison, IL.',
    path: '/contact',
  },
  rfqStatus: {
    title: 'Check RFQ Status | K&C Design and Manufacturing',
    description:
      'Securely check your RFQ status using your reference number and the email address used during submission.',
    path: '/rfq/status',
    noindex: true,
  },
  rfqConfirmation: {
    title: 'RFQ Submitted | K&C Design and Manufacturing',
    description: 'Your RFQ submission has been received by K&C Design and Manufacturing.',
    path: '/rfq/confirmation',
    noindex: true,
  },
  additionalInfo: {
    title: 'Provide Additional RFQ Information | K&C Design and Manufacturing',
    description:
      'Securely upload revised drawings or provide additional RFQ information requested by K&C Design and Manufacturing.',
    path: '/rfq/additional-info',
    noindex: true,
  },
};

export const SITEMAP_PATHS = [
  '/',
  '/about',
  '/capabilities',
  '/equipment',
  '/quality',
  '/industries',
  '/projects',
  '/services/cnc-machining',
  '/services/cnc-milling',
  '/services/cnc-turning',
  '/services/tooling',
  '/services/fixtures',
  '/services/gauges',
  '/services/prototype-machining',
  '/services/production-machining',
  '/contact',
  '/rfq/status',
];

export const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: COMPANY.name,
  image: `${SITE_URL}/kc-logo-mark.svg`,
  url: SITE_URL,
  telephone: COMPANY.phone,
  email: COMPANY.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address,
    addressLocality: 'Addison',
    addressRegion: 'IL',
    postalCode: '60101',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 41.9312,
    longitude: -88.0029,
  },
  areaServed: 'Midwest United States',
  serviceType: 'Precision CNC Machining',
  description: DEFAULT_SEO.description,
  foundingDate: '1987',
  priceRange: '$$',
  sameAs: [],
  knowsAbout: ['Precision CNC Machining', 'Fixtures', 'Gauges', 'Production Tooling'],
};

export const ADMIN_RFQ_LIST_LIMIT = 250;
