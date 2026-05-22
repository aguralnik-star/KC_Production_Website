import { SITEMAP_PATHS } from '../config/siteConfig';
import { SEO_SERVICE_PAGES } from '../data/seoServicePages';

const STORAGE_KEY = 'kc_final_launch_review_v1';

export const LAUNCH_DECISION_OPTIONS = [
  {
    value: 'ready',
    label: 'Ready for Launch',
    description: 'All critical criteria verified; approved for public launch.',
  },
  {
    value: 'conditional',
    label: 'Conditional Launch',
    description: 'Launch acceptable after documented non-blocking items are tracked.',
  },
  {
    value: 'not_ready',
    label: 'Not Ready',
    description: 'Critical blockers must be resolved before launch.',
  },
];

export const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/capabilities',
  '/equipment',
  '/quality',
  '/industries',
  '/projects',
  '/contact',
  '/rfq/status',
  ...SEO_SERVICE_PAGES.map((page) => page.path),
];

const CHECKLIST_SECTIONS = [
  {
    id: 'public-pages',
    title: 'Public Page QA',
    items: PUBLIC_ROUTES.map((route) => ({
      id: `page-${route.replace(/\//g, '-') || 'home'}`,
      label: `${route} loads with header, footer, and CTAs`,
      defaultStatus: 'pass',
      defaultEvidence: 'Route registered; lazy-loaded public bundle; shared Header/Footer layout.',
    })),
  },
  {
    id: 'seo',
    title: 'SEO QA',
    items: [
      { id: 'seo-titles', label: 'Unique page titles on all public pages', defaultStatus: 'pass', defaultEvidence: 'PAGE_SEO + service page data drive document.title via SEO component.' },
      { id: 'seo-descriptions', label: 'Unique meta descriptions', defaultStatus: 'pass', defaultEvidence: 'Per-page descriptions in siteConfig and seoServicePages.js.' },
      { id: 'seo-h1', label: 'One h1 per public page', defaultStatus: 'partial', defaultEvidence: 'Hero pages use h1; Equipment, Contact, Industries, and RFQ Status use SectionHeading h2 — fix applied in this pass.' },
      { id: 'seo-canonical', label: 'Canonical URLs set', defaultStatus: 'pass', defaultEvidence: 'buildPageSeo + applySeoToDocument upsert canonical link.' },
      { id: 'seo-og', label: 'Open Graph title and description', defaultStatus: 'pass', defaultEvidence: 'og:title and og:description set from page SEO config.' },
      { id: 'seo-local-business', label: 'LocalBusiness schema on home', defaultStatus: 'pass', defaultEvidence: 'Home uses schema="localBusiness".' },
      { id: 'seo-service-schema', label: 'Service + FAQ schema on service pages', defaultStatus: 'pass', defaultEvidence: 'buildServicePageJsonLd in serviceSeoUtils.js.' },
      { id: 'seo-sitemap', label: 'Sitemap includes all public indexable routes', defaultStatus: 'pass', defaultEvidence: `SITEMAP_PATHS (${SITEMAP_PATHS.length} URLs) matches public/sitemap.xml.` },
      { id: 'seo-robots', label: 'robots.txt allows public site and blocks admin/token routes', defaultStatus: 'pass', defaultEvidence: 'Disallow /admin and /rfq/additional-info; sitemap URL declared.' },
      { id: 'seo-internal-links', label: 'Internal links between services and core pages', defaultStatus: 'pass', defaultEvidence: 'Header Services dropdown, footer links, HomeServicesPreview, related service chips.' },
    ],
  },
  {
    id: 'content',
    title: 'Content Accuracy',
    items: [
      { id: 'content-no-iso', label: 'No ISO / AS9100 / ITAR / certification claims', defaultStatus: 'pass', defaultEvidence: 'Codebase grep: no ISO, AS9100, or ITAR claims in public copy.' },
      { id: 'content-no-customers', label: 'No named customer references', defaultStatus: 'pass', defaultEvidence: 'Projects page states representative examples only.' },
      { id: 'content-equipment', label: 'Equipment claims match documented Haas/CMM inventory', defaultStatus: 'pass', defaultEvidence: 'Equipment page lists VF-2, VF-3, ST-10, Mitutoyo CMM, inspection tools, Mastercam.' },
      { id: 'content-industries', label: 'Industries served without compliance certification claims', defaultStatus: 'pass', defaultEvidence: 'Medical/Military listed as industries served, not as certified/regulated approvals.' },
      { id: 'content-nap', label: 'NAP consistent across site and schema', defaultStatus: 'pass', defaultEvidence: 'company.js + LOCAL_BUSINESS_SCHEMA match Addison address and phone.' },
    ],
  },
  {
    id: 'rfq',
    title: 'RFQ Conversion',
    items: [
      { id: 'rfq-cta-routes', label: 'Request a Quote CTAs route to /contact', defaultStatus: 'pass', defaultEvidence: 'Header, heroes, service CTA, and project CTAs use /contact.' },
      { id: 'rfq-form-visible', label: 'RFQ form visible on /contact with required fields', defaultStatus: 'pass', defaultEvidence: 'RFQForm with validation, labels, and required markers.' },
      { id: 'rfq-upload', label: 'File upload instructions and accepted types documented', defaultStatus: 'pass', defaultEvidence: 'ACCEPTED_FILE_TYPES and upload UI on RFQForm.' },
      { id: 'rfq-confirmation', label: 'Confirmation page displays reference number', defaultStatus: 'pass', defaultEvidence: '/rfq/confirmation shows reference with role=status.' },
      { id: 'rfq-email', label: 'Customer confirmation email flow configured', defaultStatus: 'fail', defaultEvidence: 'RESEND_API_KEY missing in Supabase Edge Function secrets (see PRODUCTION_DEPLOYMENT_CONFIRMATION.md).' },
      { id: 'rfq-status-link', label: 'Public RFQ status lookup available', defaultStatus: 'pass', defaultEvidence: '/rfq/status linked in header/footer; lookup Edge Function deployed.' },
      { id: 'rfq-contact-visible', label: 'Contact information visible on RFQ page', defaultStatus: 'pass', defaultEvidence: 'Phone, fax, email, and address on Contact page aside.' },
    ],
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    items: [
      { id: 'a11y-h1', label: 'One h1 per page', defaultStatus: 'partial', defaultEvidence: 'Fixed for Equipment, Contact, Industries, RFQ Status in this pass.' },
      { id: 'a11y-labels', label: 'Form labels and error associations', defaultStatus: 'pass', defaultEvidence: 'AccessibleFormField, RFQForm labels, RFQ status form labels.' },
      { id: 'a11y-keyboard', label: 'Keyboard navigation and mobile menu trap', defaultStatus: 'pass', defaultEvidence: 'trapFocus on mobile nav; Services dropdown keyboard support.' },
      { id: 'a11y-focus', label: 'Visible focus states', defaultStatus: 'pass', defaultEvidence: 'Tailwind focus:ring on inputs and interactive controls.' },
      { id: 'a11y-alerts', label: 'Errors use role=alert; success uses role=status', defaultStatus: 'pass', defaultEvidence: 'RFQForm, RFQConfirmation, RFQStatusLookup, AccessibleFormField.' },
      { id: 'a11y-skip', label: 'Skip to main content link', defaultStatus: 'pass', defaultEvidence: 'SkipToContent component in public layout.' },
    ],
  },
  {
    id: 'performance',
    title: 'Performance',
    items: [
      { id: 'perf-build', label: 'npm run build passes', defaultStatus: 'pass', defaultEvidence: 'Vite production build succeeds (2492 modules).' },
      { id: 'perf-lazy', label: 'Public and admin routes lazy-loaded', defaultStatus: 'pass', defaultEvidence: 'React.lazy + lazyWithRetry in App.jsx.' },
      { id: 'perf-admin-split', label: 'Admin bundles code-split from public pages', defaultStatus: 'pass', defaultEvidence: 'AdminRFQDashboard and KPI charts in separate chunks.' },
      { id: 'perf-images', label: 'No broken public image paths in core pages', defaultStatus: 'pass', defaultEvidence: 'Service pages use CSS/icons; equipment uses text cards without missing hero images.' },
      { id: 'perf-console', label: 'No obvious missing-asset console warnings on core pages', defaultStatus: 'pass', defaultEvidence: 'No required hero images on modernized pages; logo assets present in public/.' },
    ],
  },
  {
    id: 'security',
    title: 'Admin Security',
    items: [
      { id: 'sec-login', label: '/admin/login loads', defaultStatus: 'pass', defaultEvidence: 'Public admin login route outside ProtectedAdminRoute.' },
      { id: 'sec-protected', label: 'Admin routes blocked when logged out', defaultStatus: 'pass', defaultEvidence: 'ProtectedAdminRoute redirects to /admin/login.' },
      { id: 'sec-analytics', label: 'Analytics (/admin/rfq-operations#analytics) blocked when logged out', defaultStatus: 'pass', defaultEvidence: 'Same ProtectedAdminRoute guard.' },
      { id: 'sec-no-sitemap', label: 'Admin routes excluded from sitemap', defaultStatus: 'pass', defaultEvidence: 'sitemap.xml contains public URLs only.' },
      { id: 'sec-service-role', label: 'Service role key not used in frontend', defaultStatus: 'pass', defaultEvidence: 'SERVICE_ROLE only in Edge Functions; Vite env uses anon key.' },
      { id: 'sec-rls', label: 'RLS documented as required', defaultStatus: 'pass', defaultEvidence: 'HANDOFF_NOTES.md and production validation docs.' },
    ],
  },
  {
    id: 'supabase',
    title: 'Supabase / Email / Storage',
    items: [
      { id: 'sb-migrations', label: 'Migrations applied', defaultStatus: 'pass', defaultEvidence: 'Production validation documents migrations on uukrvhyepqloqwekzppm.' },
      { id: 'sb-rls', label: 'RLS enabled on exposed tables', defaultStatus: 'pass', defaultEvidence: 'RLS enabled on RFQ/admin tables per deployment confirmation.' },
      { id: 'sb-admin-profile', label: 'admin_profiles has active owner/admin', defaultStatus: 'partial', defaultEvidence: 'Verify aguralnik@gmail.com owner row in production before launch sign-off.' },
      { id: 'sb-storage', label: 'rfq-files bucket private', defaultStatus: 'pass', defaultEvidence: 'Bucket public=false in production validation.' },
      { id: 'sb-edge', label: 'Edge Functions deployed', defaultStatus: 'pass', defaultEvidence: '7 functions ACTIVE including RFQ notification and status lookup.' },
      { id: 'sb-resend', label: 'Resend configured with verified sender domain', defaultStatus: 'fail', defaultEvidence: 'RESEND_API_KEY missing; internal and customer emails blocked.' },
      { id: 'sb-email-tests', label: 'Email workflows tested end-to-end', defaultStatus: 'fail', defaultEvidence: 'Blocked until Resend secret configured and emails sent in production.' },
    ],
  },
];

