import SectionHeading from '../SectionHeading';

export default function ServiceMaterials({ materials }) {
  if (!materials?.length) return null;

  return (
    <section className="section-padding bg-brand-light" aria-labelledby="service-materials-heading">
      <div className="section-container">
        <SectionHeading
          label="Materials"
          title="Materials K&C Works With"
          description="K&C machines a range of metals and engineering plastics based on your project requirements."
          titleId="service-materials-heading"
          align="center"
        />

        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {materials.map((material) => (
            <li
              key={material}
              className="rounded-full border border-slate-200/80 bg-white px-4 py-2 text-sm font-medium text-charcoal shadow-sm"
            >
              {material}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
