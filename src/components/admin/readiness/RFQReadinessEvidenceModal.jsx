import { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';

export default function RFQReadinessEvidenceModal({ check, open, onClose, onSave }) {
  const [evidence, setEvidence] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setEvidence(check?.evidence ?? '');
    setError('');
  }, [check]);

  if (!open || !check) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(evidence.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save evidence.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 px-4 py-8">
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-modal-title"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-metallic">{check.category}</p>
            <h2 id="evidence-modal-title" className="mt-1 text-lg font-bold text-charcoal">
              Add Evidence
            </h2>
            <p className="mt-1 text-sm text-metallic">{check.check_name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-metallic hover:bg-slate-100 hover:text-charcoal"
            aria-label="Close evidence modal"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5">
          <label htmlFor="readiness-evidence" className="block text-sm font-semibold text-charcoal">
            Evidence Notes
          </label>
          <textarea
            id="readiness-evidence"
            rows={6}
            value={evidence}
            onChange={(event) => setEvidence(event.target.value)}
            placeholder="Document test steps, screenshots reviewed, environment details, or verification notes."
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />

          {error && (
            <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>
          )}

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-charcoal hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Save Evidence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
