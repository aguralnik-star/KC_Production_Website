import {
  Car,
  Cpu,
  Droplets,
  Factory,
  Gauge,
  HeartPulse,
  Package,
  ScanSearch,
  Shield,
  Truck,
  UtensilsCrossed,
  Cog,
} from 'lucide-react';

const SERVICE_LINKS = {
  cncMachining: { label: 'CNC Machining', slug: 'cnc-machining' },
  cncMilling: { label: 'CNC Milling', slug: 'cnc-milling' },
  cncTurning: { label: 'CNC Turning', slug: 'cnc-turning' },
  tooling: { label: 'Tooling', slug: 'tooling' },
  fixtures: { label: 'Fixtures', slug: 'fixtures' },
  gauges: { label: 'Gauges', slug: 'gauges' },
  prototype: { label: 'Prototype Machining', slug: 'prototype-machining' },
  production: { label: 'Production Machining', slug: 'production-machining' },
};

export const INDUSTRIES_SERVED = [
  {
    id: 'transportation',
    name: 'Transportation',
    description:
      'Precision machined components, fixtures, tooling, and inspection support for transportation-related manufacturing needs.',
    commonProjectTypes: ['Machined components', 'Fixtures', 'Tooling details', 'Inspection gauges'],
    relatedServices: [SERVICE_LINKS.cncMachining, SERVICE_LINKS.fixtures, SERVICE_LINKS.gauges],
    icon: Truck,
  },
  {
    id: 'medical',
    name: 'Medical',
    description:
      'Machined parts, fixtures, and tooling support for medical device and healthcare-related manufacturing applications.',
    commonProjectTypes: ['Precision components', 'Inspection fixtures', 'Prototype parts', 'Production details'],
    relatedServices: [SERVICE_LINKS.cncMachining, SERVICE_LINKS.prototype, SERVICE_LINKS.fixtures],
    icon: HeartPulse,
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description:
      'Production components, fixtures, tooling, and gauge support for automotive suppliers and related manufacturers.',
    commonProjectTypes: ['Production components', 'Manufacturing fixtures', 'Tooling details', 'Gauge components'],
    relatedServices: [SERVICE_LINKS.production, SERVICE_LINKS.tooling, SERVICE_LINKS.fixtures],
    icon: Car,
  },
  {
    id: 'hydraulics',
    name: 'Hydraulics',
    description:
      'Complex hydraulic components, manifolds, and machined details for fluid power and related industrial applications.',
    commonProjectTypes: ['Manifold components', 'Machined blocks', 'Fittings and adapters', 'Prototype details'],
    relatedServices: [SERVICE_LINKS.cncMilling, SERVICE_LINKS.cncTurning, SERVICE_LINKS.prototype],
    icon: Droplets,
  },
  {
    id: 'valves',
    name: 'Valves',
    description:
      'Precision valve bodies, components, and related machined details for industrial valve manufacturing support.',
    commonProjectTypes: ['Valve bodies', 'Machined components', 'Inspection fixtures', 'Production details'],
    relatedServices: [SERVICE_LINKS.cncMachining, SERVICE_LINKS.production, SERVICE_LINKS.gauges],
    icon: Cog,
  },
  {
    id: 'heavy-equipment',
    name: 'Heavy Equipment',
    description:
      'Durable machined parts, tooling, and fixture support for heavy equipment and off-highway manufacturing needs.',
    commonProjectTypes: ['Structural components', 'Replacement parts', 'Tooling details', 'Production machining'],
    relatedServices: [SERVICE_LINKS.cncMachining, SERVICE_LINKS.production, SERVICE_LINKS.tooling],
    icon: Factory,
  },
  {
    id: 'material-handling',
    name: 'Material Handling',
    description:
      'Components and fixtures for conveyors, lifts, handling systems, and related industrial equipment applications.',
    commonProjectTypes: ['Machined components', 'Assembly fixtures', 'Wear parts', 'Tooling support'],
    relatedServices: [SERVICE_LINKS.cncMachining, SERVICE_LINKS.fixtures, SERVICE_LINKS.tooling],
    icon: Package,
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description:
      'Tight-tolerance components, enclosures, and fixture support for electronics manufacturing and assembly applications.',
    commonProjectTypes: ['Precision components', 'Enclosure details', 'Assembly fixtures', 'Prototype parts'],
    relatedServices: [SERVICE_LINKS.cncMilling, SERVICE_LINKS.prototype, SERVICE_LINKS.fixtures],
    icon: Cpu,
  },
  {
    id: 'food-service',
    name: 'Food Service',
    description:
      'Machined components for food service equipment and commercial kitchen-related manufacturing applications.',
    commonProjectTypes: ['Machined components', 'Assembly details', 'Replacement parts', 'Fixture components'],
    relatedServices: [SERVICE_LINKS.cncMachining, SERVICE_LINKS.production, SERVICE_LINKS.cncTurning],
    icon: UtensilsCrossed,
  },
  {
    id: 'military',
    name: 'Military',
    description:
      'Precision machining support for military-related industrial applications. Industry served only — not a certification or compliance claim.',
    commonProjectTypes: ['Machined components', 'Fixtures', 'Tooling details', 'Inspection gauges'],
    relatedServices: [SERVICE_LINKS.cncMachining, SERVICE_LINKS.fixtures, SERVICE_LINKS.gauges],
    icon: Shield,
  },
  {
    id: 'custom-inspection-fixtures',
    name: 'Custom Inspection Fixtures',
    description:
      'Purpose-built inspection and assembly fixtures designed to support repeatable quality verification and production workflows.',
    commonProjectTypes: ['Inspection fixtures', 'Assembly fixtures', 'Functional check fixtures', 'Gauge integration'],
    relatedServices: [SERVICE_LINKS.fixtures, SERVICE_LINKS.gauges, SERVICE_LINKS.cncMachining],
    icon: ScanSearch,
  },
  {
    id: 'gauges',
    name: 'Gauges',
    description:
      'Custom go/no-go gauges and measurement tools built to customer specifications for production and inspection support.',
    commonProjectTypes: ['Go/no-go gauges', 'Custom measurement tools', 'Inspection gauges', 'Production checking'],
    relatedServices: [SERVICE_LINKS.gauges, SERVICE_LINKS.fixtures, SERVICE_LINKS.cncMachining],
    icon: Gauge,
  },
];

export function getIndustryById(id) {
  return INDUSTRIES_SERVED.find((industry) => industry.id === id);
}

export function getIndustriesForService(slug) {
  return INDUSTRIES_SERVED.filter((industry) =>
    industry.relatedServices.some((service) => service.slug === slug),
  ).slice(0, 6);
}
