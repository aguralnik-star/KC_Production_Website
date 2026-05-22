import { supabase } from '../lib/supabaseClient';
import { getCurrentUser, isCurrentUserAdmin } from './authService';

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

function defaultKpiSummary() {
  return {
    rfqs_today: 0,
    rfqs_last_7_days: 0,
    completed_rfqs: 0,
    quote_requests: 0,
    quote_conversion_rate: 0,
    avg_response_time: 0,
    public_status_lookups: 0,
    additional_info_requests: 0,
    customer_reuploads: 0,
    failed_emails: 0,
    open_issues: 0,
    critical_issues: 0,
  };
}

function defaultFunnel() {
  return {
    visitors: 0,
    rfq_starts: 0,
    rfq_submissions: 0,
    quotes_sent: 0,
    opportunities_open: 0,
    projects_won: 0,
  };
}

export const POST_LAUNCH_DAILY_CHECKLIST = [
  {
    day: 1,
    title: 'Infrastructure validation',
    items: [
      'Verify RFQ submissions',
      'Verify confirmation emails',
      'Verify admin notifications',
      'Review logs',
    ],
  },
  {
    day: 2,
    title: 'Traffic review',
    items: ['Review traffic', 'Review RFQ quality', 'Review page engagement'],
  },
  {
    day: 3,
    title: 'RFQ review',
    items: ['Review RFQ completion rate', 'Review CTA effectiveness', 'Review customer questions'],
  },
  {
    day: 4,
    title: 'Workflow review',
    items: ['Review quote workflow', 'Review status lookup usage'],
  },
  {
    day: 5,
    title: 'SEO review',
    items: ['Review service page engagement', 'Review search indexing'],
  },
  {
    day: 6,
    title: 'Issue resolution review',
    items: ['Review open issues', 'Review response times'],
  },
  {
    day: 7,
    title: 'Executive summary',
    items: ['Prepare launch-week summary', 'Identify optimization opportunities'],
  },
];

export const PAGE_PERFORMANCE_PLACEHOLDERS = [
  { page: 'Home', path: '/' },
  { page: 'Capabilities', path: '/capabilities' },
  { page: 'Equipment', path: '/equipment' },
  { page: 'Quality', path: '/quality' },
  { page: 'About', path: '/about' },
  { page: 'Projects', path: '/projects' },
  { page: 'Contact', path: '/contact' },
  { page: 'Service Pages', path: '/services/cnc-machining' },
];

export function getLaunchDayNumber(launchDate = new Date('2026-05-22')) {
  const start = new Date(launchDate);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(Math.max(diff, 1), 7);
}

export function buildConversionFunnelSteps(funnel = defaultFunnel()) {
  const steps = [
    { key: 'visitors', label: 'Visitors', value: Number(funnel.visitors ?? 0) },
    { key: 'rfq_starts', label: 'RFQ Started', value: Number(funnel.rfq_starts ?? 0) },
    { key: 'rfq_submissions', label: 'RFQ Submitted', value: Number(funnel.rfq_submissions ?? 0) },
    { key: 'quotes_sent', label: 'Quoted', value: Number(funnel.quotes_sent ?? 0) },
    { key: 'projects_won', label: 'Won', value: Number(funnel.projects_won ?? 0) },
  ];

  return steps.map((step, index) => {
    const previous = index > 0 ? steps[index - 1].value : null;
    const conversionFromPrevious =
      previous && previous > 0 ? Math.round((step.value / previous) * 1000) / 10 : null;
    const conversionFromTop =
      steps[0].value > 0 ? Math.round((step.value / steps[0].value) * 1000) / 10 : null;

    return {
      ...step,
      conversionFromPrevious,
      conversionFromTop,
      isPlaceholder: step.key === 'visitors' && step.value === 0,
    };
  });
}

