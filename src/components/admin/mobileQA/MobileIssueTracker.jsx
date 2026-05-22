import { useState } from 'react';
import AccessibleButton from '../../AccessibleButton';
import { ISSUE_SEVERITIES, ISSUE_STATUSES, PAGES_TO_REVIEW, VIEWPORT_SIZES, BROWSERS } from '../../../data/mobileBrowserQAData';
import QAStatusBadge from './QAStatusBadge';

export default function MobileIssueTracker({ issues = [], onCreateIssue, onUpdateIssue, saving = false }) {
  const [form, setForm] = useState({
    title: '',
    page: '',
    viewport: '',
    browser: '',
    severity: 'medium',
    notes: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    await onCreateIssue(form);
    setForm({
      title: '',
      page: '',
      viewport: '',
      browser: '',
      severity: 'medium',
      notes: '',
    });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Issue Tracker</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">Mobile & Browser Issues</h3>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 lg:grid-cols-2">
        <input
          type="text"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Issue title"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm lg:col-span-2"
          required
        />
        <select
          value={form.page}
          onChange={(event) => setForm((prev) => ({ ...prev, page: event.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">Page (optional)</option>
          {PAGES_TO_REVIEW.map((page) => (
            <option key={page.path} value={page.path}>
              {page.label}
            </option>
          ))}
        </select>
        <select
          value={form.viewport}
          onChange={(event) => setForm((prev) => ({ ...prev, viewport: event.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">Viewport (optional)</option>
          {VIEWPORT_SIZES.map((viewport) => (
            <option key={viewport.id} value={viewport.id}>
              {viewport.label} ({viewport.category})
            </option>
          ))}
        </select>
        <select
          value={form.browser}
          onChange={(event) => setForm((prev) => ({ ...prev, browser: event.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">Browser (optional)</option>
          {BROWSERS.map((browser) => (
            <option key={browser.id} value={browser.id}>
              {browser.label}
            </option>
          ))}
        </select>
        <select
          value={form.severity}
          onChange={(event) => setForm((prev) => ({ ...prev, severity: event.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          {ISSUE_SEVERITIES.map((severity) => (
            <option key={severity} value={severity}>
              {severity}
            </option>
          ))}
        </select>
        <textarea
          value={form.notes}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          placeholder="Notes"
          rows={2}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm lg:col-span-2"
        />
        <div className="lg:col-span-2">
          <AccessibleButton type="submit" disabled={saving}>
            Add Issue
          </AccessibleButton>
        </div>
      </form>

      <ul className="space-y-3">
        {issues.length === 0 ? (
          <li className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-metallic">
            No mobile or browser issues logged yet.
          </li>
        ) : (
          issues.map((issue) => (
            <li key={issue.id} className="rounded-xl border border-slate-100 px-4 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <QAStatusBadge status={issue.severity} />
                <QAStatusBadge status={issue.status} />
                {issue.page ? <span className="text-xs font-semibold text-charcoal">{issue.page}</span> : null}
              </div>
              <p className="mt-2 font-semibold text-charcoal">{issue.title}</p>
              {issue.notes ? <p className="mt-1 text-sm text-metallic">{issue.notes}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {ISSUE_STATUSES.filter((status) => status !== issue.status).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => onUpdateIssue(issue.id, { status })}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-charcoal hover:border-accent hover:text-accent"
                    disabled={saving}
                  >
                    Mark {status}
                  </button>
                ))}
              </div>
              <textarea
                defaultValue={issue.resolution ?? ''}
                onBlur={(event) => onUpdateIssue(issue.id, { resolution: event.target.value })}
                rows={2}
                placeholder="Resolution notes"
                className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
