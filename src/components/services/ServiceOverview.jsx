import SectionHeading from '../SectionHeading';

export default function ServiceOverview({ overview }) {
  return (
    <section className="section-padding" aria-labelledby="service-overview-heading">
      <div className="section-container">
        <SectionHeading
          label="Overview"
          title="Manufacturing Support Built Around Your Requirements"
          titleId="service-overview-heading"
        />
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-metallic">{overview}</p>
      </div>
    </section>
  );
}
