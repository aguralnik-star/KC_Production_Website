export const PUBLIC_PAGES = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/capabilities', label: 'Capabilities' },
  { path: '/equipment', label: 'Equipment' },
  { path: '/quality', label: 'Quality' },
  { path: '/industries', label: 'Industries' },
  { path: '/projects', label: 'Projects' },
  { path: '/contact', label: 'Contact / RFQ' },
  { path: '/rfq/status', label: 'RFQ Status Lookup' },
  { path: '/services/cnc-machining', label: 'CNC Machining' },
  { path: '/services/cnc-milling', label: 'CNC Milling' },
  { path: '/services/cnc-turning', label: 'CNC Turning' },
  { path: '/services/tooling', label: 'Tooling' },
  { path: '/services/fixtures', label: 'Fixtures' },
  { path: '/services/gauges', label: 'Gauges' },
  { path: '/services/prototype-machining', label: 'Prototype Machining' },
  { path: '/services/production-machining', label: 'Production Machining' },
];

export const ALLOWED_FACTS = {
  company: {
    name: 'K&C Design and Manufacturing, Inc.',
    address: '422 S. Irmen Drive',
    city: 'Addison, IL 60101',
    phone: '(630) 543-3386',
    email: 'info@kcdesignmfg.com',
    founded: 1987,
    founder: 'Keith Clark',
  },
  history: [
    'Founded in Carol Stream, Illinois',
    'Started with inspection gauging, production tooling, and manufacturing fixtures',
    'Machining capabilities added in 1992',
    'First dedicated facility in 1997',
    'Expanded into current Addison facility in 2011',
  ],
  capabilities: [
    'CNC machining',
    'CNC milling',
    'CNC turning',
    'Prototype machining',
    'Production machining',
    'Tooling',
    'Fixtures',
    'Gauges',
    'Inspection fixtures',
    'Custom machined components',
    'Quality inspection',
    'CAD/CAM programming',
    'Mastercam programming',
  ],
  equipment: [
    'Haas VF-2',
    'Haas VF-3 vertical machining centers',
    '4-axis rotary table capability',
    'Haas ST-10 CNC lathe',
    'Mitutoyo Crysta-Plus M574 CMM',
    'Optical comparator',
    'Profilometer',
    'Air gauging equipment',
    'Inspection microscope',
    'Video borescope systems',
    'Thread gauges',
    'Plug gauges',
    'Ring gauges',
    'Pin gauges',
    'Micrometers',
    'Calipers',
    'Bore gauges',
    'Mastercam',
  ],
  materials: [
    'Carbon steels',
    'Tool steels',
    'Stainless steels',
    'Aluminum alloys',
    'Brass',
    'Copper',
    'Bronze',
    'Cast iron',
    'Delrin',
    'Nylon',
    'UHMW',
    'PVC',
    'Lexan',
    'Engineering plastics',
  ],
  industries: [
    'Transportation',
    'Medical',
    'Automotive',
    'Hydraulics',
    'Valves',
    'Heavy equipment',
    'Material handling',
    'Gaming',
    'Electronics',
    'Food service',
    'Military',
    'Custom inspection fixtures',
    'Gauges',
  ],
};

export const AUDIT_CATEGORIES = [
  {
    id: 'business-identity',
    title: 'Business Identity Accuracy',
    checks: [
      'Company name consistent across pages',
      'Address consistent across pages and schema',
      'Phone and email consistent',
      'Founded date consistent',
      'Founder and history accurate',
    ],
  },
  {
    id: 'capability-accuracy',
    title: 'Capability Accuracy',
    checks: [
      'CNC machining language accurate',
      'CNC milling language accurate',
      'CNC turning language accurate',
      'Tooling language accurate',
      'Fixture language accurate',
      'Gauge language accurate',
      'Prototype/production language accurate',
    ],
  },
  {
    id: 'equipment-accuracy',
    title: 'Equipment Accuracy',
    checks: [
      'Only verified equipment listed as owned',
      'Representative equipment clearly labeled',
      'No unsupported 5-axis ownership claims',
      'No unsupported machine specs',
    ],
  },
  {
    id: 'certification-compliance',
    title: 'Certification / Compliance Safety',
    checks: [
      'No ISO claim',
      'No AS9100 claim',
      'No ITAR claim',
      'No FDA/medical certification claim',
      'No aerospace certification claim',
      'No defense certification claim',
    ],
  },
  {
    id: 'customer-industry',
    title: 'Customer / Industry Safety',
    checks: [
      'No fake testimonials presented as real',
      'Representative testimonials clearly labeled',
      'No customer logos unless approved',
      'Industry served language does not imply certification',
    ],
  },
  {
    id: 'seo-quality',
    title: 'SEO Quality',
    checks: [
      'No keyword stuffing',
      'Unique title/meta per page',
      'Natural internal links',
      'Accurate service descriptions',
      'Local SEO information consistent',
    ],
  },
  {
    id: 'rfq-conversion',
    title: 'RFQ Conversion Content',
    checks: [
      'CTA text clear',
      'RFQ instructions accurate',
      'File upload instructions accurate',
      'Confirmation/status language clear',
      'No promise of quote turnaround unless confirmed',
    ],
  },
];

