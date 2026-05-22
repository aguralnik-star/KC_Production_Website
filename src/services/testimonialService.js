import { supabase } from '../lib/supabaseClient';
import {
  DEFAULT_APPROVAL_CHECKLIST,
  validatePublishRequirements,
} from '../data/testimonialWorkflowData';
import { getCurrentUser, isCurrentUserAdmin } from './authService';

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

export async function createTestimonial(data = {}) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const { data: created, error } = await supabase
    .from('testimonials')
    .insert({
      quote: data.quote?.trim() || 'Draft testimonial quote — replace before publishing.',
      created_by: user?.id ?? null,
      source_type: 'real',
      status: 'draft',
      display_mode: data.display_mode ?? 'anonymous',
      allowed_usage: data.allowed_usage ?? ['website'],
    })
    .select('*')
    .single();

  if (error) throw new Error('Unable to create testimonial.');
  await createTestimonialApprovalChecklist(created.id);
  return created;
}

export async function updateTestimonial(testimonialId, updates) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('testimonials')
    .update(updates)
    .eq('id', testimonialId)
    .select('*')
    .single();

  if (error) throw new Error('Unable to update testimonial.');
  return data;
}

export async function getTestimonials() {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw new Error('Unable to load testimonials.');
  return data ?? [];
}

export async function getPublishedTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw new Error('Unable to load published testimonials.');
  return data ?? [];
}

export async function getTestimonialById(testimonialId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', testimonialId)
    .single();

  if (error || !data) throw new Error('Testimonial not found.');
  return data;
}

export async function archiveTestimonial(testimonialId) {
  return updateTestimonial(testimonialId, { status: 'archived' });
}

export async function createTestimonialApprovalChecklist(testimonialId) {
  await requireAdminAccess();

  const rows = DEFAULT_APPROVAL_CHECKLIST.map((item) => ({
    testimonial_id: testimonialId,
    checklist_item: item.checklist_item,
    category: item.category,
    status: 'pending',
  }));

  const { data, error } = await supabase
    .from('testimonial_approval_checklists')
    .insert(rows)
    .select('*');

  if (error) throw new Error('Unable to create approval checklist.');
  return data ?? [];
}

export async function getTestimonialApprovalChecklist(testimonialId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('testimonial_approval_checklists')
    .select('*')
    .eq('testimonial_id', testimonialId)
    .order('created_at', { ascending: true });

  if (error) throw new Error('Unable to load approval checklist.');
  return data ?? [];
}

export async function updateChecklistItem(checklistItemId, updates) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const payload = { ...updates };
  if (updates.status === 'passed' || updates.status === 'failed') {
    payload.completed_at = new Date().toISOString();
    payload.completed_by = user?.id ?? null;
  }

  const { data, error } = await supabase
    .from('testimonial_approval_checklists')
    .update(payload)
    .eq('id', checklistItemId)
    .select('*')
    .single();

  if (error) throw new Error('Unable to update checklist item.');
  return data;
}

export async function getPublishReadiness(testimonialId) {
  const [testimonial, checklist] = await Promise.all([
    getTestimonialById(testimonialId),
    getTestimonialApprovalChecklist(testimonialId),
  ]);
  return validatePublishRequirements(testimonial, checklist);
}

export async function approveTestimonial(testimonialId) {
  return updateTestimonial(testimonialId, { status: 'approved' });
}

export async function publishTestimonial(testimonialId) {
  await requireAdminAccess();

  const [testimonial, checklist] = await Promise.all([
    getTestimonialById(testimonialId),
    getTestimonialApprovalChecklist(testimonialId),
  ]);

  const { canPublish, missing } = validatePublishRequirements(testimonial, checklist);
  if (!canPublish) {
    throw new Error(`Publish blocked: ${missing.join(' ')}`);
  }

  const { data, error } = await supabase
    .from('testimonials')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', testimonialId)
    .select('*')
    .single();

  if (error) throw new Error('Unable to publish testimonial.');
  return data;
}

export { validatePublishRequirements };
