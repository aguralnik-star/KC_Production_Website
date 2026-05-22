import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Loader2, LogOut, RefreshCw, Search, ShieldAlert } from 'lucide-react';
import PageHead from '../components/PageHead';
import RFQDashboardStats from '../components/admin/RFQDashboardStats';
import RFQRequestTable from '../components/admin/RFQRequestTable';
import RFQRequestDetail from '../components/admin/RFQRequestDetail';
import {
  computeRFQStats,
  filterRFQRequests,
  getAuthSession,
  getRFQFiles,
  getRFQRequestById,
  getRFQRequests,
  RFQ_STATUSES,
  signInAdmin,
  signOutAdmin,
  updateRFQStatus,
} from '../services/adminRfqService';
import { supabase } from '../lib/supabaseClient';

export default function AdminRFQDashboard() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    getAuthSession().then(setSession).finally(() => setAuthLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    if (session) loadRequests();
  }, [session, loadRequests]);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginSubmitting(true);
    setLoginError('');
    try {
      const nextSession = await signInAdmin(loginEmail, loginPassword);
      setSession(nextSession);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOutAdmin();
    setSession(null);
    setRequests([]);
    setSelectedId(null);
    setSelectedRequest(null);
    setSelectedFiles([]);
  };

  const stats = useMemo(() => computeRFQStats(requests), [requests]);
  const filteredRequests = useMemo(
    () => filterRFQRequests(requests, { statusFilter, searchQuery }),
    [requests, statusFilter, searchQuery],
  );

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading" />
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <PageHead title="Admin RFQ Dashboard | K&C Design and Manufacturing" description="Private RFQ review dashboard." />
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-charcoal">
              <ShieldAlert className="h-8 w-8 text-accent" aria-hidden="true" />
              <div>
                <h1 className="text-xl font-bold">Admin access required.</h1>
                <p className="mt-1 text-sm text-metallic">Sign in with your Supabase admin account to review RFQs.</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              {loginError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{loginError}</p>
              )}
              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-charcoal">Email</label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-charcoal">Password</label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
              >
                {loginSubmitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-metallic">
              <Link to="/" className="text-accent hover:underline">← Back to website</Link>
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead title="Admin RFQ Dashboard | K&C Design and Manufacturing" description="Review submitted RFQ requests." />

      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">K&amp;C Admin</p>
              <h1 className="text-xl font-bold text-charcoal">RFQ Review Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadRequests}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-charcoal hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                Refresh
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-charcoal hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
