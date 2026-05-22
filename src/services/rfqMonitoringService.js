import { supabase } from '../lib/supabaseClient';
import { getCurrentUser, isCurrentUserAdmin } from './authService';
import { convertRFQToCRM, getCRMConversionByRFQ } from './crmService';

export const RFQ_REVIEW_STATUSES = [
  'new',
  'pending_review',
  'qualified',
  'needs_more_info',
  'quoted',
  'follow_up_scheduled',
  'converted_to_customer',
  'disqualified',
];

export const QUOTE_STATUSES = [
  'not_started',
  'in_review',
  'ready_to_send',
  'sent_manually',
  'accepted',
  'declined',
];

export const WORKFLOW_STAGES = [
  { key: 'rfq_received', label: 'RFQ Received', order: 1 },
  { key: 'internal_review', label: 'Internal Review', order: 2 },
  { key: 'qualification', label: 'Qualification', order: 3 },
  { key: 'quote_preparation', label: 'Quote Preparation', order: 4 },
  { key: 'customer_follow_up', label: 'Customer Follow-Up', order: 5 },
  { key: 'quote_accepted', label: 'Quote Accepted', order: 6 },
  { key: 'customer_record_confirmed', label: 'Customer Record Confirmed', order: 7 },
  { key: 'first_job_created', label: 'First Job / Project Created', order: 8 },
  { key: 'converted_customer', label: 'Converted Customer', order: 9 },
];

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

async function ensureReviewRecord(rfqRequestId) {
  const { data: existing } = await supabase
    .from('crm_live_rfq_reviews')
    .select('*')
    .eq('rfq_request_id', rfqRequestId)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from('crm_live_rfq_reviews')
    .insert({
      rfq_request_id: rfqRequestId,
      review_status: 'new',
      workflow_stage: 'rfq_received',
      source_page: '/contact',
    })
    .select('*')
    .single();

  if (error) throw new Error('Unable to initialize RFQ review record.');
  return data;
}

export async function logRfqAuditEvent(rfqRequestId, eventType, metadata = {}, entityType = 'rfq_review') {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const { error } = await supabase.from('crm_rfq_audit_events').insert({
    rfq_request_id: rfqRequestId,
    event_type: eventType,
    entity_type: entityType,
    metadata,
    created_by: user?.id ?? null,
  });

  if (error) throw new Error('Unable to log RFQ audit event.');
}

export async function getLiveRfqs() {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('crm_live_rfq_dashboard_view')
    .select('*')
    .order('submitted_at', { ascending: false })
    .limit(250);

  if (error) throw new Error('Unable to load live RFQs.');

  const rows = data ?? [];
  const now = Date.now();

  return {
    all: rows,
    new: rows.filter((row) => row.review_status === 'new'),
    pendingReview: rows.filter((row) => row.review_status === 'pending_review'),
    qualified: rows.filter((row) => row.review_status === 'qualified'),
    disqualified: rows.filter((row) => row.review_status === 'disqualified'),
    converted: rows.filter((row) => row.review_status === 'converted_to_customer'),
    needsFollowUp: rows.filter((row) => row.needs_follow_up || row.review_status === 'follow_up_scheduled'),
    overdueWithoutReview: rows.filter((row) => {
      if (row.first_reviewed_at) return false;
      const submitted = new Date(row.submitted_at).getTime();
      return now - submitted > 24 * 60 * 60 * 1000;
    }),
  };
}