export function buildRfqMetrics(kpi = defaultKpiSummary(), funnel = defaultFunnel()) {
  const starts = Number(funnel.rfq_starts ?? 0);
  const submissions = Number(funnel.rfq_submissions ?? 0);
  const abandonmentRate =
    starts > 0 ? Math.round((1 - submissions / starts) * 1000) / 10 : null;
  const completionRate = starts > 0 ? Math.round((submissions / starts) * 1000) / 10 : null;

  return {
    rfqsToday: Number(kpi.rfqs_today ?? 0),
    rfqsThisWeek: Number(kpi.rfqs_last_7_days ?? 0),
    abandonmentRate,
    completionRate,
    avgQuoteTurnaroundHours: Number(kpi.avg_response_time ?? 0),
    additionalInfoRequests: Number(kpi.additional_info_requests ?? 0),
    customerReuploads: Number(kpi.customer_reuploads ?? 0),
    publicLookupUsage: Number(kpi.public_status_lookups ?? 0),
  };
}

export function buildRecommendations(kpi = defaultKpiSummary(), rfqMetrics = buildRfqMetrics()) {
  const recommendations = [];

  if (Number(kpi.rfqs_last_7_days ?? 0) < 3) {
    recommendations.push({
      id: 'rfq-volume',
      priority: 'high',
      title: 'Increase RFQ visibility',
      message: 'Increase visibility of RFQ CTA buttons on homepage, capabilities, and service pages.',
    });
  }

  if (Number(kpi.avg_response_time ?? 0) > 72) {
    recommendations.push({
      id: 'quote-turnaround',
      priority: 'high',
      title: 'Review quote response workflow',
      message: 'Quote turnaround exceeds 3 days. Review quote response workflow and admin follow-up queue.',
    });
  }

  if (rfqMetrics.abandonmentRate !== null && rfqMetrics.abandonmentRate > 50) {
    recommendations.push({
      id: 'abandonment',
      priority: 'medium',
      title: 'Simplify RFQ form',
      message: 'Simplify RFQ form and review required fields. Consider draft restore messaging and file upload guidance.',
    });
  }

  if (Number(kpi.failed_emails ?? 0) > 0) {
    recommendations.push({
      id: 'failed-emails',
      priority: 'critical',
      title: 'Review email delivery',
      message: 'Review email delivery configuration, Resend API key, and sender domain verification.',
    });
  }

  if (Number(kpi.public_status_lookups ?? 0) >= 5) {
    recommendations.push({
      id: 'self-service',
      priority: 'medium',
      title: 'Expand customer self-service',
      message: 'Consider expanding customer self-service features such as status lookup guidance and FAQ content.',
    });
  }

  if (Number(kpi.critical_issues ?? 0) > 0) {
    recommendations.push({
      id: 'critical-issues',
      priority: 'critical',
      title: 'Resolve critical launch issues',
      message: 'Critical post-launch issues are open. Prioritize resolution before scaling marketing traffic.',
    });
  }

  if (Number(kpi.quote_conversion_rate ?? 0) < 25 && Number(kpi.rfqs_last_7_days ?? 0) >= 3) {
    recommendations.push({
      id: 'quote-conversion',
      priority: 'medium',
      title: 'Improve quote follow-up',
      message: 'Quote conversion is below target. Review quote drafts, follow-up scheduling, and customer communication.',
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: 'healthy',
      priority: 'low',
      title: 'Launch week looks healthy',
      message: 'No urgent optimization triggers detected. Continue daily monitoring and document Week 1 summary.',
    });
  }

  return recommendations;
}

export function buildPagePerformanceRows() {
  return PAGE_PERFORMANCE_PLACEHOLDERS.map((row) => ({
    ...row,
    visits: null,
    ctaClicks: null,
    rfqStarts: null,
    rfqSubmissions: null,
    analyticsConnected: false,
  }));
}

export function deriveExecutiveStatus(kpi = defaultKpiSummary()) {
  if (Number(kpi.critical_issues ?? 0) > 0 || Number(kpi.failed_emails ?? 0) > 0) {
    return 'critical';
  }
  if (Number(kpi.open_issues ?? 0) > 0 || Number(kpi.rfqs_last_7_days ?? 0) < 1) {
    return 'attention_needed';
  }
  return 'healthy';
}

