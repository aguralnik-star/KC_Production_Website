import { BROWSERS, CROSS_BROWSER_CHECKS } from '../../../data/mobileBrowserQAData';
import QAStatusBadge from './QAStatusBadge';

const STATUS_OPTIONS = ['pending', 'passed', 'needs_fix', 'blocked'];

export default function CrossBrowserChecklist({ checks = {}, onChange }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Browser Matrix</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">Cross-Browser Checks</h3>
      </div>

      <div className="space-y-6">
        {BROWSERS.map((browser) => (
          <div key={browser.id}>
            <h4 className="mb-3 text-sm font-semibold text-charcoal">{browser.label}</h4>
            <ul className="space-y-2">
              {(CROSS_BROWSER_CHECKS[browser.id] ?? []).map((label, index) => {
                const checkId = `${browser.id}-${index}`;
                const check = checks[checkId] ?? { status: 'pending', label, browserId: browser.id };
                return (
                  <li
                    key={checkId}
                    className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="text-sm text-charcoal">{label}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <QAStatusBadge status={check.status ?? 'pending'} />
                      <select
                        value={check.status ?? 'pending'}
                        onChange={(event) => onChange(checkId, event.target.value, label, browser.id)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        aria-label={`${browser.label}: ${label}`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
