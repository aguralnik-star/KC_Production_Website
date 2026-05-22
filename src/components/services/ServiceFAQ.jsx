import SectionHeading from '../SectionHeading';

export default function ServiceFAQ({ faq }) {
  if (!faq?.length) return null;

  return (
    <section className="section-padding" aria-labelledby="service-faq-heading">
      <div className="section-container">
        <SectionHeading
          label="FAQ"
          title="Frequently Asked Questions"
          titleId="service-faq-heading"
          align="center"
        />

        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {faq.map(({ question, answer }) => (
            <details key={question} className="service-faq-item card group">
              <summary className="cursor-pointer list-none text-base font-semibold text-charcoal marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  {question}
                  <span
                    className="mt-0.5 shrink-0 text-brand-accent transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-metallic">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
