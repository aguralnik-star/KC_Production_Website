export default function ApprovedTestimonialCard({ testimonial }) {
  return (
    <article className="kc-testimonial-card">
      <p className="kc-testimonial-card__badge bg-emerald-100 text-emerald-800">Approved Testimonial</p>
      <figure>
        <blockquote className="kc-testimonial-card__quote">
          <p>&ldquo;{testimonial.quote}&rdquo;</p>
        </blockquote>
        <figcaption className="kc-testimonial-card__caption">
          <cite className="not-italic">
            {testimonial.role ? <span className="kc-testimonial-card__role">{testimonial.role}</span> : null}
            {testimonial.company ? <span className="kc-testimonial-card__company">{testimonial.company}</span> : null}
          </cite>
        </figcaption>
      </figure>
    </article>
  );
}
