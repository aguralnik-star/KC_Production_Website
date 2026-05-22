import { useMemo, useState } from 'react';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import ProjectsHero from '../components/projects/ProjectsHero';
import ProjectCategoryFilter from '../components/projects/ProjectCategoryFilter';
import ProjectShowcaseGrid from '../components/projects/ProjectShowcaseGrid';
import ProjectDetailModal from '../components/projects/ProjectDetailModal';
import ProjectProcessSummary from '../components/projects/ProjectProcessSummary';
import ProjectCTA from '../components/projects/ProjectCTA';
import { SHOWCASE_PROJECTS, filterProjects } from '../data/projects';
import { trackProjectCategoryFilter, trackProjectShowcaseView } from '../utils/analytics';

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = useMemo(
    () => filterProjects(SHOWCASE_PROJECTS, activeCategory),
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
      <ProjectCTA />

      <ProjectDetailModal
        project={selectedProject}
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
