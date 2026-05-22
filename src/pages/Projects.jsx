import { useMemo, useState } from 'react';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import RelatedProjects from '../components/seo/RelatedProjects';
import ProjectsHero from '../components/projects/ProjectsHero';
import ProjectCategoryFilter from '../components/projects/ProjectCategoryFilter';
import ProjectShowcaseGrid from '../components/projects/ProjectShowcaseGrid';
import ProjectDetailModal from '../components/projects/ProjectDetailModal';
import ProjectProcessSummary from '../components/projects/ProjectProcessSummary';
import TestimonialSection from '../components/trust/TestimonialSection';
import TrustCTA from '../components/trust/TrustCTA';
import { getPublicProjects } from '../data/projects';
import { trackProjectCategoryFilter, trackProjectShowcaseView } from '../utils/analytics';

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = useMemo(
    () => getPublicProjects(activeCategory),
    [activeCategory],
  );

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackProjectCategoryFilter(category);
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    trackProjectShowcaseView(project.title, project.category);
  };

  return (
    <>
      <SEO {...PAGE_SEO.projects} />

      <div className="section-container px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Projects' }]} />
      </div>

      <ProjectsHero />

      <section className="section-padding" aria-labelledby="projects-showcase-heading">
        <div className="section-container">
          <h2 id="projects-showcase-heading" className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            Representative Project Examples
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-relaxed text-metallic">
            These examples illustrate the types of machining, tooling, fixture, gauge, and production work K&amp;C
            supports. They are representative only and do not depict actual customer projects.
          </p>

          <div className="mt-8">
            <ProjectCategoryFilter activeCategory={activeCategory} onChange={handleCategoryChange} />
          </div>

          <div className="mt-10">
            <ProjectShowcaseGrid projects={filteredProjects} onViewDetails={handleViewDetails} />
          </div>
        </div>
      </section>

      <ProjectProcessSummary />
      <RelatedProjects className="bg-white !pt-0" />
      <TestimonialSection limit={2} className="bg-slate-50" />
      <TrustCTA
        headline="Have a similar machining, fixture, gauge, or tooling project?"
        body="Send your drawings, specifications, and project requirements. K&C will review your RFQ and follow up with next steps."
        analyticsLocation="projects_trust_cta"
        secondaryLabel="View Capabilities"
        secondaryTo="/capabilities"
      />

      <ProjectDetailModal
        project={selectedProject}
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
