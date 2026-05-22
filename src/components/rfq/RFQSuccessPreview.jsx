import { CheckCircle2 } from 'lucide-react';

export default function RFQSuccessPreview({ referenceNumber }) {
  return (
    <div className="rfq-success-preview" role="status" aria-live="polite">
      <CheckCircle2 className="h-8 w-8 text-emerald-600" aria-hidden="true" />
      <div>
        <p className="text-lg font-semibold text-charcoal">RFQ submitted successfully</p>
        {referenceNumber ? (
          <p className="mt-1 text-sm text-metallic">
            Reference <span className="font-mono font-semibold text-charcoal">{referenceNumber}</span>
          </p>
        ) : null}
        <p className="mt-2 text-sm text-metallic">Redirecting to your confirmation page…</p>
      </div>
    </div>
  );
}
