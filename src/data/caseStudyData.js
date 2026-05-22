export const CASE_STUDY_STATUSES = [
  'draft',
  'pending_approval',
  'approved',
  'published',
  'needs_revision',
  'archived',
];

export const CUSTOMER_DISPLAY_MODES = [
  { value: 'anonymous', label: 'Anonymous — "Representative Customer Project"' },
  { value: 'named_company', label: 'Named company only' },
  { value: 'named_customer', label: 'Named customer only' },
  { value: 'named_customer_and_company', label: 'Named customer and company' },
];

export const PHOTO_CATEGORIES = [
  'Finished Part',
  'Fixture',
  'Gauge',
  'Tooling',
  'Machine Setup',
  'Inspection',
  'Process',
  'Before/After',
  'Facility',
];

export const PHOTO_SAFETY_CHECKLIST = [
  { id: 'no_drawings', label: 'No customer drawings visible' },
  { id: 'no_part_numbers', label: 'No customer part numbers visible' },
  { id: 'no_proprietary_labels', label: 'No proprietary labels visible' },
  { id: 'no_confidential_geometry', label: 'No confidential geometry if restricted' },
  { id: 'no_pricing', label: 'No pricing visible' },
  { id: 'no_employee_pii', label: 'No employee personal data visible' },
  { id: 'public_use_approved', label: 'Approved for public website use' },
  { id: 'web_optimized', label: 'Optimized for web' },
];

export const DEFAULT_APPROVAL_CHECKLIST = [
  { category: 'customer_approval', checklist_item: 'Customer approved case study wording' },
  { category: 'customer_approval', checklist_item: 'Customer approved testimonial if included' },
  { category: 'customer_approval', checklist_item: 'Customer approved company/name usage' },
  { category: 'customer_approval', checklist_item: 'Customer approved industry reference' },
  { category: 'customer_approval', checklist_item: 'Customer approved public display mode' },
  { category: 'photo_approval', checklist_item: 'Photos approved for public website use' },
  { category: 'photo_approval', checklist_item: 'No customer drawings visible' },
  { category: 'photo_approval', checklist_item: 'No part numbers visible' },
  { category: 'photo_approval', checklist_item: 'No proprietary details visible' },
  { category: 'photo_approval', checklist_item: 'No confidential notes visible' },
  { category: 'photo_approval', checklist_item: 'Photos optimized for web' },
  { category: 'content_accuracy', checklist_item: 'No unsupported certification claims' },
  { category: 'content_accuracy', checklist_item: 'No unsupported performance guarantees' },
  { category: 'content_accuracy', checklist_item: 'No confidential pricing' },
  { category: 'content_accuracy', checklist_item: 'No unapproved customer details' },
  { category: 'content_accuracy', checklist_item: 'No exaggerated results' },
];

export const MAX_CASE_STUDY_PHOTOS = 10;
export const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ALLOWED_PHOTO_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

export function slugifyTitle(title) {
  return String(title ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function getCustomerDisplayLabel(caseStudy) {
  switch (caseStudy?.customer_display_mode) {
    case 'named_company':
      return caseStudy.approved_company_display_name || 'Approved Customer Company';
    case 'named_customer':
      return caseStudy.approved_customer_display_name || 'Approved Customer';
    case 'named_customer_and_company':
      return [caseStudy.approved_customer_display_name, caseStudy.approved_company_display_name]
        .filter(Boolean)
        .join(' · ') || 'Approved Customer';
    default:
      return 'Representative Customer Project';
  }
}

export function validatePublishRequirements(caseStudy, photos, checklist) {
  const missing = [];
  const status = caseStudy?.status;
  if (!caseStudy?.customer_approval_received) missing.push('Customer approval must be documented.');
  if ((photos?.length ?? 0) > 0 && !caseStudy?.photo_approval_received) {
    missing.push('Photo approval must be documented when photos are attached.');
  }
  if (!caseStudy?.confidentiality_review_complete) missing.push('Confidentiality review must be complete.');
  if (!caseStudy?.approved_for_public_use) missing.push('Case study must be approved for public use.');

  const publicPhotos = (photos ?? []).filter((p) => p.status !== 'archived' && p.status !== 'rejected');
  if (publicPhotos.length > 0) {
    for (const photo of publicPhotos) {
      if (!photo.approved_for_public_use) {
        missing.push(`Photo "${photo.file_name}" is not approved for public use.`);
      }
      if (!photo.confidentiality_review_complete) {
        missing.push(`Photo "${photo.file_name}" confidentiality review is incomplete.`);
      }
    }
  }

  const requiredChecklist = (checklist ?? []).filter((item) => item.status !== 'not_applicable');
  const failed = requiredChecklist.filter((item) => item.status === 'failed');
  const pending = requiredChecklist.filter((item) => item.status === 'pending');
  const notPassed = requiredChecklist.filter((item) => item.status !== 'passed');

  if (!['approved', 'pending_approval'].includes(status)) {
    missing.push('Case study status must be approved or pending approval.');
  }
  if (status === 'pending_approval' && notPassed.length > 0) {
    missing.push('All checklist items must be passed before publishing from pending approval status.');
  }
  if (failed.length > 0) missing.push(`${failed.length} checklist item(s) marked failed.`);
  if (status === 'approved' && pending.length > 0) {
    missing.push(`${pending.length} checklist item(s) still pending.`);
  }

  return { canPublish: missing.length === 0, missing };
}
