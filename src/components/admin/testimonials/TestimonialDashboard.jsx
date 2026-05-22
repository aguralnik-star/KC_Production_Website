import { MessageSquareQuote, Plus } from 'lucide-react';
import AccessibleButton from '../../AccessibleButton';
import TestimonialStatusBadge from './TestimonialStatusBadge';

export default function TestimonialDashboard({ testimonials, selectedId, onSelect, onCreate, creating }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-charcoal">Testimonials</h3>
          <p className="text-sm text-metallic">Capture, review, and publish customer-approved testimonials only.</p>
        </div>
        <AccessibleButton type="button" onClick={onCreate} disabled={creating} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" aria-hidden="true" />
          {creating ? 'Creating…' : 'New Testimonial'}
        </AccessibleButton>
      </div>

      {!testimonials.length ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-metallic">
          No testimonials tracked yet. Representative testimonials remain visible on the public site.
        </p>
      ) : (
        <ul className="space-y-2">
          {testimonials.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${selectedId === item.id ? 'border-accent bg-accent/5' : 'border-slate-200 bg-white hover:border-accent/40'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <MessageSquareQuote className="mt-0.5 h-4 w-4 text-accent" aria-hidden="true" />
                    <div>
                      <p className="line-clamp-2 text-sm font-medium text-charcoal">{item.quote}</p>
                      <p className="mt-1 text-xs text-metallic">{item.customer_company || item.customer_name || 'Draft testimonial'}</p>
                    </div>
                  </div>
                  <TestimonialStatusBadge status={item.status} />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
