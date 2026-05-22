import { SERVICE_NAV_LINKS } from './seoServicePages';

export const SERVICE_SLUGS = {
  CNC_MACHINING: 'cnc-machining',
  CNC_MILLING: 'cnc-milling',
  CNC_TURNING: 'cnc-turning',
  TOOLING: 'tooling',
  FIXTURES: 'fixtures',
  GAUGES: 'gauges',
  PROTOTYPE: 'prototype-machining',
  PRODUCTION: 'production-machining',
};

const SERVICE_LABELS = Object.fromEntries(SERVICE_NAV_LINKS.map(({ slug, label }) => [slug, label]));

export const SERVICE_RELATED_MAP = {
  [SERVICE_SLUGS.CNC_MACHINING]: [
    SERVICE_SLUGS.CNC_MILLING,
    SERVICE_SLUGS.CNC_TURNING,
    SERVICE_SLUGS.PROTOTYPE,
    SERVICE_SLUGS.PRODUCTION,
    SERVICE_SLUGS.TOOLING,
    SERVICE_SLUGS.FIXTURES,
  ],
  [SERVICE_SLUGS.CNC_MILLING]: [
    SERVICE_SLUGS.CNC_MACHINING,
    SERVICE_SLUGS.FIXTURES,
    SERVICE_SLUGS.TOOLING,
    SERVICE_SLUGS.PROTOTYPE,
    SERVICE_SLUGS.PRODUCTION,
  ],
  [SERVICE_SLUGS.CNC_TURNING]: [
    SERVICE_SLUGS.CNC_MACHINING,
    SERVICE_SLUGS.PRODUCTION,
    SERVICE_SLUGS.PROTOTYPE,
  ],
  [SERVICE_SLUGS.TOOLING]: [
    SERVICE_SLUGS.CNC_MACHINING,
    SERVICE_SLUGS.CNC_MILLING,
    SERVICE_SLUGS.FIXTURES,
    SERVICE_SLUGS.PRODUCTION,
  ],
  [SERVICE_SLUGS.FIXTURES]: [
    SERVICE_SLUGS.TOOLING,
    SERVICE_SLUGS.GAUGES,
    SERVICE_SLUGS.CNC_MILLING,
    SERVICE_SLUGS.PRODUCTION,
  ],
  [SERVICE_SLUGS.GAUGES]: [
    SERVICE_SLUGS.FIXTURES,
    SERVICE_SLUGS.TOOLING,
    'quality',
    SERVICE_SLUGS.CNC_MACHINING,
  ],
  [SERVICE_SLUGS.PROTOTYPE]: [
    SERVICE_SLUGS.CNC_MACHINING,
    SERVICE_SLUGS.CNC_MILLING,
    SERVICE_SLUGS.CNC_TURNING,
    SERVICE_SLUGS.PRODUCTION,
  ],
  [SERVICE_SLUGS.PRODUCTION]: [
    SERVICE_SLUGS.CNC_MACHINING,
    SERVICE_SLUGS.CNC_MILLING,
    SERVICE_SLUGS.CNC_TURNING,
    SERVICE_SLUGS.TOOLING,
    SERVICE_SLUGS.FIXTURES,
  ],
};

export const INDUSTRY_SERVICE_MAP = {
  transportation: [SERVICE_SLUGS.CNC_MACHINING, SERVICE_SLUGS.PRODUCTION, SERVICE_SLUGS.FIXTURES],
  medical: [SERVICE_SLUGS.CNC_MACHINING, SERVICE_SLUGS.PROTOTYPE, SERVICE_SLUGS.GAUGES],
  automotive: [SERVICE_SLUGS.CNC_MACHINING, SERVICE_SLUGS.PRODUCTION, SERVICE_SLUGS.TOOLING, SERVICE_SLUGS.FIXTURES],
  hydraulics: [SERVICE_SLUGS.CNC_MACHINING, SERVICE_SLUGS.CNC_MILLING, SERVICE_SLUGS.PRODUCTION],
  valves: [SERVICE_SLUGS.CNC_MACHINING, SERVICE_SLUGS.CNC_TURNING, SERVICE_SLUGS.CNC_MILLING],
  'heavy-equipment': [SERVICE_SLUGS.CNC_MACHINING, SERVICE_SLUGS.PRODUCTION, SERVICE_SLUGS.TOOLING],
  'material-handling': [SERVICE_SLUGS.CNC_MACHINING, SERVICE_SLUGS.FIXTURES, SERVICE_SLUGS.PRODUCTION],
  electronics: [SERVICE_SLUGS.PROTOTYPE, SERVICE_SLUGS.CNC_MILLING, SERVICE_SLUGS.FIXTURES],
  'food-service': [SERVICE_SLUGS.CNC_MACHINING, SERVICE_SLUGS.GAUGES, SERVICE_SLUGS.FIXTURES],
  military: [SERVICE_SLUGS.CNC_MACHINING, SERVICE_SLUGS.TOOLING, SERVICE_SLUGS.GAUGES],
  'custom-inspection-fixtures': [SERVICE_SLUGS.FIXTURES, SERVICE_SLUGS.GAUGES, SERVICE_SLUGS.TOOLING],
  gauges: [SERVICE_SLUGS.GAUGES, SERVICE_SLUGS.FIXTURES, 'quality'],
};

