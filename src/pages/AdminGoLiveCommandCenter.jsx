import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import GoLiveExecutiveDashboard from '../components/admin/golive/GoLiveExecutiveDashboard';
import {
  createPostLaunchIssue,
  loadGoLiveState,
  refreshGoLiveDashboardData,
  saveGoLiveState,
  updatePhaseChecklistItem,
  updatePostLaunchIssue,
  updateRfqMonitoring,
} from '../services/goLiveService';
import { buildDefaultRfqMonitoring } from '../data/goLiveData';

export default function AdminGoLiveCommandCenter() {
  const { session, handleSignOut } = useOutletContext();
  const [localState, setLocalState] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async (state, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const data = await refreshGoLiveDashboardData(state);
      setDashboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load go-live dashboard.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const state = loadGoLiveState();
    setLocalState(state);
    loadDashboard(state);
  }, [loadDashboard]);

  const persist = useCallback((nextState) => {
    const saved = saveGoLiveState(nextState);
    setLocalState(saved);
    return saved;
  }, []);

  const handleRefresh = async () => {
    if (!localState) return;
    await loadDashboard(localState, true);
  };

  const handleChecklistToggle = (phaseId, itemId, updates) => {
    if (!localState) return;
    persist(updatePhaseChecklistItem(localState, phaseId, itemId, updates));
  };

  const handleChecklistNotesChange = (phaseId, itemId, updates) => {
    if (!localState) return;
    persist(updatePhaseChecklistItem(localState, phaseId, itemId, updates));
  };

  const handleRfqStepToggle = (rfqId, stepId, completed) => {
    if (!localState) return;
    const existing = localState.rfqMonitoring[rfqId] ?? buildDefaultRfqMonitoring(rfqId);
    persist(updateRfqMonitoring(localState, rfqId, {
      steps: { ...existing.steps, [stepId]: completed },
    }));
  };

  const handleRfqMonitoringChange = (rfqId, updates) => {
    if (!localState) return;
    persist(updateRfqMonitoring(localState, rfqId, updates));
  };

  const handleLaunchApprovalChange = (updates) => {
    if (!localState) return;
    persist({ ...localState, ...updates });
  };

  const handleCreateIssue = async (payload) => {
    setSaving(true);
    setError('');
    try {
      await createPostLaunchIssue({
        ...payload,
        severity: String(payload.severity ?? 'medium').toLowerCase(),
      });
      if (localState) await loadDashboard(localState, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create issue.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateIssue = async (id, updates) => {
    setSaving(true);
    setError('');
    try {
      await updatePostLaunchIssue(id, updates);
      if (localState) await loadDashboard(localState, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update issue.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !localState || !dashboard) {
    return (
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Go-Live Command Center">
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading go-live command center" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <PageHead
        title="Go-Live Command Center | K&C Design and Manufacturing"
        description="Production launch execution and first RFQ monitoring dashboard."
        noindex
      />

      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Go-Live Command Center">
        {error ? (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        ) : null}

        <GoLiveExecutiveDashboard
          dashboard={dashboard}
          localState={localState}
          saving={saving}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onChecklistToggle={handleChecklistToggle}
          onChecklistNotesChange={handleChecklistNotesChange}
          onRfqStepToggle={handleRfqStepToggle}
          onRfqMonitoringChange={handleRfqMonitoringChange}
          onCreateIssue={handleCreateIssue}
          onUpdateIssue={handleUpdateIssue}
          onLaunchApprovalChange={handleLaunchApprovalChange}
        />
      </AdminLayout>
    </>
  );
}