export const UNSUPPORTED_CLAIM_GROUPS = [
  {
    id: 'certifications',
    title: 'Certifications',
    claims: [
      { id: 'cert-iso', label: 'ISO certified / ISO 9001', risk: 'critical', searchTerms: ['ISO', 'ISO 9001'] },
      { id: 'cert-as9100', label: 'AS9100', risk: 'critical', searchTerms: ['AS9100'] },
      { id: 'cert-itar', label: 'ITAR registered', risk: 'critical', searchTerms: ['ITAR'] },
      { id: 'cert-fda', label: 'FDA approved / medical certified', risk: 'critical', searchTerms: ['FDA', 'medical certified'] },
      { id: 'cert-aerospace', label: 'Aerospace certified', risk: 'critical', searchTerms: ['aerospace certified'] },
      { id: 'cert-defense', label: 'Military / defense certified', risk: 'critical', searchTerms: ['military certified', 'defense certified'] },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance',
    claims: [
      { id: 'comp-medical', label: 'Certified medical manufacturing', risk: 'critical', searchTerms: ['certified medical'] },
      { id: 'comp-aerospace', label: 'Certified aerospace supplier', risk: 'critical', searchTerms: ['certified aerospace'] },
      { id: 'comp-defense', label: 'Certified defense supplier', risk: 'critical', searchTerms: ['certified defense'] },
      { id: 'comp-med-device', label: 'Regulated medical device manufacturer', risk: 'critical', searchTerms: ['medical device manufacturer'] },
      { id: 'comp-itar', label: 'ITAR compliant', risk: 'critical', searchTerms: ['ITAR compliant'] },
      { id: 'comp-gov', label: 'Government-approved supplier', risk: 'high', searchTerms: ['government-approved'] },
    ],
  },
  {
    id: 'equipment',
    title: 'Equipment',
    claims: [
      { id: 'equip-umc750', label: 'Haas UMC-750 ownership', risk: 'high', searchTerms: ['UMC-750', 'UMC 750'] },
      { id: 'equip-5axis', label: '5-axis machining capability', risk: 'high', searchTerms: ['5-axis', '5 axis'] },
      { id: 'equip-live-tooling', label: 'Live tooling capability', risk: 'medium', searchTerms: ['live tooling'] },
      { id: 'equip-bar-feed', label: 'Bar feed capability', risk: 'medium', searchTerms: ['bar feed', 'bar-fed'] },
      { id: 'equip-lights-out', label: 'Lights-out automation', risk: 'high', searchTerms: ['lights-out', 'lights out'] },
    ],
  },
  {
    id: 'customer-claims',
    title: 'Customer Claims',
    claims: [
      { id: 'cust-named', label: 'Named customers without approval', risk: 'high', searchTerms: [] },
      { id: 'cust-logos', label: 'Customer logos without approval', risk: 'high', searchTerms: [] },
      { id: 'cust-fortune', label: 'Fortune 500 customers', risk: 'high', searchTerms: ['Fortune 500', 'Fortune500'] },
      { id: 'cust-oem', label: 'OEM-approved supplier', risk: 'high', searchTerms: ['OEM approved', 'OEM-approved'] },
      { id: 'cust-preferred', label: 'Preferred vendor (unconfirmed)', risk: 'medium', searchTerms: ['preferred vendor'] },
    ],
  },
  {
    id: 'performance-claims',
    title: 'Performance Claims',
    claims: [
      { id: 'perf-fastest', label: 'Guaranteed fastest turnaround', risk: 'high', searchTerms: ['fastest turnaround', 'guaranteed fastest'] },
      { id: 'perf-lowest', label: 'Guaranteed lowest price', risk: 'high', searchTerms: ['lowest price', 'guaranteed lowest'] },
      { id: 'perf-zero-defect', label: 'Zero defects / perfect quality', risk: 'high', searchTerms: ['zero defect', 'perfect quality'] },
      { id: 'perf-guaranteed-tolerance', label: 'Guaranteed tolerances without qualification', risk: 'medium', searchTerms: ['guaranteed tolerance'] },
      { id: 'perf-same-day', label: 'Same-day quotes (unconfirmed)', risk: 'medium', searchTerms: ['same-day quote', 'same day quote'] },
      { id: 'perf-emergency', label: 'Emergency machining (unconfirmed)', risk: 'medium', searchTerms: ['emergency machining'] },
    ],
  },
  {
    id: 'industry-claims',
    title: 'Industry Claims',
    claims: [
      { id: 'ind-military-cert', label: 'Military certification implied', risk: 'critical', searchTerms: ['military certified', 'defense compliance'] },
      { id: 'ind-medical-cert', label: 'Medical device certification implied', risk: 'critical', searchTerms: ['medical certified', 'medical device certification'] },
    ],
  },
];

export const REPLACEMENT_LANGUAGE = [
  { insteadOf: 'ISO-certified quality', use: 'Inspection-driven quality process' },
  { insteadOf: 'Medical certified machining', use: 'Machining support for medical industry applications' },
  { insteadOf: 'Military certified supplier', use: 'Machining support for military-related industry applications' },
  { insteadOf: '5-axis machining capability', use: 'CNC machining capability (unless 5-axis equipment is confirmed)' },
  { insteadOf: 'Guaranteed fastest turnaround', use: 'Prompt quotations and responsive communication' },
  { insteadOf: 'Bar-fed turning', use: 'Short-run and production CNC turning' },
  { insteadOf: 'Zero defects', use: 'Inspection-focused manufacturing and repeatability' },
];

export const RISKY_SEARCH_TERMS = [
  'ISO',
  'AS9100',
  'ITAR',
  'FDA',
  'certified',
  'certification',
  'aerospace',
  'defense',
  'guaranteed',
  'zero defect',
  'Fortune',
  'OEM approved',
  '5-axis',
  'UMC-750',
  'live tooling',
  'bar feed',
  'bar-fed',
];

export const PAGE_STATUS_OPTIONS = ['pending', 'approved', 'needs_revision', 'blocked'];
export const RISK_LEVEL_OPTIONS = ['low', 'medium', 'high', 'critical'];
export const DECISION_OPTIONS = ['pending', 'approved', 'needs_revision', 'blocked'];
export const CLAIM_STATUS_OPTIONS = ['pending', 'reviewed', 'issue_found', 'resolved'];

export function buildDefaultPageReviews() {
  return PUBLIC_PAGES.reduce((reviews, page) => {
    reviews[page.path] = {
      path: page.path,
      label: page.label,
      status: 'pending',
      riskLevel: 'low',
      claimsReviewed: 0,
      issuesFound: '',
      notes: '',
      decision: 'pending',
    };
    return reviews;
  }, {});
}

export function buildDefaultClaimChecks() {
  const checks = {};

  UNSUPPORTED_CLAIM_GROUPS.forEach((group) => {
    group.claims.forEach((claim) => {
      checks[claim.id] = {
        id: claim.id,
        groupId: group.id,
        label: claim.label,
        risk: claim.risk,
        status: 'pending',
        notes: '',
        evidence: '',
      };
    });
  });

  return checks;
}

export function buildDefaultCategoryChecks() {
  return AUDIT_CATEGORIES.reduce((checks, category) => {
    checks[category.id] = { id: category.id, status: 'pending', notes: '' };
    return checks;
  }, {});
}

export function flattenUnsupportedClaims() {
  return UNSUPPORTED_CLAIM_GROUPS.flatMap((group) =>
    group.claims.map((claim) => ({ ...claim, groupId: group.id, groupTitle: group.title })),
  );
}
