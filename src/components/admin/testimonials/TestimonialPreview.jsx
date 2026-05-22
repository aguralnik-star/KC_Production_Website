import { mapPublishedTestimonial } from '../../../data/testimonialWorkflowData';
import ApprovedTestimonialCard from '../../trust/ApprovedTestimonialCard';

export default function TestimonialPreview({ testimonial }) {
  if (!testimonial) {
    return <p className="text-sm text-metallic">Select a testimonial to preview public display.</p>;
  }

  const publicItem = mapPublishedTestimonial(testimonial);

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm" aria-label="Testimonial preview">
      <h3 className="text-lg font-bold text-charcoal">Preview</h3>
      <p className="mt-1 text-sm text-metallic">Public view — internal notes, customer email, and approval details are hidden.</p>
      <div className="mt-4 max-w-xl">
        <ApprovedTestimonialCard testimonial={publicItem} />
      </div>
    </section>
  );
}
