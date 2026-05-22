import ProjectShowcaseCard from './ProjectShowcaseCard';

export default function ProjectShowcaseGrid({ projects, onViewDetails }) {
  if (projects.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-metallic">
        No representative projects match this category. Try another filter or contact K&amp;C to discuss your
        requirements.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectShowcaseCard key={project.id} project={project} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
}
