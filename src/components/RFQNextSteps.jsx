import { ClipboardList } from 'lucide-react';

const steps = [
  'K&C reviews your RFQ and drawings.',
  'We contact you if more details are needed.',
  'Your project is reviewed for machining, tooling, fixture, or gauge requirements.',
  'You receive a quote or next-step follow-up.',
];

export default function RFQNextSteps() {
  return (
    <section className="rfq-next-steps print:border print:border-charcoal/20 print:bg-white" aria-labelledby="rfq-next-steps-heading">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-accent" aria-hidden="true" />
        <h2 id="rfq-next-steps-heading" className="text-lg font-semibold text-charcoal">
          What Happens Next
        </h2>
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
        Please save your reference number for future communication and RFQ status checks.
      </p>
    </section>
  );
}
