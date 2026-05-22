import { useMemo, useState } from 'react';
import AccessibleButton from '../AccessibleButton';
import { POST_LAUNCH_DAILY_CHECKLIST } from '../../services/postLaunchMonitoringService';

export default function PostLaunchDailyChecklist({
  launchDay,
  dailyReviews = [],
  onSaveReview,
  saving = false,
}) {
  const todayChecklist = useMemo(
    () => POST_LAUNCH_DAILY_CHECKLIST.find((item) => item.day === launchDay) ?? POST_LAUNCH_DAILY_CHECKLIST[0],
    [launchDay],
  );

  const todayReview = dailyReviews.find((review) => {
    const reviewDay = Math.floor(
      (new Date(review.review_date) - new Date('2026-05-22')) / (1000 * 60 * 60 * 24),
    ) + 1;
    return reviewDay === launchDay;
  });

  const [form, setForm] = useState({
    traffic_summary: todayReview?.traffic_summary ?? '',
    rfq_summary: todayReview?.rfq_summary ?? '',
    issues_found: todayReview?.issues_found ?? '',
    actions_taken: todayReview?.actions_taken ?? '',
    overall_status: todayReview?.overall_status ?? 'healthy',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const reviewDate = new Date('2026-05-22');
    reviewDate.setDate(reviewDate.getDate() + launchDay - 1);
    await onSaveReview({
      review_date: reviewDate.toISOString().slice(0, 10),
      ...form,
    });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Daily Checklist</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">
          Day {todayChecklist.day}: {todayChecklist.title}
        </h3>
      </div>

      <ul className="mb-6 space-y-2">
        {todayChecklist.items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-charcoal">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-accent" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="grid gap-3">
        <textarea
          value={form.traffic_summary}
          onChange={(event) => setForm((prev) => ({ ...prev, traffic_summary: event.target.value }))}
          placeholder="Traffic summary"
          rows={2}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <textarea
          value={form.rfq_summary}
          onChange={(event) => setForm((prev) => ({ ...prev, rfq_summary: event.target.value }))}
          placeholder="RFQ summary"
          rows={2}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <textarea
          value={form.issues_found}
          onChange={(event) => setForm((prev) => ({ ...prev, issues_found: event.target.value }))}
          placeholder="Issues found"
          rows={2}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <textarea
          value={form.actions_taken}
          onChange={(event) => setForm((prev) => ({ ...prev, actions_taken: event.target.value }))}
          placeholder="Actions taken"
          rows={2}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <select
          value={form.overall_status}
          onChange={(event) => setForm((prev) => ({ ...prev, overall_status: event.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="healthy">Healthy</option>
          <option value="attention_needed">Attention Needed</option>
          <option value="critical">Critical</option>
        </select>
        <AccessibleButton type="submit" disabled={saving}>
          Save Day {launchDay} Review
        </AccessibleButton>
      </form>
    </section>
  );
}
