import { supabase } from '../lib/supabaseClient';
import { getCurrentUser, isCurrentUserAdmin } from './authService';
import { COMPANY } from '../data/company';
import { buildPublicStatusUpdateForManualQuoteSend } from './rfqWorkflowService';

export const DRAFT_TYPES = [
  { value: 'initial_quote', label: 'Initial Quote' },
  { value: 'quote_revision', label: 'Quote Revision' },
  { value: 'follow_up', label: 'Follow-Up' },
  { value: 'clarification_request', label: 'Clarification Request' },
  { value: 'no_quote', label: 'No Quote / Decline' },
];

export const SEND_METHODS = [
  { value: 'manual_email', label: 'Manual Email' },
  { value: 'outlook', label: 'Outlook' },
  { value: 'gmail', label: 'Gmail' },
  { value: 'phone_follow_up', label: 'Phone Follow-Up' },
  { value: 'other', label: 'Other' },
];

const DEFAULT_OPTIONS = {
  draft_type: 'initial_quote',
  quoted_amount: '',
  estimated_lead_time: '',
  payment_terms: 'Net 30',
  delivery_terms: 'FOB Addison, IL',
  validity_days: 30,
  notes_to_customer: '',
  include_file_reference: true,
  include_next_steps: true,
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

export function addBusinessDays(date, days) {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0 && result.getDay() !== 6) added += 1;
  }
  return result;
}

