import { useState } from 'react';
import { X, Mail, Phone, Building2, Loader2, FileText, DollarSign, AlertCircle } from 'lucide-react';
import RFQStatusBadge from './RFQStatusBadge';
import RFQFileList from './RFQFileList';
import RFQWorkflowPanel from './RFQWorkflowPanel';
import RFQPublicStatusEditor from './RFQPublicStatusEditor';
import { RFQ_STATUSES } from '../../services/adminRfqService';
import { CUSTOMER_STATUS_LABELS } from '../../services/rfqWorkflowService';

function DetailRow({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">{label}</dt>
      <dd className="mt-1 text-sm text-charcoal">{value || '—'}</dd>
    </div>
  );
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const TABS = [
  { id: 'details', label: 'Details', icon: FileText },
  { id: 'quote', label: 'Quote', icon: DollarSign },
];

export default function RFQRequestDetail({
  request,
  files,
  loading,
  savingStatus,
  onClose,
  onStatusChange,
  onRequestUpdated,
}) {
  const [activeTab, setActiveTab] = useState('details');

  if (loading) {
    return (
      <aside className="flex h-full items-center justify-center rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading details" />
      </aside>
    );
  }

  if (!request) {
    return (
      <aside className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-charcoal">Select an RFQ</p>
        <p className="mt-2 text-sm text-metallic">Choose a request from the table to review details and files.</p>
      </aside>
    );
  }

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:min-h-[720px]">
      <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-metallic">RFQ Details</p>
          <h2 className="mt-1 text-lg font-bold text-charcoal">{request.company || request.name}</h2>
          <p className="text-sm text-metallic">{formatDate(request.created_at)}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-metallic hover:bg-slate-100 hover:text-charcoal lg:hidden"
          aria-label="Close details panel"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="border-b border-slate-100 px-5">
        <div className="flex gap-1" role="tablist" aria-label="RFQ detail tabs">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
                activeTab === id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-metallic hover:text-charcoal'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {activeTab === 'details' ? (
          <>
            <div className="mb-6 flex items-center justify-between gap-3">
              <RFQStatusBadge status={request.status} />
              <div className="min-w-[160px]">
                <label htmlFor="rfq-status" className="sr-only">Update status</label>
                <select
                  id="rfq-status"
                  value={request.status}
                  onChange={(e) => onStatusChange(e.target.value)}
                  disabled={savingStatus}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-charcoal focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
                >
                  {RFQ_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <section className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-charcoal">Submission Details</h3>
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailRow label="Reference Number" value={request.reference_number} />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Confirmation Email</dt>
                  <dd className="mt-1 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      request.customer_confirmation_email_status === 'sent'
                        ? 'border-emerald-200 bg-emerald-100 text-emerald-800'
                        : request.customer_confirmation_email_status === 'failed'
                          ? 'border-red-200 bg-red-100 text-red-800'
                          : 'border-slate-200 bg-slate-100 text-slate-700'
                    }`}>
                      {request.customer_confirmation_email_status === 'sent'
                        ? 'Sent'
                        : request.customer_confirmation_email_status === 'failed'
                          ? 'Failed'
                          : 'Not Sent'}
                    </span>
                    {request.customer_confirmation_email_status === 'failed' && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                        Action needed
                      </span>
                    )}
                  </dd>
                </div>
                <DetailRow label="Submitted At" value={request.submitted_at ? formatDate(request.submitted_at) : formatDate(request.created_at)} />
                <DetailRow
                  label="Confirmation Sent At"
                  value={request.customer_confirmation_email_sent_at ? formatDate(request.customer_confirmation_email_sent_at) : null}
                />
                <DetailRow
                  label="Public Status"
                  value={CUSTOMER_STATUS_LABELS[request.public_status] || request.public_status}
                />
                <DetailRow
                  label="Last Status Viewed"
                  value={request.last_customer_status_viewed_at ? formatDate(request.last_customer_status_viewed_at) : null}
                />
              </dl>
              {request.customer_status_message && (
                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-charcoal">
                  {request.customer_status_message}
                </div>
              )}
              {request.customer_confirmation_email_status === 'failed' && request.customer_confirmation_email_error && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {request.customer_confirmation_email_error}
                </div>
              )}
            </section>

            <section className="mb-6">
              <RFQPublicStatusEditor request={request} onRequestUpdated={onRequestUpdated} />
            </section>

            <section className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-charcoal">Contact Information</h3>
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailRow label="Name" value={request.name} />
                <DetailRow label="Company" value={request.company} />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${request.email}`} className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      {request.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Phone</dt>
                  <dd className="mt-1">
                    {request.phone ? (
                      <a href={`tel:${request.phone}`} className="inline-flex items-center gap-1.5 text-sm text-charcoal hover:text-accent">
                        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                        {request.phone}
                      </a>
                    ) : (
                      <span className="text-sm text-charcoal">—</span>
                    )}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="mb-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-charcoal">
                <Building2 className="h-4 w-4 text-accent" aria-hidden="true" />
                Project Details
              </h3>
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailRow label="Project Type" value={request.project_type} />
                <DetailRow label="Material" value={request.material} />
                <DetailRow label="Quantity" value={request.quantity} />
                <DetailRow label="Timeline" value={request.timeline} />
              </dl>
            </section>

            <section className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-charcoal">Notes</h3>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-charcoal">
                {request.notes || 'No notes provided.'}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-semibold text-charcoal">Uploaded Files</h3>
              <RFQFileList files={files} />
            </section>

            <p className="mt-6 font-mono text-xs text-slate-400">ID: {request.id}</p>
          </>
        ) : (
          <RFQWorkflowPanel
            request={request}
            files={files}
            onRequestUpdated={onRequestUpdated}
          />
        )}
      </div>
    </aside>
  );
}
