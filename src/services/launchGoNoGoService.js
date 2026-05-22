const STORAGE_KEY = 'kc_launch_go_no_go_v1';

export const DECISION_OPTIONS = [
  { value: 'no_go', label: 'No-Go', description: 'Do not launch until critical blockers are resolved.' },
  { value: 'conditional_go', label: 'Conditional Go', description: 'Launch only after documented conditions are met.' },
  { value: 'go', label: 'Go', description: 'All required criteria verified; approved for public launch.' },
];

export const GO_NO_GO_CRITERIA = [
  {
    area: 'Production build',
    category: 'required',
    defaultStatus: 'pass',
    defaultEvidence: 'npm run build succeeded locally and on Vercel (2439 modules, code-split bundles).',
    defaultRisk: 'Low',
    defaultOwner: 'Engineering',
    defaultDecision: 'Go',
  },
  {
    area: 'Vercel production deployment',
    category: 'required',
    defaultStatus: 'pass',
    defaultEvidence: 'Deployed to https://kc-production-website.vercel.app with SPA rewrites.',
    defaultRisk: 'Low',
    defaultOwner: 'Engineering',
    defaultDecision: 'Go',
  },
  {
    area: 'Supabase migrations',
    category: 'required',
    defaultStatus: 'pass',
    defaultEvidence: 'Migrations 001–016 applied on project uukrvhyepqloqwekzppm.',
    defaultRisk: 'Low',
    defaultOwner: 'Engineering',
    defaultDecision: 'Go',
  },
  {
    area: 'RLS verified',
    category: 'required',
    defaultStatus: 'partial',
    defaultEvidence: 'RLS enabled on all RFQ/admin tables; anonymous RFQ insert still failing (42501).',
    defaultRisk: 'Critical',
    defaultOwner: 'Engineering',
    defaultDecision: 'No-Go',
  },
  {
    area: 'Admin login verified',
    category: 'required',
    defaultStatus: 'fail',
    defaultEvidence: 'No active owner/admin row in admin_profiles; login flow not end-to-end tested.',
    defaultRisk: 'Critical',
    defaultOwner: 'Operations',
    defaultDecision: 'No-Go',
  },
  {
    area: 'RFQ submission tested',
    category: 'required',
    defaultStatus: 'fail',
    defaultEvidence: 'Public anon insert blocked by RLS; admin SQL insert works (KC-RFQ-20260522-0001).',
    defaultRisk: 'Critical',
    defaultOwner: 'Engineering',
    defaultDecision: 'No-Go',
  },
  {
    area: 'File upload tested',
    category: 'required',
    defaultStatus: 'not_tested',
    defaultEvidence: 'Blocked by RFQ insert failure; rfq-files bucket is private.',
    defaultRisk: 'High',
    defaultOwner: 'Engineering',
    defaultDecision: 'No-Go',
  },
  {
    area: 'Internal email tested',
    category: 'required',
    defaultStatus: 'fail',
    defaultEvidence: 'RESEND_API_KEY not configured in Supabase Edge Function secrets.',
    defaultRisk: 'Critical',
    defaultOwner: 'Operations',
    defaultDecision: 'No-Go',
  },
  {
    area: 'Customer confirmation email tested',
    category: 'required',
    defaultStatus: 'fail',
    defaultEvidence: 'Requires Resend configuration and successful RFQ submission.',
    defaultRisk: 'Critical',
    defaultOwner: 'Operations',
    defaultDecision: 'No-Go',
  },
  {
    area: 'Public RFQ status lookup tested',
    category: 'required',
    defaultStatus: 'pass',
    defaultEvidence: 'public-rfq-status-lookup returns 200 with seeded reference KC-RFQ-20260522-0001.',
    defaultRisk: 'Low',
    defaultOwner: 'Engineering',
    defaultDecision: 'Go',
  },
  {
    area: 'Additional info workflow tested',
    category: 'required',
    defaultStatus: 'not_tested',
    defaultEvidence: 'Edge functions deployed; workflow blocked without admin user and Resend.',
    defaultRisk: 'High',
    defaultOwner: 'Engineering',
    defaultDecision: 'No-Go',
  },
  {
    area: 'Admin dashboard tested',
    category: 'required',
    defaultStatus: 'not_tested',
    defaultEvidence: 'Requires active admin user; route protection verified (redirect to login).',
    defaultRisk: 'High',
    defaultOwner: 'Operations',
    defaultDecision: 'No-Go',
  },
  {
    area: 'Analytics tested',
    category: 'required',
    defaultStatus: 'not_tested',
    defaultEvidence: 'Operations analytics views deployed; not validated with live admin session.',
    defaultRisk: 'Medium',
    defaultOwner: 'Operations',
    defaultDecision: 'Conditional Go',
  },
  {
    area: 'Operations dashboard tested',
    category: 'required',
    defaultStatus: 'not_tested',
    defaultEvidence: 'Command center deployed; KPI charts lazy-loaded; manual QA pending.',
    defaultRisk: 'Medium',
    defaultOwner: 'Operations',
    defaultDecision: 'Conditional Go',
  },
  {
    area: 'SEO verified',
    category: 'required',
    defaultStatus: 'pass',
    defaultEvidence: 'Page titles, meta descriptions, robots.txt, sitemap.xml, skip link verified on Vercel.',
    defaultRisk: 'Low',
    defaultOwner: 'Marketing',
    defaultDecision: 'Go',
  },
  {
    area: 'Mobile responsive verified',
    category: 'required',
    defaultStatus: 'partial',
    defaultEvidence: 'Mobile nav and layout render; full device matrix not completed.',
    defaultRisk: 'Medium',
    defaultOwner: 'Design',
    defaultDecision: 'Conditional Go',
  },
  {
    area: 'No critical console errors',
    category: 'required',
    defaultStatus: 'pass',
    defaultEvidence: 'No console errors on /contact after hydration on Vercel deployment.',
    defaultRisk: 'Low',
    defaultOwner: 'Engineering',
    defaultDecision: 'Go',
  },
  {
    area: 'Custom domain connected',
    category: 'conditional',
    defaultStatus: 'fail',
    defaultEvidence: 'www.kcdesignmfg.com still serves legacy static site, not React deployment.',
    defaultRisk: 'High',
    defaultOwner: 'Operations',
    defaultDecision: 'No-Go',
  },
];

