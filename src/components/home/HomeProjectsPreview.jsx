import { ArrowRight } from 'lucide-react';
import CTAButton from '../CTAButton';
import { HOME_PROJECT_PREVIEWS } from '../../data/projects';

export default function HomeProjectsPreview() {
  return (
    <section className="section-padding bg-white" aria-labelledby="home-projects-heading">
      <div className="section-container">
        <h2 id="home-projects-heading" className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
          Representative Project Types
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-relaxed text-metallic">
          Explore representative examples of the machining, fixture, gauge, and production work K&amp;C supports.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {HOME_PROJECT_PREVIEWS.map(({ title, description, icon: Icon }) => (
            <article key={title} className="card h-full text-center sm:text-left">
              <div className="capability-feature-card__icon mx-auto sm:mx-0" aria-hidden="true">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-charcoal">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-metallic">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <CTAButton to="/projects" variant="secondary">
            View Project Showcase
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
