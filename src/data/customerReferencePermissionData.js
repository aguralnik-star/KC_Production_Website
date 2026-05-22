export const RELATIONSHIP_TYPES = [
  { value: 'customer', label: 'Customer' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'partner', label: 'Partner' },
  { value: 'other', label: 'Other' },
];

export const REFERENCE_STATUSES = [
  { value: 'prospect', label: 'Prospect' },
  { value: 'requested', label: 'Requested' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' },
  { value: 'active_reference', label: 'Active Reference' },
  { value: 'archived', label: 'Archived' },
];

export const PUBLIC_DISPLAY_MODES = [
  { value: 'anonymous', label: 'Anonymous' },
  { value: 'name_only', label: 'Name Only' },
  { value: 'company_only', label: 'Company Only' },
  { value: 'role_only', label: 'Role Only' },
  { value: 'name_and_company', label: 'Name and Company' },
  { value: 'name_company_and_role', label: 'Name, Company, and Role' },
];

export const PERMISSION_TYPES = [
  { value: 'testimonial', label: 'Testimonial' },
  { value: 'case_study', label: 'Case Study' },
  { value: 'project_photos', label: 'Project Photos' },
  { value: 'company_name', label: 'Company Name' },
  { value: 'customer_name', label: 'Customer Name' },
  { value: 'customer_role', label: 'Customer Role' },
  { value: 'logo', label: 'Logo' },
  { value: 'anonymous_reference', label: 'Anonymous Reference' },
  { value: 'website_publication', label: 'Website Publication' },
  { value: 'sales_materials', label: 'Sales Materials' },
  { value: 'social_media', label: 'Social Media' },
];

export const PERMISSION_STATUSES = [
  'not_requested',
  'requested',
  'approved',
  'declined',
  'expired',
  'revoked',
];

export const APPROVAL_METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'signed_form', label: 'Signed Form' },
  { value: 'verbal', label: 'Verbal' },
  { value: 'contract', label: 'Contract' },
  { value: 'other', label: 'Other' },
];

export const PERMISSION_SUMMARY_STATES = [
  'Fully Approved',
  'Partially Approved',
  'Pending',
  'Declined',
  'Expired',
  'Revoked',
  'Missing',
];

const TESTIMONIAL_DISPLAY_PERMISSIONS = {
  anonymous: ['anonymous_reference'],
  display_name_only: ['customer_name'],
  company_only: ['company_name'],
  role_only: ['customer_role'],
  name_and_company: ['customer_name', 'company_name'],
  name_company_and_role: ['customer_name', 'company_name', 'customer_role'],
};

const CASE_STUDY_DISPLAY_PERMISSIONS = {
  anonymous: ['anonymous_reference'],
  named_company: ['company_name'],
  named_customer: ['customer_name'],
  named_customer_and_company: ['customer_name', 'company_name'],
};

export function isPermissionExpired(permission) {
  if (!permission?.expiration_date) return false;
  const exp = new Date(permission.expiration_date);
  exp.setHours(23, 59, 59, 999);
  return exp < new Date();
}

export function isPermissionApproved(permission) {
  if (!permission) return false;
  if (permission.permission_status === 'missing') return false;
  if (permission.permission_status !== 'approved') return false;
  if (isPermissionExpired(permission)) return false;
  return true;
}

export function isPermissionBlocked(permission) {
  if (!permission) return false;
  return ['declined', 'revoked'].includes(permission.permission_status)
    || (permission.permission_status === 'approved' && isPermissionExpired(permission));
}

export function findPermission(permissions, permissionType) {
  return permissions?.find((p) => p.permission_type === permissionType) ?? null;
}

export function getEffectivePermissionStatus(permission) {
  if (!permission) return 'missing';
  if (permission.permission_status === 'approved' && isPermissionExpired(permission)) {
    return 'expired';
  }
  return permission.permission_status;
}

export function summarizePermissionState(permissions) {
  const rows = PERMISSION_TYPES.map(({ value }) => {
    const perm = findPermission(permissions, value);
    return getEffectivePermissionStatus(perm);
  });

  if (rows.every((s) => s === 'approved')) return 'Fully Approved';
  if (rows.some((s) => s === 'declined')) return 'Declined';
  if (rows.some((s) => s === 'revoked')) return 'Revoked';
  if (rows.some((s) => s === 'expired')) return 'Expired';
  if (rows.some((s) => s === 'approved') && rows.some((s) => s !== 'approved' && s !== 'not_requested')) {
    return 'Partially Approved';
  }
  if (rows.some((s) => s === 'approved')) return 'Partially Approved';
  if (rows.some((s) => ['requested', 'not_requested'].includes(s))) return 'Pending';
  if (rows.every((s) => s === 'missing' || s === 'not_requested')) return 'Missing';
  return 'Pending';
}

export function buildPermissionMatrix(permissions = []) {
  return PERMISSION_TYPES.map(({ value, label }) => {
    const existing = findPermission(permissions, value);
    const effectiveStatus = getEffectivePermissionStatus(existing);
    return {
      permission_type: value,
      label,
      id: existing?.id ?? null,
      permission_status: effectiveStatus,
      allowed_usage: existing?.allowed_usage ?? [],
      approval_method: existing?.approval_method ?? null,
      approval_date: existing?.approval_date ?? null,
      expiration_date: existing?.expiration_date ?? null,
      approval_evidence: existing?.approval_evidence ?? null,
      restrictions: existing?.restrictions ?? null,
      internal_notes: existing?.internal_notes ?? null,
      isApproved: isPermissionApproved(existing),
      isBlocked: isPermissionBlocked(existing),
    };
  });
}