function formatCurrency(amount) {
  if (!amount && amount !== 0) return '—';
  const num = Number(String(amount).replace(/[^0-9.-]/g, ''));
  if (Number.isNaN(num)) return String(amount);
  return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function buildSubject(rfqRequest, draftType) {
  const company = rfqRequest.company?.trim();
  if (draftType === 'follow_up') {
    return company
      ? `Following Up on Your Quote - ${company}`
      : 'Following Up on Your K&C Design and Manufacturing Quote';
  }
  if (draftType === 'clarification_request') {
    return company
      ? `Information Needed for Your RFQ - ${company}`
      : 'Information Needed for Your K&C RFQ';
  }
  if (draftType === 'no_quote') {
    return company
      ? `Regarding Your RFQ - ${company}`
      : 'Regarding Your K&C Design and Manufacturing RFQ';
  }
  if (draftType === 'quote_revision') {
    return company
      ? `Revised Quote for ${company} RFQ - K&C Design and Manufacturing`
      : 'Revised Quote for Your K&C Design and Manufacturing RFQ';
  }
  return company
    ? `Quote for ${company} RFQ - K&C Design and Manufacturing`
    : 'Quote for your K&C Design and Manufacturing RFQ';
}

function buildBody(rfqRequest, options, files = []) {
  const name = rfqRequest.name?.trim() || 'there';
  const {
    draft_type,
    quoted_amount,
    estimated_lead_time,
    payment_terms,
    delivery_terms,
    validity_days,
    notes_to_customer,
    include_file_reference,
    include_next_steps,
  } = { ...DEFAULT_OPTIONS, ...options };

  const signature = [
    'Thank you,',
    COMPANY.shortName,
    COMPANY.address,
    COMPANY.city,
    `Phone: ${COMPANY.phone}`,
    `Email: ${COMPANY.email}`,
  ].join('\n');

  if (draft_type === 'no_quote') {
    return [
      `Hi ${name},`,
      '',
      'Thank you for contacting K&C Design and Manufacturing and for the opportunity to review your RFQ.',
      '',
      'After careful review, we are unable to provide a quote for this project at this time.',
      notes_to_customer ? `\n${notes_to_customer}` : '',
      '',
      'We appreciate your interest and hope to work with you on future projects.',
      '',
      signature,
    ].filter((line, i, arr) => line !== '' || (arr[i - 1] !== '' && arr[i + 1] !== '')).join('\n');
  }

  if (draft_type === 'clarification_request') {
    return [
      `Hi ${name},`,
      '',
      'Thank you for sending your RFQ to K&C Design and Manufacturing.',
      '',
      'To prepare an accurate quote, we need a bit more information:',
      notes_to_customer || '- Please confirm drawings, tolerances, finish requirements, and quantity details.',
      '',
      'Once we receive the additional details, we will promptly provide a quote.',
      '',
      signature,
    ].join('\n');
  }

  if (draft_type === 'follow_up') {
    return [
      `Hi ${name},`,
      '',
      'I wanted to follow up regarding the quote we sent from K&C Design and Manufacturing.',
      '',
      'Please let us know if you have any questions, would like to discuss the project, or are ready to move forward.',
      notes_to_customer ? `\n${notes_to_customer}` : '',
      include_next_steps
        ? '\nWe would be happy to schedule a call or revise the quote if your requirements have changed.'
        : '',
      '',
      signature,
    ].join('\n');
  }

  const intro =
    draft_type === 'quote_revision'
      ? 'Thank you for your patience. Based on updated information, we are pleased to provide the following revised quote:'
      : 'Thank you for sending your RFQ to K&C Design and Manufacturing. Based on the information provided, we are pleased to provide the following quote:';

  const lines = [
    `Hi ${name},`,
    '',
    intro,
    '',
    `Project Type: ${rfqRequest.project_type || '—'}`,
    `Material: ${rfqRequest.material || '—'}`,
    `Quantity: ${rfqRequest.quantity || '—'}`,
  ];

  if (estimated_lead_time) lines.push(`Estimated Lead Time: ${estimated_lead_time}`);
  if (quoted_amount) lines.push(`Quoted Amount: ${formatCurrency(quoted_amount)}`);
  if (payment_terms) lines.push(`Payment Terms: ${payment_terms}`);
  if (delivery_terms) lines.push(`Delivery Terms: ${delivery_terms}`);

  if (include_file_reference && files.length > 0) {
    lines.push('', 'Referenced Files:');
    files.forEach((file) => lines.push(`- ${file.file_name}`));
  }

  if (notes_to_customer) {
    lines.push('', notes_to_customer);
  }

  if (draft_type !== 'no_quote' && validity_days) {
    lines.push('', `This quote is valid for ${validity_days} days unless otherwise noted.`);
  }

  if (include_next_steps) {
    lines.push(
      '',
      'Please reply to this email if you would like to move forward, request changes, or discuss the project details.',
    );
  }

  lines.push('', signature);
  return lines.join('\n');
}

export function generateQuoteDraft(rfqRequest, options = {}, files = []) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  return {
    subject: buildSubject(rfqRequest, mergedOptions.draft_type),
    body: buildBody(rfqRequest, mergedOptions, files),
    draft_type: mergedOptions.draft_type,
    status: 'draft',
  };
}

export async function saveQuoteDraft(rfqRequestId, draft) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('rfq_quote_email_drafts')
    .insert({
      rfq_request_id: rfqRequestId,
      created_by: user?.id ?? null,
      subject: draft.subject,
      body: draft.body,
      draft_type: draft.draft_type ?? 'initial_quote',
      status: draft.status ?? 'draft',
    })
    .select('*')
    .single();

  if (error || !data) throw new Error('Unable to save quote draft.');

  const { data: rfq } = await supabase
    .from('rfq_requests')
    .select('quote_email_draft_count')
    .eq('id', rfqRequestId)
    .single();

  const { data: updatedRfq, error: rfqError } = await supabase
    .from('rfq_requests')
    .update({
      quote_email_draft_count: (rfq?.quote_email_draft_count ?? 0) + 1,
      last_quote_draft_at: new Date().toISOString(),
    })
    .eq('id', rfqRequestId)
    .select('*')
    .single();

  if (rfqError) throw new Error('Draft saved but RFQ summary update failed.');

  await addInternalNote(rfqRequestId, 'Quote email draft created.');

  return { draft: data, rfq: updatedRfq };
}

