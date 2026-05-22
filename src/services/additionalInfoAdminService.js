import { supabase } from '../lib/supabaseClient';
import { getCurrentSession, getCurrentUser, isCurrentUserAdmin } from './authService';
import { COMPANY } from '../data/company';

export const REQUEST_TYPES = [
  { value: 'files_and_notes', label: 'Files and Notes' },
  { value: 'files_only', label: 'Files Only' },
  { value: 'notes_only', label: 'Notes Only' },
  { value: 'drawing_revision', label: 'Drawing Revision' },
  { value: 'missing_details', label: 'Missing Details' },
  { value: 'tolerance_clarification', label: 'Tolerance Clarification' },
  { value: 'material_clarification', label: 'Material Clarification' },
  { value: 'quantity_clarification', label: 'Quantity Clarification' },
];

export const REQUESTED_ITEM_TEMPLATES = [
  'Updated drawing file',
  'STEP or DXF file',
  'Material specification',
  'Quantity confirmation',
  'Tolerance requirements',
  'Finish requirements',
  'Delivery timeline',
  'Missing dimensions',
  'Clarification on revision level',
];

const DEFAULT_MESSAGE =
  'Thank you for submitting your RFQ to K&C Design and Manufacturing. To continue reviewing your project, we need a few additional details or updated files.\n\nPlease use the secure link below to provide the requested information.';

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

function generateRequestToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function defaultExpiresAt(days = 14) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function buildDefaultAdditionalInfoDraft(rfqRequest) {
  const reference = rfqRequest.reference_number ?? 'your RFQ';
  return {
    request_type: 'files_and_notes',
    subject: `Additional Information Needed for RFQ ${reference}`,
    message: DEFAULT_MESSAGE,
    requested_items: REQUESTED_ITEM_TEMPLATES.slice(0, 3).join('\n'),
    expires_at: defaultExpiresAt(),
    customer_email: rfqRequest.email,
  };
}

export async function createAdditionalInfoRequestDraft(rfqRequestId, draft) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('rfq_additional_info_requests')
    .insert({
      rfq_request_id: rfqRequestId,
      created_by: user?.id ?? null,
      request_token: generateRequestToken(),
      request_type: draft.request_type ?? 'files_and_notes',
      subject: draft.subject,
      message: draft.message,
      requested_items: draft.requested_items ?? null,
      expires_at: draft.expires_at ?? defaultExpiresAt(),
      customer_email: draft.customer_email ?? null,
      status: 'draft',
    })
    .select('*')
    .single();

  if (error || !data) throw new Error('Unable to create additional info request draft.');
  return data;
}

export async function saveAdditionalInfoRequest(requestId, updates) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('rfq_additional_info_requests')
    .update(updates)
    .eq('id', requestId)
    .select('*')
    .single();

  if (error || !data) throw new Error('Unable to save additional info request.');
  return data;
}

export async function sendAdditionalInfoRequest(requestId) {
  await requireAdminAccess();
  const session = await getCurrentSession();
  if (!session?.access_token) throw new Error('Authentication required.');

  const { data, error } = await supabase.functions.invoke('send-additional-info-request', {
    body: { additional_info_request_id: requestId },
    headers: { Authorization: `Bearer ${session.access_token}` },
  });

  if (error || data?.error || !data?.sent) {
    throw new Error(data?.error || 'Unable to send additional information request.');
  }

  return data;
}

export async function cancelAdditionalInfoRequest(requestId) {
  return saveAdditionalInfoRequest(requestId, { status: 'canceled' });
}

export async function getAdditionalInfoRequests(rfqRequestId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('rfq_additional_info_requests')
    .select('*')
    .eq('rfq_request_id', rfqRequestId)
    .order('created_at', { ascending: false });

  if (error) throw new Error('Unable to load additional info requests.');
  return data ?? [];
}

export async function getCustomerInfoSubmissions(rfqRequestId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('rfq_customer_info_submissions')
    .select('*')
    .eq('rfq_request_id', rfqRequestId)
    .order('created_at', { ascending: false });

  if (error) throw new Error('Unable to load customer submissions.');
  return data ?? [];
}

export async function getCustomerUploadedFiles(rfqRequestId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('rfq_customer_uploaded_files')
    .select('*')
    .eq('rfq_request_id', rfqRequestId)
    .order('created_at', { ascending: false });

  if (error) throw new Error('Unable to load customer uploaded files.');
  return data ?? [];
}

export async function createSignedCustomerFileUrl(filePath) {
  await requireAdminAccess();

  const { data, error } = await supabase.storage
    .from('rfq-files')
    .createSignedUrl(filePath, 3600);

  if (error || !data?.signedUrl) throw new Error('Unable to generate download link.');
  return data.signedUrl;
}

export { COMPANY, DEFAULT_MESSAGE };
