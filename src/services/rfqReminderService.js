import { supabase } from '../lib/supabaseClient';
import { getCurrentUser, isCurrentUserAdmin } from './authService';
import { addBusinessDays } from './quoteDraftService';

const CLOSED_STATUSES = new Set(['closed', 'won', 'lost', 'rejected']);
const FOLLOW_UP_ALERT_TYPES = new Set(['follow_up_due_today', 'follow_up_overdue']);

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

async function addInternalNote(rfqRequestId, note) {
  const user = await getCurrentUser();
  const { error } = await supabase.from('rfq_internal_notes').insert({
    rfq_request_id: rfqRequestId,
    created_by: user?.id ?? null,
    note,
  });
  if (error) throw new Error('Unable to save internal note.');
}

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toDateString(date) {
  return startOfDay(date).toISOString().slice(0, 10);
}

function businessDaysAgo(days) {
  const date = new Date();
  let subtracted = 0;
  while (subtracted < days) {
    date.setDate(date.getDate() - 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) subtracted += 1;
  }
  return date;
}

function isDismissed(rfq) {
  if (!rfq.follow_up_reminder_dismissed_until) return false;
  return rfq.follow_up_reminder_dismissed_until >= toDateString();
}

function computeQueueBucket(rfq) {
  if (CLOSED_STATUSES.has(rfq.status) || isDismissed(rfq)) return 'closed';
  if (!rfq.next_follow_up_at) return 'no_follow_up';
  const followUpDate = startOfDay(new Date(rfq.next_follow_up_at));
  const today = startOfDay();
  if (followUpDate < today) return 'overdue';
  if (followUpDate.getTime() === today.getTime()) return 'due_today';
  return 'upcoming';
}

function computeFollowUpStatus(rfq) {
  if (rfq.follow_up_status === 'completed') return 'completed';
  if (isDismissed(rfq)) return 'dismissed';
  const bucket = computeQueueBucket(rfq);
  if (bucket === 'overdue') return 'overdue';
  if (bucket === 'due_today') return 'due_today';
  if (rfq.next_follow_up_at) return 'scheduled';
  return 'none';
}

function computeAlertLevel(rfq, alerts) {
  const openLevels = alerts
    .filter((a) => a.status === 'open')
    .map((a) => a.alert_level);
  if (openLevels.includes('critical')) return 'critical';
  if (openLevels.includes('warning')) return 'warning';
  if (openLevels.includes('watch')) return 'watch';
  return 'none';
}

export function generateAlertsForRfq(rfq) {
  const alerts = [];
  const now = new Date();
  const createdAt = new Date(rfq.created_at);
  const updatedAt = new Date(rfq.updated_at ?? rfq.created_at);

  if (rfq.status === 'new' && createdAt < businessDaysAgo(2)) {
    alerts.push({
      alert_type: 'stale_new_rfq',
      alert_level: 'warning',
      title: 'Stale New RFQ',
      message: `${rfq.company || rfq.name} has been new for more than 2 business days.`,
    });
  }

  if (rfq.status === 'in_review' && updatedAt < businessDaysAgo(5)) {
    alerts.push({
      alert_type: 'stale_in_review',
      alert_level: 'warning',
      title: 'Stale In-Review RFQ',
      message: `${rfq.company || rfq.name} has remained in review for more than 5 business days.`,
    });
  }

  if (rfq.status === 'quote_ready' && !rfq.quote_sent_at && updatedAt < businessDaysAgo(2)) {
    alerts.push({
      alert_type: 'quote_not_sent',
      alert_level: 'critical',
      title: 'Quote Ready But Not Sent',
      message: `${rfq.company || rfq.name} is quote-ready but has not been manually sent.`,
    });
  }

  if (
    rfq.next_follow_up_at
    && !CLOSED_STATUSES.has(rfq.status)
    && startOfDay(new Date(rfq.next_follow_up_at)) < startOfDay()
  ) {
    alerts.push({
      alert_type: 'follow_up_overdue',
      alert_level: 'critical',
      title: 'Follow-Up Overdue',
      message: `Follow-up for ${rfq.company || rfq.name} is overdue.`,
    });
  }

  if (
    rfq.next_follow_up_at
    && !CLOSED_STATUSES.has(rfq.status)
    && startOfDay(new Date(rfq.next_follow_up_at)).getTime() === startOfDay().getTime()
  ) {
    alerts.push({
      alert_type: 'follow_up_due_today',
      alert_level: 'watch',
      title: 'Follow-Up Due Today',
      message: `Follow-up for ${rfq.company || rfq.name} is due today.`,
    });
  }

  if (rfq.status === 'waiting_on_customer' && updatedAt < businessDaysAgo(7)) {
    alerts.push({
      alert_type: 'customer_waiting',
      alert_level: 'warning',
      title: 'Customer Waiting',
      message: `${rfq.company || rfq.name} has been waiting on customer for more than 7 business days.`,
    });
  }

  if (rfq.status === 'follow_up_needed' && !rfq.next_follow_up_at) {
    alerts.push({
      alert_type: 'follow_up_overdue',
      alert_level: 'warning',
      title: 'Follow-Up Needed',
      message: `${rfq.company || rfq.name} is marked follow-up needed without a scheduled next follow-up.`,
    });
  }

  return alerts;
}

