export const SHARED_MATERIALS = [
  'Aluminum',
  'Carbon steel',
  'Stainless steel',
  'Tool steel',
  'Brass',
  'Copper',
  'Bronze',
  'Cast iron',
  'Engineering plastics',
];

export const SHARED_PROCESS = {
  title: 'How the RFQ Process Works',
  steps: [
    { number: 1, title: 'Submit Drawings' },
    { number: 2, title: 'Review Requirements' },
    { number: 3, title: 'Confirm Material, Quantity, and Timeline' },
    { number: 4, title: 'Quote and Schedule' },
    { number: 5, title: 'Machine, Inspect, and Deliver' },
  ],
};

export const SHARED_WHY_KC = [
  { title: 'Founded in 1987', description: 'Decades of precision manufacturing experience serving Midwest customers.' },
  { title: 'Midwest Manufacturing Partner', description: 'Responsive support for regional manufacturers and production teams.' },
  { title: 'Prompt Quotations', description: 'K&C reviews RFQs quickly and provides practical project feedback.' },
  { title: 'Competitive Pricing', description: 'Strong manufacturing value without compromising quality or service.' },
  { title: 'Quality-Driven Inspection', description: 'Inspection support and repeatability are central to every project.' },
  { title: 'Long-Term Customer Relationships', description: 'K&C earns trust through consistent performance and follow-through.' },
];

export const SHARED_CTA = {
  headline: 'Ready to request a quote?',
  body: 'Send your drawings, specifications, quantities, and timeline. K&C will review your RFQ and follow up with next steps.',
  buttonLabel: 'Request a Quote',
  buttonLink: '/contact',
};

export const SERVICE_NAV_LINKS = [
  { slug: 'cnc-machining', label: 'CNC Machining' },
  { slug: 'cnc-milling', label: 'CNC Milling' },
  { slug: 'cnc-turning', label: 'CNC Turning' },
  { slug: 'tooling', label: 'Tooling' },
  { slug: 'fixtures', label: 'Fixtures' },
  { slug: 'gauges', label: 'Gauges' },
  { slug: 'prototype-machining', label: 'Prototype Machining' },
  { slug: 'production-machining', label: 'Production Machining' },
];