function buildDefaultReview() {
  return {
    decision: 'no_go',
    finalNotes: '',
    reviewedAt: null,
    reviewedBy: '',
    criteria: GO_NO_GO_CRITERIA.map((item) => ({
      area: item.area,
      category: item.category,
      status: item.defaultStatus,
      evidence: item.defaultEvidence,
      risk: item.defaultRisk,
      owner: item.defaultOwner,
      decision: item.defaultDecision,
    })),
  };
}

function mergeReview(stored) {
  const defaults = buildDefaultReview();
  if (!stored) return defaults;

  const criteriaMap = new Map((stored.criteria ?? []).map((row) => [row.area, row]));
  return {
    ...defaults,
    ...stored,
    criteria: defaults.criteria.map((row) => ({
      ...row,
      ...(criteriaMap.get(row.area) ?? {}),
    })),
  };
}

export function loadLaunchGoNoGoReview() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildDefaultReview();
    return mergeReview(JSON.parse(raw));
  } catch {
    return buildDefaultReview();
  }
}

export function saveLaunchGoNoGoReview(review) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(review));
}

export function summarizeGoNoGoReview(review) {
  const required = review.criteria.filter((row) => row.category === 'required');
  const pass = required.filter((row) => row.status === 'pass').length;
  const fail = required.filter((row) => row.status === 'fail').length;
  const partial = required.filter((row) => row.status === 'partial').length;
  const notTested = required.filter((row) => row.status === 'not_tested').length;
  const noGoRows = required.filter((row) => row.decision === 'No-Go').length;

  return {
    totalRequired: required.length,
    pass,
    fail,
    partial,
    notTested,
    noGoRows,
    passRate: required.length ? Math.round((pass / required.length) * 100) : 0,
  };
}

export function deriveRecommendedDecision(review) {
  const summary = summarizeGoNoGoReview(review);
  const hasCriticalFail = review.criteria.some(
    (row) => row.category === 'required' && (row.status === 'fail' || row.risk === 'Critical'),
  );

  if (hasCriticalFail || summary.fail > 0 || summary.noGoRows >= 4) {
    return 'no_go';
  }
  if (summary.notTested > 0 || summary.partial > 0 || summary.noGoRows > 0) {
    return 'conditional_go';
  }
  return 'go';
}
