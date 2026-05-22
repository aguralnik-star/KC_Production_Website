import { supabase } from '../lib/supabaseClient';
import { getCurrentSession, getCurrentUser, isCurrentUserAdmin } from './authService';
import { COMPANY } from '../data/company';
import {
  CUSTOMER_STATUS_LABELS,
  PUBLIC_STATUSES,
  getCustomerStatusLabel,
} from './rfqWorkflowService';

export const STATUS_EMAIL_MESSAGES = {
  received: 'Your RFQ has been received and is waiting for review.',
  under_review: 'Our team is reviewing your RFQ and uploaded project details.',
  additional_info_needed:
    'We may need additional information before we can continue review. Please reply with any updated drawings, quantities, tolerances, or timeline requirements.',
  quote_in_progress: 'Your RFQ is being prepared for quoting.',
  quote_sent: 'A quote or follow-up response has been sent or is being finalized.',
  completed: 'This RFQ has been completed.',
  closed: 'This RFQ has been closed. Please contact us if you have questions.',
};

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

function displayValue(value) {
  return value?.trim() || '—';
}

function buildSubject(rfqRequest) {
  const reference = displayValue(rfqRequest.reference_number);
  return `Update on Your RFQ ${reference} - K&C Design and Manufacturing`;
}

function buildBody(rfqRequest, publicStatus, customerStatusMessage) {
  const name = rfqRequest.name?.trim() || 'there';
  const statusLabel = getCustomerStatusLabel(publicStatus);
  const message = customerStatusMessage?.trim() || STATUS_EMAIL_MESSAGES[publicStatus] || STATUS_EMAIL_MESSAGES.received;

  return [
    `Hi ${name},`,
    '',
    'We wanted to provide an update on your RFQ with K&C Design and Manufacturing.',
    '',
    `RFQ Reference Number: ${displayValue(rfqRequest.reference_number)}`,
    `Current Status: ${statusLabel}`,
    message,
    '',
    'Project Summary:',
    `Company: ${displayValue(rfqRequest.company)}`,
    `Project Type: ${displayValue(rfqRequest.project_type)}`,
    `Material: ${displayValue(rfqRequest.material)}`,
    `Quantity: ${displayValue(rfqRequest.quantity)}`,
    `Timeline: ${displayValue(rfqRequest.timeline)}`,
    '',
    'If you have questions or need to provide additional information, please reply to this email or contact us directly.',
    '',
    'Thank you,',
    '',
    COMPANY.shortName,
    COMPANY.address,
    COMPANY.city,
    `Phone: ${COMPANY.phone}`,
    `Email: ${COMPANY.email}`,
  ].join('\n');
}

export function generateStatusEmailDraft(rfqRequest, publicStatus, customMessage) {
  if (!PUBLIC_STATUSES.includes(publicStatus)) {
    throw new Error('Invalid public status.');
  }

  const message = customMessage?.trim() || STATUS_EMAIL_MESSAGES[publicStatus];

  return {
    public_status: publicStatus,
    subject: buildSubject(rfqRequest),
    body: buildBody(rfqRequest, publicStatus, message),
    status: 'draft',
  };
}

export async function saveStatusEmailDraft(rfqRequestId, draft) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('rfq_customer_status_email_drafts')
    .insert({
      rfq_request_id: rfqRequestId,
      created_by: user?.id ?? null,
      public_status: draft.public_status,
      subject: draft.subject,
      body: draft.body,
      status: draft.status ?? 'draft',
    })
    .select('*')
    .single();

  if (error || !data) throw new Error('Unable to save status email draft.');
  await addInternalNote(rfqRequestId, 'Customer status update email draft created.');
  return data;
}

export async function getStatusEmailDrafts(rfqRequestId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('rfq_customer_status_email_drafts')
    .select('*')
    .eq('rfq_request_id', rfqRequestId)
    .order('created_at', { ascending: false });

  if (error) throw new Error('Unable to load status email drafts.');
  return data ?? [];
}

export async function updateStatusEmailDraft(draftId, updates) {
  await requireAdminAccess();

  const allowed = {};
  if (updates.subject !== undefined) allowed.subject = updates.subject;
  if (updates.body !== undefined) allowed.body = updates.body;
  if (updates.public_status !== undefined) allowed.public_status = updates.public_status;
  if (updates.status !== undefined) allowed.status = updates.status;

  const { data, error } = await supabase
    .from('rfq_customer_status_email_drafts')
    .update(allowed)
    .eq('id', draftId)
    .select('*')
    .single();

  if (error || !data) throw new Error('Unable to update status email draft.');
  return data;
}

export async function markStatusEmailDraftReady(draftId) {
  return updateStatusEmailDraft(draftId, { status: 'ready' });
}

export async function archiveStatusEmailDraft(draftId) {
  return updateStatusEmailDraft(draftId, { status: 'archived' });
}

export async function sendStatusEmailDraft(draftId) {
  await requireAdminAccess();
  const session = await getCurrentSession();
  if (!session?.access_token) throw new Error('Authentication required.');

  const { data, error } = await supabase.functions.invoke('send-customer-status-update', {
    body: { draft_id: draftId },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    throw new Error('Unable to send customer status update email.');
  }

  if (data?.error || !data?.sent) {
    throw new Error(data?.error || 'Unable to send customer status update email.');
  }

  return data;
}

export async function getStatusEmailEvents(rfqRequestId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('rfq_customer_status_email_events')
    .select('*')
    .eq('rfq_request_id', rfqRequestId)
    .order('created_at', { ascending: false });

  if (error) throw new Error('Unable to load status email events.');
  return data ?? [];
}

export { CUSTOMER_STATUS_LABELS, PUBLIC_STATUSES, STATUS_EMAIL_MESSAGES as DEFAULT_STATUS_EMAIL_MESSAGES };
