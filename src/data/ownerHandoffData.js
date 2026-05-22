export const PRODUCTION_URL = 'https://www.kcdesignmfg.com';

export const LAUNCH_STATUS_OPTIONS = ['ready', 'conditional', 'not_ready'];

export const LAUNCH_DECISION_OPTIONS = ['approved', 'conditional', 'deferred'];

export const LAUNCH_STATUS_AREAS = [
  { id: 'public_website', label: 'Public Website Status', defaultStatus: 'conditional' },
  { id: 'rfq_workflow', label: 'RFQ Workflow Status', defaultStatus: 'conditional' },
  { id: 'admin_system', label: 'Admin System Status', defaultStatus: 'conditional' },
  { id: 'seo', label: 'SEO Status', defaultStatus: 'conditional' },
  { id: 'analytics', label: 'Analytics Status', defaultStatus: 'conditional' },
  { id: 'launch', label: 'Launch Status', defaultStatus: 'conditional' },
];

export const HANDOFF_DOCUMENTS = [
  {
    id: 'launch-package',
    file: 'FINAL_PRODUCTION_LAUNCH_PACKAGE.md',
    title: 'Final Production Launch Package',
    description: 'Executive summary of website features, RFQ platform, admin tools, production systems, and launch status.',
  },
  {
    id: 'owner-guide',
    file: 'OWNER_HANDOFF_GUIDE.md',
    title: 'Owner Handoff Guide',
    description: 'Step-by-step guide for K&C owners to access admin, review RFQs, manage quotes, and monitor performance.',
  },
  {
    id: 'admin-manual',
    file: 'ADMIN_OPERATIONS_MANUAL.md',
    title: 'Admin Operations Manual',
    description: 'Daily and weekly admin workflows for RFQ review, follow-ups, analytics, and operations monitoring.',
  },
  {
    id: 'maintenance',
    file: 'WEBSITE_MAINTENANCE_PLAN.md',
    title: 'Maintenance Plan',
    description: 'Monthly and quarterly website maintenance tasks for forms, email, SEO, content, and infrastructure.',
  },
  {
    id: 'rfq-sop',
    file: 'RFQ_WORKFLOW_OPERATING_PROCEDURE.md',
    title: 'RFQ Workflow SOP',
    description: 'End-to-end RFQ lifecycle, status definitions, and operating procedures.',
  },
  {
    id: 'post-launch',
    file: 'POST_LAUNCH_SUPPORT_PLAN.md',
    description: 'First 24 hours, 7 days, and 30 days post-launch support and monitoring plan.',
    title: 'Post-Launch Support Plan',
  },
  {
    id: 'signoff',
    file: 'FINAL_LAUNCH_SIGNOFF.md',
    title: 'Final Launch Signoff',
    description: 'Launch approval checklist and executive sign-off record.',
  },
];

export const OWNER_ACTION_ITEMS = [
  { id: 'production-url', label: 'Confirm production URL (https://www.kcdesignmfg.com)' },
  { id: 'admin-access', label: 'Confirm admin user access for K&C staff' },
  { id: 'rfq-notification', label: 'Confirm RFQ notification email delivery to K&C' },
  { id: 'customer-confirmation', label: 'Confirm customer confirmation email delivery' },
  { id: 'test-rfq', label: 'Confirm first test RFQ submitted and reviewed' },
  { id: 'file-download', label: 'Confirm uploaded file download from admin' },
  { id: 'status-lookup', label: 'Confirm public RFQ status lookup works' },
  { id: 'owner-approval', label: 'Confirm owner approval for production launch' },
];

export const POST_LAUNCH_SUPPORT_ITEMS = [
  { id: 'pl-24h-site', label: 'Check production site loads correctly', phase: '24h' },
  { id: 'pl-24h-rfq', label: 'Submit test RFQ in production', phase: '24h' },
  { id: 'pl-24h-email', label: 'Verify internal and customer emails', phase: '24h' },
  { id: 'pl-24h-upload', label: 'Verify file upload and download', phase: '24h' },
  { id: 'pl-24h-admin', label: 'Verify admin login and dashboard', phase: '24h' },
  { id: 'pl-24h-logs', label: 'Review Supabase/Vercel logs for errors', phase: '24h' },
  { id: 'pl-7d-rfqs', label: 'Monitor incoming RFQs daily', phase: '7d' },
  { id: 'pl-7d-analytics', label: 'Monitor analytics and conversion events', phase: '7d' },
  { id: 'pl-7d-email-fail', label: 'Monitor email delivery failures', phase: '7d' },
  { id: 'pl-7d-questions', label: 'Review customer questions and RFQ quality', phase: '7d' },
  { id: 'pl-7d-conversion', label: 'Review RFQ conversion rate trends', phase: '7d' },
  { id: 'pl-30d-photos', label: 'Add real facility and project photos', phase: '30d' },
  { id: 'pl-30d-showcase', label: 'Improve project showcase content', phase: '30d' },
  { id: 'pl-30d-seo', label: 'Review SEO ranking and Search Console', phase: '30d' },
  { id: 'pl-30d-testimonials', label: 'Add approved customer testimonials', phase: '30d' },
  { id: 'pl-30d-rfq-form', label: 'Review RFQ form improvements if needed', phase: '30d' },
];

export const SIGNOFF_CHECKLIST_ITEMS = [
  { id: 'signoff-public', label: 'Public site approved' },
  { id: 'signoff-rfq', label: 'RFQ workflow approved' },
  { id: 'signoff-admin', label: 'Admin access approved' },
  { id: 'signoff-email', label: 'Email delivery approved' },
  { id: 'signoff-upload', label: 'File upload approved' },
  { id: 'signoff-seo', label: 'SEO approved' },
  { id: 'signoff-mobile', label: 'Mobile approved' },
  { id: 'signoff-security', label: 'Security approved' },
  { id: 'signoff-training', label: 'Owner training complete' },
  { id: 'signoff-launch', label: 'Production launch approved' },
];

export function buildDefaultChecklistState(items) {
  return items.reduce((state, item) => {
    state[item.id] = { completed: false, notes: '' };
    return state;
  }, {});
}

export function buildDefaultAreaStatuses() {
  return LAUNCH_STATUS_AREAS.reduce((statuses, area) => {
    statuses[area.id] = area.defaultStatus;
    return statuses;
  }, {});
}