function flattenChecklist() {
  return CHECKLIST_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      sectionId: section.id,
      sectionTitle: section.title,
      itemId: item.id,
      label: item.label,
      status: item.defaultStatus,
      evidence: item.defaultEvidence,
      notes: '',
    })),
  );
}

function mergeChecklist(stored) {
  const defaults = flattenChecklist();
  if (!stored?.items?.length) return defaults;
  const map = new Map(stored.items.map((row) => [row.itemId, row]));
  return defaults.map((row) => ({ ...row, ...(map.get(row.itemId) ?? {}) }));
}

export function buildDefaultFinalLaunchReview() {
  return {
    reviewDate: new Date().toISOString().slice(0, 10),
    decision: 'conditional',
    seoScore: 92,
    evidenceNotes: '',
    reviewedBy: '',
    reviewedAt: null,
    items: flattenChecklist(),
  };
}

export function loadFinalLaunchReview() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildDefaultFinalLaunchReview();
    const parsed = JSON.parse(raw);
    return {
      ...buildDefaultFinalLaunchReview(),
      ...parsed,
      items: mergeChecklist(parsed),
    };
  } catch {
    return buildDefaultFinalLaunchReview();
  }
}

export function saveFinalLaunchReview(review) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...review,
      reviewedAt: new Date().toISOString(),
    }),
  );
}

