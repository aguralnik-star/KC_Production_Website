import { RefreshCw } from 'lucide-react';

function formatTimestamp(value) {
  if (!value) return 'Not refreshed yet';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function RFQOperationsRefreshControl({
  refreshedAt,
  refreshing,
  onRefresh,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <p className="text-sm text-metallic">
        Last refreshed: <span className="font-medium text-charcoal">{formatTimestamp(refreshedAt)}</span>
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-charcoal hover:border-accent hover:text-accent disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
          Refresh
        </button>
        <label className="inline-flex items-center gap-2 text-sm text-metallic">
          <input type="checkbox" disabled className="rounded border-slate-300" />
          Auto-refresh (coming soon)
        </label>
      </div>
    </div>
  );
}
