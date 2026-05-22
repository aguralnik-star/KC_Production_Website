import {
  Award,
  CalendarClock,
  Factory,
  Handshake,
  MapPin,
  Microscope,
  Route,
  ShieldCheck,
} from 'lucide-react';

export const TRUST_SIGNALS = [
  {
    id: 'founded-1987',
    title: 'Founded in 1987',
    description:
      'Decades of manufacturing experience serving customer needs across machining, tooling, fixtures, gauges, and custom components.',
    icon: Award,
  },
  {
    id: 'family-owned',
    title: 'Family-Owned Manufacturing Partner',
    description:
      'Hands-on service, direct communication, and long-term customer relationships.',
    icon: Handshake,
  },
  {
    id: 'precision-cnc',
    title: 'Precision CNC Machining',
    description:
      'CNC milling, CNC turning, tooling, fixture, gauge, prototype, and production machining support.',
    icon: Factory,
  },
  {
    id: 'inspection-quality',
    title: 'Inspection-Driven Quality',
    description:
      'Quality supported by CMM inspection, gauging, optical comparison, and precision measuring tools.',
    icon: Microscope,
  },
  {
    id: 'prompt-quotations',
    title: 'Prompt Quotations',
    description:
      'Responsive RFQ review and practical communication throughout the quoting process.',
    icon: CalendarClock,
  },
  {
    id: 'on-time-delivery',
    title: 'On-Time Delivery Focus',
    description:
      'Production planning and communication built around dependable delivery.',
    icon: Route,
  },
  {
    id: 'midwest-support',
    title: 'Midwest Manufacturing Support',
    description:
      'Located in Addison, Illinois and serving manufacturers across the Midwest.',
    icon: MapPin,
  },
  {
    id: 'prototype-production',
    title: 'Prototype to Production',
    description:
      'Support for early-stage prototypes, short-run machining, and small-to-medium production needs.',
    icon: ShieldCheck,
  },
];

export const CREDIBILITY_BAND_ITEMS = [
  { label: 'Founded in 1987' },
  { label: 'Addison, IL' },
  { label: 'CNC Machining' },
  { label: 'Fixtures & Gauges' },
  { label: 'Quality Inspection' },
];

export const INSPECTION_TRUST_SIGNAL_IDS = [
  'inspection-quality',
  'prompt-quotations',
  'on-time-delivery',
  'precision-cnc',
];

export const TESTIMONIAL_SECTION_NOTE =
  'Representative feedback themes based on the type of customer experience K&C is built to provide. Replace with approved customer testimonials when available.';

export function getTrustSignalsByIds(ids) {
  return TRUST_SIGNALS.filter((signal) => ids.includes(signal.id));
}
