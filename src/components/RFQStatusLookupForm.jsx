import { useState } from 'react';
import { AlertCircle, Loader2, Search, ShieldCheck } from 'lucide-react';
import CTAButton from './CTAButton';
import { lookupRFQStatus } from '../services/publicRfqStatusService';
import {
  trackStatusLookupAttempt,
  trackStatusLookupError,
  trackStatusLookupNotFound,
  trackStatusLookupSuccess,
} from '../utils/analytics';

const inputClass =
  'mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';

export default function RFQStatusLookupForm({ onResult, onNotFound, onError }) {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError('');
    setLoading(true);
    trackStatusLookupAttempt();

    try {
      const data = await lookupRFQStatus(referenceNumber, email);

      if (data?.found) {
        trackStatusLookupSuccess(data.reference_number || referenceNumber);
        onResult?.(data);
      } else {
        trackStatusLookupNotFound();
        onNotFound?.(data?.message);
      }
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : 'Unable to check RFQ status right now. Please try again or contact K&C.';
      setFieldError(message);
      trackStatusLookupError('request_failed');
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-5" noValidate>
      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        For security, we verify both your reference number and email address.
      </div>

      {fieldError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {fieldError}
        </div>
      )}

      <div>
        <label htmlFor="reference-number" className="block text-sm font-medium text-charcoal">
          Reference Number <span className="text-accent">*</span>
        </label>
        <input
          id="reference-number"
          type="text"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
          className={`${inputClass} font-mono uppercase`}
          placeholder="KC-RFQ-YYYYMMDD-0000"
          disabled={loading}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="lookup-email" className="block text-sm font-medium text-charcoal">
          Email <span className="text-accent">*</span>
        </label>
        <input
          id="lookup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="you@company.com"
          disabled={loading}
          autoComplete="email"
        />
      </div>

      <CTAButton
        type="submit"
        className="w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
        analyticsLabel="Check Status"
        analyticsLocation="rfq_status_lookup"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Checking Status…
          </>
        ) : (
          <>
            <Search className="h-4 w-4" aria-hidden="true" />
            Check Status
          </>
        )}
      </CTAButton>
    </form>
  );
}
