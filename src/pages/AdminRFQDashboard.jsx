import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { AlertCircle, Loader2, RefreshCw, Search } from 'lucide-react';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import RFQDashboardStats from '../components/admin/RFQDashboardStats';
import RFQRequestTable from '../components/admin/RFQRequestTable';
import RFQRequestDetail from '../components/admin/RFQRequestDetail';
import {
  computeRFQStats,
  filterRFQRequests,
  getRFQFiles,
  getRFQRequestById,
  getRFQRequests,
  RFQ_STATUSES,
  updateRFQStatus,
} from '../services/adminRfqService';

export default function AdminRFQDashboard() {
  const navigate = useNavigate();
  const { session, handleSignOut } = useOutletContext();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getRFQRequests();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load RFQ requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const loadDetail = useCallback(async (id) => {
    setDetailLoading(true);
    try {
      const [request, files] = await Promise.all([
        getRFQRequestById(id),
        getRFQFiles(id),
      ]);
      setSelectedRequest(request);
      setSelectedFiles(files);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load RFQ details.');
      setSelectedRequest(null);
      setSelectedFiles([]);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleSelect = (id) => {
    setSelectedId(id);
    loadDetail(id);
  };

  const handleStatusChange = async (status) => {
    if (!selectedId) return;
    setSavingStatus(true);
    try {
      const updated = await updateRFQStatus(selectedId, status);
      setSelectedRequest(updated);
      setRequests((prev) => prev.map((req) => (req.id === updated.id ? updated : req)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update status.');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleRequestUpdated = (updatedRequest) => {
    setSelectedRequest(updatedRequest);
    setRequests((prev) => prev.map((req) => (req.id === updatedRequest.id ? updatedRequest : req)));
  };

  const onSignOut = async () => {
    await handleSignOut();
    navigate('/admin/login', { replace: true });
  };

  const stats = useMemo(() => computeRFQStats(requests), [requests]);
  const filteredRequests = useMemo(
    () => filterRFQRequests(requests, { statusFilter, searchQuery }),
    [requests, statusFilter, searchQuery],
  );

  return (
    <>
      <PageHead title="Admin RFQ Dashboard | K&C Design and Manufacturing" description="Review submitted RFQ requests." />

      <AdminLayout email={session?.user?.email} onSignOut={onSignOut}>
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={loadRequests}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-charcoal hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}

        <RFQDashboardStats stats={stats} />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-metallic" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, name, email, project…"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-charcoal focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            {RFQ_STATUSES.map((status) => (
              <option key={status} value={status}>{status.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="mt-8 flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading RFQs" />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <RFQRequestTable
              requests={filteredRequests}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
            <div className={`${selectedId ? 'block' : 'hidden xl:block'} min-h-[480px]`}>
              <RFQRequestDetail
                request={selectedRequest}
                files={selectedFiles}
                loading={detailLoading}
                savingStatus={savingStatus}
                onClose={() => {
                  setSelectedId(null);
                  setSelectedRequest(null);
                  setSelectedFiles([]);
                }}
                onStatusChange={handleStatusChange}
                onRequestUpdated={handleRequestUpdated}
              />
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
