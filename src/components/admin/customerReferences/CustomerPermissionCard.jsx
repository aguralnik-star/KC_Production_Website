import { useState } from 'react';
import AccessibleButton from '../../AccessibleButton';
import PermissionStatusBadge from './PermissionStatusBadge';
import { APPROVAL_METHODS } from '../../../data/customerReferencePermissionData';

const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

export default function CustomerPermissionCard({
  permission,
  onRequest,
  onApprove,
  onDecline,
  onRevoke,
  onUpdateEvidence,
  saving,
}) {
  const [showApprove, setShowApprove] = useState(false);
  const [evidence, setEvidence] = useState(permission.approval_evidence ?? '');
  const [restrictions, setRestrictions] = useState(permission.restrictions ?? '');
  const [approvalMethod, setApprovalMethod] = useState(permission.approval_method ?? 'email');
  const [reason, setReason] = useState('');

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-charcoal">{permission.label}</h4>
        <PermissionStatusBadge status={permission.permission_status} />
      </div>

      <dl className="mt-3 space-y-1 text-xs text-metallic">
        {permission.approval_method ? <div><dt className="inline font-semibold">Method: </dt><dd className="inline">{permission.approval_method}</dd></div> : null}
        {permission.approval_date ? <div><dt className="inline font-semibold">Approved: </dt><dd className="inline">{permission.approval_date}</dd></div> : null}
        {permission.expiration_date ? <div><dt className="inline font-semibold">Expires: </dt><dd className="inline">{permission.expiration_date}</dd></div> : null}
        {permission.allowed_usage?.length ? <div><dt className="inline font-semibold">Usage: </dt><dd className="inline">{permission.allowed_usage.join(', ')}</dd></div> : null}
        {permission.restrictions ? <div><dt className="inline font-semibold">Restrictions: </dt><dd className="inline">{permission.restrictions}</dd></div> : null}
      </dl>

      {permission.isBlocked ? (
        <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800" role="alert">
          This permission blocks publication.
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <AccessibleButton type="button" disabled={saving || !permission.id} onClick={onRequest} className="rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-charcoal">
          Mark Requested
        </AccessibleButton>
        <AccessibleButton type="button" disabled={saving} onClick={() => setShowApprove((v) => !v)} className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800">
          Approve
        </AccessibleButton>
        <AccessibleButton type="button" disabled={saving || !permission.id} onClick={() => onDecline(reason)} className="rounded border border-red-200 px-2 py-1 text-xs font-semibold text-red-700">
          Decline
        </AccessibleButton>
        <AccessibleButton type="button" disabled={saving || !permission.id} onClick={() => onRevoke(reason)} className="rounded border border-red-300 px-2 py-1 text-xs font-semibold text-red-800">
          Revoke
        </AccessibleButton>
      </div>

      {showApprove ? (
        <div className="mt-3 space-y-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
          <label className="block text-xs font-semibold text-metallic">
            Approval Method
            <select value={approvalMethod} onChange={(e) => setApprovalMethod(e.target.value)} className={`mt-1 ${inputClass}`}>
              {APPROVAL_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </label>
          <label className="block text-xs font-semibold text-metallic">
            Evidence
            <textarea rows={2} value={evidence} onChange={(e) => setEvidence(e.target.value)} className={`mt-1 ${inputClass}`} />
          </label>
          <label className="block text-xs font-semibold text-metallic">
            Restrictions
            <textarea rows={2} value={restrictions} onChange={(e) => setRestrictions(e.target.value)} className={`mt-1 ${inputClass}`} />
          </label>
          <AccessibleButton
            type="button"
            disabled={saving}
            onClick={() => onApprove({ approval_method: approvalMethod, approval_evidence: evidence, restrictions })}
            className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white"
          >
            Confirm Approval
          </AccessibleButton>
        </div>
      ) : null}

      <div className="mt-3 space-y-2">
        <label className="block text-xs font-semibold text-metallic">
          Add Evidence / Restriction Notes
          <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} className={`mt-1 ${inputClass}`} />
        </label>
        <AccessibleButton
          type="button"
          disabled={saving || !permission.id}
          onClick={() => onUpdateEvidence({ approval_evidence: evidence || reason, restrictions })}
          className="rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-charcoal"
        >
          Save Evidence
        </AccessibleButton>
      </div>
    </article>
  );
}
