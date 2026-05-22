import { supabase } from '../lib/supabaseClient';
import { getCurrentUser, isCurrentUserAdmin } from './authService';

export const AUDIT_VERSION = '1.0';

export const AUTH_CHECK_NAMES = new Set([
  'Admin login',
  'Session persistence',
  'Admin route protection',
]);

export const AUDIT_CHECK_TEMPLATE = [
  {
    category: 'Public Website Readiness',
    checks: [
      { check_name: 'Home page loads', check_description: 'Verify the home page renders without errors.' },
      { check_name: 'About page loads', check_description: 'Verify the about page renders without errors.' },
      { check_name: 'Capabilities page loads', check_description: 'Verify the capabilities page renders without errors.' },
      { check_name: 'Equipment page loads', check_description: 'Verify the equipment page renders without errors.' },
      { check_name: 'Quality page loads', check_description: 'Verify the quality page renders without errors.' },
      { check_name: 'Contact page loads', check_description: 'Verify the contact page and RFQ form render without errors.' },
      { check_name: 'Mobile responsiveness verified', check_description: 'Verify key pages on mobile and tablet breakpoints.' },
      { check_name: 'SEO metadata verified', check_description: 'Verify page titles and meta descriptions on public pages.' },
      { check_name: 'Navigation verified', check_description: 'Verify header navigation links route correctly.' },
      { check_name: 'Footer links verified', check_description: 'Verify footer links and contact details are correct.' },
    ],
  },
  {
    category: 'RFQ Submission Readiness',
    checks: [
      { check_name: 'RFQ form validation', check_description: 'Verify required fields and client-side validation behave correctly.' },
      { check_name: 'RFQ database insert', check_description: 'Submit a test RFQ and confirm it is stored in rfq_requests.' },
      { check_name: 'RFQ reference generation', check_description: 'Confirm KC-RFQ reference numbers are generated automatically.' },
      { check_name: 'File upload validation', check_description: 'Verify file type, count, and size limits are enforced.' },
      { check_name: 'File storage upload', check_description: 'Confirm uploaded files are stored in the private rfq-files bucket.' },
      { check_name: 'Internal notification email', check_description: 'Confirm internal RFQ notification email is delivered.' },
      { check_name: 'Customer confirmation email', check_description: 'Confirm customer confirmation email is delivered with reference number.' },
      { check_name: 'Confirmation page redirect', check_description: 'Verify successful submissions redirect to the confirmation page.' },
      { check_name: 'Error handling validation', check_description: 'Verify user-friendly errors appear when submission fails.' },
    ],
  },
  {
    category: 'Customer Workflow Readiness',
    checks: [
      { check_name: 'RFQ status lookup', check_description: 'Verify public status lookup works with reference number and email.' },
      { check_name: 'Email verification lookup', check_description: 'Confirm lookup fails when email does not match the RFQ.' },
      { check_name: 'Public status display', check_description: 'Verify only safe public status fields are shown to customers.' },
      { check_name: 'Additional information request page', check_description: 'Verify the tokenized additional info upload page loads correctly.' },
      { check_name: 'Token validation', check_description: 'Verify invalid tokens return a safe expired/invalid message.' },
      { check_name: 'Customer file re-upload', check_description: 'Verify customer can upload revised files through the secure link.' },
      { check_name: 'Submission success flow', check_description: 'Verify customer success message appears after submission.' },
      { check_name: 'Expired token handling', check_description: 'Verify expired or used tokens cannot be reused.' },
    ],
  },
  {
    category: 'Admin Workflow Readiness',
    checks: [
      { check_name: 'Admin login', check_description: 'Verify admin users can sign in successfully.' },
      { check_name: 'Session persistence', check_description: 'Verify admin session persists across page reloads.' },
      { check_name: 'Admin route protection', check_description: 'Verify non-admin users cannot access admin routes.' },
      { check_name: 'RFQ dashboard loading', check_description: 'Verify the admin RFQ dashboard loads submitted requests.' },
      { check_name: 'RFQ detail view', check_description: 'Verify RFQ detail tabs and request data load correctly.' },
      { check_name: 'Internal notes', check_description: 'Verify internal notes can be viewed and recorded.' },
      { check_name: 'Follow-up tracking', check_description: 'Verify follow-up queue and reminder actions work.' },
      { check_name: 'Quote draft generation', check_description: 'Verify quote draft generation and preview work.' },
      { check_name: 'Manual send tracking', check_description: 'Verify manual quote send events are recorded.' },
      { check_name: 'Status email workflow', check_description: 'Verify customer status update draft/send workflow works.' },
      { check_name: 'Additional info workflow', check_description: 'Verify additional info request draft/send/review workflow works.' },
    ],
  },
  {
    category: 'Analytics Readiness',
    checks: [
      { check_name: 'Analytics dashboard loads', check_description: 'Verify the analytics dashboard loads for admin users.' },
      { check_name: 'Summary metrics calculate', check_description: 'Verify summary metrics populate correctly.' },
      { check_name: 'Monthly charts render', check_description: 'Verify monthly chart components render without errors.' },
      { check_name: 'Conversion metrics calculate', check_description: 'Verify conversion metrics calculate from RFQ data.' },
      { check_name: 'Follow-up analytics calculate', check_description: 'Verify follow-up analytics reflect queue activity.' },
      { check_name: 'Response-time reporting works', check_description: 'Verify response-time reporting displays expected values.' },
    ],
  },
  {
    category: 'Security Readiness',
    checks: [
      { check_name: 'Anonymous RFQ insert only', check_description: 'Verify anonymous users can only insert RFQ submissions as intended.' },
      { check_name: 'Admin-only dashboard access', check_description: 'Verify RFQ admin dashboard requires authenticated admin access.' },
      { check_name: 'Admin-only analytics access', check_description: 'Verify analytics views require authenticated admin access.' },
      { check_name: 'Private file storage', check_description: 'Verify rfq-files bucket is private with no anonymous read access.' },
      { check_name: 'Signed download URLs', check_description: 'Verify admin downloads use short-lived signed URLs only.' },
      { check_name: 'Service role hidden', check_description: 'Verify service role keys are not exposed in frontend code or bundles.' },
      { check_name: 'RLS policies validated', check_description: 'Review RLS policies on RFQ-related tables.' },
      { check_name: 'Edge function authorization validated', check_description: 'Verify protected edge functions reject unauthorized requests.' },
      { check_name: 'Token expiration validated', check_description: 'Verify additional info tokens expire and cannot be reused after submission.' },
      { check_name: 'Public lookup data limited', check_description: 'Verify public status lookup returns only safe customer-facing fields.' },
    ],
  },
  {
    category: 'Email Readiness',
    checks: [
      { check_name: 'Resend API configured', check_description: 'Verify Resend API key and sender settings are configured in production.' },
      { check_name: 'Internal notifications send', check_description: 'Verify internal RFQ notification emails send successfully.' },
      { check_name: 'Customer confirmation sends', check_description: 'Verify customer confirmation emails send successfully.' },
      { check_name: 'Status update emails send', check_description: 'Verify admin-approved status update emails send successfully.' },
      { check_name: 'Additional information request emails send', check_description: 'Verify additional info request emails send with secure upload link.' },
      { check_name: 'Email templates render correctly', check_description: 'Review HTML and text templates for formatting and content accuracy.' },
      { check_name: 'Reply-to configured', check_description: 'Verify reply-to addresses route to info@kcdesignmfg.com.' },
      { check_name: 'Production sender domain verified', check_description: 'Verify production sender domain is verified in Resend.' },
    ],
  },
  {
    category: 'Operational Readiness',
    checks: [
      { check_name: 'Audit logs recorded', check_description: 'Verify production readiness audit activity is recorded.' },
      { check_name: 'Internal notes recorded', check_description: 'Verify workflow actions create internal notes where expected.' },
      { check_name: 'Follow-up queue works', check_description: 'Verify follow-up queue populates and supports admin actions.' },
      { check_name: 'Alert generation works', check_description: 'Verify overdue and follow-up alerts are generated.' },
      { check_name: 'Overdue detection works', check_description: 'Verify overdue RFQ detection logic behaves correctly.' },
      { check_name: 'Public status synchronization works', check_description: 'Verify internal workflow updates sync to public_status correctly.' },
      { check_name: 'Error monitoring configured', check_description: 'Verify error monitoring/alerting is configured for production.' },
      { check_name: 'Backup strategy documented', check_description: 'Verify database and storage backup strategy is documented.' },
    ],
  },
];

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

