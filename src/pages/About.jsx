import { ArrowRight, Heart, Users, Wrench, Handshake } from 'lucide-react';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import SectionHeading from '../components/SectionHeading';
import CTAButton from '../components/CTAButton';
import { COMPANY, CORE_MESSAGE } from '../data/company';

const timeline = [
  {
    year: '1987',
    title: 'Founded by Keith Clark',
    description: 'K&C Design and Manufacturing was founded by Keith Clark in Carol Stream, Illinois — built on tool and die, die design, and quality control expertise.',
  },
  {
    year: 'Early Years',
    title: 'Gauging, Tooling & Fixtures',
    description: 'The company began with inspection gauging, production tooling, and manufacturing fixtures — establishing a foundation in precision and quality.',
  },
  {
    year: 'Growth',
    title: 'Precision Manufacturing & Machining',
    description: 'As customer needs evolved, K&C expanded into precision manufacturing and CNC machining capabilities to serve Midwest manufacturers more comprehensively.',
  },
  {
    year: 'Today',
    title: 'Addison, IL — Long-Term Partnerships',
    description: 'Now located at 422 S. Irmen Drive in Addison, K&C continues to build lasting relationships. Many clients have been with us for years, and most new business comes from trusted referrals.',
  },
];

const values = [
  { icon: Heart, title: 'Personal Service', description: 'When you call our office, you speak with someone knowledgeable — never a phone maze.' },
  { icon: Users, title: 'Industry Expertise', description: 'Over 60 years of combined experience across machining, tooling, and quality control.' },
  { icon: Wrench, title: 'Precision Focus', description: 'A strong dedication to quality, precision, and attention to detail in every project.' },
  { icon: Handshake, title: 'Long-Term Relationships', description: 'We are serious about working with you and building partnerships that last.' },
];

export default function About() {
  return (
    <>
      <SEO {...PAGE_SEO.about} />

      <section className="page-hero">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="About Us"
            title="Built on Quality, Precision, and Personal Service"
            description={CORE_MESSAGE}
            dark
          />
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-charcoal">Our Story</h2>
              <div className="mt-6 space-y-4 leading-relaxed text-metallic">
                <p>
                  K&amp;C Design and Manufacturing was founded in {COMPANY.founded} by {COMPANY.founder} in {COMPANY.origin}. From the beginning, the company was rooted in tool and die work, die design, and quality control — disciplines that still define how we approach every project today.
                </p>
                <p>
                  K&amp;C started with inspection gauging, production tooling, and manufacturing fixtures. As our customers&apos; needs grew, so did we — expanding into precision manufacturing and CNC machining to deliver a broader range of capabilities under one roof.
                </p>
                <p>
                  For over 35 years, we have provided quality machining services to industries throughout the Midwest USA. With a strong dedication to quality, precision, and attention to detail, we strive to provide not only the finest machining, but also unsurpassed customer service.
                </p>
                <p>
                  We would be honored to share our expertise and address any needs you may have. Many of our current clients have been with us for years, and most of our new business comes from trusted referrals — a testament to the relationships we build.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              {timeline.map(({ year, title, description }) => (
                <article key={year} className="card border-l-4 border-l-accent">
                  <p className="text-sm font-bold text-accent">{year}</p>
                  <h3 className="mt-1 text-lg font-semibold text-charcoal">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-metallic">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <SectionHeading label="Our Values" title="What Sets K&C Apart" align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <article key={title} className="card text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-charcoal">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-metallic">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container text-center">
          <SectionHeading
            title="Let's Build a Long-Term Partnership"
            description="Contact us for a prompt quotation and experience the K&C difference."
            align="center"
          />
          <CTAButton to="/contact" className="mt-8">
            Request a Quote
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
        </div>
      </section>
    </>
  );
}
