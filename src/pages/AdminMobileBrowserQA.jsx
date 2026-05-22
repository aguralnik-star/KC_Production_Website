import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import MobileBrowserQADashboard from '../components/admin/mobileQA/MobileBrowserQADashboard';
import {
  computeQASummary,
  createIssue,
  loadMobileBrowserQAState,
  saveMobileBrowserQAState,
} from '../services/mobileBrowserQAService';

export default function AdminMobileBrowserQA() {
  const { session, handleSignOut } = useOutletContext();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setState(loadMobileBrowserQAState());
    setLoading(false);
  }, []);

  const summary = useMemo(() => (state ? computeQASummary(state) : null), [state]);

  const persist = useCallback(async (nextState) => {
    setSaving(true);
    setError('');
    try {
      const saved = saveMobileBrowserQAState(nextState);
      setState(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save QA state.');
    } finally {
      setSaving(false);
    }
  }, []);

  const handleViewportChange = (viewportId, status) => {
    if (!state) return;
    persist({
      ...state,
      viewportChecks: { ...state.viewportChecks, [viewportId]: status },
    });
  };

  const handleBrowserChange = (checkId, status, label, browserId) => {
    if (!state) return;
    persist({
      ...state,
      browserChecks: {
        ...state.browserChecks,
        [checkId]: {
          ...(state.browserChecks[checkId] ?? {}),
          browserId,
          label,
          status,
        },
      },
    });
  };

  const handleUpdateReview = (path, updates) => {
    if (!state) return;
    persist({
      ...state,
      pageReviews: {
        ...state.pageReviews,
        [path]: { ...state.pageReviews[path], ...updates },
      },
    });
  };

  const handleCreateIssue = async (payload) => {
    if (!state) return;
    await persist({
      ...state,
      issues: [createIssue(payload), ...state.issues],
    });
  };

  const handleUpdateIssue = async (id, updates) => {
    if (!state) return;
    await persist({
      ...state,
      issues: state.issues.map((issue) => (issue.id === id ? { ...issue, ...updates } : issue)),
    });
  };

  const handleNotesChange = (evidenceNotes) => {
    setState((prev) => (prev ? { ...prev, evidenceNotes } : prev));
  };

  const handleSaveNotes = async () => {
    if (!state) return;
    await persist(state);
  };

  if (loading || !state || !summary) {
    return (
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Mobile & Browser QA">
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading mobile and browser QA dashboard" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <PageHead
        title="Mobile & Browser QA | K&C Design and Manufacturing"
        description="Final mobile responsiveness and cross-browser QA dashboard."
      />

      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Mobile & Browser QA">
        {error ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </div>
        ) : null}

        <MobileBrowserQADashboard
          summary={summary}
          state={state}
          saving={saving}
          onViewportChange={handleViewportChange}
          onBrowserChange={handleBrowserChange}
          onUpdateReview={handleUpdateReview}
          onCreateIssue={handleCreateIssue}
          onUpdateIssue={handleUpdateIssue}
          onNotesChange={handleNotesChange}
          onSaveNotes={handleSaveNotes}
        />
      </AdminLayout>
    </>
  );
}
