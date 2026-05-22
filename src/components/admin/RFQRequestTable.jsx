import { memo } from 'react';
import { Eye } from 'lucide-react';
import RFQStatusBadge from './RFQStatusBadge';

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function RFQRequestTable({ requests, selectedId, onSelect }) {
  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <p className="text-lg font-semibold text-charcoal">No RFQ requests found</p>
        <p className="mt-2 text-sm text-metallic">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Date', 'Company', 'Contact', 'Email', 'Project Type', 'Material', 'Qty', 'Timeline', 'Status', ''].map((heading) => (
                  <th key={heading || 'actions'} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-metallic">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr
                  key={req.id}
                  className={`transition-colors ${selectedId === req.id ? 'bg-blue-50/70' : 'hover:bg-slate-50'}`}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-charcoal">{formatDate(req.created_at)}</td>
                  <td className="px-4 py-3 text-charcoal">{req.company || '—'}</td>
                  <td className="px-4 py-3 text-charcoal">{req.name}</td>
                  <td className="px-4 py-3 text-metallic">{req.email}</td>
                  <td className="px-4 py-3 text-charcoal">{req.project_type || '—'}</td>
                  <td className="px-4 py-3 text-charcoal">{req.material || '—'}</td>
                  <td className="px-4 py-3 text-charcoal">{req.quantity || '—'}</td>
                  <td className="px-4 py-3 text-charcoal">{req.timeline || '—'}</td>
                  <td className="px-4 py-3"><RFQStatusBadge status={req.status} /></td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onSelect(req.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-charcoal hover:border-accent hover:text-accent"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {requests.map((req) => (
          <article
            key={req.id}
            className={`rounded-xl border bg-white p-4 shadow-sm ${selectedId === req.id ? 'border-accent' : 'border-slate-200'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-charcoal">{req.company || req.name}</p>
                <p className="text-sm text-metallic">{req.email}</p>
                <p className="mt-1 text-xs text-metallic">{formatDate(req.created_at)}</p>
              </div>
              <RFQStatusBadge status={req.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-charcoal">
              <p><span className="text-metallic">Project:</span> {req.project_type || '—'}</p>
              <p><span className="text-metallic">Material:</span> {req.material || '—'}</p>
            </div>
            <button
              type="button"
              onClick={() => onSelect(req.id)}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-charcoal px-3 py-2 text-sm font-semibold text-white"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              View Details
            </button>
          </article>
        ))}
      </div>
    </>
  );
}

export default memo(RFQRequestTable);
