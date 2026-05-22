import { ClipboardList } from 'lucide-react';

const steps = [
  'Our team will review your RFQ and drawings.',
  'We may contact you if additional details are needed.',
  'A quote or follow-up response will be provided after review.',
];

export default function RFQNextSteps() {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-6 print:border-charcoal/20 print:bg-white">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-accent" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-charcoal">What Happens Next</h2>
      </div>
      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3 text-sm leading-relaxed text-charcoal">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
              {index + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-sm font-medium text-charcoal">
        Please save this reference number for future communication.
      </p>
    </section>
  );
}
