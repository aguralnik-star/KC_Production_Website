import { supabase } from '../lib/supabaseClient';
import { getCurrentUser, isCurrentUserAdmin } from './authService';

export const PUBLIC_STATUSES = [
  'received',
  'under_review',
  'additional_info_needed',
  'quote_in_progress',
  'quote_sent',
  'completed',
  'closed',
];

export const CUSTOMER_STATUS_LABELS = {
  received: 'RFQ Received',
  under_review: 'Under Review',
  additional_info_needed: 'Additional Information Needed',
  quote_in_progress: 'Quote In Progress',
  quote_sent: 'Quote Sent',
  completed: 'Completed',
  closed: 'Closed',
};

export const DEFAULT_CUSTOMER_STATUS_MESSAGES = {
  received: 'Your RFQ has been received and is waiting for review.',
  under_review: 'Our team is reviewing your RFQ and uploaded project details.',
  additional_info_needed: 'We may need additional information before we can continue review.',
  quote_in_progress: 'Your RFQ is being prepared for quoting.',
  quote_sent: 'A quote or follow-up response has been sent or is being finalized.',
  completed: 'This RFQ has been completed.',
  closed: 'This RFQ has been closed.',
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

export function mapInternalStatusToPublicStatus(internalStatus) {
  switch (internalStatus) {
    case 'new':
      return 'received';
    case 'in_review':
      return 'under_review';
    case 'waiting_on_customer':
      return 'additional_info_needed';
    case 'quote_ready':
      return 'quote_in_progress';
    case 'quoted':
    case 'follow_up_needed':
      return 'quote_sent';
    case 'won':
      return 'completed';
    case 'lost':
    case 'closed':
    case 'rejected':
      return 'closed';
    default:
      return 'received';
  }
}

export function getCustomerStatusLabel(publicStatus) {
  return CUSTOMER_STATUS_LABELS[publicStatus] ?? CUSTOMER_STATUS_LABELS.received;
}

export function getDefaultCustomerStatusMessage(publicStatus) {
  return DEFAULT_CUSTOMER_STATUS_MESSAGES[publicStatus]
    ?? DEFAULT_CUSTOMER_STATUS_MESSAGES.received;
}

export function buildPublicStatusUpdateForInternalChange(existingRfq, newInternalStatus) {
  const publicStatus = mapInternalStatusToPublicStatus(newInternalStatus);
  const updates = { public_status: publicStatus };

  if (!existingRfq?.customer_status_message?.trim()) {
    updates.customer_status_message = getDefaultCustomerStatusMessage(publicStatus);
  }

  return updates;
}

export function buildPublicStatusUpdateForManualQuoteSend(existingRfq) {
  const updates = { public_status: 'quote_sent' };

  if (!existingRfq?.customer_status_message?.trim()) {
    updates.customer_status_message = getDefaultCustomerStatusMessage('quote_sent');
  }

  return updates;
}

export async function updatePublicCustomerStatus(rfqRequestId, { public_status, customer_status_message }) {
  await requireAdminAccess();

  if (!PUBLIC_STATUSES.includes(public_status)) {
    throw new Error('Invalid public status.');
  }

  const message = customer_status_message?.trim() || getDefaultCustomerStatusMessage(public_status);

  const { data, error } = await supabase
    .from('rfq_requests')
    .update({
      public_status,
      customer_status_message: message,
    })
    .eq('id', rfqRequestId)
    .select('*')
    .single();

  if (error || !data) throw new Error('Unable to update customer-facing status.');

  await addInternalNote(rfqRequestId, 'Customer-facing RFQ status updated.');
  return data;
}

export function getSuggestedPublicStatus(request) {
  if (request?.public_status) return request.public_status;
  return mapInternalStatusToPublicStatus(request?.status);
}
