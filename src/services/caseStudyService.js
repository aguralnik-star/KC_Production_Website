import { supabase } from '../lib/supabaseClient';
import { DEFAULT_APPROVAL_CHECKLIST, slugifyTitle, validatePublishRequirements } from '../data/caseStudyData';
import { getCurrentUser, isCurrentUserAdmin } from './authService';
import { getCaseStudyPhotos } from './caseStudyPhotoService';

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

export async function createCaseStudy(data = {}) {
  await requireAdminAccess();
  const user = await getCurrentUser();
  const title = data.title?.trim() || 'Untitled Case Study';
  const slug = data.slug?.trim() || slugifyTitle(title) || `case-study-${Date.now()}`;

  const { data: created, error } = await supabase
    .from('case_studies')
    .insert({
      title,
      slug,
      created_by: user?.id ?? null,
      customer_display_mode: data.customer_display_mode ?? 'anonymous',
      industry: data.industry ?? null,
      capability: data.capability ?? null,
      material: data.material ?? null,
      process: data.process ?? null,
      public_summary: data.public_summary ?? null,
      source_type: 'real',
      status: 'draft',
    })
    .select('*')
    .single();

  if (error) throw new Error('Unable to create case study.');
  await createApprovalChecklist(created.id);
  return created;
}

export async function updateCaseStudy(caseStudyId, updates) {
  await requireAdminAccess();

  const payload = { ...updates };
  if (payload.title && !payload.slug) {
    payload.slug = slugifyTitle(payload.title);
  }

  const { data, error } = await supabase
    .from('case_studies')
    .update(payload)
    .eq('id', caseStudyId)
    .select('*')
    .single();

  if (error) throw new Error('Unable to update case study.');
  return data;
}

export async function getCaseStudies() {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw new Error('Unable to load case studies.');
  return data ?? [];
}

export async function getCaseStudyById(caseStudyId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('id', caseStudyId)
    .single();

  if (error || !data) throw new Error('Case study not found.');
  return data;
}

export async function getPublishedCaseStudies() {
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw new Error('Unable to load published case studies.');
  return data ?? [];
}

export async function getPublishedCaseStudyBySlug(slug) {
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw new Error('Unable to load case study.');
  if (!data) return null;
  return data;
}

export async function createApprovalChecklist(caseStudyId) {
  await requireAdminAccess();

  const rows = DEFAULT_APPROVAL_CHECKLIST.map((item) => ({
    case_study_id: caseStudyId,
    checklist_item: item.checklist_item,
    category: item.category,
    status: 'pending',
  }));

  const { data, error } = await supabase
    .from('case_study_approval_checklists')
    .insert(rows)
    .select('*');

  if (error) throw new Error('Unable to create approval checklist.');
  return data ?? [];
}

export async function getApprovalChecklist(caseStudyId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('case_study_approval_checklists')
    .select('*')
    .eq('case_study_id', caseStudyId)
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
    .from('case_study_approval_checklists')
    .update(payload)
    .eq('id', checklistItemId)
    .select('*')
    .single();

  if (error) throw new Error('Unable to update checklist item.');
  return data;
}

export async function getPublishReadiness(caseStudyId) {
  const [caseStudy, photos, checklist] = await Promise.all([
    getCaseStudyById(caseStudyId),
    getCaseStudyPhotos(caseStudyId),
    getApprovalChecklist(caseStudyId),
  ]);

  return validatePublishRequirements(caseStudy, photos, checklist);
}

export async function publishCaseStudy(caseStudyId) {
  await requireAdminAccess();

  const [caseStudy, photos, checklist] = await Promise.all([
    getCaseStudyById(caseStudyId),
    getCaseStudyPhotos(caseStudyId),
    getApprovalChecklist(caseStudyId),
  ]);

  const { canPublish, missing } = validatePublishRequirements(caseStudy, photos, checklist);
  if (!canPublish) {
    throw new Error(`Publish blocked: ${missing.join(' ')}`);
  }

  const publishedAt = new Date().toISOString();

  const { data, error } = await supabase
    .from('case_studies')
    .update({
      status: 'published',
      published_at: publishedAt,
    })
    .eq('id', caseStudyId)
    .select('*')
    .single();

  if (error) throw new Error('Unable to publish case study.');

  const activePhotos = photos.filter((p) => p.status !== 'archived' && p.status !== 'rejected');
  if (activePhotos.length > 0) {
    await supabase
      .from('case_study_photos')
      .update({ status: 'published' })
      .eq('case_study_id', caseStudyId)
      .in('id', activePhotos.map((p) => p.id));
  }

  return data;
}

export async function archiveCaseStudy(caseStudyId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('case_studies')
    .update({ status: 'archived' })
    .eq('id', caseStudyId)
    .select('*')
    .single();

  if (error) throw new Error('Unable to archive case study.');
  return data;
}

export { validatePublishRequirements };
