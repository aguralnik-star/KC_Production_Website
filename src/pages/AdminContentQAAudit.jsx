import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import ContentQADashboard from '../components/admin/contentQA/ContentQADashboard';
import {
  computeContentQASummary,
  loadContentQAAuditState,
  saveContentQAAuditState,
} from '../services/contentQAAuditService';

export default function AdminContentQAAudit() {
  const { session, handleSignOut } = useOutletContext();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setState(loadContentQAAuditState());
    setLoading(false);
  }, []);

  const summary = useMemo(() => (state ? computeContentQASummary(state) : null), [state]);

  const persist = useCallback(async (nextState) => {
    setSaving(true);
    setError('');
    try {
      const saved = saveContentQAAuditState(nextState);
      setState(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save content QA state.');
    } finally {
      setSaving(false);
    }
  }, []);

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

  const handleUpdateClaim = (claimId, updates) => {
    if (!state) return;
    persist({
      ...state,
      claimChecks: {
        ...state.claimChecks,
        [claimId]: { ...state.claimChecks[claimId], ...updates },
      },
    });
  };

  const handleUpdateCategory = (categoryId, updates) => {
    if (!state) return;
    persist({
      ...state,
      categoryChecks: {
        ...state.categoryChecks,
        [categoryId]: { ...state.categoryChecks[categoryId], ...updates },
      },
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
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Content QA">
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading content QA dashboard" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <PageHead
        title="Content QA Audit | K&C Design and Manufacturing"
        description="Production content QA and unsupported claims audit dashboard."
      />

      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Content QA">
        {error ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </div>
        ) : null}

        <ContentQADashboard
          summary={summary}
          state={state}
          saving={saving}
          onUpdateReview={handleUpdateReview}
          onUpdateClaim={handleUpdateClaim}
          onUpdateCategory={handleUpdateCategory}
          onNotesChange={handleNotesChange}
          onSaveNotes={handleSaveNotes}
        />
      </AdminLayout>
    </>
  );
}