export const SEO_SERVICE_PAGES = [
  {
    slug: 'cnc-machining',
    path: '/services/cnc-machining',
    eyebrow: 'CNC Machining',
    title: 'CNC Machining Services in Addison, IL',
    h1: 'Precision CNC Machining for Midwest Manufacturers',
    metaDescription:
      'K&C Design and Manufacturing provides CNC machining services for prototypes, production components, tooling, fixtures, gauges, and custom manufactured parts in Addison, Illinois.',
    overview:
      'K&C Design and Manufacturing supports customers with CNC machining services for precision components, prototypes, production parts, tooling, fixtures, gauges, and custom manufacturing requirements.',
    capabilities: [
      'CNC milling',
      'CNC turning',
      'Prototype machining',
      'Production machining',
      'Custom machined components',
      'Tooling and fixture support',
      'Inspection-supported manufacturing',
    ],
    applications: [
      'Industrial components',
      'Tooling details',
      'Fixture components',
      'Gauge components',
      'Replacement parts',
      'Prototype parts',
      'Production parts',
    ],
    materials: SHARED_MATERIALS,
    faq: [
      {
        question: 'What types of CNC machining projects does K&C support?',
        answer:
          'K&C supports prototype machining, production machining, tooling, fixtures, gauges, and custom machined components.',
      },
      {
        question: 'Can K&C machine both metals and plastics?',
        answer:
          'Yes. K&C works with metals including aluminum, steels, stainless steel, brass, copper, bronze, cast iron, and engineering plastics.',
      },
      {
        question: 'How do I request a CNC machining quote?',
        answer:
          'Submit drawings, material requirements, quantity, timeline, and project notes through the RFQ form.',
      },
    ],
    relatedServices: ['cnc-milling', 'cnc-turning', 'prototype-machining', 'production-machining'],
  },
  {
    slug: 'cnc-milling',
    path: '/services/cnc-milling',
    eyebrow: 'CNC Milling',
    title: 'CNC Milling Services | K&C Design and Manufacturing',
    h1: 'Precision CNC Milling for Components, Tooling, and Fixtures',
    metaDescription:
      'CNC milling services for prototypes, production components, tooling, fixtures, and custom machined parts from K&C Design and Manufacturing in Addison, IL.',
    overview:
      'K&C Design and Manufacturing provides CNC milling for precision components, fixture plates, tooling details, prototypes, and production parts with inspection-supported manufacturing.',
    capabilities: [
      'Vertical CNC milling',
      '4-axis rotary table capability',
      'Prototype components',
      'Production components',
      'Fixture plates',
      'Tooling details',
      'Custom machined parts',
    ],
    applications: [
      'Fixture plates',
      'Manifold-style components',
      'Tooling details',
      'Production brackets',
      'Prototype housings',
      'Industrial components',
    ],
    materials: SHARED_MATERIALS,
    faq: [
      {
        question: 'Does K&C offer CNC milling for prototypes?',
        answer: 'Yes. K&C supports prototype milling as well as short-run and production machining.',
      },
      {
        question: 'Can K&C support fixture and tooling components?',
        answer:
          'Yes. CNC milling is commonly used for tooling, fixtures, gauges, and custom production support components.',
      },
    ],
    relatedServices: ['cnc-machining', 'cnc-turning', 'fixtures', 'tooling'],
  },
  {
    slug: 'cnc-turning',
    path: '/services/cnc-turning',
    eyebrow: 'CNC Turning',
    title: 'CNC Turning Services | K&C Design and Manufacturing',
    h1: 'Precision CNC Turning for Custom Machined Components',
    metaDescription:
      'CNC turning services for shafts, bushings, fittings, cylindrical parts, prototypes, and production components from K&C Design and Manufacturing.',
    overview:
      'K&C Design and Manufacturing delivers CNC turning for cylindrical components including shafts, bushings, fittings, spacers, and custom turned parts for prototype and production needs.',
    capabilities: [
      'CNC turning',
      'Precision cylindrical components',
      'Short-run turned parts',
      'Production turned parts',
      'Shafts',
      'Bushings',
      'Fittings',
      'Custom turned components',
    ],
    applications: ['Bushings', 'Shafts', 'Spacers', 'Fittings', 'Pins', 'Production components', 'Replacement parts'],
    materials: SHARED_MATERIALS,
    faq: [
      {
        question: 'What types of turned parts does K&C support?',
        answer:
          'K&C supports turned components such as bushings, shafts, spacers, fittings, pins, and custom cylindrical parts.',
      },
    ],
    relatedServices: ['cnc-machining', 'cnc-milling', 'prototype-machining', 'production-machining'],
  },
  {
    slug: 'tooling',
    path: '/services/tooling',
    eyebrow: 'Manufacturing Tooling',
    title: 'Manufacturing Tooling Services | K&C Design and Manufacturing',
    h1: 'Custom Manufacturing Tooling Built for Production Support',
    metaDescription:
      'Custom manufacturing tooling services for production support, machining, assembly, inspection, and industrial manufacturing applications.',
    overview:
      'K&C Design and Manufacturing builds custom manufacturing tooling and tooling components to support production, assembly, inspection, and process improvement requirements.',
    capabilities: [
      'Production tooling',
      'Machined tooling details',
      'Assembly support tooling',
      'Manufacturing support tooling',
      'Repair and replacement tooling',
      'Tooling components',
    ],
    applications: [
      'Production support',
      'Assembly operations',
      'Inspection support',
      'Manufacturing fixtures',
      'Replacement tooling',
      'Process improvement',
    ],
    materials: ['Aluminum', 'Carbon steel', 'Stainless steel', 'Tool steel', 'Engineering plastics'],
    faq: [
      {
        question: 'Does K&C build custom production tooling?',
        answer:
          'Yes. K&C supports custom tooling, tooling components, and manufacturing support tools based on customer requirements.',
      },
    ],
    relatedServices: ['fixtures', 'gauges', 'cnc-milling', 'production-machining'],
  },
  {
    slug: 'fixtures',
    path: '/services/fixtures',
    eyebrow: 'Manufacturing Fixtures',
    title: 'Manufacturing Fixture Services | K&C Design and Manufacturing',
    h1: 'Custom Fixtures for Repeatable Manufacturing and Inspection',
    metaDescription:
      'Custom manufacturing fixtures, inspection fixtures, assembly fixtures, and machining fixtures from K&C Design and Manufacturing in Addison, IL.',
    overview:
      'K&C Design and Manufacturing designs and builds custom fixtures for manufacturing setup, inspection, assembly, and repeatable part positioning across production workflows.',
    capabilities: [
      'Manufacturing fixtures',
      'Inspection fixtures',
      'Assembly fixtures',
      'Machining fixtures',
      'Fixture plates',
      'Location and holding features',
      'Repeatable setup support',
    ],
    applications: [
      'Production setup support',
      'Quality inspection',
      'Part positioning',
      'Assembly support',
      'Repeatable manufacturing',
      'Workflow improvement',
    ],
    materials: ['Aluminum', 'Carbon steel', 'Stainless steel', 'Tool steel', 'Engineering plastics'],
    faq: [
      {
        question: 'What types of fixtures does K&C build?',
        answer:
          'K&C supports manufacturing fixtures, inspection fixtures, assembly fixtures, machining fixtures, and fixture components.',
      },
    ],
    relatedServices: ['tooling', 'gauges', 'cnc-milling', 'production-machining'],
  },
  {
    slug: 'gauges',
    path: '/services/gauges',
    eyebrow: 'Inspection Gauges',
    title: 'Inspection Gauges and Custom Gauging | K&C Design and Manufacturing',
    h1: 'Custom Inspection Gauges for Manufacturing Quality Control',
    metaDescription:
      'Custom inspection gauges, production gauges, and gauging support for repeatable manufacturing quality control from K&C Design and Manufacturing.',
    overview:
      'K&C Design and Manufacturing builds custom inspection gauges and gauging components to support repeatable measurement, feature verification, and shop-floor quality control.',
    capabilities: [
      'Custom inspection gauges',
      'Production gauges',
      'Functional checking gauges',
      'Gauge components',
      'Repeatable measurement support',
      'Quality control support',
    ],
    applications: [
      'Production inspection',
      'Feature verification',
      'Shop-floor quality checks',
      'Customer-specific gauging',
      'Repeatable measurement',
      'Process control',
    ],
    materials: ['Aluminum', 'Carbon steel', 'Stainless steel', 'Tool steel', 'Brass'],
    faq: [
      {
        question: 'Does K&C build custom inspection gauges?',
        answer:
          'Yes. K&C supports custom inspection gauges and gauging solutions for manufacturing quality control.',
      },
    ],
    relatedServices: ['fixtures', 'tooling', 'cnc-machining', 'production-machining'],
  },
  {
    slug: 'prototype-machining',
    path: '/services/prototype-machining',
    eyebrow: 'Prototype Machining',
    title: 'Prototype Machining Services | K&C Design and Manufacturing',
    h1: 'Prototype Machining for Design Validation and Production Readiness',
    metaDescription:
      'Prototype machining services for design validation, fit checks, engineering development, and transition to production manufacturing.',
    overview:
      'K&C Design and Manufacturing supports prototype machining for design validation, fit and function checks, engineering development, and transition to production manufacturing.',
    capabilities: [
      'Prototype CNC machining',
      'Low-volume machining',
      'Design validation parts',
      'Material evaluation',
      'Engineering support',
      'Transition to production',
    ],
    applications: [
      'Prototype housings',
      'Design validation parts',
      'Test components',
      'Engineering samples',
      'Pre-production components',
      'Fit and function checks',
    ],
    materials: SHARED_MATERIALS,
    faq: [
      {
        question: 'Can K&C machine prototype parts before production?',
        answer:
          'Yes. K&C supports prototype machining to help validate design, fit, function, materials, and manufacturability.',
      },
    ],
    relatedServices: ['cnc-machining', 'cnc-milling', 'cnc-turning', 'production-machining'],
  },
  {
    slug: 'production-machining',
    path: '/services/production-machining',
    eyebrow: 'Production Machining',
    title: 'Production Machining Services | K&C Design and Manufacturing',
    h1: 'Production Machining for Repeatable Small-to-Medium Runs',
    metaDescription:
      'Production machining services for repeatable small-to-medium manufacturing runs, CNC components, tooling details, fixtures, and custom parts.',
    overview:
      'K&C Design and Manufacturing delivers production machining for repeatable small-to-medium runs with inspection support, on-time delivery focus, and customer-focused communication.',
    capabilities: [
      'Small-to-medium production runs',
      'Repeatable CNC machining',
      'Batch manufacturing support',
      'Production inspection support',
      'Custom component manufacturing',
      'On-time delivery focus',
    ],
    applications: [
      'Repeat production parts',
      'Industrial components',
      'Tooling details',
      'Fixture components',
      'Replacement parts',
      'Customer-specific machined components',
    ],
    materials: SHARED_MATERIALS,
    faq: [
      {
        question: 'Does K&C support production machining?',
        answer:
          'Yes. K&C supports repeatable small-to-medium production machining with inspection support and customer-focused communication.',
      },
    ],
    relatedServices: ['cnc-machining', 'cnc-milling', 'cnc-turning', 'tooling'],
  },
];

export function getServiceBySlug(slug) {
  return SEO_SERVICE_PAGES.find((page) => page.slug === slug) ?? null;
}

export function getRelatedServices(slugs) {
  return slugs.map((slug) => getServiceBySlug(slug)).filter(Boolean);
}
