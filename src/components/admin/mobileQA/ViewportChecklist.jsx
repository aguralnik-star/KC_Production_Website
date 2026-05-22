import { VIEWPORT_SIZES } from '../../../data/mobileBrowserQAData';
import QAStatusBadge from './QAStatusBadge';

const STATUS_OPTIONS = ['pending', 'passed', 'needs_fix', 'blocked'];

export default function ViewportChecklist({ checks = {}, onChange }) {
  const grouped = {
    mobile: VIEWPORT_SIZES.filter((item) => item.category === 'mobile'),
    tablet: VIEWPORT_SIZES.filter((item) => item.category === 'tablet'),
    desktop: VIEWPORT_SIZES.filter((item) => item.category === 'desktop'),
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Viewport Matrix</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">Responsive Viewport Checks</h3>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-charcoal">{category}</h4>
            <ul className="space-y-2">
              {items.map((viewport) => (
                <li
                  key={viewport.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-charcoal">{viewport.label}</p>
                    <p className="text-xs text-metallic">{viewport.width}px width</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <QAStatusBadge status={checks[viewport.id] ?? 'pending'} />
                    <select
                      value={checks[viewport.id] ?? 'pending'}
                      onChange={(event) => onChange(viewport.id, event.target.value)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      aria-label={`Status for ${viewport.label}`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