export async function getFollowUpQueue() {
  await requireAdminAccess();
  const { data, error } = await supabase
    .from('rfq_followup_queue_view')
    .select('*')
    .neq('computed_queue_bucket', 'closed')
    .order('next_follow_up_at', { ascending: true, nullsFirst: false });

  if (error) throw new Error('Unable to load follow-up queue.');
  return data ?? [];
}

export async function getOverdueAlerts() {
  await requireAdminAccess();
  const { data, error } = await supabase.from('rfq_overdue_alerts_view').select('*');
  if (error) throw new Error('Unable to load overdue alert candidates.');
  return data ?? [];
}

export async function getOpenAlerts() {
  await requireAdminAccess();
  const { data, error } = await supabase
    .from('rfq_alerts')
    .select('*, rfq_requests(id, company, name, email, status)')
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) throw new Error('Unable to load open alerts.');
  return data ?? [];
}

export async function createAlert(alertData) {
  await requireAdminAccess();
  const { data, error } = await supabase
    .from('rfq_alerts')
    .insert(alertData)
    .select('*')
    .single();
  if (error || !data) throw new Error('Unable to create alert.');
  return data;
}

export async function dismissAlert(alertId) {
  await requireAdminAccess();
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from('rfq_alerts')
    .update({
      status: 'dismissed',
      dismissed_at: new Date().toISOString(),
      dismissed_by: user?.id ?? null,
    })
    .eq('id', alertId)
    .select('*')
    .single();
  if (error || !data) throw new Error('Unable to dismiss alert.');
  return data;
}

export async function resolveAlert(alertId) {
  await requireAdminAccess();
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from('rfq_alerts')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      resolved_by: user?.id ?? null,
    })
    .eq('id', alertId)
    .select('*')
    .single();
  if (error || !data) throw new Error('Unable to resolve alert.');
  return data;
}

async function resolveOpenAlertsForRfq(rfqRequestId, alertTypes) {
  const user = await getCurrentUser();
  const { error } = await supabase
    .from('rfq_alerts')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      resolved_by: user?.id ?? null,
    })
    .eq('rfq_request_id', rfqRequestId)
    .eq('status', 'open')
    .in('alert_type', alertTypes);
  if (error) throw new Error('Unable to resolve alerts.');
}

async function dismissOpenAlertsForRfq(rfqRequestId) {
  const user = await getCurrentUser();
  const { error } = await supabase
    .from('rfq_alerts')
    .update({
      status: 'dismissed',
      dismissed_at: new Date().toISOString(),
      dismissed_by: user?.id ?? null,
    })
    .eq('rfq_request_id', rfqRequestId)
    .eq('status', 'open');
  if (error) throw new Error('Unable to dismiss alerts.');
}

export async function dismissRFQReminder(rfqRequestId, untilDate) {
  await requireAdminAccess();
  const { data, error } = await supabase
    .from('rfq_requests')
    .update({
      follow_up_reminder_dismissed_until: untilDate,
      follow_up_status: 'dismissed',
      last_admin_touch_at: new Date().toISOString(),
    })
    .eq('id', rfqRequestId)
    .select('*')
    .single();
  if (error || !data) throw new Error('Unable to dismiss reminder.');
  await dismissOpenAlertsForRfq(rfqRequestId);
  await addInternalNote(rfqRequestId, 'Follow-up reminder dismissed.');
  return data;
}

export async function updateFollowUpPriority(rfqRequestId, priority) {
  await requireAdminAccess();
  const { data, error } = await supabase
    .from('rfq_requests')
    .update({
      follow_up_priority: priority,
      last_admin_touch_at: new Date().toISOString(),
    })
    .eq('id', rfqRequestId)
    .select('*')
    .single();
  if (error || !data) throw new Error('Unable to update follow-up priority.');
  return data;
}

