export default function RFQFormSection({ id, title, description, children, sectionRef }) {
  return (
    <section ref={sectionRef} id={id} className="rfq-form-section" aria-labelledby={`${id}-heading`}>
      <div className="rfq-form-section__header">
        <h2 id={`${id}-heading`} className="rfq-form-section__title">
          {title}
        </h2>
        {description ? <p className="rfq-form-section__description">{description}</p> : null}
      </div>
      <div className="rfq-form-section__body">{children}</div>
    </section>
  );
}
