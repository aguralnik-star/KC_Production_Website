import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import ContentRiskBadge, { DECISION_OPTIONS, RISK_OPTIONS, STATUS_OPTIONS } from './ContentRiskBadge';
import QAStatusBadge from '../mobileQA/QAStatusBadge';

export default function ContentPageReviewTable({ pageReviews = {}, onUpdateReview }) {
  const rows = Object.values(pageReviews);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Page Review</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">Public Content Page Review</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-metallic">
            <tr>
              <th className="px-4 py-3 font-semibold">Page</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Risk Level</th>
              <th className="px-4 py-3 font-semibold">Claims Reviewed</th>
              <th className="px-4 py-3 font-semibold">Issues Found</th>
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
                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <QAStatusBadge status={review.status} />
                    <select
                      value={review.status}
                      onChange={(event) => onUpdateReview(review.path, { status: event.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                      aria-label={`${review.label} status`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <ContentRiskBadge risk={review.riskLevel} />
                    <select
                      value={review.riskLevel}
                      onChange={(event) => onUpdateReview(review.path, { riskLevel: event.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                      aria-label={`${review.label} risk level`}
                    >
                      {RISK_OPTIONS.map((risk) => (
                        <option key={risk} value={risk}>
                          {risk}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <input
                    type="number"
                    min="0"
                    value={review.claimsReviewed}
                    onChange={(event) =>
                      onUpdateReview(review.path, { claimsReviewed: Number(event.target.value) || 0 })
                    }
                    className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                    aria-label={`${review.label} claims reviewed`}
                  />
                </td>
                <td className="px-4 py-4">
                  <input
                    type="text"
                    value={review.issuesFound}
                    onChange={(event) => onUpdateReview(review.path, { issuesFound: event.target.value })}
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
                    placeholder="Review notes"
                  />
                </td>
                <td className="px-4 py-4">
                  <select
                    value={review.decision}
                    onChange={(event) => onUpdateReview(review.path, { decision: event.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                    aria-label={`${review.label} decision`}
                  >
                    {DECISION_OPTIONS.map((decision) => (
                      <option key={decision} value={decision}>
                        {decision.replace('_', ' ')}
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
