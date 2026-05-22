import { getReplacementRecommendation } from '../../../services/realContentReplacementService';

const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

export default function ContentReplacementQueue({ queueProgress, state, onUpdateQueue }) {
  const hasApprovedTestimonial = state.testimonials.some(
    (t) => t.isCustomerApproved && ['approved', 'published'].includes(t.status),
  );
  const hasApprovedPhoto = state.photos.some(
    (p) => p.isCustomerApproved && ['approved', 'published'].includes(p.status),
  );
  const hasApprovedCaseStudy = state.caseStudies.some(
    (c) => c.isCustomerApproved && ['approved', 'published'].includes(c.approvalStatus),
  );

  const recommendationByType = {
    testimonial: getReplacementRecommendation('testimonial', hasApprovedTestimonial),
    photo: getReplacementRecommendation('photo', hasApprovedPhoto),
    case_study: getReplacementRecommendation('case_study', hasApprovedCaseStudy),
    mixed: 'Review all content types for sales and quote support materials.',
  };

  return (
    <section className="space-y-4" aria-label="Content replacement queue">
      <div>
        <h3 className="text-lg font-bold text-charcoal">Replacement Queue</h3>
        <p className="mt-1 text-sm text-metallic">
          Prioritized order for replacing representative content with customer-approved real content.
        </p>
      </div>

      <ol className="space-y-4">
        {queueProgress.map((entry) => {
          const recommendation = recommendationByType[entry.type] ?? recommendationByType.mixed;
          const queueState = entry.queueState ?? {};

          return (
            <li key={entry.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">Priority {entry.priority}</p>
                  <h4 className="mt-1 text-base font-bold text-charcoal">{entry.label}</h4>
                  <p className="mt-1 text-xs text-metallic">Target: {entry.target}</p>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-700">
                  {queueState.status ?? 'pending'}
                </span>
              </div>

              <p className="mt-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-charcoal">
                {recommendation}
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
                  Queue Status
                  <select
                    value={queueState.status ?? 'pending'}
                    onChange={(e) => onUpdateQueue(entry.id, { status: e.target.value })}
                    className={`mt-1 ${inputClass}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="complete">Complete</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </label>
                <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
                  Assigned To
                  <input
                    type="text"
                    value={queueState.assignedTo ?? ''}
                    onChange={(e) => onUpdateQueue(entry.id, { assignedTo: e.target.value })}
                    className={`mt-1 ${inputClass}`}
                  />
                </label>
              </div>

              <label className="mt-3 block text-xs font-semibold uppercase tracking-wider text-metallic">
                Notes
                <textarea
                  value={queueState.notes ?? ''}
                  onChange={(e) => onUpdateQueue(entry.id, { notes: e.target.value })}
                  rows={2}
                  className={`mt-1 ${inputClass}`}
                />
              </label>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