export const PROJECT_CATEGORY_SERVICE_MAP = {
  'CNC Machining': [SERVICE_SLUGS.CNC_MACHINING, SERVICE_SLUGS.CNC_MILLING, SERVICE_SLUGS.CNC_TURNING],
  Tooling: [SERVICE_SLUGS.TOOLING, SERVICE_SLUGS.CNC_MILLING, SERVICE_SLUGS.PRODUCTION],
  Fixtures: [SERVICE_SLUGS.FIXTURES, SERVICE_SLUGS.TOOLING, SERVICE_SLUGS.CNC_MILLING],
  Gauges: [SERVICE_SLUGS.GAUGES, SERVICE_SLUGS.FIXTURES],
  'Prototype Work': [SERVICE_SLUGS.PROTOTYPE, SERVICE_SLUGS.CNC_MACHINING, SERVICE_SLUGS.CNC_MILLING],
  'Production Components': [SERVICE_SLUGS.PRODUCTION, SERVICE_SLUGS.CNC_MACHINING, SERVICE_SLUGS.CNC_TURNING],
  'Inspection Support': [SERVICE_SLUGS.GAUGES, SERVICE_SLUGS.FIXTURES, 'quality'],
};

export const CAPABILITY_SERVICE_LINKS = SERVICE_NAV_LINKS.map(({ slug, label }) => ({
  slug,
  label,
  path: `/services/${slug}`,
  description: `Learn more about ${label.toLowerCase()} from K&C Design and Manufacturing.`,
}));

export const HOME_EXPLORE_LINKS = [
  { label: 'Capabilities Overview', path: '/capabilities', description: 'CNC milling, turning, fixtures, gauges, and production support.' },
  { label: 'Industries Served', path: '/industries', description: 'Markets supported across the Midwest and beyond.' },
  { label: 'Project Showcase', path: '/projects', description: 'Representative machining, tooling, fixture, and gauge examples.' },
  { label: 'Request a Quote', path: '/contact', description: 'Submit drawings and project requirements for review.' },
];

const PAGE_LINKS = {
  quality: { label: 'Quality & Inspection', path: '/quality' },
};

function resolveLinkKey(key) {
  if (PAGE_LINKS[key]) {
    return { ...PAGE_LINKS[key], slug: key, type: 'page' };
  }

  const label = SERVICE_LABELS[key];
  if (!label) return null;

  return {
    slug: key,
    label,
    path: `/services/${key}`,
    type: 'service',
  };
}

export function getServiceLink(slug) {
  return resolveLinkKey(slug);
}

export function getRelatedServiceLinks(slug, limit = 5) {
  const keys = SERVICE_RELATED_MAP[slug] ?? [];
  return keys.map(resolveLinkKey).filter(Boolean).slice(0, limit);
}

export function getIndustryServiceLinks(industryId) {
  const keys = INDUSTRY_SERVICE_MAP[industryId] ?? [];
  return keys.map(resolveLinkKey).filter(Boolean);
}

export function getProjectRelatedServiceLinks(project) {
  if (!project) return [];

  const keys = PROJECT_CATEGORY_SERVICE_MAP[project.category] ?? [SERVICE_SLUGS.CNC_MACHINING];
  return keys.map(resolveLinkKey).filter(Boolean);
}

export function getIndustriesForServiceSlug(slug) {
  return Object.entries(INDUSTRY_SERVICE_MAP)
    .filter(([, services]) => services.includes(slug))
    .map(([industryId]) => industryId);
}
