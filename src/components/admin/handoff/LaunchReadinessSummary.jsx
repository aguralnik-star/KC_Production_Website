import { LAUNCH_STATUS_AREAS, LAUNCH_STATUS_OPTIONS } from '../../../data/ownerHandoffData';
import QAStatusBadge from '../mobileQA/QAStatusBadge';

const STATUS_BADGE_MAP = {
  ready: 'passed',
  conditional: 'needs_fix',
  not_ready: 'blocked',
};

export default function LaunchReadinessSummary({ areaStatuses = {}, onStatusChange, remainingIssues, onRemainingIssuesChange }) {
  return (
    <section className="handoff-readiness-summary rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Launch Readiness</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">System Status Overview</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {LAUNCH_STATUS_AREAS.map((area) => (
          <article key={area.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-charcoal">{area.label}</p>
              <QAStatusBadge status={STATUS_BADGE_MAP[areaStatuses[area.id]] ?? 'pending'} />
            </div>
            <select
              value={areaStatuses[area.id] ?? 'conditional'}
              onChange={(event) => onStatusChange(area.id, event.target.value)}
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              aria-label={`${area.label} readiness`}
            >
              {LAUNCH_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </article>
        ))}
      </div>

      <div className="mt-6">
        <label htmlFor="remaining-issues" className="text-sm font-semibold text-charcoal">
          Remaining Issues
        </label>
        <textarea
          id="remaining-issues"
          value={remainingIssues}
          onChange={(event) => onRemainingIssuesChange(event.target.value)}
          rows={3}
          className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
          placeholder="List any remaining launch blockers, conditional items, or owner follow-ups."
        />
      </div>
    </section>
  );
}
