import { supabase, RFQ_BUCKET } from '../lib/supabaseClient';

export const RFQ_STATUSES = ['new', 'in_review', 'quoted', 'closed', 'rejected'];

const SIGNED_URL_TTL_SECONDS = 3600;

async function requireAuth() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    throw new Error('Admin access required.');
  }
  return session;
}

export async function getAuthSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function signInAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error('Invalid email or password.');
  return data.session;
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error('Unable to sign out.');
}

export async function getRFQRequests() {
  await requireAuth();

  const { data, error } = await supabase
    .from('rfq_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error('Unable to load RFQ requests.');
  return data ?? [];
}

export async function getRFQRequestById(id) {
  await requireAuth();

  const { data, error } = await supabase
    .from('rfq_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) throw new Error('RFQ request not found.');
  return data;
}

export async function getRFQFiles(rfqRequestId) {
  await requireAuth();

  const { data, error } = await supabase
    .from('rfq_files')
    .select('*')
    .eq('rfq_request_id', rfqRequestId)
    .order('created_at', { ascending: true });

  if (error) throw new Error('Unable to load RFQ files.');
  return data ?? [];
}

export async function updateRFQStatus(id, status) {
  await requireAuth();

  if (!RFQ_STATUSES.includes(status)) {
    throw new Error('Invalid status.');
  }

  const { data, error } = await supabase
    .from('rfq_requests')
    .update({ status })
    .eq('id', id)
    .select('*')
    .single();

  if (error || !data) throw new Error('Unable to update RFQ status.');
  return data;
}

export async function createSignedFileUrl(filePath) {
  await requireAuth();

  const { data, error } = await supabase.storage
    .from(RFQ_BUCKET)
    .createSignedUrl(filePath, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    throw new Error('Unable to generate download link.');
  }

  return data.signedUrl;
}

export function computeRFQStats(requests) {
  const counts = {
    total: requests.length,
    new: 0,
    in_review: 0,
    quoted: 0,
    closed: 0,
    rejected: 0,
  };

  for (const req of requests) {
    if (req.status in counts) {
      counts[req.status] += 1;
    }
  }

  return counts;
}

export function filterRFQRequests(requests, { statusFilter = 'all', searchQuery = '' }) {
  let filtered = [...requests];

  if (statusFilter !== 'all') {
    filtered = filtered.filter((req) => req.status === statusFilter);
  }

  const query = searchQuery.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter((req) => {
      const haystack = [
        req.company,
        req.name,
        req.email,
        req.project_type,
        req.notes,
        req.material,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  return filtered.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}
