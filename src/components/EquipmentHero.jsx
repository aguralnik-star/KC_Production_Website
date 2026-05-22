import SectionHeading from './SectionHeading';

export default function EquipmentHero() {
  return (
    <section className="page-hero">
      <div className="section-container px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Equipment"
          title="Precision Manufacturing Equipment"
          description="K&C Design and Manufacturing uses CNC machining equipment, inspection systems, and CAD/CAM programming tools to support precision machining, tooling, fixtures, gauges, and production manufacturing."
          dark
        />
      </div>
    </section>
  );
}
