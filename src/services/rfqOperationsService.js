import { supabase } from '../lib/supabaseClient';
import { isCurrentUserAdmin } from './authService';

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

function defaultSummary() {
  return {
    new_rfqs_today: 0,
    open_rfqs: 0,
    in_review_rfqs: 0,
    quotes_awaiting_response: 0,
    overdue_followups: 0,
    followups_due_today: 0,
    additional_info_outstanding: 0,
    customer_reuploads_today: 0,
    failed_customer_emails: 0,
    failed_status_emails: 0,
    failed_additional_info_requests: 0,
    public_status_lookups_today: 0,
    successful_status_lookups_today: 0,
    failed_status_lookups_today: 0,
    won_this_month: 0,
    lost_this_month: 0,
    quoted_value_open: 0,
    won_value_this_month: 0,
  };
}

function defaultHealth() {
  return {
    total_rfqs: 0,
    rfqs_last_24h: 0,
    uploaded_files_last_24h: 0,
    customer_reuploads_last_24h: 0,
    failed_email_count_last_24h: 0,
    lookup_events_last_24h: 0,
    failed_lookup_events_last_24h: 0,
    open_alert_count: 0,
    critical_alert_count: 0,
    latest_rfq_created_at: null,
    latest_customer_reupload_at: null,
    latest_email_sent_at: null,
  };
}

export function deriveSystemHealthState(health, alerts = []) {
  const criticalAlerts = alerts.filter((alert) => alert.alert_level === 'critical');
  const warningAlerts = alerts.filter((alert) => alert.alert_level === 'warning');
  const failedEmails = Number(health?.failed_email_count_last_24h ?? 0);
  const failedLookups = Number(health?.failed_lookup_events_last_24h ?? 0);
  const lookupEvents = Number(health?.lookup_events_last_24h ?? 0);
  const failedAdditionalInfo = alerts.some((alert) => alert.alert_type === 'failed_email' && alert.title?.includes('additional info'));

  if (
    Number(health?.critical_alert_count ?? 0) > 0
    || criticalAlerts.length > 0
    || failedEmails > 0
    || failedAdditionalInfo
  ) {
    return 'critical';
  }

  if (
    warningAlerts.length > 0
    || Number(health?.overdue_followups ?? 0) > 0
    || (lookupEvents >= 5 && failedLookups / Math.max(lookupEvents, 1) >= 0.3)
  ) {
    return 'attention';
  }

  return 'healthy';
}

export function buildActionQueue(alerts = []) {
  const priority = {
    failed_email: 1,
    additional_info_expired: 2,
    overdue_followup: 3,
    quote_ready_not_sent: 4,
    stale_new_rfq: 5,
    customer_reupload_received: 6,
    lookup_failure_spike: 7,
    additional_info_outstanding: 8,
  };

  return [...alerts]
    .sort((a, b) => {
      const left = priority[a.alert_type] ?? 99;
      const right = priority[b.alert_type] ?? 99;
      if (left !== right) return left - right;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
    .slice(0, 12);
}

function groupAlertsBySeverity(alerts = []) {
  return {
    critical: alerts.filter((alert) => alert.alert_level === 'critical'),
    warning: alerts.filter((alert) => alert.alert_level === 'warning'),
    watch: alerts.filter((alert) => alert.alert_level === 'watch'),
  };
}

function buildDailySeries(rows, dateField, days = 30) {
  const today = new Date();
  const series = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - offset);
    const key = date.toISOString().slice(0, 10);
    series.push({ date: key, count: 0 });
  }

  const index = new Map(series.map((item, idx) => [item.date, idx]));
  for (const row of rows) {
    const value = row[dateField];
    if (!value) continue;
    const key = new Date(value).toISOString().slice(0, 10);
    const idx = index.get(key);
    if (idx !== undefined) series[idx].count += 1;
  }

  return series;
}

export async function getOperationsSummary() {
  await requireAdminAccess();
  const { data, error } = await supabase.from('rfq_operations_summary_view').select('*').maybeSingle();
  if (error) throw new Error('Unable to load operations summary.');
  return data ?? defaultSummary();
}

export async function getOperationsAlerts() {
  await requireAdminAccess();
  const { data, error } = await supabase
    .from('rfq_operations_alerts_view')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw new Error('Unable to load operations alerts.');
  return data ?? [];
}

export async function getSystemHealth() {
  await requireAdminAccess();
  const { data, error } = await supabase.from('rfq_system_health_view').select('*').maybeSingle();
  if (error) throw new Error('Unable to load system health.');
  return data ?? defaultHealth();
}

export async function getAdminActivity(limit = 25) {
  await requireAdminAccess();
  const { data, error } = await supabase
    .from('rfq_admin_activity_view')
    .select('*')
    .order('activity_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error('Unable to load admin activity.');
  return data ?? [];
}

export async function getOperationsKpiCharts() {
  await requireAdminAccess();
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [
    rfqResult,
    quoteSendResult,
    wonLostResult,
    followUpResult,
  ] = await Promise.all([
    supabase
      .from('rfq_requests')
      .select('created_at')
      .gte('created_at', since.toISOString()),
    supabase
      .from('rfq_manual_send_events')
      .select('sent_at')
      .gte('sent_at', since.toISOString()),
    supabase
      .from('rfq_requests')
      .select('status, updated_at, created_at')
      .in('status', ['won', 'lost'])
      .gte('updated_at', monthStart.toISOString()),
    supabase
      .from('rfq_requests')
      .select('follow_up_status, updated_at')
      .in('follow_up_status', ['overdue', 'completed'])
      .gte('updated_at', since.toISOString()),
  ]);

  if (rfqResult.error || quoteSendResult.error || wonLostResult.error || followUpResult.error) {
    throw new Error('Unable to load KPI chart data.');
  }

  const rfqsReceived = buildDailySeries(rfqResult.data ?? [], 'created_at');
  const quotesSent = buildDailySeries(quoteSendResult.data ?? [], 'sent_at');

  const wonLost = { won: 0, lost: 0 };
  for (const row of wonLostResult.data ?? []) {
    if (row.status === 'won') wonLost.won += 1;
    if (row.status === 'lost') wonLost.lost += 1;
  }

  const followUps = { overdue: 0, completed: 0 };
  for (const row of followUpResult.data ?? []) {
    if (row.follow_up_status === 'overdue') followUps.overdue += 1;
    if (row.follow_up_status === 'completed') followUps.completed += 1;
  }

  return {
    rfqsReceived,
    quotesSent,
    wonLost,
    followUps,
  };
}

export async function getCommandCenterData() {
  const [summary, alerts, health, activity, charts] = await Promise.all([
    getOperationsSummary(),
    getOperationsAlerts(),
    getSystemHealth(),
    getAdminActivity(),
    getOperationsKpiCharts(),
  ]);

  const groupedAlerts = groupAlertsBySeverity(alerts);
  const actionQueue = buildActionQueue(alerts);
  const healthState = deriveSystemHealthState(
    { ...health, overdue_followups: summary.overdue_followups },
    alerts,
  );

  return {
    summary,
    alerts,
    groupedAlerts,
    actionQueue,
    health,
    healthState,
    activity,
    charts,
    refreshedAt: new Date().toISOString(),
  };
}

export async function refreshOperationsData() {
  return getCommandCenterData();
}

export function formatCurrency(value) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatActivityType(type) {
  return String(type ?? 'activity').replaceAll('_', ' ');
}
