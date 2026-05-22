import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import OwnerHandoffDashboard from '../components/admin/handoff/OwnerHandoffDashboard';
import {
  computeHandoffSummary,
  loadOwnerHandoffState,
  saveOwnerHandoffState,
} from '../services/ownerHandoffService';

export default function AdminOwnerHandoff() {
  const { session, handleSignOut } = useOutletContext();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setState(loadOwnerHandoffState());
    setLoading(false);
  }, []);

  const summary = useMemo(() => (state ? computeHandoffSummary(state) : null), [state]);

  const persist = useCallback(async (nextState) => {
    setSaving(true);
    setError('');
    try {
      const saved = saveOwnerHandoffState(nextState);
      setState(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save handoff state.');
    } finally {
      setSaving(false);
    }
  }, []);

  const updateChecklistItem = (section, id, updates) => {
    if (!state) return;
    persist({
      ...state,
      [section]: {
        ...state[section],
        [id]: { ...state[section][id], ...updates },
      },
    });
  };

  if (loading || !state || !summary) {
    return (
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Owner Handoff">
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading owner handoff dashboard" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <PageHead
        title="Owner Handoff | K&C Design and Manufacturing"
        description="Final production launch package and owner handoff dashboard."
        noindex
      />

      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Owner Handoff">
        {error ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </div>
        ) : null}

        <OwnerHandoffDashboard
          summary={summary}
          state={state}
          saving={saving}
          onAreaStatusChange={(areaId, status) =>
            persist({ ...state, areaStatuses: { ...state.areaStatuses, [areaId]: status } })
          }
          onRemainingIssuesChange={(remainingIssues) => persist({ ...state, remainingIssues })}
          onOwnerToggle={(id, completed) => updateChecklistItem('ownerActions', id, { completed })}
          onOwnerNotesChange={(id, notes) => updateChecklistItem('ownerActions', id, { notes })}
          onPostLaunchToggle={(id, completed) => updateChecklistItem('postLaunchItems', id, { completed })}
          onPostLaunchNotesChange={(id, notes) => updateChecklistItem('postLaunchItems', id, { notes })}
          onSignoffChecklistToggle={(id, completed) => updateChecklistItem('signoffChecklist', id, { completed })}
          onFinalSignoffChange={(updates) =>
            setState((prev) => (prev ? { ...prev, finalSignoff: { ...prev.finalSignoff, ...updates } } : prev))
          }
          onSave={() => persist(state)}
        />
      </AdminLayout>
    </>
  );
}
