import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { AlertCircle, Bell, Inbox, Loader2, RefreshCw } from 'lucide-react';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import RFQDashboardStats from '../components/admin/RFQDashboardStats';
import RFQRequestTable from '../components/admin/RFQRequestTable';
import RFQRequestDetail from '../components/admin/RFQRequestDetail';
import RFQReminderStats from '../components/admin/RFQReminderStats';
import RFQReminderFilters from '../components/admin/RFQReminderFilters';
import RFQReminderQueue from '../components/admin/RFQReminderQueue';
import RFQOverdueAlerts from '../components/admin/RFQOverdueAlerts';
import {
  computeRFQStats,
  filterRFQRequests,
  getRFQFiles,
  getRFQRequestById,
  getRFQRequests,
  RFQ_STATUSES,
  updateRFQStatus,
} from '../services/adminRfqService';
import {
  computeReminderStats,
  dismissAlert,
  dismissRFQReminder,
  getFollowUpQueue,
  getOpenAlerts,
  groupQueueByBucket,
  markFollowUpCompleted,
  refreshComputedReminderStatuses,
  resolveAlert,
  scheduleNextFollowUp,
  updateFollowUpPriority,
} from '../services/rfqReminderService';

const TABS = [
  { id: 'rfqs', label: 'All RFQs', icon: Inbox },
  { id: 'reminders', label: 'Reminders', icon: Bell },
];

export default function AdminRFQDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, handleSignOut } = useOutletContext();

  const [activeTab, setActiveTab] = useState('rfqs');
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

  const [reminderQueue, setReminderQueue] = useState([]);
  const [openAlerts, setOpenAlerts] = useState([]);
  const [remindersLoading, setRemindersLoading] = useState(false);
  const [reminderSearch, setReminderSearch] = useState('');
  const [bucketFilter, setBucketFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [actionBusyId, setActionBusyId] = useState(null);
  const [alertBusyId, setAlertBusyId] = useState(null);

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

  const loadReminders = useCallback(async () => {
    setRemindersLoading(true);
    setError('');
    try {
      await refreshComputedReminderStatuses();
      const [queue, alerts] = await Promise.all([getFollowUpQueue(), getOpenAlerts()]);
      setReminderQueue(queue);
      setOpenAlerts(alerts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load reminders.');
    } finally {
      setRemindersLoading(false);
    }
  }, []);

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

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'reminders') {
      setActiveTab('reminders');
    }
  }, [searchParams]);

  useEffect(() => {
    const rfqId = searchParams.get('rfq');
    if (rfqId) {
      setActiveTab('rfqs');
      setSelectedId(rfqId);
      loadDetail(rfqId);
    }
  }, [searchParams, loadDetail]);

  useEffect(() => {
    if (activeTab === 'reminders') {
      loadReminders();
    }
  }, [activeTab, loadReminders]);

  const handleSelect = (id) => {
    setSelectedId(id);
    loadDetail(id);
  };

  const handleOpenRfqFromReminders = (id) => {
    setActiveTab('rfqs');
    handleSelect(id);
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

  const runReminderAction = async (id, action) => {
    setActionBusyId(id);
    setError('');
    try {
      await action();
      await loadReminders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update reminder.');
    } finally {
      setActionBusyId(null);
    }
  };

  const runAlertAction = async (alertId, action) => {
    setAlertBusyId(alertId);
    setError('');
    try {
      await action();
      await loadReminders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update alert.');
    } finally {
      setAlertBusyId(null);
    }
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

  const filteredQueue = useMemo(() => {
    const query = reminderSearch.trim().toLowerCase();
    return reminderQueue.filter((item) => {
      const matchesBucket = bucketFilter === 'all' || item.computed_queue_bucket === bucketFilter;
      const matchesPriority = priorityFilter === 'all' || item.follow_up_priority === priorityFilter;
      const matchesSearch = !query || [
        item.company,
        item.name,
        item.email,
        item.project_type,
        item.status,
      ].some((field) => field?.toLowerCase().includes(query));
      return matchesBucket && matchesPriority && matchesSearch;
    });
  }, [reminderQueue, bucketFilter, priorityFilter, reminderSearch]);

  const groupedQueue = useMemo(() => groupQueueByBucket(filteredQueue), [filteredQueue]);
  const reminderStats = useMemo(
    () => computeReminderStats(reminderQueue, openAlerts),
    [reminderQueue, openAlerts],
  );

  const refreshActiveTab = () => {
    if (activeTab === 'reminders') {
      loadReminders();
    } else {
      loadRequests();
    }
  };

  const isRefreshing = activeTab === 'reminders' ? remindersLoading : loading;

  return (
    <>
      <PageHead title="Admin RFQ Dashboard | K&C Design and Manufacturing" description="Review submitted RFQ requests." />

      <AdminLayout email={session?.user?.email} onSignOut={onSignOut} title="RFQ Review Dashboard">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-charcoal hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={refreshActiveTab}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-charcoal hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}

        {activeTab === 'rfqs' ? (
          <>
            <RFQDashboardStats stats={stats} />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search company, name, email, project…"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
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
                  <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
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
          </>
        ) : (
          <>
            {remindersLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading reminders" />
              </div>
            ) : (
              <>
                <RFQReminderStats stats={reminderStats} />

                <div className="mt-8">
                  <h2 className="mb-4 text-lg font-semibold text-charcoal">Open Alerts</h2>
                  <RFQOverdueAlerts
                    alerts={openAlerts}
                    onDismiss={(alertId) => runAlertAction(alertId, () => dismissAlert(alertId))}
                    onResolve={(alertId) => runAlertAction(alertId, () => resolveAlert(alertId))}
                    onOpenRfq={handleOpenRfqFromReminders}
                    busyId={alertBusyId}
                  />
                </div>

                <div className="mt-10">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold text-charcoal">Follow-Up Queue</h2>
                  </div>
                  <RFQReminderFilters
                    searchQuery={reminderSearch}
                    onSearchChange={setReminderSearch}
                    bucketFilter={bucketFilter}
                    onBucketChange={setBucketFilter}
                    priorityFilter={priorityFilter}
                    onPriorityChange={setPriorityFilter}
                  />
                  <div className="mt-6">
                    <RFQReminderQueue
                      groups={groupedQueue}
                      onOpenRfq={handleOpenRfqFromReminders}
                      onScheduleFollowUp={(id, date) => runReminderAction(id, () => scheduleNextFollowUp(id, date))}
                      onMarkComplete={(id) => runReminderAction(id, () => markFollowUpCompleted(id))}
                      onDismissUntil={(id, untilDate) => runReminderAction(id, () => dismissRFQReminder(id, untilDate))}
                      onIncreasePriority={(id, priority) => runReminderAction(id, () => updateFollowUpPriority(id, priority))}
                      actionBusyId={actionBusyId}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </AdminLayout>
    </>
  );
}
