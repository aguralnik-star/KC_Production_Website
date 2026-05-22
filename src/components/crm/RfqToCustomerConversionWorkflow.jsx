import { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  FileText,
  Loader2,
  ShieldAlert,
  UserCheck,
  XCircle,
} from 'lucide-react';
import AccessibleButton from '../AccessibleButton';
import {
  assignRfqOwner,
  convertRfqToCustomer,
  convertRfqToOpportunity,
  createRfqFollowUpTask,
  getConversionGateStatus,
  getReviewStatusLabel,
  markRfqDisqualified,
  markRfqNeedsMoreInfo,
  markRfqQualified,
  QUOTE_STATUSES,
  TASK_PRIORITIES,
  updateRfqStatus,
  updateWorkflowStage,
  upsertQuotePrepRecord,
  WORKFLOW_STAGES,
} from '../../services/rfqMonitoringService';

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

function GateCheck({ label, pass }) {
  return (
    <li className={`flex items-center gap-2 text-sm ${pass ? 'text-emerald-700' : 'text-red-700'}`}>
      {pass ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
      {label}
    </li>
  );
}

export default function RfqToCustomerConversionWorkflow({
  detail,
  owners = [],
  loading,
  onRefresh,
  onUpdated,
}) {
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [disqualifyReason, setDisqualifyReason] = useState('');
  const [needsInfoNotes, setNeedsInfoNotes] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [gateStatus, setGateStatus] = useState(null);
  const [adminOverride, setAdminOverride] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  const [followUpForm, setFollowUpForm] = useState({
    title: '',
    due_date: '',
    priority: 'medium',
    recommended_action: '',
    notes: '',
  });

  const [quoteForm, setQuoteForm] = useState({
    quote_status: 'in_review',
    internal_notes: '',
    estimated_value: '',
    next_action: '',
  });

  const rfqId = detail?.rfq?.id;

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const runAction = async (key, action) => {
    resetMessages();
    setBusy(key);
    try {
      await action();
      setSuccess('Changes saved.');
      await onUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setBusy('');
    }
  };

  const loadGate = useCallback(async () => {
    if (!rfqId) return;
    try {
      const gate = await getConversionGateStatus(rfqId, { adminOverride, overrideReason });
      setGateStatus(gate);
    } catch {
      setGateStatus(null);
    }
  }, [rfqId, adminOverride, overrideReason]);

  useEffect(() => {
    if (detail?.review?.assigned_owner_id) {
      setSelectedOwner(detail.review.assigned_owner_id);
    }
    if (detail?.quotePrep) {
      setQuoteForm({
        quote_status: detail.quotePrep.quote_status || 'in_review',
        internal_notes: detail.quotePrep.internal_notes || '',
        estimated_value: detail.quotePrep.estimated_value ?? '',
        next_action: detail.quotePrep.next_action || '',
      });
    }
    const companyName = detail?.rfq?.company?.trim() || detail?.rfq?.name?.trim() || '';
    if (companyName) {
      setFollowUpForm((prev) => ({
        ...prev,
        title: prev.title || `Follow up on RFQ from ${companyName}`,
      }));
    }
  }, [detail]);

  useEffect(() => {
    loadGate();
  }, [loadGate]);

  if (!rfqId) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-metallic">
        Select an RFQ from the queue to begin the review and conversion workflow.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading RFQ workflow" />
      </div>
    );
  }

  const rfq = detail.rfq;
  const review = detail.review;
  const stages = detail.workflowStages ?? [];
  const stageMap = Object.fromEntries(stages.map((stage) => [stage.stage_key, stage]));

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-charcoal">RFQ Review & Conversion</h3>
            <p className="mt-1 text-sm text-metallic">
              {rfq.reference_number || rfq.id?.slice(0, 8)} · {rfq.company || rfq.name} · {getReviewStatusLabel(review?.review_status || 'new')}
            </p>
          </div>
          <AccessibleButton type="button" onClick={onRefresh} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-charcoal">
            Reload
          </AccessibleButton>
        </div>

        {error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
            {success}
          </div>
        ) : null}

        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Project Type</dt>
            <dd className="text-charcoal">{rfq.project_type || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Material</dt>
            <dd className="text-charcoal">{rfq.material || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Quantity</dt>
            <dd className="text-charcoal">{rfq.quantity || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Deadline</dt>
            <dd className="text-charcoal">{rfq.timeline || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Source Page</dt>
            <dd className="text-charcoal">{review?.source_page || '/contact'}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Submitted</dt>
            <dd className="text-charcoal">{formatDate(rfq.created_at)}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="review-actions-heading">
        <h3 id="review-actions-heading" className="text-sm font-bold text-charcoal">Review Actions</h3>
        <p className="mt-1 text-xs text-metallic">All actions require human approval. No automatic customer contact.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <AccessibleButton
            type="button"
            disabled={!!busy}
            onClick={() => runAction('pending', () => updateRfqStatus(rfqId, 'pending_review'))}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {busy === 'pending' ? 'Saving…' : 'Mark Pending Review'}
          </AccessibleButton>
          <AccessibleButton
            type="button"
            disabled={!!busy}
            onClick={() => runAction('qualified', () => markRfqQualified(rfqId))}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {busy === 'qualified' ? 'Saving…' : 'Mark Qualified'}
          </AccessibleButton>
          <AccessibleButton
            type="button"
            disabled={!!busy}
            onClick={() => runAction('opportunity', () => convertRfqToOpportunity(rfqId))}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {busy === 'opportunity' ? 'Converting…' : 'Convert to Opportunity'}
          </AccessibleButton>
          <AccessibleButton
            type="button"
            disabled={!!busy}
            onClick={() => runAction('disqualified', () => markRfqDisqualified(rfqId, disqualifyReason))}
            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {busy === 'disqualified' ? 'Saving…' : 'Disqualify'}
          </AccessibleButton>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-charcoal">Disqualify reason</span>
            <input
              type="text"
              value={disqualifyReason}
              onChange={(event) => setDisqualifyReason(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="Optional reason for disqualification"
            />
          </label>
          <div>
            <label className="block text-sm font-medium text-charcoal" htmlFor="needs-info-notes">
              Needs more info notes
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="needs-info-notes"
                type="text"
                value={needsInfoNotes}
                onChange={(event) => setNeedsInfoNotes(event.target.value)}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="Internal notes for missing details"
              />
              <AccessibleButton
                type="button"
                disabled={!!busy}
                onClick={() => runAction('needs_info', () => markRfqNeedsMoreInfo(rfqId, needsInfoNotes))}
                className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 disabled:opacity-50"
              >
                Needs Info
              </AccessibleButton>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <span className="font-medium text-charcoal">Assign owner</span>
            <select
              value={selectedOwner}
              onChange={(event) => setSelectedOwner(event.target.value)}
              className="mt-1 block rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">Unassigned</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.id.slice(0, 8)} ({owner.role})
                </option>
              ))}
            </select>
          </label>
          <AccessibleButton
            type="button"
            disabled={!!busy}
            onClick={() => runAction('owner', () => assignRfqOwner(rfqId, selectedOwner || null))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-charcoal disabled:opacity-50"
          >
            {busy === 'owner' ? 'Saving…' : 'Save Owner'}
          </AccessibleButton>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="workflow-stages-heading">
        <h3 id="workflow-stages-heading" className="flex items-center gap-2 text-sm font-bold text-charcoal">
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          Conversion Workflow Stages
        </h3>

        <ol className="mt-4 space-y-4">
          {WORKFLOW_STAGES.map(({ key, label, order }) => {
            const stage = stageMap[key] || {};
            const stageId = `stage-${key}`;
            return (
              <li key={key} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-charcoal">
                    {order}. {label}
                  </p>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-700">
                    {stage.status || 'pending'}
                  </span>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs">
                    Status
                    <select
                      id={`${stageId}-status`}
                      defaultValue={stage.status || 'pending'}
                      onChange={(event) =>
                        runAction(`stage-${key}`, () =>
                          updateWorkflowStage(rfqId, key, { status: event.target.value }),
                        )
                      }
                      className="mt-1 block w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </label>
                  <label className="text-xs">
                    Due date
                    <input
                      type="date"
                      defaultValue={stage.due_date ? stage.due_date.slice(0, 10) : ''}
                      onBlur={(event) =>
                        runAction(`stage-due-${key}`, () =>
                          updateWorkflowStage(rfqId, key, { due_date: event.target.value || null }),
                        )
                      }
                      className="mt-1 block w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                    />
                  </label>
                </div>
                <label className="mt-3 block text-xs">
                  Notes
                  <textarea
                    defaultValue={stage.notes || ''}
                    rows={2}
                    onBlur={(event) =>
                      runAction(`stage-notes-${key}`, () =>
                        updateWorkflowStage(rfqId, key, { notes: event.target.value || null }),
                      )
                    }
                    className="mt-1 block w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                  />
                </label>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="follow-up-heading">
        <h3 id="follow-up-heading" className="flex items-center gap-2 text-sm font-bold text-charcoal">
          <UserCheck className="h-4 w-4" aria-hidden="true" />
          Follow-Up Task
        </h3>
        <p className="mt-1 text-xs text-metallic">Creates an internal task only — does not email the customer.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Title
            <input
              type="text"
              value={followUpForm.title}
              onChange={(event) => setFollowUpForm((prev) => ({ ...prev, title: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            Due date
            <input
              type="date"
              value={followUpForm.due_date}
              onChange={(event) => setFollowUpForm((prev) => ({ ...prev, due_date: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            Priority
            <select
              value={followUpForm.priority}
              onChange={(event) => setFollowUpForm((prev) => ({ ...prev, priority: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {TASK_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Recommended action
            <input
              type="text"
              value={followUpForm.recommended_action}
              onChange={(event) => setFollowUpForm((prev) => ({ ...prev, recommended_action: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            Notes
            <textarea
              value={followUpForm.notes}
              onChange={(event) => setFollowUpForm((prev) => ({ ...prev, notes: event.target.value }))}
              rows={2}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <AccessibleButton
          type="button"
          disabled={!!busy || review?.review_status !== 'qualified'}
          onClick={() => runAction('follow_up', () => createRfqFollowUpTask(rfqId, followUpForm))}
          className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy === 'follow_up' ? 'Creating…' : 'Create Follow-Up Task'}
        </AccessibleButton>
        {review?.review_status !== 'qualified' ? (
          <p className="mt-2 text-xs text-amber-700">RFQ must be qualified before creating a follow-up task.</p>
        ) : null}

        {(detail.followUpTasks ?? []).length ? (
          <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
            {detail.followUpTasks.map((task) => (
              <li key={task.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <p className="font-medium text-charcoal">{task.title}</p>
                <p className="text-xs text-metallic">
                  Due {task.due_date || '—'} · {task.priority} · {task.recommended_action}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="quote-prep-heading">
        <h3 id="quote-prep-heading" className="flex items-center gap-2 text-sm font-bold text-charcoal">
          <FileText className="h-4 w-4" aria-hidden="true" />
          Quote Preparation (Review Only)
        </h3>
        <p className="mt-1 text-xs text-metallic">Internal quote prep record. Does not send quotes automatically.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Quote status
            <select
              value={quoteForm.quote_status}
              onChange={(event) => setQuoteForm((prev) => ({ ...prev, quote_status: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {QUOTE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Estimated value
            <input
              type="number"
              min="0"
              step="0.01"
              value={quoteForm.estimated_value}
              onChange={(event) => setQuoteForm((prev) => ({ ...prev, estimated_value: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            Next action
            <input
              type="text"
              value={quoteForm.next_action}
              onChange={(event) => setQuoteForm((prev) => ({ ...prev, next_action: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            Internal notes
            <textarea
              value={quoteForm.internal_notes}
              onChange={(event) => setQuoteForm((prev) => ({ ...prev, internal_notes: event.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <AccessibleButton
          type="button"
          disabled={!!busy}
          onClick={() =>
            runAction('quote', () =>
              upsertQuotePrepRecord(rfqId, {
                ...quoteForm,
                estimated_value: quoteForm.estimated_value ? Number(quoteForm.estimated_value) : null,
              }),
            )
          }
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy === 'quote' ? 'Saving…' : 'Save Quote Prep Record'}
        </AccessibleButton>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm" aria-labelledby="conversion-gate-heading">
        <h3 id="conversion-gate-heading" className="flex items-center gap-2 text-sm font-bold text-amber-900">
          <ShieldAlert className="h-4 w-4" aria-hidden="true" />
          Customer Conversion Gate
        </h3>
        <p className="mt-2 text-sm text-amber-900">
          Customer conversion requires human approval. This action will mark the RFQ as converted but will not automatically send emails, activate billing, or start production.
        </p>

        {gateStatus ? (
          <ul className="mt-4 space-y-1">
            <GateCheck label="Company exists" pass={gateStatus.checks.companyExists} />
            <GateCheck label="Contact exists" pass={gateStatus.checks.contactExists} />
            <GateCheck label="Opportunity exists" pass={gateStatus.checks.opportunityExists} />
            <GateCheck label="RFQ marked qualified" pass={gateStatus.checks.rfqQualified} />
            <GateCheck
              label="Quote accepted or admin override"
              pass={gateStatus.checks.quoteAccepted}
            />
            <GateCheck label="Not already converted" pass={gateStatus.checks.notAlreadyConverted} />
          </ul>
        ) : null}

        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-2 text-sm text-amber-900">
            <input
              type="checkbox"
              checked={adminOverride}
              onChange={(event) => setAdminOverride(event.target.checked)}
            />
            Admin override (requires reason if quote not accepted)
          </label>
          {adminOverride ? (
            <input
              type="text"
              value={overrideReason}
              onChange={(event) => setOverrideReason(event.target.value)}
              placeholder="Override reason (required)"
              className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm"
            />
          ) : null}
        </div>

        <AccessibleButton
          type="button"
          disabled={!!busy || !gateStatus?.canConvert}
          onClick={() =>
            runAction('convert', () => convertRfqToCustomer(rfqId, { adminOverride, overrideReason }))
          }
          className="mt-4 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy === 'convert' ? 'Converting…' : 'Approve Customer Conversion'}
        </AccessibleButton>

        {!gateStatus?.canConvert ? (
          <p className="mt-2 flex items-center gap-1 text-xs text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            Complete all gate requirements before converting.
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="audit-log-heading">
        <h3 id="audit-log-heading" className="text-sm font-bold text-charcoal">Audit Log</h3>
        {!detail.auditEvents?.length ? (
          <p className="mt-3 text-sm text-metallic">No audit events yet.</p>
        ) : (
          <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-sm">
            {detail.auditEvents.map((event) => (
              <li key={event.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <p className="font-medium text-charcoal">{event.event_type}</p>
                <p className="text-xs text-metallic">
                  {formatDate(event.created_at)} · {event.entity_type}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
