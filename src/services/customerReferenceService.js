import { supabase } from '../lib/supabaseClient';
import { PERMISSION_TYPES } from '../data/customerReferencePermissionData';
import { getCurrentUser, isCurrentUserAdmin } from './authService';
import { getPermissions } from './customerPermissionService';

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

export async function addCustomerReferenceActivity(customerReferenceId, activity) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('customer_reference_activity')
    .insert({
      customer_reference_id: customerReferenceId,
      activity_type: activity.activity_type,
      activity_summary: activity.activity_summary,
      created_by: user?.id ?? null,
      related_table: activity.related_table ?? null,
      related_record_id: activity.related_record_id ?? null,
      notes: activity.notes ?? null,
    })
    .select('*')
    .single();

  if (error) throw new Error('Unable to record activity.');
  return data;
}

export async function createCustomerReference(data = {}) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const { data: created, error } = await supabase
    .from('customer_references')
    .insert({
      created_by: user?.id ?? null,
      customer_name: data.customer_name ?? null,
      customer_company: data.customer_company ?? null,
      customer_email: data.customer_email ?? null,
      customer_phone: data.customer_phone ?? null,
      customer_role: data.customer_role ?? null,
      industry: data.industry ?? null,
      relationship_type: data.relationship_type ?? 'customer',
      reference_status: data.reference_status ?? 'prospect',
      public_display_mode: data.public_display_mode ?? 'anonymous',
      approved_display_name: data.approved_display_name ?? null,
      approved_company_display: data.approved_company_display ?? null,
      approved_role_display: data.approved_role_display ?? null,
      internal_notes: data.internal_notes ?? null,
      do_not_contact: data.do_not_contact ?? false,
    })
    .select('*')
    .single();

  if (error) throw new Error('Unable to create customer reference.');

  await Promise.all(
    PERMISSION_TYPES.map(({ value }) =>
      supabase.from('customer_reference_permissions').insert({
        customer_reference_id: created.id,
        permission_type: value,
        permission_status: 'not_requested',
        allowed_usage: [],
      })
    )
  );

  await addCustomerReferenceActivity(created.id, {
    activity_type: 'reference_created',
    activity_summary: `Customer reference created for ${created.customer_company || created.customer_name || 'unnamed contact'}.`,
  });

  return created;
}

export async function updateCustomerReference(customerReferenceId, updates) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('customer_references')
    .update(updates)
    .eq('id', customerReferenceId)
    .select('*')
    .single();

  if (error) throw new Error('Unable to update customer reference.');

  if (updates.customer_name || updates.customer_company || updates.customer_email) {
    await addCustomerReferenceActivity(customerReferenceId, {
      activity_type: 'contact_updated',
      activity_summary: 'Customer contact information updated.',
    });
  }

  return data;
}

export async function getCustomerReferences(filters = {}) {
  await requireAdminAccess();

  let query = supabase
    .from('customer_references')
    .select('*')
    .order('updated_at', { ascending: false });

  if (filters.reference_status) {
    query = query.eq('reference_status', filters.reference_status);
  }
  if (filters.industry) {
    query = query.eq('industry', filters.industry);
  }
  if (filters.relationship_type) {
    query = query.eq('relationship_type', filters.relationship_type);
  }
  if (filters.do_not_contact === true) {
    query = query.eq('do_not_contact', true);
  }
  if (filters.do_not_contact === false) {
    query = query.eq('do_not_contact', false);
  }
  if (filters.search?.trim()) {
    const term = `%${filters.search.trim()}%`;
    query = query.or(
      `customer_name.ilike.${term},customer_company.ilike.${term},customer_email.ilike.${term}`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error('Unable to load customer references.');
  return data ?? [];
}

export async function getCustomerReferenceById(customerReferenceId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('customer_references')
    .select('*')
    .eq('id', customerReferenceId)
    .single();

  if (error || !data) throw new Error('Customer reference not found.');
  return data;
}

export async function archiveCustomerReference(customerReferenceId) {
  const updated = await updateCustomerReference(customerReferenceId, { reference_status: 'archived' });
  await addCustomerReferenceActivity(customerReferenceId, {
    activity_type: 'note_added',
    activity_summary: 'Customer reference archived.',
  });
  return updated;
}

export async function setDoNotContact(customerReferenceId, value) {
  const updated = await updateCustomerReference(customerReferenceId, { do_not_contact: value });
  await addCustomerReferenceActivity(customerReferenceId, {
    activity_type: 'do_not_contact_set',
    activity_summary: value ? 'Do not contact flag enabled.' : 'Do not contact flag removed.',
  });
  return updated;
}

async function linkContent(table, recordId, customerReferenceId, activityType, summary) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from(table)
    .update({ customer_reference_id: customerReferenceId })
    .eq('id', recordId)
    .select('*')
    .single();

  if (error) throw new Error(`Unable to link ${table} record.`);

  await addCustomerReferenceActivity(customerReferenceId, {
    activity_type: activityType,
    activity_summary: summary,
    related_table: table,
    related_record_id: recordId,
  });

  return data;
}

export async function linkTestimonial(customerReferenceId, testimonialId) {
  return linkContent(
    'testimonials',
    testimonialId,
    customerReferenceId,
    'testimonial_linked',
    'Testimonial linked to customer reference.'
  );
}

export async function linkCaseStudy(customerReferenceId, caseStudyId) {
  return linkContent(
    'case_studies',
    caseStudyId,
    customerReferenceId,
    'case_study_linked',
    'Case study linked to customer reference.'
  );
}

export async function linkPhoto(customerReferenceId, photoId) {
  return linkContent(
    'case_study_photos',
    photoId,
    customerReferenceId,
    'photo_linked',
    'Project photo linked to customer reference.'
  );
}

export async function getCustomerReferenceActivity(customerReferenceId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('customer_reference_activity')
    .select('*')
    .eq('customer_reference_id', customerReferenceId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw new Error('Unable to load activity feed.');
  return data ?? [];
}

export async function getCustomerReferenceSummary(customerReferenceId) {
  await requireAdminAccess();

  const [reference, permissions, activity] = await Promise.all([
    getCustomerReferenceById(customerReferenceId),
    getPermissions(customerReferenceId),
    getCustomerReferenceActivity(customerReferenceId),
  ]);

  const [testimonialsRes, caseStudiesRes, photosRes, requestsRes] = await Promise.all([
    supabase.from('testimonials').select('*').eq('customer_reference_id', customerReferenceId),
    supabase.from('case_studies').select('*').eq('customer_reference_id', customerReferenceId),
    supabase.from('case_study_photos').select('*').eq('customer_reference_id', customerReferenceId),
    supabase.from('customer_approval_requests').select('*').eq('customer_reference_id', customerReferenceId),
  ]);

  return {
    reference,
    permissions,
    activity,
    linkedTestimonials: testimonialsRes.data ?? [],
    linkedCaseStudies: caseStudiesRes.data ?? [],
    linkedPhotos: photosRes.data ?? [],
    linkedApprovalRequests: requestsRes.data ?? [],
  };
}

export async function getAllPermissions() {
  await requireAdminAccess();
  const { data, error } = await supabase.from('customer_reference_permissions').select('*');
  if (error) throw new Error('Unable to load permissions.');
  return data ?? [];
}
