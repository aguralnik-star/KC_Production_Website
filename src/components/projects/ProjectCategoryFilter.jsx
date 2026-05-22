import { PROJECT_CATEGORIES } from '../../data/projects';

export default function ProjectCategoryFilter({ activeCategory, onChange }) {
  return (
    <div className="project-category-filter" role="group" aria-label="Filter projects by category">
      <ul className="project-category-filter__list">
        {PROJECT_CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <li key={category}>
              <button
                type="button"
                onClick={() => onChange(category)}
                className={`project-category-filter__button ${isActive ? 'project-category-filter__button--active' : ''}`}
                aria-pressed={isActive}
              >
                {category}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
