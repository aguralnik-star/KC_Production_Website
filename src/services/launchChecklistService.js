import { supabase } from '../lib/supabaseClient';
import { getCurrentUser, isCurrentUserAdmin } from './authService';

const STORAGE_KEY = 'kc_launch_checklist_v1';

export const LAUNCH_CHECKLIST_TEMPLATE = [
  {
    category: 'Website SEO',
    items: [
      'Page titles verified',
      'Meta descriptions verified',
      'Sitemap generated',
      'Robots.txt configured',
      'LocalBusiness schema added',
      'Open Graph metadata added',
      'Canonical URLs verified',
    ],
  },
  {
    category: 'Performance',
    items: [
      'Production build passes',
      'Public pages lazy-loaded',
      'Admin routes lazy-loaded',
      'Images optimized/lazy-loaded',
      'Large tables capped/paginated',
      'No console errors',
      'Bundle size reviewed',
    ],
  },
  {
    category: 'Accessibility',
    items: [
      'Keyboard navigation checked',
      'Form labels verified',
      'Focus states visible',
      'Color contrast checked',
      'Error messages accessible',
      'Mobile menu accessible',
      'Skip link working',
    ],
  },
  {
    category: 'RFQ Workflow',
    items: [
      'RFQ submission tested',
      'File upload tested',
      'Confirmation page tested',
      'Customer confirmation email tested',
      'Public RFQ status lookup tested',
      'Additional information upload tested',
      'Admin RFQ review tested',
    ],
  },
  {
    category: 'Admin Security',
    items: [
      'Admin login tested',
      'Admin routes protected',
      'RLS policies verified',
      'Private storage verified',
      'Signed download URLs tested',
      'Service role not exposed',
      'Public routes do not expose private data',
    ],
  },
  {
    category: 'Email',
    items: [
      'Resend API configured',
      'Sender domain verified',
      'Reply-to configured',
      'Internal RFQ notification tested',
      'Customer confirmation tested',
      'Customer status update tested',
      'Additional info request email tested',
    ],
  },
  {
    category: 'Supabase',
    items: [
      'Environment variables configured',
      'Migrations applied',
      'Storage bucket private',
      'Edge Functions deployed',
      'RLS enabled',
      'Admin user created',
      'Backup strategy documented',
    ],
  },
  {
    category: 'Vercel Deployment',
    items: [
      'Environment variables added',
      'Build command verified',
      'Output directory verified',
      'Custom domain connected',
      'HTTPS verified',
      'Redirects verified',
      'Production deployment tested',
    ],
  },
];

function flattenTemplate() {
  return LAUNCH_CHECKLIST_TEMPLATE.flatMap(({ category, items }) =>
    items.map((item) => ({
      category,
      item,
      status: 'pending',
      evidence: '',
    })),
  );
}

function buildLocalState(items) {
  const map = new Map(items.map((entry) => [`${entry.category}::${entry.item}`, entry]));
  return flattenTemplate().map((entry) => {
    const saved = map.get(`${entry.category}::${entry.item}`);
    return saved ? { ...entry, ...saved } : entry;
  });
}

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

export function loadLaunchChecklistLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return flattenTemplate();
    const parsed = JSON.parse(raw);
    return buildLocalState(Array.isArray(parsed?.items) ? parsed.items : []);
  } catch {
    return flattenTemplate();
  }
}

export function saveLaunchChecklistLocal(items) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      items,
      updatedAt: new Date().toISOString(),
    }),
  );
}

export function calculateLaunchCompletion(items = []) {
  const applicable = items.filter((item) => item.status !== 'not_applicable');
  if (applicable.length === 0) return 0;
  const completed = applicable.filter((item) => item.status === 'completed').length;
  return Math.round((completed / applicable.length) * 10000) / 100;
}

export function deriveLaunchReadiness(items = [], completion = 0) {
  const criticalCategories = new Set(['Admin Security', 'Email', 'Supabase', 'Vercel Deployment']);
  const hasIncompleteCritical = items.some(
    (item) => criticalCategories.has(item.category) && item.status === 'pending',
  );

  if (completion >= 95 && !hasIncompleteCritical) {
    return { status: 'ready', label: 'Ready for Launch' };
  }
  if (completion >= 80) {
    return { status: 'nearly-ready', label: 'Nearly Ready' };
  }
  return { status: 'not-ready', label: 'Not Ready' };
}

export function groupLaunchChecklist(items = []) {
  return items.reduce((groups, item) => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
    return groups;
  }, {});
}

export async function syncLaunchChecklistToSupabase(items) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const payload = items.map((item) => ({
    category: item.category,
    item: item.item,
    status: item.status,
    evidence: item.evidence || null,
    completed_by: item.status === 'completed' ? user?.id ?? null : null,
    completed_at: item.status === 'completed' ? new Date().toISOString() : null,
  }));

  const { error } = await supabase.from('launch_checklist_items').upsert(payload, {
    onConflict: 'category,item',
  });

  if (error) throw new Error('Unable to sync launch checklist to Supabase.');
}

export async function loadLaunchChecklistFromSupabase() {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('launch_checklist_items')
    .select('*')
    .order('category', { ascending: true });

  if (error) throw new Error('Unable to load launch checklist from Supabase.');
  if (!data?.length) return loadLaunchChecklistLocal();

  return buildLocalState(
    data.map((row) => ({
      category: row.category,
      item: row.item,
      status: row.status,
      evidence: row.evidence ?? '',
    })),
  );
}

export async function loadLaunchChecklist() {
  try {
    return await loadLaunchChecklistFromSupabase();
  } catch {
    return loadLaunchChecklistLocal();
  }
}

export async function saveLaunchChecklist(items, { syncRemote = false } = {}) {
  saveLaunchChecklistLocal(items);
  if (syncRemote) {
    try {
      await syncLaunchChecklistToSupabase(items);
    } catch {
      // Local save remains primary if remote sync is unavailable.
    }
  }
}
