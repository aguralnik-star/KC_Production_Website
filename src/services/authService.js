import { supabase } from '../lib/supabaseClient';

const ADMIN_ROLES = new Set(['admin', 'owner']);

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw new Error('Unable to verify session.');
  return session;
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

export async function isCurrentUserAdmin() {
  const user = await getCurrentUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('admin_profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data) return false;
  return data.is_active === true && ADMIN_ROLES.has(data.role);
}

export async function signInAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw new Error('Invalid email or password.');
  }

  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    await supabase.auth.signOut();
    throw new Error('This account does not have admin access.');
  }

  return data.session;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error('Unable to sign out.');
}

export async function getAdminProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('admin_profiles')
    .select('id, email, role, is_active, created_at')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}
