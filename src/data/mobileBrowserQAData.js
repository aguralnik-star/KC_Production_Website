export const QA_STATUSES = ['pending', 'passed', 'needs_fix', 'blocked'];
export const ISSUE_SEVERITIES = ['low', 'medium', 'high', 'critical'];
export const ISSUE_STATUSES = ['open', 'investigating', 'resolved'];

export const PAGES_TO_REVIEW = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/capabilities', label: 'Capabilities' },
  { path: '/equipment', label: 'Equipment' },
  { path: '/quality', label: 'Quality' },
  { path: '/industries', label: 'Industries' },
  { path: '/projects', label: 'Projects' },
  { path: '/contact', label: 'Contact / RFQ' },
  { path: '/rfq/status', label: 'RFQ Status Lookup' },
  { path: '/services/cnc-machining', label: 'Service: CNC Machining' },
  { path: '/services/cnc-milling', label: 'Service: CNC Milling' },
  { path: '/services/cnc-turning', label: 'Service: CNC Turning' },
  { path: '/services/tooling', label: 'Service: Tooling' },
  { path: '/services/fixtures', label: 'Service: Fixtures' },
  { path: '/services/gauges', label: 'Service: Gauges' },
  { path: '/services/prototype-machining', label: 'Service: Prototype Machining' },
  { path: '/services/production-machining', label: 'Service: Production Machining' },
  { path: '/admin/login', label: 'Admin Login' },
];

export const VIEWPORT_SIZES = [
  { id: 'mobile-320', label: '320px', width: 320, category: 'mobile' },
  { id: 'mobile-375', label: '375px', width: 375, category: 'mobile' },
  { id: 'mobile-390', label: '390px', width: 390, category: 'mobile' },
  { id: 'mobile-414', label: '414px', width: 414, category: 'mobile' },
  { id: 'mobile-430', label: '430px', width: 430, category: 'mobile' },
  { id: 'tablet-768', label: '768px', width: 768, category: 'tablet' },
  { id: 'tablet-820', label: '820px', width: 820, category: 'tablet' },
  { id: 'tablet-1024', label: '1024px', width: 1024, category: 'tablet' },
  { id: 'desktop-1280', label: '1280px', width: 1280, category: 'desktop' },
  { id: 'desktop-1440', label: '1440px', width: 1440, category: 'desktop' },
  { id: 'desktop-1920', label: '1920px', width: 1920, category: 'desktop' },
];

export const BROWSERS = [
  { id: 'chrome', label: 'Chrome', category: 'desktop' },
  { id: 'edge', label: 'Edge', category: 'desktop' },
  { id: 'safari', label: 'Safari', category: 'desktop' },
  { id: 'firefox', label: 'Firefox', category: 'desktop' },
  { id: 'mobile-safari', label: 'Mobile Safari', category: 'mobile' },
  { id: 'chrome-android', label: 'Chrome Android', category: 'mobile' },
];

export const QA_CATEGORIES = [
  {
    id: 'layout',
    title: 'Layout',
    checks: [
      'No horizontal scrolling',
      'Text does not overflow',
      'Cards stack correctly',
      'Images scale correctly',
      'Sections have proper spacing',
      'Hero sections fit mobile screens',
      'Footer columns stack cleanly',
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation',
    checks: [
      'Mobile menu opens',
      'Mobile menu closes',
      'All nav links work',
      'Dropdown/service links work',
      'Logo links to home',
      'Header does not overlap content',
      'CTA button remains usable',
    ],
  },
  {
    id: 'rfq-form',
    title: 'RFQ Form',
    checks: [
      'Fields are readable',
      'Labels are visible',
      'Inputs are large enough',
      'File upload works',
      'Drag/drop fallback works',
      'Error messages display correctly',
      'Submit button is easy to tap',
      'Confirmation page is readable',
    ],
  },
  {
    id: 'status-lookup',
    title: 'Public RFQ Status Lookup',
    checks: [
      'Form fits mobile',
      'Reference number field works',
      'Email field works',
      'Result card is readable',
      'CTA buttons stack cleanly',
    ],
  },
  {
    id: 'additional-info',
    title: 'Additional Info Upload',
    checks: [
      'Token page layout works',
      'File upload works',
      'Success/expired states are readable',
      'Upload progress does not overflow',
    ],
  },
  {
    id: 'service-pages',
    title: 'Service Pages',
    checks: [
      'Hero text fits',
      'Related service links wrap properly',
      'FAQ sections work',
      'CTA buttons stack correctly',
    ],
  },
  {
    id: 'project-showcase',
    title: 'Project Showcase',
    checks: [
      'Project cards stack',
      'Modal works on mobile',
      'Modal close button accessible',
      'Category filters wrap correctly',
    ],
  },
  {
    id: 'accessibility-mobile',
    title: 'Accessibility on Mobile',
    checks: [
      'Tap targets at least 44px',
      'Focus states visible',
      'Keyboard navigation works where applicable',
      'Forms have labels',
      'No tiny unreadable text',
    ],
  },
];

export const CROSS_BROWSER_CHECKS = {
  chrome: ['Public pages render', 'RFQ form works', 'Admin login works'],
  edge: ['Public pages render', 'RFQ form works', 'Admin login works'],
  safari: ['Hero gradients render', 'Forms behave correctly', 'File upload works', 'Sticky panels do not break'],
  firefox: ['Layout consistency', 'Buttons render correctly', 'Forms work', 'Modals work'],
  'mobile-safari': ['Viewport height issues checked', 'Header/menu works', 'File upload works', 'Input zoom issues avoided'],
  'chrome-android': ['Navigation works', 'RFQ form works', 'Status lookup works'],
};

export const COMMON_ISSUES = [
  'Horizontal scroll on narrow viewports',
  'Mobile menu trap focus issue',
  'RFQ file upload not tappable on iOS',
  'Hero headline wraps awkwardly at 320px',
  'Sticky sidebar overlaps form on tablet',
  'Modal exceeds viewport height',
  'Long email address overflows footer',
  'Service dropdown clipped on mobile',
  'Table not scrollable on admin pages',
  'Input zoom on focus in Mobile Safari',
];

export const LAUNCH_BLOCKERS = [
  'Horizontal scrolling on core public pages',
  'Broken mobile navigation',
  'RFQ form unusable on mobile',
  'File upload broken on mobile',
  'Admin login broken',
  'Public status lookup broken',
  'Critical layout issue on homepage',
  'CTA buttons unusable',
  'Text unreadable',
  'Broken production build',
];

export function getViewportSizesByCategory(category) {
  return VIEWPORT_SIZES.filter((item) => item.category === category);
}

export function buildDefaultPageReviews() {
  return PAGES_TO_REVIEW.reduce((reviews, page) => {
    reviews[page.path] = {
      path: page.path,
      label: page.label,
      mobileStatus: 'pending',
      tabletStatus: 'pending',
      desktopStatus: 'pending',
      browserStatus: 'pending',
      issues: '',
      notes: '',
      decision: 'pending',
    };
    return reviews;
  }, {});
}

export function buildDefaultViewportChecks() {
  return VIEWPORT_SIZES.reduce((checks, viewport) => {
    checks[viewport.id] = 'pending';
    return checks;
  }, {});
}

export function buildDefaultBrowserChecks() {
  const checks = {};
  Object.entries(CROSS_BROWSER_CHECKS).forEach(([browserId, items]) => {
    items.forEach((label, index) => {
      checks[`${browserId}-${index}`] = {
        browserId,
        label,
        status: 'pending',
      };
    });
  });
  return checks;
}
