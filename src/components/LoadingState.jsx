import { Loader2 } from 'lucide-react';

export default function LoadingState({
  label = 'Loading',
  message = 'Loading content…',
  compact = false,
}) {
  return (
    <div
      className={`flex items-center justify-center ${compact ? 'py-10' : 'min-h-[240px] py-16'}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden="true" />
        <p className="text-sm font-medium text-charcoal">{message}</p>
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}
