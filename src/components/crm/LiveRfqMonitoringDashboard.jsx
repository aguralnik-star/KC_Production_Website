import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Loader2,
  RefreshCw,
  UserRound,
  XCircle,
} from 'lucide-react';
import AccessibleButton from '../AccessibleButton';
import { getReviewStatusLabel, RFQ_REVIEW_STATUSES } from '../../services/rfqMonitoringService';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function SummaryCard({ label, count, tone = 'default', icon: Icon }) {
  const toneClass =
    tone === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-900'
      : tone === 'success'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
        : tone === 'danger'
          ? 'border-red-200 bg-red-50 text-red-900'
          : 'border-slate-200 bg-white text-charcoal';

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${toneClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
          <p className="mt-2 text-2xl font-bold">{count}</p>
        </div>
        {Icon ? <Icon className="h-5 w-5 opacity-70" aria-hidden="true" /> : null}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    new: 'bg-slate-100 text-slate-700',
    pending_review: 'bg-blue-100 text-blue-800',
    qualified: 'bg-emerald-100 text-emerald-800',
    needs_more_info: 'bg-amber-100 text-amber-900',
    quoted: 'bg-indigo-100 text-indigo-800',
    follow_up_scheduled: 'bg-violet-100 text-violet-800',
    converted_to_customer: 'bg-teal-100 text-teal-900',
    disqualified: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] || styles.new}`}>
      {getReviewStatusLabel(status || 'new')}
    </span>
  );
}

export default function LiveRfqMonitoringDashboard({
  buckets,
  loading,
  refreshing,
  error,
  selectedRfqId,
  onRefresh,
  onSelectRfq,
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  const rows = useMemo(() => {
    let list = buckets?.all ?? [];
    if (statusFilter !== 'all') {
      list = list.filter((row) => (row.review_status || 'new') === statusFilter);
    }
    if (showOverdueOnly) {
      list = list.filter((row) => row.overdue_without_review);
    }
    return list;
  }, [buckets, statusFilter, showOverdueOnly]);

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading live RFQs" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-charcoal">Live RFQ Monitoring</h2>
          <p className="mt-1 text-sm text-metallic">
            Monitor website RFQs, review qualification, and convert approved opportunities — no automatic customer contact.
          </p>
        </div>
        <AccessibleButton
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-charcoal disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
          Refresh
        </AccessibleButton>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="New RFQs" count={buckets?.new?.length ?? 0} icon={Clock} />
        <SummaryCard label="Pending Review" count={buckets?.pendingReview?.length ?? 0} icon={Filter} />
        <SummaryCard label="Qualified" count={buckets?.qualified?.length ?? 0} tone="success" icon={CheckCircle2} />
        <SummaryCard
          label="Overdue > 24h"
          count={buckets?.overdueWithoutReview?.length ?? 0}
          tone="warning"
          icon={AlertTriangle}
        />
        <SummaryCard label="Disqualified" count={buckets?.disqualified?.length ?? 0} tone="danger" icon={XCircle} />
        <SummaryCard label="Converted" count={buckets?.converted?.length ?? 0} tone="success" icon={CheckCircle2} />
        <SummaryCard label="Needs Follow-Up" count={buckets?.needsFollowUp?.length ?? 0} icon={UserRound} />
        <SummaryCard label="Total Live RFQs" count={buckets?.all?.length ?? 0} />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <label className="text-sm font-medium text-charcoal" htmlFor="rfq-status-filter">
          Status
        </label>
        <select
          id="rfq-status-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          {RFQ_REVIEW_STATUSES.map((status) => (
            <option key={status} value={status}>
              {getReviewStatusLabel(status)}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={showOverdueOnly}
            onChange={(event) => setShowOverdueOnly(event.target.checked)}
          />
          Overdue without review only
        </label>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="live-rfq-table-heading">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 id="live-rfq-table-heading" className="text-lg font-bold text-charcoal">
            Live RFQ Queue
          </h3>
          <p className="mt-1 text-sm text-metallic">{rows.length} RFQ(s) shown</p>
        </div>

        {!rows.length ? (
          <p className="p-6 text-sm text-metallic">No RFQs match the current filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-metallic">
                <tr>
                  <th scope="col" className="px-4 py-3">Reference</th>
                  <th scope="col" className="px-4 py-3">Company / Contact</th>
                  <th scope="col" className="px-4 py-3">Project</th>
                  <th scope="col" className="px-4 py-3">Material</th>
                  <th scope="col" className="px-4 py-3">Qty</th>
                  <th scope="col" className="px-4 py-3">Deadline</th>
                  <th scope="col" className="px-4 py-3">Source</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Owner</th>
                  <th scope="col" className="px-4 py-3">Submitted</th>
                  <th scope="col" className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isSelected = selectedRfqId === row.rfq_request_id;
                  return (
                    <tr
                      key={row.rfq_request_id}
                      className={`border-b border-slate-100 ${isSelected ? 'bg-accent/5' : 'hover:bg-slate-50'} ${row.overdue_without_review ? 'bg-amber-50/40' : ''}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs">{row.reference_number || '—'}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-charcoal">{row.company_name || '—'}</p>
                        <p className="text-xs text-metallic">{row.contact_name}</p>
                      </td>
                      <td className="px-4 py-3 text-charcoal">{row.project_type || '—'}</td>
                      <td className="px-4 py-3 text-charcoal">{row.material || '—'}</td>
                      <td className="px-4 py-3 text-charcoal">{row.quantity || '—'}</td>
                      <td className="px-4 py-3 text-charcoal">{row.deadline || '—'}</td>
                      <td className="px-4 py-3 text-xs text-metallic">{row.source_page || '/contact'}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={row.review_status || 'new'} />
                        {row.overdue_without_review ? (
                          <p className="mt-1 text-xs font-semibold text-amber-700">Overdue review</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-xs text-metallic">
                        {row.assigned_owner_id ? row.assigned_owner_id.slice(0, 8) : 'Unassigned'}
                      </td>
                      <td className="px-4 py-3 text-charcoal">{formatDate(row.submitted_at)}</td>
                      <td className="px-4 py-3">
                        <AccessibleButton
                          type="button"
                          onClick={() => onSelectRfq(row.rfq_request_id)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-charcoal"
                        >
                          Review
                        </AccessibleButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
