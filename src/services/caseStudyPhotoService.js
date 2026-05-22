import { supabase, CASE_STUDY_PHOTOS_BUCKET } from '../lib/supabaseClient';
import {
  ALLOWED_PHOTO_EXTENSIONS,
  ALLOWED_PHOTO_TYPES,
  MAX_CASE_STUDY_PHOTOS,
  MAX_PHOTO_SIZE_BYTES,
} from '../data/caseStudyData';
import { getCurrentUser, isCurrentUserAdmin } from './authService';

const SIGNED_URL_TTL_SECONDS = 3600;

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

function sanitizeFileName(name) {
  return String(name ?? 'photo')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
}

function validatePhotoFile(file) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_PHOTO_TYPES.includes(file.type) && !ALLOWED_PHOTO_EXTENSIONS.includes(ext)) {
    throw new Error('Allowed photo types: JPG, JPEG, PNG, WEBP.');
  }
  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    throw new Error('Each photo must be 10MB or smaller.');
  }
}

export async function getCaseStudyPhotos(caseStudyId) {
  const isAdmin = await isCurrentUserAdmin();

  let query = supabase
    .from('case_study_photos')
    .select('*')
    .eq('case_study_id', caseStudyId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (isAdmin) {
    const { data, error } = await query;
    if (error) throw new Error('Unable to load case study photos.');
    return data ?? [];
  }

  const { data, error } = await query.eq('status', 'published');
  if (error) throw new Error('Unable to load case study photos.');
  return data ?? [];
}

export async function getPublishedCaseStudyPhotos(caseStudyId) {
  const { data, error } = await supabase
    .from('case_study_photos')
    .select('*')
    .eq('case_study_id', caseStudyId)
    .eq('status', 'published')
    .eq('approved_for_public_use', true)
    .eq('confidentiality_review_complete', true)
    .order('sort_order', { ascending: true });

  if (error) throw new Error('Unable to load published photos.');
  return data ?? [];
}

export async function uploadCaseStudyPhoto(caseStudyId, file, metadata = {}) {
  await requireAdminAccess();
  validatePhotoFile(file);

  const existing = await getCaseStudyPhotos(caseStudyId);
  const activeCount = existing.filter((p) => p.status !== 'archived').length;
  if (activeCount >= MAX_CASE_STUDY_PHOTOS) {
    throw new Error(`Maximum ${MAX_CASE_STUDY_PHOTOS} photos per case study.`);
  }

  if (!metadata.alt_text?.trim()) {
    throw new Error('Alt text is required for every photo.');
  }
  if (!metadata.category?.trim()) {
    throw new Error('Photo category is required.');
  }

  const user = await getCurrentUser();
  const timestamp = Date.now();
  const safeName = sanitizeFileName(file.name);
  const filePath = `case-studies/${caseStudyId}/${timestamp}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(CASE_STUDY_PHOTOS_BUCKET)
    .upload(filePath, file, { upsert: false, contentType: file.type });

  if (uploadError) throw new Error('Unable to upload photo.');

  const { data, error } = await supabase
    .from('case_study_photos')
    .insert({
      case_study_id: caseStudyId,
      uploaded_by: user?.id ?? null,
      file_name: file.name,
      file_path: filePath,
      file_type: file.type,
      file_size: file.size,
      alt_text: metadata.alt_text.trim(),
      caption: metadata.caption?.trim() ?? null,
      category: metadata.category.trim(),
      sort_order: activeCount,
      status: 'pending_review',
    })
    .select('*')
    .single();

  if (error) throw new Error('Unable to save photo record.');
  return data;
}

export async function updateCaseStudyPhoto(photoId, updates) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('case_study_photos')
    .update(updates)
    .eq('id', photoId)
    .select('*')
    .single();

  if (error) throw new Error('Unable to update photo.');
  return data;
}

export async function approveCaseStudyPhoto(photoId) {
  return updateCaseStudyPhoto(photoId, {
    status: 'approved',
    approved_for_public_use: true,
    confidentiality_review_complete: true,
  });
}

export async function rejectCaseStudyPhoto(photoId) {
  return updateCaseStudyPhoto(photoId, {
    status: 'rejected',
    approved_for_public_use: false,
  });
}

export async function createSignedPhotoUrl(filePath, { requirePublished = false } = {}) {
  if (!filePath) throw new Error('File path required.');

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    if (!requirePublished) throw new Error('Admin access required.');

    const { data: photo, error: photoError } = await supabase
      .from('case_study_photos')
      .select('status, approved_for_public_use, confidentiality_review_complete, case_study_id')
      .eq('file_path', filePath)
      .maybeSingle();

    if (photoError || !photo) throw new Error('Photo is not available for public display.');
    if (
      photo.status !== 'published'
      || !photo.approved_for_public_use
      || !photo.confidentiality_review_complete
    ) {
      throw new Error('Photo is not available for public display.');
    }

    const { data: study } = await supabase
      .from('case_studies')
      .select('status, approved_for_public_use, confidentiality_review_complete')
      .eq('id', photo.case_study_id)
      .maybeSingle();

    if (
      !study
      || study.status !== 'published'
      || !study.approved_for_public_use
      || !study.confidentiality_review_complete
    ) {
      throw new Error('Photo is not available for public display.');
    }
  }

  const { data, error } = await supabase.storage
    .from(CASE_STUDY_PHOTOS_BUCKET)
    .createSignedUrl(filePath, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) throw new Error('Unable to generate photo URL.');
  return data.signedUrl;
}

export async function deleteOrArchivePhoto(photoId) {
  await requireAdminAccess();
  return updateCaseStudyPhoto(photoId, { status: 'archived' });
}

export async function getPhotoSignedUrls(photos, { requirePublished = false } = {}) {
  const results = await Promise.all(
    photos.map(async (photo) => {
      try {
        const url = await createSignedPhotoUrl(photo.file_path, { requirePublished });
        return { ...photo, signedUrl: url };
      } catch {
        return { ...photo, signedUrl: null };
      }
    }),
  );
  return results;
}
