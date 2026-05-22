import { ArrowRight } from 'lucide-react';
import CTAButton from '../CTAButton';

export default function TrustCTA({
  variant = 'band',
  headline = 'Need machining, tooling, fixture, or gauge support for your industry?',
  body = 'Send your drawings, specifications, and project requirements. K&C will review your RFQ and follow up with next steps.',
  buttonLabel = 'Request a Quote',
  buttonTo = '/contact',
  secondaryLabel,
  secondaryTo,
  analyticsLocation = 'trust_cta',
  className = '',
}) {
  const isBand = variant === 'band';
  const isInline = variant === 'inline' || variant === 'inline-light';

  if (isInline) {
    const lightText = variant === 'inline-light';
    return (
      <div className={`text-center ${className}`.trim()}>
        {headline ? (
          <h3 className={`text-2xl font-bold ${lightText ? 'text-white' : 'text-charcoal'}`}>{headline}</h3>
        ) : null}
        {body ? (
          <p className={`mx-auto mt-3 max-w-2xl text-base leading-relaxed ${lightText ? 'text-slate-300' : 'text-metallic'}`}>
            {body}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CTAButton
            to={buttonTo}
            variant={lightText ? 'white' : 'primary'}
            analyticsLabel={buttonLabel}
            analyticsLocation={analyticsLocation}
          >
            {buttonLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
          {secondaryLabel && secondaryTo ? (
            <CTAButton
              to={secondaryTo}
              variant={lightText ? 'light' : 'secondary'}
              analyticsLabel={secondaryLabel}
              analyticsLocation={analyticsLocation}
            >
              {secondaryLabel}
            </CTAButton>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <section className={`kc-trust-cta ${className}`.trim()} aria-labelledby="trust-cta-heading">
      <div className="kc-trust-cta__pattern" aria-hidden="true" />
      <div className="section-container relative text-center">
        <h2 id="trust-cta-heading" className="text-3xl font-bold text-white sm:text-4xl">
          {headline}
        </h2>
        {body ? <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">{body}</p> : null}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CTAButton
            to={buttonTo}
            analyticsLabel={buttonLabel}
            analyticsLocation={analyticsLocation}
          >
            {buttonLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
          {secondaryLabel && secondaryTo ? (
            <CTAButton
              to={secondaryTo}
              variant="light"
              analyticsLabel={secondaryLabel}
              analyticsLocation={analyticsLocation}
            >
              {secondaryLabel}
            </CTAButton>
          ) : null}
        </div>
      </div>
    </section>
  );
}
