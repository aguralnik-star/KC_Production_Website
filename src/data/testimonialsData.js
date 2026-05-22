const CONTENT_METADATA = {
  isRepresentative: true,
  isCustomerApproved: false,
  approvalStatus: 'published',
  publishReady: true,
  sourceType: 'representative',
  confidentialityReviewed: true,
  approvedUsage: ['website'],
};

export const REPRESENTATIVE_TESTIMONIALS = [
  {
    id: 'rep-1',
    quote:
      'K&C is the kind of manufacturing partner we can rely on when quality, communication, and timing matter.',
    role: 'Manufacturing Manager',
    company: 'Representative Midwest Manufacturer',
    ...CONTENT_METADATA,
  },
  {
    id: 'rep-2',
    quote:
      'Their ability to support fixtures, gauges, tooling, and machined components makes them a practical partner for production support.',
    role: 'Quality Engineer',
    company: 'Representative Industrial Customer',
    ...CONTENT_METADATA,
  },
  {
    id: 'rep-3',
    quote:
      'We value responsive quoting, clear communication, and the confidence that parts will be reviewed carefully before delivery.',
    role: 'Operations Lead',
    company: 'Representative Production Customer',
    ...CONTENT_METADATA,
  },
  {
    id: 'rep-4',
    quote:
      'K&C brings practical manufacturing experience to the table and understands the importance of repeatability.',
    role: 'Engineering Manager',
    company: 'Representative OEM Supplier',
    ...CONTENT_METADATA,
  },
];

/** Customer-approved testimonials — add only after explicit customer approval. */
export const REAL_TESTIMONIALS = [];

export function isContentPublishReady(item) {
  return Boolean(
    item?.isCustomerApproved
    && item?.approvalStatus === 'approved'
    && item?.publishReady
    && item?.confidentialityReviewed
    && item?.sourceType === 'real',
  );
}

export function getPublicTestimonials(limit) {
  const approvedReal = REAL_TESTIMONIALS.filter(isContentPublishReady);
  const source = approvedReal.length > 0 ? approvedReal : REPRESENTATIVE_TESTIMONIALS;
  return limit ? source.slice(0, limit) : source;
}

export function getTestimonialDisplayLabel(testimonial) {
  if (testimonial?.isRepresentative || testimonial?.sourceType === 'representative') {
    return 'Representative Example';
  }
  if (isContentPublishReady(testimonial)) {
    return null;
  }
  return 'Representative Example';
}