export async function scheduleNextFollowUp(rfqRequestId, nextFollowUpAt) {
  await requireAdminAccess();
  const { data, error } = await supabase
    .from('rfq_requests')
    .update({
      next_follow_up_at: nextFollowUpAt,
      follow_up_status: 'scheduled',
      follow_up_reminder_dismissed_until: null,
      last_admin_touch_at: new Date().toISOString(),
    })
    .eq('id', rfqRequestId)
    .select('*')
    .single();
  if (error || !data) throw new Error('Unable to schedule follow-up.');
  await addInternalNote(rfqRequestId, 'Next follow-up scheduled.');
  return data;
}

export async function markFollowUpCompleted(rfqRequestId) {
  await requireAdminAccess();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('rfq_requests')
    .update({
      last_follow_up_at: now,
      overdue_alert_level: 'none',
      follow_up_status: 'completed',
      last_admin_touch_at: now,
    })
    .eq('id', rfqRequestId)
    .select('*')
    .single();
  if (error || !data) throw new Error('Unable to mark follow-up completed.');
  await resolveOpenAlertsForRfq(rfqRequestId, [...FOLLOW_UP_ALERT_TYPES]);
  await addInternalNote(rfqRequestId, 'Follow-up completed from reminder queue.');
  return data;
}

export async function refreshComputedReminderStatuses() {
  await requireAdminAccess();

  const { data: rfqs, error } = await supabase.from('rfq_requests').select('*');
  if (error) throw new Error('Unable to refresh reminder statuses.');

  const { data: openAlerts } = await supabase
    .from('rfq_alerts')
    .select('*')
    .eq('status', 'open');

  const alertsByRfq = {};
  for (const alert of openAlerts ?? []) {
    alertsByRfq[alert.rfq_request_id] ??= [];
    alertsByRfq[alert.rfq_request_id].push(alert);
  }

  const generatedAlerts = [];
  const now = new Date().toISOString();

  for (const rfq of rfqs ?? []) {
    const suggested = generateAlertsForRfq(rfq);
    const existingTypes = new Set((alertsByRfq[rfq.id] ?? []).map((a) => a.alert_type));

    for (const alert of suggested) {
      if (!existingTypes.has(alert.alert_type)) {
        const created = await createAlert({
          rfq_request_id: rfq.id,
          alert_type: alert.alert_type,
          alert_level: alert.alert_level,
          title: alert.title,
          message: alert.message,
          status: 'open',
        });
        generatedAlerts.push(created);
        existingTypes.add(alert.alert_type);
      }
    }

    const followUpStatus = computeFollowUpStatus(rfq);
    const overdueLevel = computeAlertLevel(rfq, [...(alertsByRfq[rfq.id] ?? []), ...generatedAlerts.filter((a) => a.rfq_request_id === rfq.id)]);

    await supabase
      .from('rfq_requests')
      .update({
        follow_up_status: followUpStatus,
        overdue_alert_level: overdueLevel,
        last_alert_generated_at: now,
      })
      .eq('id', rfq.id);
  }

  return { generatedCount: generatedAlerts.length };
}

export function computeReminderStats(queue, openAlerts) {
  const today = toDateString();
  const weekEnd = toDateString(addBusinessDays(new Date(), 7));

  return {
    overdue: queue.filter((item) => item.computed_queue_bucket === 'overdue').length,
    dueToday: queue.filter((item) => item.computed_queue_bucket === 'due_today').length,
    upcomingThisWeek: queue.filter((item) => {
      if (item.computed_queue_bucket !== 'upcoming' || !item.next_follow_up_at) return false;
      const followDate = item.next_follow_up_at.slice(0, 10);
      return followDate >= today && followDate <= weekEnd;
    }).length,
    noFollowUp: queue.filter((item) => item.computed_queue_bucket === 'no_follow_up').length,
    criticalAlerts: openAlerts.filter((a) => a.alert_level === 'critical').length,
    staleRfqs: openAlerts.filter((a) => ['stale_new_rfq', 'stale_in_review', 'quote_not_sent', 'customer_waiting'].includes(a.alert_type)).length,
  };
}

export function groupQueueByBucket(queue) {
  const order = ['overdue', 'due_today', 'upcoming', 'no_follow_up'];
  const groups = Object.fromEntries(order.map((bucket) => [bucket, []]));
  for (const item of queue) {
    if (groups[item.computed_queue_bucket]) {
      groups[item.computed_queue_bucket].push(item);
    }
  }
  return order.map((bucket) => ({ bucket, items: groups[bucket] }));
}

export { addBusinessDays, toDateString };