function flattenTemplateChecks() {
  return AUDIT_CHECK_TEMPLATE.flatMap(({ category, checks }) =>
    checks.map((check) => ({
      category,
      check_name: check.check_name,
      check_description: check.check_description,
      status: 'pending',
    })),
  );
}

export function calculateCompletion(checks = []) {
  const applicable = checks.filter((check) => check.status !== 'not_applicable');
  if (applicable.length === 0) return 0;

  const passed = applicable.filter((check) => check.status === 'passed').length;
  return Math.round((passed / applicable.length) * 10000) / 100;
}

function getFailedChecks(checks = []) {
  return checks.filter((check) => check.status === 'failed');
}

function getPendingChecks(checks = []) {
  return checks.filter((check) => check.status === 'pending');
}

function isProductionReady(checks = [], completionPercentage = 0) {
  const failedSecurity = checks.filter(
    (check) => check.category === 'Security Readiness' && check.status === 'failed',
  );
  const failedEmail = checks.filter(
    (check) => check.category === 'Email Readiness' && check.status === 'failed',
  );
  const failedAuth = checks.filter(
    (check) => AUTH_CHECK_NAMES.has(check.check_name) && check.status === 'failed',
  );
  const failedChecks = getFailedChecks(checks);

  if (failedSecurity.length > 0) return false;
  if (failedEmail.length > 0) return false;
  if (failedAuth.length > 0) return false;
  if (completionPercentage < 95) return false;
  if (failedChecks.length > 0) return false;

  return true;
}

