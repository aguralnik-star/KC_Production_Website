import { supabase } from '../lib/supabaseClient';
import { getCurrentUser, isCurrentUserAdmin } from './authService';

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

export async function createRequest(data) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const { data: created, error } = await supabase
    .from('customer_approval_requests')
    .insert({
      created_by: user?.id ?? null,
      request_type: data.request_type,
      customer_name: data.customer_name ?? null,
      customer_company: data.customer_company ?? null,
      customer_email: data.customer_email ?? null,
      related_testimonial_id: data.related_testimonial_id ?? null,
      related_case_study_id: data.related_case_study_id ?? null,
      customer_reference_id: data.customer_reference_id ?? null,
      status: data.status ?? 'draft',
      subject: data.subject ?? null,
      body: data.body ?? null,
      approval_received: data.approval_received ?? false,
      approval_date: data.approval_date ?? null,
      approval_notes: data.approval_notes ?? null,
      internal_notes: data.internal_notes ?? null,
    })
    .select('*')
    .single();

  if (error) throw new Error('Unable to create approval request.');
  return created;
}

export async function updateRequest(requestId, updates) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('customer_approval_requests')
    .update(updates)
    .eq('id', requestId)
    .select('*')
    .single();

  if (error) throw new Error('Unable to update approval request.');
  return data;
}

export async function getRequests() {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('customer_approval_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw new Error('Unable to load approval requests.');
  return data ?? [];
}

async function updateRequestStatus(requestId, updates) {
  return updateRequest(requestId, updates);
}

export async function markCopied(requestId) {
  return updateRequestStatus(requestId, { status: 'copied' });
}

export async function markSentManually(requestId) {
  return updateRequestStatus(requestId, { status: 'sent_manually' });
}

export async function markAwaitingResponse(requestId) {
  return updateRequestStatus(requestId, { status: 'awaiting_response' });
}

export async function markApproved(requestId, approvalNotes = '') {
  return updateRequestStatus(requestId, {
    status: 'approved',
    approval_received: true,
    approval_date: new Date().toISOString(),
    approval_notes: approvalNotes || null,
  });
}

export async function markDeclined(requestId, approvalNotes = '') {
  return updateRequestStatus(requestId, {
    status: 'declined',
    approval_received: false,
    approval_notes: approvalNotes || null,
  });
}
