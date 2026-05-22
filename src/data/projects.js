export {
  SHOWCASE_PROJECTS,
  REAL_CASE_STUDIES,
  getPublicProjects,
  getProjectImageSource,
  filterProjects,
  isProjectPublishReady,
} from './projectsData';

export const PROJECT_CATEGORIES = [
  'All',
  'CNC Machining',
  'Tooling',
  'Fixtures',
  'Gauges',
  'Prototype Work',
  'Production Components',
  'Inspection Support',
];

import { LayoutGrid, Ruler, Cog } from 'lucide-react';

export const HOME_PROJECT_PREVIEWS = [
  {
    title: 'Precision Fixture Work',
    description: 'Representative fixture plates and assembly support tooling for repeatable production.',
    icon: LayoutGrid,
  },
  {
    title: 'Custom Gauges',
    description: 'Representative inspection gauges built for shop-floor quality verification.',
    icon: Ruler,
  },
  {
    title: 'Production Components',
    description: 'Representative machined components for small-to-medium production requirements.',
    icon: Cog,
  },
];
