import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import RealContentDashboard from '../components/admin/realContent/RealContentDashboard';
import {
  addCaseStudy,
  addPhoto,
  addTestimonial,
  computeRealContentSummary,
  loadRealContentState,
  saveRealContentState,
  updateCaseStudy,
  updateConfidentialityReview,
  updatePhoto,
  updateQueueItem,
  updateTestimonial,
} from '../services/realContentReplacementService';

export default function AdminRealContentReplacement() {
  const { session, handleSignOut } = useOutletContext();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setState(loadRealContentState());
    setLoading(false);
  }, []);

  const summary = useMemo(() => (state ? computeRealContentSummary(state) : null), [state]);

  const persist = useCallback((nextState) => {
    setSaving(true);
    setError('');
    try {
      const saved = saveRealContentState(nextState);
      setState(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save real content state.');
    } finally {
      setSaving(false);
    }
  }, []);

  const removeFromList = (key, id) => {
    if (!state) return;
    persist({ ...state, [key]: state[key].filter((item) => item.id !== id) });
  };

  if (loading || !state || !summary) {
    return (
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Real Content">
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading real content dashboard" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <PageHead
        title="Real Content Replacement | K&C Design and Manufacturing"
        description="Admin system for customer-approved testimonials, photography, and case studies."
        noindex
      />

      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Real Content">
        {error ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </div>
        ) : null}

        <RealContentDashboard
          state={state}
          summary={summary}
          saving={saving}
          onAddTestimonial={() => persist(addTestimonial(state))}
          onAddPhoto={() => persist(addPhoto(state))}
          onAddCaseStudy={() => persist(addCaseStudy(state))}
          onUpdateTestimonial={(id, updates) => persist(updateTestimonial(state, id, updates))}
          onUpdatePhoto={(id, updates) => persist(updatePhoto(state, id, updates))}
          onUpdateCaseStudy={(id, updates) => persist(updateCaseStudy(state, id, updates))}
          onRemoveTestimonial={(id) => removeFromList('testimonials', id)}
          onRemovePhoto={(id) => removeFromList('photos', id)}
          onRemoveCaseStudy={(id) => removeFromList('caseStudies', id)}
          onUpdateQueue={(queueId, updates) => persist(updateQueueItem(state, queueId, updates))}
          onConfidentialityToggle={(itemId, value) => persist(updateConfidentialityReview(state, itemId, value))}
        />
      </AdminLayout>
    </>
  );
}
