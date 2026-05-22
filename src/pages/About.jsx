import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Building, Target } from 'lucide-react';

const values = [
  { icon: Heart, title: 'Family Values', description: 'Built on integrity, accountability, and the pride of putting our name on every part we ship.' },
  { icon: Users, title: 'Skilled Team', description: 'Experienced machinists, programmers, and inspectors who take ownership of quality at every step.' },
  { icon: Building, title: 'Facility Growth', description: 'Continuous investment in CNC equipment, inspection tools, and shop capacity since 1992.' },
  { icon: Target, title: 'Customer Focus', description: 'We listen, adapt, and deliver — building long-term partnerships with manufacturers who demand precision.' },
];

const timeline = [
  { year: '1987', title: 'Company Founded', description: 'K&C Design & Manufacturing was established as a family-owned precision manufacturing company, built on craftsmanship and customer relationships.' },
  { year: '1992', title: 'CNC Machining Added', description: 'Recognizing growing demand for automated precision, K&C invested in CNC milling and turning capabilities to serve production and prototype customers.' },
  { year: 'Late 1990s – 2000s', title: 'Facility Expansion', description: 'Continued growth brought additional Haas CNC equipment, expanded floor space, and enhanced inspection capabilities to support larger production volumes.' },
  { year: 'Present', title: 'Full-Service Manufacturing', description: 'Today, K&C delivers CNC machined components, custom fixtures, gauges, and tooling for customers across automotive, aerospace, medical, and industrial sectors.' },
];

export default function About() {
  return (
    <>
      <section className="bg-charcoal py-16 sm:py-20">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <p className="section-label text-accent-light">About Us</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">Three Generations of American Precision Manufacturing</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            Since 1987, K&amp;C Design &amp; Manufacturing has been a family-owned shop committed to precision, reliability, and the kind of personal service only a dedicated team can provide.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="section-title">Our Story</h2>
              <div className="mt-6 space-y-4 leading-relaxed text-metallic">
                <p>K&amp;C Design &amp; Manufacturing began in 1987 as a small, family-operated precision manufacturing company. From the start, our focus was simple: do quality work, stand behind it, and treat every customer like a long-term partner.</p>
                <p>In 1992, we added CNC machining capabilities — a pivotal step that expanded our ability to serve customers with prototype work, short-run production, and increasingly complex components. That investment set the foundation for decades of growth.</p>
                <p>Over the years, we&apos;ve expanded our facility, added Haas CNC milling and turning centers, integrated CMM inspection, and built a team of skilled machinists and programmers. Through it all, we&apos;ve remained family-owned and committed to the values that built this company.</p>
                <p>Today, K&amp;C serves manufacturers across the country with CNC milling, turning, custom fixtures, gauges, tooling, and production machining — always with the precision and accountability our customers expect.</p>
              </div>
            </div>
            <div className="space-y-6">
              {timeline.map(({ year, title, description }) => (
                <div key={year} className="card border-l-4 border-l-accent">
                  <p className="text-sm font-bold text-accent">{year}</p>
                  <h3 className="mt-1 text-lg font-semibold text-charcoal">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-metallic">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-label">Our Values</p>
            <h2 className="section-title">What Drives Us Every Day</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-charcoal">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-metallic">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container text-center">
          <h2 className="section-title">Let&apos;s Build Something Together</h2>
          <p className="section-subtitle mx-auto">Whether you need a single prototype or a recurring production run, our team is ready to review your project and provide a competitive quote.</p>
          <Link to="/contact" className="btn-primary mt-8">Request a Quote<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
