import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function RFQReferenceBadge({ referenceNumber, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!referenceNumber) return;
    try {
      await navigator.clipboard.writeText(referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <p className="text-sm font-medium uppercase tracking-wide text-metallic">Reference Number</p>
      <div className="w-full rounded-2xl border-2 border-accent/20 bg-accent/5 px-6 py-5 text-center print:border-charcoal print:bg-white">
        <p className="break-all font-mono text-2xl font-bold tracking-wide text-charcoal sm:text-3xl">
          {referenceNumber || '—'}
        </p>
      </div>
      {referenceNumber && (
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:border-accent hover:text-accent print:hidden"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copy Reference Number
            </>
          )}
        </button>
      )}
    </div>
  );
}
