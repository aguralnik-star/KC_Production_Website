import {
  Box,
  Cog,
  Droplets,
  Layers,
  LayoutGrid,
  RotateCw,
  Ruler,
  Wrench,
} from 'lucide-react';

const REPRESENTATIVE_METADATA = {
  isRepresentative: true,
  isCustomerApproved: false,
  approvalStatus: 'published',
  publishReady: true,
  sourceType: 'representative',
  confidentialityReviewed: true,
  approvedUsage: ['website'],
};

export const SHOWCASE_PROJECTS = [
  {
    id: 'fixture-plate',
    title: 'Precision Aluminum Fixture Plate',
    category: 'Fixtures',
    process: 'CNC Milling',
    material: 'Aluminum',
    summary:
      'A representative fixture plate project designed to support repeatable production setup and part positioning.',
    details: [
      'CNC milled aluminum fixture plate',
      'Multiple precision hole patterns',
      'Repeatable setup support',
      'Deburred and inspection-ready finish',
      'Suitable for production support environments',
    ],
    tags: ['Fixtures', 'CNC Milling', 'Production Support', 'Aluminum'],
    image: '/images/projects/fixture-plate.jpg',
    imageAlt: 'Representative precision aluminum fixture plate',
    icon: LayoutGrid,
    ...REPRESENTATIVE_METADATA,
  },
  {
    id: 'stainless-component',
    title: 'Stainless Steel Production Component',
    category: 'Production Components',
    process: 'CNC Milling / CNC Turning',
    material: 'Stainless Steel',
    summary:
      'A representative stainless steel machined component for small-to-medium production requirements.',
    details: [
      'Precision machined stainless steel',
      'Tight dimensional control',
      'Repeatable batch production support',
      'Inspection-focused manufacturing process',
      'Suitable for demanding industrial use',
    ],
    tags: ['Production', 'Stainless Steel', 'CNC Machining', 'Inspection'],
    image: '/images/projects/stainless-component.jpg',
    imageAlt: 'Representative stainless steel production component',
    icon: Cog,
    ...REPRESENTATIVE_METADATA,
  },
  {
    id: 'inspection-gauge',
    title: 'Custom Inspection Gauge',
    category: 'Gauges',
    process: 'Gauge Manufacturing',
    material: 'Tool Steel / Aluminum',
    summary:
      'A representative inspection gauge designed to support repeatable quality checks during production.',
    details: [
      'Custom gauge design support',
      'Repeatable feature verification',
      'Shop-floor inspection use',
      'Practical quality control support',
      'Built for customer-specific requirements',
    ],
    tags: ['Gauges', 'Inspection Support', 'Quality Control', 'Custom'],
    image: '/images/projects/inspection-gauge.jpg',
    imageAlt: 'Representative custom inspection gauge',
    icon: Ruler,
    ...REPRESENTATIVE_METADATA,
  },
  {
    id: 'prototype-housing',
    title: 'Prototype Machined Housing',
    category: 'Prototype Work',
    process: 'Prototype CNC Machining',
    material: 'Aluminum / Engineering Plastic',
    summary:
      'A representative prototype housing project used to validate fit, form, and function before production.',
    details: [
      'Prototype machining support',
      'Engineering review and manufacturability feedback',
      'Material flexibility',
      'Short-run production readiness',
      'Useful for design validation',
    ],
    tags: ['Prototype', 'CNC Machining', 'Design Validation', 'Short Run'],
    image: '/images/projects/prototype-housing.jpg',
    imageAlt: 'Representative prototype machined housing',
    icon: Box,
    ...REPRESENTATIVE_METADATA,
  },
  {
    id: 'tooling-component',
    title: 'Production Tooling Component',
    category: 'Tooling',
    process: 'CNC Machining / Tooling',
    material: 'Tool Steel',
    summary:
      'A representative production tooling component built to support manufacturing repeatability and durability.',
    details: [
      'Machined tooling detail',
      'Durable material selection',
      'Production support application',
      'Repeatable manufacturing process',
      'Inspection before delivery',
    ],
    tags: ['Tooling', 'Tool Steel', 'Production Support', 'CNC Machining'],
    image: '/images/projects/tooling-component.jpg',
    imageAlt: 'Representative production tooling component',
    icon: Wrench,
    ...REPRESENTATIVE_METADATA,
  },
  {
    id: 'hydraulic-manifold',
    title: 'Hydraulic Manifold Component',
    category: 'CNC Machining',
    process: 'CNC Milling',
    material: 'Aluminum / Steel',
    summary:
      'A representative machined manifold-style component for fluid power and hydraulic applications.',
    details: [
      'Milled porting and feature control',
      'Multiple setup machining',
      'Deburr and inspection support',
      'Suitable for hydraulic or valve-related applications',
      'Built around customer drawings',
    ],
    tags: ['CNC Milling', 'Hydraulics', 'Manifold', 'Industrial'],
    image: '/images/projects/hydraulic-manifold.jpg',
    imageAlt: 'Representative hydraulic manifold component',
    icon: Droplets,
    ...REPRESENTATIVE_METADATA,
  },
  {
    id: 'assembly-fixture',
    title: 'Assembly Support Fixture',
    category: 'Fixtures',
    process: 'Fixture Manufacturing',
    material: 'Aluminum / Steel',
    summary:
      'A representative assembly fixture used to improve repeatability and reduce setup variation.',
    details: [
      'Custom fixture layout',
      'Production assembly support',
      'Repeatable alignment features',
      'Durable construction',
      'Supports consistent workflow',
    ],
    tags: ['Fixtures', 'Assembly', 'Production Support', 'Repeatability'],
    image: '/images/projects/assembly-fixture.jpg',
    imageAlt: 'Representative assembly support fixture',
    icon: Layers,
    ...REPRESENTATIVE_METADATA,
  },
  {
    id: 'turned-component',
    title: 'Small Precision Turned Component',
    category: 'CNC Machining',
    process: 'CNC Turning',
    material: 'Steel / Brass',
    summary:
      'A representative turned component for industrial assemblies, fittings, shafts, or bushings.',
    details: [
      'CNC turned profile',
      'Consistent diameter control',
      'Short-run and production support',
      'Multi-material capability',
      'Inspection-supported output',
    ],
    tags: ['CNC Turning', 'Precision', 'Short Run', 'Production'],
    image: '/images/projects/turned-component.jpg',
    imageAlt: 'Representative small precision turned component',
    icon: RotateCw,
    ...REPRESENTATIVE_METADATA,
  },
];

