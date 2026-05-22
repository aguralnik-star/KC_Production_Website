import { useState } from 'react';
import AccessibleButton from '../AccessibleButton';

const SEVERITIES = ['low', 'medium', 'high', 'critical'];
const STATUSES = ['open', 'investigating', 'resolved'];

const BADGE_STYLES = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
  open: 'bg-blue-100 text-blue-800',
  investigating: 'bg-purple-100 text-purple-800',
  resolved: 'bg-emerald-100 text-emerald-800',
};

export default function PostLaunchIssueTracker({ issues = [], onCreateIssue, onUpdateIssue, saving = false }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    await onCreateIssue({ title: title.trim(), description: description.trim(), severity });
    setTitle('');
    setDescription('');
    setSeverity('medium');
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Issue Tracker</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">Launch Week Issues</h3>
      </div>

      <form onSubmit={handleCreate} className="mb-6 grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Issue title"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          required
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Issue description"
          rows={3}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {SEVERITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <AccessibleButton type="submit" disabled={saving}>
            Create Issue
          </AccessibleButton>
        </div>
      </form>

      <ul className="space-y-3">
        {issues.length === 0 ? (
          <li className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-metallic">
            No launch issues logged yet.
          </li>
        ) : (
          issues.map((issue) => (
            <li key={issue.id} className="rounded-xl border border-slate-100 bg-white px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${BADGE_STYLES[issue.severity]}`}>
                  {issue.severity}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${BADGE_STYLES[issue.status]}`}>
                  {issue.status}
                </span>
              </div>
              <p className="mt-2 font-semibold text-charcoal">{issue.title}</p>
              {issue.description ? <p className="mt-1 text-sm text-metallic">{issue.description}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {STATUSES.filter((status) => status !== issue.status).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => onUpdateIssue(issue.id, { status })}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-charcoal hover:border-accent hover:text-accent"
                    disabled={saving}
                  >
                    Mark {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