export function groupFinalLaunchReview(items = []) {
  return items.reduce((groups, item) => {
    if (!groups[item.sectionId]) {
      groups[item.sectionId] = { title: item.sectionTitle, items: [] };
    }
    groups[item.sectionId].items.push(item);
    return groups;
  }, {});
}

export function summarizeFinalLaunchReview(review) {
  const items = review.items ?? [];
  const applicable = items.filter((item) => item.status !== 'na');
  const pass = applicable.filter((item) => item.status === 'pass').length;
  const partial = applicable.filter((item) => item.status === 'partial').length;
  const fail = applicable.filter((item) => item.status === 'fail').length;
  const notTested = applicable.filter((item) => item.status === 'not_tested').length;

  return {
    total: applicable.length,
    pass,
    partial,
    fail,
    notTested,
    passRate: applicable.length ? Math.round((pass / applicable.length) * 100) : 0,
  };
}

export function deriveRecommendedLaunchDecision(review) {
  const items = review.items ?? [];
  const hasCriticalFail = items.some(
    (item) =>
      item.status === 'fail' &&
      ['rfq-email', 'sb-resend', 'sb-email-tests', 'sec-protected', 'sec-service-role', 'perf-build'].includes(item.itemId),
  );

  if (hasCriticalFail) {
    const emailOnly = items
      .filter((item) => item.status === 'fail')
      .every((item) => ['rfq-email', 'sb-resend', 'sb-email-tests'].includes(item.itemId));
    if (emailOnly) return 'conditional';
    return 'not_ready';
  }

  const summary = summarizeFinalLaunchReview(review);
  if (summary.fail > 0 || summary.notTested > 2) return 'conditional';
  if (summary.partial > 0) return 'conditional';
  return 'ready';
}

export { CHECKLIST_SECTIONS };