/** Customer-approved case studies — add only after explicit customer approval. */
export const REAL_CASE_STUDIES = [];

export function isProjectPublishReady(item) {
  return Boolean(
    item?.isCustomerApproved
    && item?.approvalStatus === 'approved'
    && item?.publishReady
    && item?.confidentialityReviewed
    && item?.sourceType === 'real',
  );
}

export function getPublicProjects(category = 'All') {
  const approvedReal = REAL_CASE_STUDIES.filter(isProjectPublishReady);
  const source = approvedReal.length > 0 ? approvedReal : SHOWCASE_PROJECTS;
  if (category === 'All') return source;
  if (category === 'Inspection Support') {
    return source.filter(
      (project) =>
        project.category === 'Gauges'
        || project.tags?.some((tag) => tag.toLowerCase().includes('inspection')),
    );
  }
  return source.filter((project) => project.category === category);
}

export function getProjectImageSource(project) {
  if (isProjectPublishReady(project) && project.image) {
    return { type: 'approved', src: project.image, alt: project.imageAlt };
  }
  if (project.image && !project.isRepresentative) {
    return { type: 'approved', src: project.image, alt: project.imageAlt };
  }
  return { type: 'placeholder', src: null, alt: project.imageAlt ?? project.title };
}

export function filterProjects(projects, category) {
  if (category === 'All') return projects;
  if (category === 'Inspection Support') {
    return projects.filter(
      (project) =>
        project.category === 'Gauges'
        || project.tags?.some((tag) => tag.toLowerCase().includes('inspection')),
    );
  }
  return projects.filter((project) => project.category === category);
}