export function generateAuditSummary(audit, checks = [], reviewer = null) {
  const completionPercentage = calculateCompletion(checks);
  const failedChecks = getFailedChecks(checks);
  const pendingChecks = getPendingChecks(checks);
  const passedChecks = checks.filter((check) => check.status === 'passed');
  const notApplicableChecks = checks.filter((check) => check.status === 'not_applicable');
  const productionReady = isProductionReady(checks, completionPercentage);

  const openIssues = failedChecks.map((check) => ({
    category: check.category,
    check_name: check.check_name,
    evidence: check.evidence,
  }));

  const recommendedActions = [];
  if (failedChecks.some((check) => check.category === 'Security Readiness')) {
    recommendedActions.push('Resolve all failed security checks before launch.');
  }
  if (failedChecks.some((check) => check.category === 'Email Readiness')) {
    recommendedActions.push('Resolve all failed email workflow checks before launch.');
  }
  if (failedChecks.some((check) => AUTH_CHECK_NAMES.has(check.check_name))) {
    recommendedActions.push('Resolve authentication and RBAC failures before launch.');
  }
  if (pendingChecks.length > 0) {
    recommendedActions.push(`Complete ${pendingChecks.length} pending checklist item(s).`);
  }
  if (completionPercentage < 95) {
    recommendedActions.push('Increase completion to at least 95% before production launch.');
  }
  if (recommendedActions.length === 0 && productionReady) {
    recommendedActions.push('Proceed with controlled production launch and monitor initial RFQ activity.');
  }

  return {
    audit_id: audit?.id,
    audit_name: audit?.audit_name,
    audit_date: audit?.created_at,
    audit_version: audit?.audit_version ?? AUDIT_VERSION,
    reviewer: reviewer?.email ?? reviewer?.user_metadata?.full_name ?? 'Admin Reviewer',
    completion_percentage: completionPercentage,
    total_checks: checks.length,
    passed_checks: passedChecks.length,
    failed_checks: failedChecks.length,
    pending_checks: pendingChecks.length,
    not_applicable_checks: notApplicableChecks.length,
    open_issues: openIssues,
    recommended_actions: recommendedActions,
    production_ready: productionReady,
    final_recommendation: productionReady
      ? 'Production Ready — all critical checks passed and completion threshold met.'
      : 'Production Not Ready — resolve failed critical checks and complete outstanding QA items.',
    outstanding_risks: openIssues.map((issue) => `${issue.category}: ${issue.check_name}`),
  };
}