export async function getQuoteDrafts(rfqRequestId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('rfq_quote_email_drafts')
    .select('*')
    .eq('rfq_request_id', rfqRequestId)
    .order('created_at', { ascending: false });

  if (error) throw new Error('Unable to load quote drafts.');
  return data ?? [];
}

export async function updateQuoteDraft(draftId, updates) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('rfq_quote_email_drafts')
    .update(updates)
    .eq('id', draftId)
    .select('*')
    .single();

  if (error || !data) throw new Error('Unable to update quote draft.');
  return data;
}

export async function markDraftCopied(draftId) {
  await requireAdminAccess();

  const draft = await updateQuoteDraft(draftId, {
    status: 'copied',
    copied_at: new Date().toISOString(),
  });

  await addInternalNote(draft.rfq_request_id, 'Quote email draft copied for manual sending.');
  return draft;
}

export async function createManualSendEvent(rfqRequestId, draftId, sendData) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('rfq_manual_send_events')
    .insert({
      rfq_request_id: rfqRequestId,
      quote_email_draft_id: draftId ?? null,
      sent_by: user?.id ?? null,
      sent_to_email: sendData.sent_to_email ?? null,
      sent_subject: sendData.sent_subject ?? null,
      sent_at: sendData.sent_at ?? new Date().toISOString(),
      send_method: sendData.send_method ?? 'manual_email',
      notes: sendData.notes ?? null,
    })
    .select('*')
    .single();

  if (error || !data) throw new Error('Unable to record manual send event.');
  return data;
}

export async function markDraftManuallySent(draftId, sendData) {
  await requireAdminAccess();
  const user = await getCurrentUser();
  const sentAt = sendData.sent_at ?? new Date().toISOString();

  const draft = await updateQuoteDraft(draftId, {
    status: 'manually_sent',
    manual_sent_at: sentAt,
    manual_sent_by: user?.id ?? null,
  });

  await createManualSendEvent(draft.rfq_request_id, draftId, {
    ...sendData,
    sent_at: sentAt,
    sent_subject: sendData.sent_subject ?? draft.subject,
  });

  const { data: existingRfq } = await supabase
    .from('rfq_requests')
    .select('next_follow_up_at, customer_status_message')
    .eq('id', draft.rfq_request_id)
    .single();

  const rfqUpdates = {
    status: 'quoted',
    quote_sent_at: sentAt,
    quote_manually_sent_at: sentAt,
    quote_manually_sent_by: user?.id ?? null,
    quote_send_method: sendData.send_method ?? 'manual_email',
    quote_send_notes: sendData.notes ?? null,
    ...buildPublicStatusUpdateForManualQuoteSend(existingRfq),
  };

  if (!existingRfq?.next_follow_up_at) {
    rfqUpdates.next_follow_up_at = addBusinessDays(new Date(sentAt), 3).toISOString();
  }

  const { data: updatedRfq, error: rfqError } = await supabase
    .from('rfq_requests')
    .update(rfqUpdates)
    .eq('id', draft.rfq_request_id)
    .select('*')
    .single();

  if (rfqError) throw new Error('Manual send recorded but RFQ update failed.');

  await addInternalNote(draft.rfq_request_id, 'Quote manually sent to customer.');

  return { draft, rfq: updatedRfq };
}

export async function getManualSendEvents(rfqRequestId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('rfq_manual_send_events')
    .select('*')
    .eq('rfq_request_id', rfqRequestId)
    .order('sent_at', { ascending: false });

  if (error) throw new Error('Unable to load manual send events.');
  return data ?? [];
}

export async function archiveQuoteDraft(draftId) {
  return updateQuoteDraft(draftId, { status: 'archived' });
}

export { DEFAULT_OPTIONS as DEFAULT_DRAFT_OPTIONS };
