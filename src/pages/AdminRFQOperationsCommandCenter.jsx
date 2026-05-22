import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import RFQOperationsCommandCenter from '../components/admin/operations/RFQOperationsCommandCenter';
import { refreshOperationsData } from '../services/rfqOperationsService';

export default function AdminRFQOperationsCommandCenter() {
  const navigate = useNavigate();
  const { session, handleSignOut } = useOutletContext();
  const onSignOut = handleSignOut;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const nextData = await refreshOperationsData();
      setData(nextData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load operations command center.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenRfq = (rfqId) => {
    if (!rfqId) return;
    navigate(`/admin/rfqs?rfq=${rfqId}`);
  };

  return (
    <>
      <PageHead
        title="RFQ Operations Command Center | K&C Design and Manufacturing"
        description="Live admin operations dashboard for monitoring the RFQ platform after launch."
      />

      <AdminLayout email={session?.user?.email} onSignOut={onSignOut} title="Operations Command Center">
        <RFQOperationsCommandCenter
          data={data}
          loading={loading}
          refreshing={refreshing}
          error={error}
          onRefresh={() => loadData(true)}
          onOpenRfq={handleOpenRfq}
        />
      </AdminLayout>
    </>
  );
}
