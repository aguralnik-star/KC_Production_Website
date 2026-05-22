import { supabase } from '../lib/supabaseClient';
import { DEFAULT_REQUEST_SUBJECT, fillRequestTemplate } from '../data/testimonialWorkflowData';
import { getCurrentUser, isCurrentUserAdmin } from './authService';

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

export async function getRequestTemplates() {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('testimonial_request_templates')
    .select('*')
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error('Unable to load request templates.');
  return data ?? [];
}

export async function createRequestTemplate(template) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('testimonial_request_templates')
    .insert({
      template_name: template.template_name,
      subject: template.subject,
      body: template.body,
      is_default: template.is_default ?? false,
      created_by: user?.id ?? null,
    })
    .select('*')
    .single();

  if (error) throw new Error('Unable to create request template.');
  return data;
}

export async function updateRequestTemplate(templateId, updates) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('testimonial_request_templates')
    .update(updates)
    .eq('id', templateId)
    .select('*')
    .single();

  if (error) throw new Error('Unable to update request template.');
  return data;
}

export async function generateTestimonialRequestDraft(customerData, template) {
  const subject = template?.subject || DEFAULT_REQUEST_SUBJECT;
  const body = fillRequestTemplate(template?.body ?? '', customerData);
  return { subject, body };
}

export async function createRequestLog(data) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const { data: created, error } = await supabase
    .from('testimonial_request_logs')
    .insert({
      created_by: user?.id ?? null,
      customer_name: data.customer_name ?? null,
      customer_company: data.customer_company ?? null,
      customer_email: data.customer_email ?? null,
      subject: data.subject ?? null,
      request_body: data.request_body ?? null,
      status: data.status ?? 'draft',
      notes: data.notes ?? null,
    })
    .select('*')
    .single();

  if (error) throw new Error('Unable to create request log.');
  return created;
}

export async function getRequestLogs() {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('testimonial_request_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw new Error('Unable to load request logs.');
  return data ?? [];
}

async function updateRequestLog(requestLogId, updates) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('testimonial_request_logs')
    .update(updates)
    .eq('id', requestLogId)
    .select('*')
    .single();

  if (error) throw new Error('Unable to update request log.');
  return data;
}

export async function markRequestCopied(requestLogId) {
  return updateRequestLog(requestLogId, { status: 'copied' });
}

export async function markRequestSentManually(requestLogId) {
  return updateRequestLog(requestLogId, {
    status: 'sent_manually',
    sent_at: new Date().toISOString(),
  });
}

export async function markRequestReceived(requestLogId) {
  return updateRequestLog(requestLogId, { status: 'received' });
}
