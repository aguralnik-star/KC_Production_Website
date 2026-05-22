import ApprovalStatusBadge from './ApprovalStatusBadge';
import { REQUEST_TYPES } from '../../../data/customerApprovalWorkflowData';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function requestTypeLabel(type) {
  return REQUEST_TYPES.find((item) => item.value === type)?.label ?? type;
}

export default function ApprovalRequestHistory({ requests, onSelect }) {
  if (!requests.length) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-charcoal">Approval Request History</h3>
        <p className="mt-2 text-sm text-metallic">No approval requests recorded yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="approval-history-heading">
      <div className="border-b border-slate-200 px-6 py-4">
        <h3 id="approval-history-heading" className="text-lg font-bold text-charcoal">
          Approval Request History
        </h3>
        <p className="mt-1 text-sm text-metallic">Documented approval trail for manual email workflow.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-metallic">
            <tr>
              <th scope="col" className="px-4 py-3">Customer</th>
              <th scope="col" className="px-4 py-3">Company</th>
              <th scope="col" className="px-4 py-3">Request Type</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Date Created</th>
              <th scope="col" className="px-4 py-3">Approval Date</th>
              <th scope="col" className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr
                key={request.id}
                className="border-b border-slate-100 hover:bg-slate-50"
                tabIndex={0}
                role="button"
                onClick={() => onSelect?.(request)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect?.(request);
                  }
                }}
              >
                <td className="px-4 py-3 font-medium text-charcoal">{request.customer_name || '—'}</td>
                <td className="px-4 py-3 text-charcoal">{request.customer_company || '—'}</td>
                <td className="px-4 py-3 text-charcoal">{requestTypeLabel(request.request_type)}</td>
                <td className="px-4 py-3">
                  <ApprovalStatusBadge status={request.status} />
                </td>
                <td className="px-4 py-3 text-charcoal">{formatDate(request.created_at)}</td>
                <td className="px-4 py-3 text-charcoal">{formatDate(request.approval_date)}</td>
                <td className="max-w-xs truncate px-4 py-3 text-metallic" title={request.approval_notes || request.internal_notes || ''}>
                  {request.approval_notes || request.internal_notes || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
