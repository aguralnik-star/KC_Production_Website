import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import QAStatusBadge from './QAStatusBadge';

const STATUS_OPTIONS = ['pending', 'passed', 'needs_fix', 'blocked'];
const DECISION_OPTIONS = ['pending', 'passed', 'needs_fix', 'blocked'];

export default function ResponsivePageReviewTable({ pageReviews = {}, onUpdateReview }) {
  const rows = Object.values(pageReviews);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Page Review</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">Responsive Page Review Table</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[960px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-metallic">
            <tr>
              <th className="px-4 py-3 font-semibold">Page</th>
              <th className="px-4 py-3 font-semibold">Mobile</th>
              <th className="px-4 py-3 font-semibold">Tablet</th>
              <th className="px-4 py-3 font-semibold">Desktop</th>
              <th className="px-4 py-3 font-semibold">Browser</th>
              <th className="px-4 py-3 font-semibold">Issues</th>
              <th className="px-4 py-3 font-semibold">Notes</th>
              <th className="px-4 py-3 font-semibold">Decision</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((review) => (
              <tr key={review.path} className="border-t border-slate-100 align-top">
                <td className="px-4 py-4">
                  <div className="font-medium text-charcoal">{review.label}</div>
                  <Link
                    to={review.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                  >
                    {review.path}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </td>
                {['mobileStatus', 'tabletStatus', 'desktopStatus', 'browserStatus'].map((field) => (
                  <td key={field} className="px-4 py-4">
                    <div className="space-y-2">
                      <QAStatusBadge status={review[field]} />
                      <select
                        value={review[field]}
                        onChange={(event) => onUpdateReview(review.path, { [field]: event.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                        aria-label={`${review.label} ${field}`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                ))}
                <td className="px-4 py-4">
                  <input
                    type="text"
                    value={review.issues}
                    onChange={(event) => onUpdateReview(review.path, { issues: event.target.value })}
                    className="w-full min-w-[120px] rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                    placeholder="Issue summary"
                  />
                </td>
                <td className="px-4 py-4">
                  <textarea
                    value={review.notes}
                    onChange={(event) => onUpdateReview(review.path, { notes: event.target.value })}
                    rows={2}
                    className="w-full min-w-[140px] rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                    placeholder="Evidence notes"
                  />
                </td>
                <td className="px-4 py-4">
                  <select
                    value={review.decision}
                    onChange={(event) => onUpdateReview(review.path, { decision: event.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                    aria-label={`Decision for ${review.label}`}
                  >
                    {DECISION_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
