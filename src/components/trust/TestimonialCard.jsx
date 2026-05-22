export default function TestimonialCard({ testimonial }) {
  return (
    <article className="kc-testimonial-card">
      {testimonial.isRepresentative ? (
        <p className="kc-testimonial-card__badge">Representative Example</p>
      ) : null}

      <figure>
        <blockquote className="kc-testimonial-card__quote">
          <p>&ldquo;{testimonial.quote}&rdquo;</p>
        </blockquote>
        <figcaption className="kc-testimonial-card__caption">
          <cite className="not-italic">
            <span className="kc-testimonial-card__role">{testimonial.role}</span>
            <span className="kc-testimonial-card__company">{testimonial.company}</span>
          </cite>
        </figcaption>
      </figure>
    </article>
  );
}
