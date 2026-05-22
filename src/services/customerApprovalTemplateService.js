import { supabase } from '../lib/supabaseClient';
import { isCurrentUserAdmin } from './authService';

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

export async function getTemplates() {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('customer_approval_templates')
    .select('*')
    .order('template_type', { ascending: true })
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error('Unable to load approval templates.');
  return data ?? [];
}

export async function createTemplate(template) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('customer_approval_templates')
    .insert({
      template_type: template.template_type,
      template_name: template.template_name,
      subject: template.subject,
      body: template.body,
      is_default: template.is_default ?? false,
    })
    .select('*')
    .single();

  if (error) throw new Error('Unable to create approval template.');
  return data;
}

export async function updateTemplate(templateId, updates) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('customer_approval_templates')
    .update(updates)
    .eq('id', templateId)
    .select('*')
    .single();

  if (error) throw new Error('Unable to update approval template.');
  return data;
}

export async function getDefaultTemplate(templateType) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('customer_approval_templates')
    .select('*')
    .eq('template_type', templateType)
    .eq('is_default', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error('Unable to load default template.');

  if (data) return data;

  const { data: fallback, error: fallbackError } = await supabase
    .from('customer_approval_templates')
    .select('*')
    .eq('template_type', templateType)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fallbackError) throw new Error('Unable to load template.');
  return fallback;
}
