import { REPRESENTATIVE_TESTIMONIALS } from '../../data/testimonialsData';
import { TESTIMONIAL_SECTION_NOTE } from '../../data/trustSignalsData';
import TestimonialCard from './TestimonialCard';

export default function TestimonialSection({
  testimonials = REPRESENTATIVE_TESTIMONIALS,
  limit,
  showSectionNote = true,
  variant = 'light',
  eyebrow = 'Customer Experience Themes',
  title = 'The Kind of Partnership K&C Is Built to Provide',
  description = 'These examples reflect representative feedback themes — not verified customer endorsements.',
  className = '',
}) {
  const items = limit ? testimonials.slice(0, limit) : testimonials;
  const isDark = variant === 'dark';

  return (
    <section
      className={`kc-testimonial-section kc-testimonial-section--${variant} section-padding ${className}`.trim()}
      aria-labelledby="testimonial-section-heading"
    >
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-brand-accent' : 'text-accent'}`}>
            {eyebrow}
          </p>
          <h2
            id="testimonial-section-heading"
            className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${isDark ? 'text-white' : 'text-charcoal'}`}
          >
            {title}
          </h2>
          {description ? (
            <p className={`mt-4 text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-metallic'}`}>
              {description}
            </p>
          ) : null}
          {showSectionNote ? (
            <p className={`mt-4 rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-white/15 bg-white/5 text-slate-300' : 'border-slate-200 bg-slate-50 text-metallic'}`}>
              {TESTIMONIAL_SECTION_NOTE}
            </p>
          ) : null}
        </div>

        <ul className="mt-10 grid gap-6 lg:grid-cols-2">
          {items.map((testimonial) => (
            <li key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
