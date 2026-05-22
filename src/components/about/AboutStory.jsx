import SectionHeading from '../SectionHeading';

const CALLOUT =
  'Our goal has always been simple: provide dependable precision manufacturing support that helps customers get quality parts, tooling, fixtures, and gauges delivered with confidence.';

export default function AboutStory() {
  return (
    <section className="section-padding" aria-labelledby="about-story-heading">
      <div className="section-container">
        <SectionHeading
          label="Our Story"
          title="Built on Manufacturing Experience and Customer Trust"
          titleId="about-story-heading"
          description="Founded by Keith Clark in 1987, K&C Design and Manufacturing began with a foundation in tool and die, die design, quality control, inspection gauging, production tooling, and manufacturing fixtures. As customer needs grew, K&C expanded into precision machining and custom manufacturing services while maintaining the hands-on service and quality focus that built the company."
        />

        <blockquote className="about-story-callout card mt-10 border-l-4 border-l-brand-accent">
          <p className="text-lg font-medium leading-relaxed text-charcoal">&ldquo;{CALLOUT}&rdquo;</p>
        </blockquote>
      </div>
    </section>
  );
}
