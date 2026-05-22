import { supabase, RFQ_BUCKET } from '../lib/supabaseClient';
import { isCurrentUserAdmin } from './authService';

export const RFQ_STATUSES = [
  'new',
  'in_review',
  'quote_ready',
  'quoted',
  'waiting_on_customer',
  'follow_up_needed',
  'won',
  'lost',
  'closed',
  'rejected',
];

const SIGNED_URL_TTL_SECONDS = 3600;

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    throw new Error('Admin access required.');
  }
}

export async function getRFQRequests() {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('rfq_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error('Unable to load RFQ requests.');
  return data ?? [];
}

export async function getRFQRequestById(id) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('rfq_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) throw new Error('RFQ request not found.');
  return data;
}

export async function getRFQFiles(rfqRequestId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('rfq_files')
    .select('*')
    .eq('rfq_request_id', rfqRequestId)
    .order('created_at', { ascending: true });

  if (error) throw new Error('Unable to load RFQ files.');
  return data ?? [];
}

export async function updateRFQStatus(id, status) {
  await requireAdminAccess();

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
  await requireAdminAccess();

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
