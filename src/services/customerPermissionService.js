import { supabase } from '../lib/supabaseClient';
import {
  buildPermissionMatrix,
  findPermission,
  getApprovedPermissions as filterApprovedPermissions,
  isPermissionApproved,
} from '../data/customerReferencePermissionData';
import { getCurrentUser, isCurrentUserAdmin } from './authService';

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

async function logPermissionActivity(customerReferenceId, activityType, permissionType, notes) {
  const user = await getCurrentUser();
  await supabase.from('customer_reference_activity').insert({
    customer_reference_id: customerReferenceId,
    activity_type: activityType,
    activity_summary: `${permissionType.replace(/_/g, ' ')} permission ${activityType.replace('permission_', '')}.`,
    created_by: user?.id ?? null,
    related_table: 'customer_reference_permissions',
    notes: notes ?? null,
  });
}

export async function createPermission(customerReferenceId, permissionData) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('customer_reference_permissions')
    .insert({
      customer_reference_id: customerReferenceId,
      permission_type: permissionData.permission_type,
      permission_status: permissionData.permission_status ?? 'not_requested',
      allowed_usage: permissionData.allowed_usage ?? [],
      approval_method: permissionData.approval_method ?? null,
      approval_date: permissionData.approval_date ?? null,
      expiration_date: permissionData.expiration_date ?? null,
      approval_evidence: permissionData.approval_evidence ?? null,
      restrictions: permissionData.restrictions ?? null,
      approved_by_customer_name: permissionData.approved_by_customer_name ?? null,
      internal_notes: permissionData.internal_notes ?? null,
    })
    .select('*')
    .single();

  if (error) throw new Error('Unable to create permission.');
  return data;
}

export async function updatePermission(permissionId, updates) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const payload = { ...updates };
  if (updates.approval_method || updates.approval_date) {
    payload.reviewed_by = user?.id ?? null;
  }

  const { data, error } = await supabase
    .from('customer_reference_permissions')
    .update(payload)
    .eq('id', permissionId)
    .select('*')
    .single();

  if (error) throw new Error('Unable to update permission.');
  return data;
}

export async function getPermissions(customerReferenceId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('customer_reference_permissions')
    .select('*')
    .eq('customer_reference_id', customerReferenceId)
    .order('permission_type', { ascending: true });

  if (error) throw new Error('Unable to load permissions.');
  return data ?? [];
}

async function getOrCreatePermission(customerReferenceId, permissionType) {
  const permissions = await getPermissions(customerReferenceId);
  const existing = findPermission(permissions, permissionType);
  if (existing) return existing;
  return createPermission(customerReferenceId, { permission_type: permissionType });
}

export async function requestPermission(permissionId) {
  const updated = await updatePermission(permissionId, { permission_status: 'requested' });
  await logPermissionActivity(updated.customer_reference_id, 'permission_requested', updated.permission_type);
  return updated;
}

export async function approvePermission(permissionId, approvalData = {}) {
  const updated = await updatePermission(permissionId, {
    permission_status: 'approved',
    approval_method: approvalData.approval_method ?? null,
    approval_date: approvalData.approval_date ?? new Date().toISOString().slice(0, 10),
    expiration_date: approvalData.expiration_date ?? null,
    approval_evidence: approvalData.approval_evidence ?? null,
    restrictions: approvalData.restrictions ?? null,
    approved_by_customer_name: approvalData.approved_by_customer_name ?? null,
    allowed_usage: approvalData.allowed_usage ?? [],
    internal_notes: approvalData.internal_notes ?? null,
  });
  await logPermissionActivity(
    updated.customer_reference_id,
    'permission_approved',
    updated.permission_type,
    approvalData.approval_evidence
  );
  return updated;
}

export async function declinePermission(permissionId, reason = '') {
  const updated = await updatePermission(permissionId, {
    permission_status: 'declined',
    internal_notes: reason || null,
  });
  await logPermissionActivity(updated.customer_reference_id, 'permission_declined', updated.permission_type, reason);
  return updated;
}

export async function revokePermission(permissionId, reason = '') {
  const updated = await updatePermission(permissionId, {
    permission_status: 'revoked',
    internal_notes: reason || null,
  });
  await logPermissionActivity(updated.customer_reference_id, 'permission_revoked', updated.permission_type, reason);
  return updated;
}

export async function checkPermission(customerReferenceId, permissionType) {
  const permissions = await getPermissions(customerReferenceId);
  const permission = findPermission(permissions, permissionType);
  return {
    permission,
    approved: isPermissionApproved(permission),
    status: permission?.permission_status ?? 'missing',
  };
}

export async function getApprovedPermissions(customerReferenceId) {
  const permissions = await getPermissions(customerReferenceId);
  return filterApprovedPermissions(permissions);
}

export function getApprovedPermissionsSync(permissions) {
  return permissions.filter((p) => isPermissionApproved(p));
}

export async function getPermissionMatrix(customerReferenceId) {
  const permissions = await getPermissions(customerReferenceId);
  return buildPermissionMatrix(permissions);
}

export async function ensurePermissionAndRequest(customerReferenceId, permissionType) {
  const perm = await getOrCreatePermission(customerReferenceId, permissionType);
  if (perm.permission_status === 'not_requested') {
    return requestPermission(perm.id);
  }
  return perm;
}

export async function getReferencePermissionsForPublish(customerReferenceId) {
  if (!customerReferenceId) return { reference: null, permissions: [] };

  const { data: reference, error: refError } = await supabase
    .from('customer_references')
    .select('*')
    .eq('id', customerReferenceId)
    .maybeSingle();

  if (refError) throw new Error('Unable to load customer reference.');

  const permissions = customerReferenceId ? await getPermissions(customerReferenceId) : [];
  return { reference, permissions };
}
