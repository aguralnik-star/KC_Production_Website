import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import RFQReadinessDashboard from '../components/admin/readiness/RFQReadinessDashboard';
import { getCurrentUser } from '../services/authService';
import {
  createAudit,
  finalizeAudit,
  generateAuditSummary,
  getAudit,
  getChecks,
  updateCheckStatus,
} from '../services/rfqProductionReadinessService';

export default function AdminRFQProductionReadiness() {
  const { session, handleSignOut } = useOutletContext();
  const onSignOut = handleSignOut;

  const [audit, setAudit] = useState(null);
  const [checks, setChecks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [reviewer, setReviewer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const loadAuditData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [currentAudit, currentUser] = await Promise.all([
        getAudit(),
        getCurrentUser(),
      ]);
      setReviewer(currentUser);
      setAudit(currentAudit);

      if (currentAudit?.id) {
        const currentChecks = await getChecks(currentAudit.id);
        setChecks(currentChecks);
        setSummary(generateAuditSummary(currentAudit, currentChecks, currentUser));
      } else {
        setChecks([]);
        setSummary(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load production readiness audit.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuditData();
  }, [loadAuditData]);

  const handleCreateAudit = async () => {
    setCreating(true);
    setError('');
    try {
      const created = await createAudit('Production Launch QA');
      const createdChecks = await getChecks(created.id);
      const currentUser = await getCurrentUser();
      setAudit(created);
      setChecks(createdChecks);
      setSummary(generateAuditSummary(created, createdChecks, currentUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create production readiness audit.');
    } finally {
      setCreating(false);
    }
  };

  const handleFinalizeAudit = async () => {
    if (!audit?.id) return;
    setFinalizing(true);
    setError('');
    try {
      const result = await finalizeAudit(audit.id);
      setAudit(result.audit);
      setChecks(result.checks);
      setSummary(result.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to finalize production readiness audit.');
    } finally {
      setFinalizing(false);
    }
  };

  const handleUpdateStatus = async (check, status) => {
    setUpdatingId(check.id);
    setError('');
    try {
      const result = await updateCheckStatus(check.id, status, check.evidence);
      setAudit(result.audit);
      setChecks(result.checks);
      setSummary(generateAuditSummary(result.audit, result.checks, reviewer));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update checklist item.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveEvidence = async (check, evidence) => {
    setUpdatingId(check.id);
    setError('');
    try {
      const result = await updateCheckStatus(check.id, check.status, evidence);
      setAudit(result.audit);
      setChecks(result.checks);
      setSummary(generateAuditSummary(result.audit, result.checks, reviewer));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save evidence.');
      throw err;
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <PageHead
        title="RFQ Production Readiness | K&C Design and Manufacturing"
        description="Admin production readiness audit and final QA checklist for the RFQ platform."
      />

      <AdminLayout email={session?.user?.email} onSignOut={onSignOut} title="Production Readiness">
        <RFQReadinessDashboard
          audit={audit}
          checks={checks}
          summary={summary}
          loading={loading}
          creating={creating}
          finalizing={finalizing}
          updatingId={updatingId}
          error={error}
          reviewer={reviewer}
          onCreateAudit={handleCreateAudit}
          onFinalizeAudit={handleFinalizeAudit}
          onUpdateStatus={handleUpdateStatus}
          onSaveEvidence={handleSaveEvidence}
        />
      </AdminLayout>
    </>
  );
}
