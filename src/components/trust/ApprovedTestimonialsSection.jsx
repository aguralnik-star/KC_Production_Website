import { useEffect, useState } from 'react';
import { mapPublishedTestimonial } from '../../data/testimonialWorkflowData';
import { getRepresentativeTestimonials } from '../../data/testimonialsData';
import { getPublishedTestimonials } from '../../services/testimonialService';
import TestimonialSection from './TestimonialSection';

export default function ApprovedTestimonialsSection({
  limit,
  showSectionNote = true,
  variant = 'light',
  eyebrow,
  title,
  description,
  className = '',
  approvedDescription = 'Customer-approved testimonials published with documented permission and confidentiality review.',
  representativeDescription = 'These examples reflect representative feedback themes — not verified customer endorsements.',
}) {
  const [published, setPublished] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getPublishedTestimonials()
      .then((rows) => {
        if (!cancelled) {
          setPublished(rows.map(mapPublishedTestimonial));
          setLoadFailed(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPublished([]);
          setLoadFailed(true);
        }
      });

    return () => { cancelled = true; };
  }, []);

  if (published === null) {
    return (
      <TestimonialSection
        limit={limit}
        showSectionNote={showSectionNote}
        variant={variant}
        eyebrow={eyebrow}
        title={title}
        description={description ?? representativeDescription}
        className={className}
        testimonials={getRepresentativeTestimonials(limit)}
      />
    );
  }

  const hasApproved = published.length > 0 && !loadFailed;
  const items = hasApproved ? (limit ? published.slice(0, limit) : published) : getRepresentativeTestimonials(limit);

  return (
    <TestimonialSection
      limit={limit}
      showSectionNote={showSectionNote && !hasApproved}
      variant={variant}
      eyebrow={hasApproved ? (eyebrow ?? 'Customer Testimonials') : eyebrow}
      title={title}
      description={hasApproved ? approvedDescription : (description ?? representativeDescription)}
      className={className}
      testimonials={items}
      useApprovedCard={hasApproved}
    />
  );
}
