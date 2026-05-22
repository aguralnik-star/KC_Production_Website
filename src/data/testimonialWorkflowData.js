export const TESTIMONIAL_STATUSES = [
  'draft',
  'pending_approval',
  'approved',
  'published',
  'needs_revision',
  'rejected',
  'archived',
];

export const DISPLAY_MODES = [
  { value: 'anonymous', label: 'Anonymous — Approved Customer / K&C Customer' },
  { value: 'display_name_only', label: 'Display name only' },
  { value: 'company_only', label: 'Company only' },
  { value: 'role_only', label: 'Role/title only' },
  { value: 'name_and_company', label: 'Name and company' },
  { value: 'name_company_and_role', label: 'Name, company, and role' },
];

export const APPROVAL_METHODS = ['email', 'signed_form', 'verbal', 'other'];

export const ALLOWED_USAGE_OPTIONS = [
  'website',
  'proposals',
  'sales_materials',
  'social_media',
  'anonymous_only',
];

export const DEFAULT_APPROVAL_CHECKLIST = [
  { category: 'customer_permission', checklist_item: 'Customer approved quote wording' },
  { category: 'customer_permission', checklist_item: 'Customer approved name usage' },
  { category: 'customer_permission', checklist_item: 'Customer approved company usage' },
  { category: 'customer_permission', checklist_item: 'Customer approved role/title usage' },
  { category: 'customer_permission', checklist_item: 'Customer approved website publication' },
  { category: 'customer_permission', checklist_item: 'Customer approved sales material usage if selected' },
  { category: 'content_safety', checklist_item: 'No confidential project details' },
  { category: 'content_safety', checklist_item: 'No pricing details' },
  { category: 'content_safety', checklist_item: 'No proprietary customer information' },
  { category: 'content_safety', checklist_item: 'No unsupported performance claims' },
  { category: 'content_safety', checklist_item: 'No certification claims unless verified' },
  { category: 'content_safety', checklist_item: 'No sensitive business details' },
  { category: 'display_review', checklist_item: 'Display mode matches customer approval' },
  { category: 'display_review', checklist_item: 'Anonymous mode used if requested' },
  { category: 'display_review', checklist_item: 'Public quote matches approved version' },
  { category: 'display_review', checklist_item: 'Customer/company/role fields match approved display values' },
];

export const DEFAULT_REQUEST_SUBJECT = 'Request for Testimonial Approval - K&C Design and Manufacturing';

export function getPublicTestimonialAttribution(testimonial) {
  const mode = testimonial?.display_mode ?? 'anonymous';

  switch (mode) {
    case 'display_name_only':
      return {
        role: testimonial.approved_display_name || 'Approved Customer',
        company: '',
      };
    case 'company_only':
      return {
        role: '',
        company: testimonial.approved_company_display || 'K&C Customer',
      };
    case 'role_only':
      return {
        role: testimonial.approved_role_display || 'Manufacturing Professional',
        company: '',
      };
    case 'name_and_company':
      return {
        role: testimonial.approved_display_name || 'Approved Customer',
        company: testimonial.approved_company_display || 'K&C Customer',
      };
    case 'name_company_and_role':
      return {
        role: testimonial.approved_role_display || testimonial.approved_display_name || 'Approved Customer',
        company: testimonial.approved_company_display || 'K&C Customer',
      };
    default:
      return {
        role: 'Approved Customer',
        company: 'K&C Customer',
      };
  }
}

export function mapPublishedTestimonial(row) {
  const attribution = getPublicTestimonialAttribution(row);
  return {
    id: row.id,
    quote: row.quote,
    role: attribution.role,
    company: attribution.company,
    isRepresentative: false,
    isApproved: true,
    sourceType: 'real',
    displayMode: row.display_mode,
    industry: row.industry,
    relatedService: row.related_service,
  };
}

export function validateDisplayModeFields(testimonial) {
  const missing = [];
  const mode = testimonial?.display_mode ?? 'anonymous';

  if (mode === 'display_name_only' && !testimonial?.approved_display_name?.trim()) {
    missing.push('Approved display name is required for display name only mode.');
  }
  if (mode === 'company_only' && !testimonial?.approved_company_display?.trim()) {
    missing.push('Approved company display is required for company only mode.');
  }
  if (mode === 'role_only' && !testimonial?.approved_role_display?.trim()) {
    missing.push('Approved role display is required for role only mode.');
  }
  if (mode === 'name_and_company') {
    if (!testimonial?.approved_display_name?.trim()) missing.push('Approved display name is required.');
    if (!testimonial?.approved_company_display?.trim()) missing.push('Approved company display is required.');
  }
  if (mode === 'name_company_and_role') {
    if (!testimonial?.approved_display_name?.trim()) missing.push('Approved display name is required.');
    if (!testimonial?.approved_company_display?.trim()) missing.push('Approved company display is required.');
    if (!testimonial?.approved_role_display?.trim()) missing.push('Approved role display is required.');
  }

  return missing;
}

export function validatePublishRequirements(testimonial, checklist) {
  const missing = [];

  if (!testimonial?.quote?.trim()) missing.push('Quote is required.');
  if (!testimonial?.approval_received) missing.push('Customer approval must be documented.');
  if (!testimonial?.approval_date) missing.push('Approval date is required.');
  if (!testimonial?.confidentiality_review_complete) missing.push('Confidentiality review must be complete.');
  if (!testimonial?.approved_for_public_use) missing.push('Testimonial must be approved for public use.');

  missing.push(...validateDisplayModeFields(testimonial));

  const required = (checklist ?? []).filter((item) => item.status !== 'not_applicable');
  const failed = required.filter((item) => item.status === 'failed');
  const pending = required.filter((item) => item.status === 'pending');

  if (failed.length > 0) missing.push(`${failed.length} checklist item(s) marked failed.`);
  if (pending.length > 0) missing.push(`${pending.length} checklist item(s) still pending.`);

  const status = testimonial?.status;
  if (!['approved', 'pending_approval'].includes(status)) {
    missing.push('Status must be approved or pending approval with all checklist items passed.');
  }

  return { canPublish: missing.length === 0, missing };
}

export function fillRequestTemplate(body, data) {
  return String(body ?? '')
    .replaceAll('{customer_name}', data.customer_name || '[Customer Name]')
    .replaceAll('{customer_company}', data.customer_company || '[Customer Company]')
    .replaceAll('{customer_email}', data.customer_email || '[Customer Email]')
    .replaceAll('{project_type}', data.project_type || '[Project Type]')
    .replaceAll('{relationship_context}', data.relationship_context || '[Relationship Context]')
    .replaceAll('{requested_usage}', data.requested_usage || '[Requested Usage]')
    .replaceAll('{custom_note}', data.custom_note || '');
}
