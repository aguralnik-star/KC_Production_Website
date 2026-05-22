import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import LiveRfqMonitoringDashboard from '../components/crm/LiveRfqMonitoringDashboard';
import RfqToCustomerConversionWorkflow from '../components/crm/RfqToCustomerConversionWorkflow';
import {
  getAdminOwners,
  getLiveRfqs,
  getRfqById,
} from '../services/rfqMonitoringService';

export default function AdminLiveRfqMonitoring() {
  const { session, handleSignOut } = useOutletContext();
  const [buckets, setBuckets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedRfqId, setSelectedRfqId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [owners, setOwners] = useState([]);

  const loadBuckets = useCallback(async () => {
    const data = await getLiveRfqs();
    setBuckets(data);
  }, []);

  const loadDetail = useCallback(async (id) => {
    if (!id) {
      setDetail(null);
      return;
    }
    setDetailLoading(true);
    try {
      const data = await getRfqById(id);
      setDetail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load RFQ detail.');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    setError('');
    try {
      await loadBuckets();
      if (selectedRfqId) {
        await loadDetail(selectedRfqId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to refresh live RFQs.');
    } finally {
      setRefreshing(false);
    }
  }, [loadBuckets, loadDetail, selectedRfqId]);

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([loadBuckets(), getAdminOwners().then(setOwners)])
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load live RFQ monitoring.'))
      .finally(() => setLoading(false));
  }, [loadBuckets]);

  useEffect(() => {
    loadDetail(selectedRfqId);
  }, [selectedRfqId, loadDetail]);

  const handleSelectRfq = (id) => {
    setSelectedRfqId(id);
    setError('');
  };

  return (
    <>
      <PageHead
        title="Live RFQ Monitoring | K&C Admin"
        description="Monitor website RFQs and manage qualification, quote prep, and customer conversion workflow."
        noindex
      />
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Live RFQ Monitoring">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <LiveRfqMonitoringDashboard
            buckets={buckets}
            loading={loading}
            refreshing={refreshing}
            error={error}
            selectedRfqId={selectedRfqId}
            onRefresh={refreshAll}
            onSelectRfq={handleSelectRfq}
          />
          <RfqToCustomerConversionWorkflow
            detail={detail}
            owners={owners}
            loading={detailLoading}
            onRefresh={() => loadDetail(selectedRfqId)}
            onUpdated={refreshAll}
          />
        </div>
      </AdminLayout>
    </>
  );
}