export async function getPostLaunchKpiSummary() {
  await requireAdminAccess();
  const { data, error } = await supabase.from('post_launch_kpi_summary_view').select('*').maybeSingle();
  if (error) throw new Error('Unable to load post-launch KPI summary.');
  return data ?? defaultKpiSummary();
}

export async function getPostLaunchFunnel() {
  await requireAdminAccess();
  const { data, error } = await supabase.from('post_launch_conversion_funnel_view').select('*').maybeSingle();
  if (error) throw new Error('Unable to load post-launch conversion funnel.');
  return data ?? defaultFunnel();
}

export async function getPostLaunchActivity(limit = 30) {
  await requireAdminAccess();
  const { data, error } = await supabase
    .from('post_launch_activity_view')
    .select('*')
    .order('activity_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error('Unable to load post-launch activity feed.');
  return data ?? [];
}

export async function getPostLaunchIssues() {
  await requireAdminAccess();
  const { data, error } = await supabase
    .from('post_launch_issues')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error('Unable to load post-launch issues.');
  return data ?? [];
}

export async function getPostLaunchDailyReviews() {
  await requireAdminAccess();
  const { data, error } = await supabase
    .from('post_launch_daily_reviews')
    .select('*')
    .order('review_date', { ascending: false })
    .limit(7);
  if (error) throw new Error('Unable to load daily reviews.');
  return data ?? [];
}

export async function createPostLaunchIssue({ title, description, severity = 'medium', assignedTo = null }) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('post_launch_issues')
    .insert({
      title,
      description,
      severity,
      assigned_to: assignedTo,
      created_by: user?.id ?? null,
    })
    .select('*')
    .single();

  if (error) throw new Error('Unable to create post-launch issue.');
  return data;
}

export async function updatePostLaunchIssue(id, updates) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('post_launch_issues')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error('Unable to update post-launch issue.');
  return data;
}

export async function savePostLaunchDailyReview(review) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const payload = {
    review_date: review.review_date,
    reviewer_id: user?.id ?? null,
    traffic_summary: review.traffic_summary || null,
    rfq_summary: review.rfq_summary || null,
    issues_found: review.issues_found || null,
    actions_taken: review.actions_taken || null,
    overall_status: review.overall_status || 'healthy',
  };

  const { data, error } = await supabase
    .from('post_launch_daily_reviews')
    .upsert(payload, { onConflict: 'review_date' })
    .select('*')
    .single();

  if (error) throw new Error('Unable to save daily review.');
  return data;
}

export async function getPostLaunchDashboardData() {
  const [kpi, funnel, activity, issues, dailyReviews] = await Promise.all([
    getPostLaunchKpiSummary(),
    getPostLaunchFunnel(),
    getPostLaunchActivity(),
    getPostLaunchIssues(),
    getPostLaunchDailyReviews(),
  ]);

  const rfqMetrics = buildRfqMetrics(kpi, funnel);
  const funnelSteps = buildConversionFunnelSteps(funnel);
  const recommendations = buildRecommendations(kpi, rfqMetrics);
  const pagePerformance = buildPagePerformanceRows();
  const launchDay = getLaunchDayNumber();
  const executiveStatus = deriveExecutiveStatus(kpi);

  return {
    kpi,
    funnel,
    funnelSteps,
    rfqMetrics,
    recommendations,
    pagePerformance,
    activity,
    issues,
    dailyReviews,
    launchDay,
    executiveStatus,
    refreshedAt: new Date().toISOString(),
  };
}

export async function refreshPostLaunchDashboardData() {
  return getPostLaunchDashboardData();
}

export function formatActivityLabel(type) {
  return String(type ?? 'activity').replaceAll('_', ' ');
}

export function formatHours(value) {
  const hours = Number(value ?? 0);
  if (hours <= 0) return '—';
  if (hours < 24) return `${hours}h`;
  return `${Math.round((hours / 24) * 10) / 10}d`;
}