function checkRequiredPermissions(permissions, requiredTypes, missing, reference) {
  if (reference?.do_not_contact) {
    missing.push('Customer reference is marked do not contact — approval must be explicitly documented.');
  }

  for (const type of requiredTypes) {
    const perm = findPermission(permissions, type);
    if (!perm || perm.permission_status === 'missing') {
      missing.push(`Missing permission: ${PERMISSION_TYPES.find((p) => p.value === type)?.label ?? type}.`);
      continue;
    }
    if (perm.permission_status === 'declined') {
      missing.push(`Permission declined: ${type}.`);
    }
    if (perm.permission_status === 'revoked') {
      missing.push(`Permission revoked: ${type}.`);
    }
    if (perm.permission_status === 'approved' && isPermissionExpired(perm)) {
      missing.push(`Permission expired: ${type}.`);
    }
    if (perm.permission_status !== 'approved') {
      missing.push(`Permission not approved: ${type} (${perm.permission_status}).`);
    }
  }
}

export function validateTestimonialReferencePermissions(reference, permissions, testimonial) {
  const missing = [];
  const warnings = [];

  if (!testimonial?.customer_reference_id) {
    warnings.push('No linked customer reference. Permission must be verified manually.');
    return { canPublish: true, missing: [], warnings };
  }

  if (!reference) {
    missing.push('Linked customer reference not found.');
    return { canPublish: false, missing, warnings };
  }

  const required = ['testimonial', 'website_publication'];
  const displayMode = testimonial.display_mode ?? 'anonymous';
  const displayPerms = TESTIMONIAL_DISPLAY_PERMISSIONS[displayMode] ?? ['anonymous_reference'];
  required.push(...displayPerms);

  checkRequiredPermissions(permissions, [...new Set(required)], missing, reference);

  if (reference.do_not_contact && !testimonial.approval_received) {
    missing.push('Do not contact is set and testimonial approval is not documented.');
  }

  return { canPublish: missing.length === 0, missing, warnings };
}

export function validateCaseStudyReferencePermissions(reference, permissions, caseStudy, photos = []) {
  const missing = [];
  const warnings = [];

  if (!caseStudy?.customer_reference_id) {
    warnings.push('No linked customer reference. Permission must be verified manually.');
    return { canPublish: true, missing: [], warnings };
  }

  if (!reference) {
    missing.push('Linked customer reference not found.');
    return { canPublish: false, missing, warnings };
  }

  const required = ['case_study', 'website_publication'];
  const displayMode = caseStudy.customer_display_mode ?? 'anonymous';
  const displayPerms = CASE_STUDY_DISPLAY_PERMISSIONS[displayMode] ?? ['anonymous_reference'];
  required.push(...displayPerms);

  const activePhotos = (photos ?? []).filter((p) => p.status !== 'archived' && p.status !== 'rejected');
  if (activePhotos.length > 0) {
    required.push('project_photos');
  }

  checkRequiredPermissions(permissions, [...new Set(required)], missing, reference);

  if (reference.do_not_contact && !caseStudy.customer_approval_received) {
    missing.push('Do not contact is set and case study approval is not documented.');
  }

  return { canPublish: missing.length === 0, missing, warnings };
}

export function validatePhotoReferencePermissions(reference, permissions, photo) {
  const missing = [];
  const warnings = [];

  if (!photo?.customer_reference_id) {
    warnings.push('No linked customer reference. Photo permission must be verified manually.');
    return { canPublish: true, missing: [], warnings };
  }

  if (!reference) {
    missing.push('Linked customer reference not found.');
    return { canPublish: false, missing, warnings };
  }

  checkRequiredPermissions(permissions, ['project_photos', 'website_publication'], missing, reference);

  if (reference.do_not_contact && !photo.approved_for_public_use) {
    missing.push('Do not contact is set and photo approval is not documented.');
  }

  return { canPublish: missing.length === 0, missing, warnings };
}

export function getApprovedPermissions(permissions = []) {
  return permissions.filter((p) => isPermissionApproved(p));
}

export function computeReferenceDashboardStats(references = [], permissions = [], testimonials = [], caseStudies = []) {
  const refIds = new Set(references.map((r) => r.id));
  const refPermissions = permissions.filter((p) => refIds.has(p.customer_reference_id));

  const pendingPermissions = refPermissions.filter((p) =>
    ['not_requested', 'requested'].includes(p.permission_status)
  ).length;

  const declinedPermissions = refPermissions.filter((p) =>
    ['declined', 'revoked'].includes(p.permission_status)
  ).length;

  return {
    totalReferences: references.filter((r) => r.reference_status !== 'archived').length,
    approvedReferences: references.filter((r) =>
      ['approved', 'active_reference'].includes(r.reference_status)
    ).length,
    pendingPermissions,
    declinedPermissions,
    activePublishedContent:
      testimonials.filter((t) => t.status === 'published').length +
      caseStudies.filter((c) => c.status === 'published').length,
    doNotContact: references.filter((r) => r.do_not_contact).length,
  };
}
