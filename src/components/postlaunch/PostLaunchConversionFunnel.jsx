export default function PostLaunchConversionFunnel({ steps = [] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">RFQ Funnel</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">Conversion Funnel (Last 7 Days)</h3>
      </div>

      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={step.key} className="relative">
            <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-charcoal">{step.label}</p>
                {step.isPlaceholder ? (
                  <p className="text-xs text-metallic">Connect analytics to track visitors</p>
                ) : null}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-charcoal">{step.value}</p>
                {step.conversionFromPrevious != null ? (
                  <p className="text-xs text-metallic">{step.conversionFromPrevious}% from previous step</p>
                ) : null}
              </div>
            </div>
            {index < steps.length - 1 ? (
              <div className="flex justify-center py-1 text-metallic" aria-hidden="true">
                ↓
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
