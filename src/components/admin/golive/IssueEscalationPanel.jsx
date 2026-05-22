import { useState } from 'react';
import {
  ESCALATION_MATRIX,
  ISSUE_SEVERITY_LEVELS,
  SEVERITY_EXAMPLES,
} from '../../../data/goLiveData';
import AccessibleButton from '../../AccessibleButton';

const SEVERITY_TONES = {
  LOW: 'border-slate-200 bg-slate-50 text-slate-700',
  MEDIUM: 'border-amber-200 bg-amber-50 text-amber-800',
  HIGH: 'border-orange-200 bg-orange-50 text-orange-800',
  CRITICAL: 'border-red-200 bg-red-50 text-red-800',
};

export default function IssueEscalationPanel({ issues = [], saving, onCreateIssue, onUpdateIssue }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    severity: 'MEDIUM',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    await onCreateIssue({
      title: form.title.trim(),
      description: form.description.trim(),
      severity: form.severity,
      status: 'open',
    });
    setForm({ title: '', description: '', severity: 'MEDIUM' });
  };

  return (
    <section className="space-y-6" aria-label="Issue escalation panel">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-charcoal">Escalation Matrix</h3>
        <ul className="mt-4 space-y-2">
          {ESCALATION_MATRIX.map((row) => (
            <li key={row.severity} className={`rounded-lg border px-4 py-3 text-sm ${SEVERITY_TONES[row.severity]}`}>
              <span className="font-bold">{row.severity}:</span> {row.response}
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {ISSUE_SEVERITY_LEVELS.map((severity) => (
            <div key={severity} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-metallic">{severity} Examples</p>
              <ul className="mt-2 list-disc pl-5 text-xs text-charcoal">
                {(SEVERITY_EXAMPLES[severity] ?? []).map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-charcoal">Log Go-Live Issue</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="text"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Issue title"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            required
          />
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Issue description"
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <select
            value={form.severity}
            onChange={(event) => setForm((prev) => ({ ...prev, severity: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {ISSUE_SEVERITY_LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <AccessibleButton type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Create Issue'}
          </AccessibleButton>
        </form>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-charcoal">Open Issues</h3>
        {!issues.length ? (
          <p className="mt-3 text-sm text-metallic">No open issues logged.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {issues.map((issue) => (
              <li key={issue.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-charcoal">{issue.title}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-bold uppercase ${SEVERITY_TONES[String(issue.severity ?? 'medium').toUpperCase()] ?? SEVERITY_TONES.MEDIUM}`}>
                    {issue.severity}
                  </span>
                </div>
                {issue.description ? <p className="mt-2 text-sm text-metallic">{issue.description}</p> : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {issue.status !== 'resolved' ? (
                    <AccessibleButton
                      type="button"
                      disabled={saving}
                      onClick={() => onUpdateIssue(issue.id, { status: 'resolved', resolved_at: new Date().toISOString() })}
                    >
                      Mark Resolved
                    </AccessibleButton>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700">Resolved</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}
