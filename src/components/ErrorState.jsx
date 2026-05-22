import { AlertCircle } from 'lucide-react';
import AccessibleButton from './AccessibleButton';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again or contact K&C if the issue continues.',
  onRetry,
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center" role="alert">
      <AlertCircle className="mx-auto h-10 w-10 text-red-600" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-bold text-charcoal">{title}</h2>
      <p className="mt-2 text-sm text-red-800">{message}</p>
      {onRetry && (
        <AccessibleButton
          onClick={onRetry}
          className="mt-5 rounded-lg bg-charcoal px-4 py-2.5 text-sm font-semibold text-white hover:bg-charcoal-light"
        >
          Try Again
        </AccessibleButton>
      )}
    </div>
  );
}
