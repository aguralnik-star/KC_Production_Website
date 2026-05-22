import { AlertCircle } from 'lucide-react';

export default function RFQErrorSummary({ submitError, requiredMessages = [], fileErrors = [] }) {
  const hasErrors = Boolean(submitError || requiredMessages.length || fileErrors.length);
  if (!hasErrors) return null;

  return (
    <div className="rfq-error-summary" role="alert" aria-live="assertive">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold">Please fix the following before submitting:</p>
          {submitError ? <p className="mt-2 text-sm">{submitError}</p> : null}
          {requiredMessages.length > 0 ? (
            <div className="mt-3">
              <p className="text-sm font-medium">Required information</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                {requiredMessages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {fileErrors.length > 0 ? (
            <div className="mt-3">
              <p className="text-sm font-medium">File upload issues</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                {fileErrors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