export async function getRfqById(id) {
  await requireAdminAccess();

  const { data: rfq, error: rfqError } = await supabase
    .from('rfq_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (rfqError || !rfq) throw new Error('RFQ not found.');

  await ensureReviewRecord(id);

  const [
    { data: review },
    { data: quotePrep },
    { data: workflowStages },
    { data: followUpTasks },
    { data: auditEvents },
    crmConversion,
  ] = await Promise.all([
    supabase.from('crm_live_rfq_reviews').select('*').eq('rfq_request_id', id).single(),
    supabase.from('crm_quote_prep_records').select('*').eq('rfq_request_id', id).maybeSingle(),
    supabase
      .from('crm_conversion_workflow_stages')
      .select('*')
      .eq('rfq_request_id', id)
      .order('stage_order', { ascending: true }),
    supabase
      .from('crm_rfq_follow_up_tasks')
      .select('*')
      .eq('rfq_request_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('crm_rfq_audit_events')
      .select('*')
      .eq('rfq_request_id', id)
      .order('created_at', { ascending: false })
      .limit(50),
    getCRMConversionByRFQ(id).catch(() => null),
  ]);

  return {
    rfq,
    review,
    quotePrep,
    workflowStages: workflowStages ?? [],
    followUpTasks: followUpTasks ?? [],
    auditEvents: auditEvents ?? [],
    crmConversion,
  };
}

export async function updateRfqStatus(id, status) {
  await requireAdminAccess();
  if (!RFQ_REVIEW_STATUSES.includes(status)) {
    throw new Error('Invalid RFQ review status.');
  }

  await ensureReviewRecord(id);

  const patch = {
    review_status: status,
    first_reviewed_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('crm_live_rfq_reviews')
    .update(patch)
    .eq('rfq_request_id', id)
    .select('*')
    .single();

  if (error) throw new Error('Unable to update RFQ status.');

  await logRfqAuditEvent(id, 'status_updated', { review_status: status });
  return data;
}

export async function assignRfqOwner(id, ownerId) {
  await requireAdminAccess();
  await ensureReviewRecord(id);

  const { data, error } = await supabase
    .from('crm_live_rfq_reviews')
    .update({ assigned_owner_id: ownerId || null })
    .eq('rfq_request_id', id)
    .select('*')
    .single();

  if (error) throw new Error('Unable to assign RFQ owner.');

  await logRfqAuditEvent(id, 'owner_assigned', { assigned_owner_id: ownerId || null });
  return data;
}

export async function markRfqQualified(id) {
  await requireAdminAccess();
  await ensureReviewRecord(id);

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('crm_live_rfq_reviews')
    .update({
      review_status: 'qualified',
      workflow_stage: 'qualification',
      qualified_at: now,
      first_reviewed_at: now,
    })
    .eq('rfq_request_id', id)
    .select('*')
    .single();

  if (error) throw new Error('Unable to mark RFQ as qualified.');

  await supabase
    .from('crm_conversion_workflow_stages')
    .update({ status: 'completed', completed_at: now })
    .eq('rfq_request_id', id)
    .eq('stage_key', 'qualification');

  await logRfqAuditEvent(id, 'rfq_qualified', { qualified_at: now }, 'lead');
  return data;
}

export async function markRfqNeedsMoreInfo(id, notes = '') {
  await requireAdminAccess();
  await ensureReviewRecord(id);

  const { data, error } = await supabase
    .from('crm_live_rfq_reviews')
    .update({
      review_status: 'needs_more_info',
      workflow_stage: 'internal_review',
      internal_notes: notes || null,
      first_reviewed_at: new Date().toISOString(),
    })
    .eq('rfq_request_id', id)
    .select('*')
    .single();

  if (error) throw new Error('Unable to mark RFQ as needs more info.');

  await logRfqAuditEvent(id, 'needs_more_info', { notes }, 'rfq_review');
  return data;
}

export async function markRfqDisqualified(id, reason = '') {
  await requireAdminAccess();
  await ensureReviewRecord(id);

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('crm_live_rfq_reviews')
    .update({
      review_status: 'disqualified',
      disqualified_at: now,
      disqualify_reason: reason || null,
      first_reviewed_at: now,
    })
    .eq('rfq_request_id', id)
    .select('*')
    .single();

  if (error) throw new Error('Unable to disqualify RFQ.');

  await logRfqAuditEvent(id, 'rfq_disqualified', { reason }, 'rfq_review');
  return data;
}

export async function convertRfqToOpportunity(id) {
  await requireAdminAccess();
  const conversion = await convertRFQToCRM(id);

  await ensureReviewRecord(id);
  await supabase
    .from('crm_live_rfq_reviews')
    .update({
      review_status: 'pending_review',
      workflow_stage: 'customer_record_confirmed',
      first_reviewed_at: new Date().toISOString(),
    })
    .eq('rfq_request_id', id);

  await logRfqAuditEvent(
    id,
    'opportunity_created',
    {
      company_id: conversion.company?.id,
      contact_id: conversion.contact?.id,
      opportunity_id: conversion.opportunity?.id,
    },
    'opportunity',
  );

  return conversion;
}

export async function createRfqFollowUpTask(id, taskInput = {}) {
  await requireAdminAccess();
  const user = await getCurrentUser();
  const detail = await getRfqById(id);
  const companyName = detail.rfq.company?.trim() || detail.rfq.name?.trim() || 'Unknown Company';

  const payload = {
    rfq_request_id: id,
    crm_live_rfq_review_id: detail.review?.id ?? null,
    title: taskInput.title || `Follow up on RFQ from ${companyName}`,
    company_name: taskInput.company_name || companyName,
    contact_name: taskInput.contact_name || detail.rfq.name,
    contact_email: taskInput.contact_email || detail.rfq.email,
    due_date: taskInput.due_date || null,
    priority: taskInput.priority || 'medium',
    recommended_action: taskInput.recommended_action || 'Review RFQ details and schedule internal follow-up.',
    notes: taskInput.notes || null,
    created_by: user?.id ?? null,
  };

  const { data, error } = await supabase
    .from('crm_rfq_follow_up_tasks')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw new Error('Unable to create follow-up task.');

  await supabase
    .from('crm_live_rfq_reviews')
    .update({
      review_status: 'follow_up_scheduled',
      workflow_stage: 'customer_follow_up',
      needs_follow_up: true,
    })
    .eq('rfq_request_id', id);

  await logRfqAuditEvent(id, 'follow_up_task_created', { task_id: data.id, title: data.title }, 'contact');
  return data;
}

export async function getQuotePrepRecord(rfqRequestId) {
  await requireAdminAccess();
  const { data, error } = await supabase
    .from('crm_quote_prep_records')
    .select('*')
    .eq('rfq_request_id', rfqRequestId)
    .maybeSingle();

  if (error) throw new Error('Unable to load quote prep record.');
  return data;
}

export async function upsertQuotePrepRecord(rfqRequestId, input = {}) {
  await requireAdminAccess();
  const detail = await getRfqById(rfqRequestId);
  const crm = detail.crmConversion;

  const payload = {
    rfq_request_id: rfqRequestId,
    company_id: input.company_id ?? crm?.company?.id ?? null,
    contact_id: input.contact_id ?? crm?.contact?.id ?? null,
    opportunity_id: input.opportunity_id ?? crm?.opportunity?.id ?? null,
    project_type: input.project_type ?? detail.rfq.project_type,
    material: input.material ?? detail.rfq.material,
    quantity: input.quantity ?? detail.rfq.quantity,
    deadline: input.deadline ?? detail.rfq.timeline,
    quote_status: input.quote_status ?? 'in_review',
    internal_notes: input.internal_notes ?? null,
    estimated_value: input.estimated_value ?? null,
    next_action: input.next_action ?? null,
  };

  const { data, error } = await supabase
    .from('crm_quote_prep_records')
    .upsert(payload, { onConflict: 'rfq_request_id' })
    .select('*')
    .single();

  if (error) throw new Error('Unable to save quote prep record.');

  await supabase
    .from('crm_live_rfq_reviews')
    .update({ workflow_stage: 'quote_preparation', review_status: 'quoted' })
    .eq('rfq_request_id', rfqRequestId);

  await logRfqAuditEvent(rfqRequestId, 'quote_prep_updated', { quote_status: data.quote_status }, 'opportunity');
  return data;
}

export async function getConversionGateStatus(rfqRequestId, { adminOverride = false, overrideReason = '' } = {}) {
  await requireAdminAccess();
  const detail = await getRfqById(rfqRequestId);
  const user = await getCurrentUser();

  const checks = {
    companyExists: Boolean(detail.crmConversion?.company?.id),
    contactExists: Boolean(detail.crmConversion?.contact?.id),
    opportunityExists: Boolean(detail.crmConversion?.opportunity?.id),
    rfqQualified: detail.review?.review_status === 'qualified' || Boolean(detail.review?.qualified_at),
    quoteAccepted:
      detail.quotePrep?.quote_status === 'accepted' || (adminOverride && Boolean(overrideReason?.trim())),
    notAlreadyConverted: detail.review?.review_status !== 'converted_to_customer',
  };

  const canConvert = Object.values(checks).every(Boolean);

  return {
    canConvert,
    checks,
    overrideApplied: adminOverride && Boolean(overrideReason?.trim()),
    overrideBy: adminOverride ? user?.id : null,
  };
}

export async function convertRfqToCustomer(rfqRequestId, { adminOverride = false, overrideReason = '' } = {}) {
  await requireAdminAccess();
  const gate = await getConversionGateStatus(rfqRequestId, { adminOverride, overrideReason });

  if (!gate.canConvert) {
    const missing = Object.entries(gate.checks)
      .filter(([, pass]) => !pass)
      .map(([key]) => key);
    throw new Error(`Customer conversion blocked. Missing requirements: ${missing.join(', ')}`);
  }

  const user = await getCurrentUser();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('crm_live_rfq_reviews')
    .update({
      review_status: 'converted_to_customer',
      workflow_stage: 'converted_customer',
      converted_to_customer_at: now,
      conversion_override_by: gate.overrideApplied ? user?.id : null,
      conversion_override_reason: gate.overrideApplied ? overrideReason.trim() : null,
    })
    .eq('rfq_request_id', rfqRequestId)
    .select('*')
    .single();

  if (error) throw new Error('Unable to mark RFQ as converted customer.');

  await supabase
    .from('crm_conversion_workflow_stages')
    .update({ status: 'completed', completed_at: now })
    .eq('rfq_request_id', rfqRequestId)
    .eq('stage_key', 'converted_customer');

  await logRfqAuditEvent(
    rfqRequestId,
    'converted_to_customer',
    {
      admin_override: gate.overrideApplied,
      override_reason: gate.overrideApplied ? overrideReason.trim() : null,
    },
    'company',
  );

  return data;
}

export async function updateWorkflowStage(rfqRequestId, stageKey, patch = {}) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('crm_conversion_workflow_stages')
    .update({
      status: patch.status,
      owner_id: patch.owner_id,
      due_date: patch.due_date,
      notes: patch.notes,
      completed_at: patch.status === 'completed' ? new Date().toISOString() : patch.completed_at ?? null,
    })
    .eq('rfq_request_id', rfqRequestId)
    .eq('stage_key', stageKey)
    .select('*')
    .single();

  if (error) throw new Error('Unable to update workflow stage.');

  await supabase
    .from('crm_live_rfq_reviews')
    .update({ workflow_stage: stageKey })
    .eq('rfq_request_id', rfqRequestId);

  await logRfqAuditEvent(rfqRequestId, 'workflow_stage_updated', { stage_key: stageKey, ...patch });
  return data;
}

export async function getAdminOwners() {
  await requireAdminAccess();
  const { data, error } = await supabase
    .from('admin_profiles')
    .select('id, role, is_active')
    .eq('is_active', true);

  if (error) throw new Error('Unable to load admin owners.');
  return data ?? [];
}

export function getReviewStatusLabel(status) {
  const labels = {
    new: 'New',
    pending_review: 'Pending Review',
    qualified: 'Qualified',
    needs_more_info: 'Needs More Info',
    quoted: 'Quoted',
    follow_up_scheduled: 'Follow-Up Scheduled',
    converted_to_customer: 'Converted to Customer',
    disqualified: 'Disqualified',
  };
  return labels[status] || status;
}