export async function createAudit(auditName = 'Production Launch QA') {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const { data: audit, error: auditError } = await supabase
    .from('rfq_production_readiness_audits')
    .insert({
      audit_name: auditName,
      audit_version: AUDIT_VERSION,
      overall_status: 'in_progress',
      completion_percentage: 0,
      created_by: user?.id ?? null,
    })
    .select('*')
    .single();

  if (auditError || !audit) {
    throw new Error('Unable to create production readiness audit.');
  }

  const checkRows = flattenTemplateChecks().map((check) => ({
    ...check,
    audit_id: audit.id,
  }));

  const { error: checksError } = await supabase
    .from('rfq_production_readiness_checks')
    .insert(checkRows);

  if (checksError) {
    throw new Error('Unable to initialize production readiness checks.');
  }

  return audit;
}

export async function getAudit(auditId = null) {
  await requireAdminAccess();

  if (auditId) {
    const { data, error } = await supabase
      .from('rfq_production_readiness_audits')
      .select('*')
      .eq('id', auditId)
      .maybeSingle();

    if (error || !data) throw new Error('Audit not found.');
    return data;
  }

  const { data, error } = await supabase
    .from('rfq_production_readiness_audits')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error('Unable to load production readiness audit.');
  return data;
}

export async function getChecks(auditId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('rfq_production_readiness_checks')
    .select('*')
    .eq('audit_id', auditId)
    .order('category', { ascending: true })
    .order('check_name', { ascending: true });

  if (error) throw new Error('Unable to load production readiness checks.');
  return data ?? [];
}

async function syncAuditProgress(auditId, checks) {
  const completionPercentage = calculateCompletion(checks);
  const hasFailures = checks.some((check) => check.status === 'failed');
  const hasPending = checks.some((check) => check.status === 'pending');
  const overallStatus = hasFailures ? 'failed' : hasPending ? 'in_progress' : 'passed';

  const { error } = await supabase
    .from('rfq_production_readiness_audits')
    .update({
      completion_percentage: completionPercentage,
      overall_status: overallStatus,
    })
    .eq('id', auditId);

  if (error) throw new Error('Unable to update audit progress.');
}

export async function updateCheckStatus(checkId, status, evidence = null) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const updates = {
    status,
    evidence: evidence ?? null,
    completed_at: status === 'pending' ? null : new Date().toISOString(),
    completed_by: status === 'pending' ? null : user?.id ?? null,
  };

  const { data: check, error } = await supabase
    .from('rfq_production_readiness_checks')
    .update(updates)
    .eq('id', checkId)
    .select('*')
    .single();

  if (error || !check) throw new Error('Unable to update checklist item.');

  const checks = await getChecks(check.audit_id);
  await syncAuditProgress(check.audit_id, checks);

  const audit = await getAudit(check.audit_id);
  return { check, audit, checks };
}

export async function finalizeAudit(auditId) {
  await requireAdminAccess();
  const user = await getCurrentUser();
  const audit = await getAudit(auditId);
  const checks = await getChecks(auditId);
  const summary = generateAuditSummary(audit, checks, user);
  const overallStatus = summary.production_ready ? 'passed' : 'failed';

  const { data, error } = await supabase
    .from('rfq_production_readiness_audits')
    .update({
      overall_status: overallStatus,
      completion_percentage: summary.completion_percentage,
      notes: summary.final_recommendation,
    })
    .eq('id', auditId)
    .select('*')
    .single();

  if (error || !data) throw new Error('Unable to finalize production readiness audit.');

  return {
    audit: data,
    checks,
    summary: generateAuditSummary(data, checks, user),
  };
}

export function groupChecksByCategory(checks = []) {
  return checks.reduce((groups, check) => {
    if (!groups[check.category]) groups[check.category] = [];
    groups[check.category].push(check);
    return groups;
  }, {});
}

export function getCheckStats(checks = []) {
  return {
    total: checks.length,
    passed: checks.filter((check) => check.status === 'passed').length,
    failed: checks.filter((check) => check.status === 'failed').length,
    pending: checks.filter((check) => check.status === 'pending').length,
    not_applicable: checks.filter((check) => check.status === 'not_applicable').length,
    completion_percentage: calculateCompletion(checks),
  };
}
