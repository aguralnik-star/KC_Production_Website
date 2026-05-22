import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ClipboardCheck, Download, Loader2, Printer } from 'lucide-react';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import AccessibleButton from '../components/AccessibleButton';
import {
  calculateLaunchCompletion,
  deriveLaunchReadiness,
  groupLaunchChecklist,
  loadLaunchChecklist,
  saveLaunchChecklist,
} from '../services/launchChecklistService';

function StatusBadge({ status, label }) {
  const styles = {
    ready: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    'nearly-ready': 'border-amber-200 bg-amber-50 text-amber-800',
    'not-ready': 'border-red-200 bg-red-50 text-red-800',
    completed: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    pending: 'border-slate-200 bg-slate-100 text-slate-700',
    not_applicable: 'border-slate-200 bg-slate-50 text-slate-600',
  };

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status] ?? styles.pending}`}>
      {label}
    </span>
  );
}

export default function LaunchChecklist() {
  const { session, handleSignOut } = useOutletContext();
  const onSignOut = handleSignOut;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeEvidence, setActiveEvidence] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await loadLaunchChecklist();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load launch checklist.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const completion = useMemo(() => calculateLaunchCompletion(items), [items]);
  const readiness = useMemo(() => deriveLaunchReadiness(items, completion), [items, completion]);
  const grouped = useMemo(() => groupLaunchChecklist(items), [items]);

  const updateItem = async (target, updates) => {
    const nextItems = items.map((item) =>
      item.category === target.category && item.item === target.item
        ? { ...item, ...updates }
        : item,
    );
    setItems(nextItems);
    setSaving(true);
    setError('');
    try {
      await saveLaunchChecklist(nextItems, { syncRemote: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save checklist item.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (target) => {
    const nextStatus = target.status === 'completed' ? 'pending' : 'completed';
    updateItem(target, { status: nextStatus });
  };

  const handleMarkNa = (target) => {
    updateItem(target, { status: 'not_applicable' });
  };

  const handleSaveEvidence = async (evidence) => {
    if (!activeEvidence) return;
    await updateItem(activeEvidence, { evidence });
    setActiveEvidence(null);
  };

  if (loading) {
    return (
      <AdminLayout email={session?.user?.email} onSignOut={onSignOut} title="Launch Checklist">
        <div className="flex min-h-[320px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading launch checklist" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <PageHead
        title="Launch Checklist | K&C Design and Manufacturing"
        description="Production launch checklist for SEO, performance, accessibility, RFQ workflow, and deployment."
        noindex
      />

      <AdminLayout email={session?.user?.email} onSignOut={onSignOut} title="Launch Checklist">
        <div className="launch-checklist space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">Production Launch</p>
                <h2 className="mt-1 text-2xl font-bold text-charcoal">Final Launch Hardening Checklist</h2>
                <p className="mt-2 max-w-3xl text-sm text-metallic">
                  Track SEO, performance, accessibility, RFQ workflow, security, email, Supabase, and Vercel deployment readiness before go-live.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <StatusBadge status={readiness.status} label={readiness.label} />
                <AccessibleButton
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-charcoal hover:border-accent hover:text-accent"
                >
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  Print
                </AccessibleButton>
                <AccessibleButton
                  onClick={() => window.alert('Export summary coming soon. Use Print for now.')}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-charcoal hover:border-accent hover:text-accent"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Export Summary
                </AccessibleButton>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-metallic">Completion</p>
                <p className="mt-2 text-3xl font-bold text-charcoal">{completion}%</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-metallic">Completed Items</p>
                <p className="mt-2 text-3xl font-bold text-emerald-700">
                  {items.filter((item) => item.status === 'completed').length}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-metallic">Total Items</p>
                <p className="mt-2 text-3xl font-bold text-charcoal">{items.length}</p>
              </div>
            </div>
          </section>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </div>
          )}

          {saving && (
            <p className="text-sm text-metallic" role="status">Saving checklist…</p>
          )}

          {Object.entries(grouped).map(([category, categoryItems]) => {
            const categoryCompletion = calculateLaunchCompletion(categoryItems);
            return (
              <section key={category} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-charcoal">{category}</h3>
                    <p className="text-sm text-metallic">{categoryCompletion}% complete</p>
                  </div>
                  <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${categoryCompletion >= 95 ? 'bg-emerald-500' : categoryCompletion >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${categoryCompletion}%` }}
                    />
                  </div>
                </div>

                <ul className="space-y-3">
                  {categoryItems.map((item) => (
                    <li key={`${category}-${item.item}`} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={item.status === 'completed'}
                            onChange={() => handleToggle(item)}
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent/30"
                            aria-label={`Mark ${item.item} complete`}
                          />
                          <div>
                            <p className="font-medium text-charcoal">{item.item}</p>
                            {item.evidence && (
                              <p className="mt-1 text-sm text-metallic">{item.evidence}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status={item.status} label={item.status.replaceAll('_', ' ')} />
                          <AccessibleButton
                            onClick={() => setActiveEvidence(item)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-charcoal hover:border-accent hover:text-accent"
                          >
                            Evidence
                          </AccessibleButton>
                          <AccessibleButton
                            onClick={() => handleMarkNa(item)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-charcoal hover:border-accent hover:text-accent"
                          >
                            N/A
                          </AccessibleButton>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-charcoal">Launch Recommendation</h3>
                <p className="mt-1 text-sm text-charcoal">
                  {readiness.status === 'ready'
                    ? 'Critical launch categories are complete and overall readiness meets the launch threshold.'
                    : readiness.status === 'nearly-ready'
                      ? 'Most launch tasks are complete. Resolve remaining critical deployment and security items before go-live.'
                      : 'Launch is not recommended yet. Complete SEO, security, email, Supabase, and deployment checklist items first.'}
                </p>
              </div>
            </div>
          </section>
        </div>

        {activeEvidence && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 px-4 py-8 print:hidden">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl" role="dialog" aria-modal="true">
              <h3 className="text-lg font-bold text-charcoal">Checklist Evidence</h3>
              <p className="mt-1 text-sm text-metallic">{activeEvidence.item}</p>
              <textarea
                defaultValue={activeEvidence.evidence || ''}
                rows={5}
                className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                id="launch-evidence-input"
              />
              <div className="mt-4 flex justify-end gap-3">
                <AccessibleButton
                  onClick={() => setActiveEvidence(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-charcoal"
                >
                  Cancel
                </AccessibleButton>
                <AccessibleButton
                  onClick={() => {
                    const value = document.getElementById('launch-evidence-input')?.value ?? '';
                    handleSaveEvidence(value.trim());
                  }}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
                >
                  Save Evidence
                </AccessibleButton>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
