import { Link } from 'react-router-dom';
import { ArrowRight, Clock, FileText, Headphones } from 'lucide-react';

const benefits = [
  { icon: Clock, text: 'Responsive quoting within 1–2 business days' },
  { icon: FileText, text: 'Upload drawings, models, or specifications' },
  { icon: Headphones, text: 'Direct access to our engineering team' },
];

export default function RFQSection() {
  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-accent-dark shadow-xl">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-14">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">Ready to Start?</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Request a Quote for Your Next Project</h2>
              <p className="mt-4 text-lg leading-relaxed text-blue-100">
                Share your project details, material requirements, and timeline. Our team will review your specifications and provide a competitive, accurate quote.
              </p>
              <ul className="mt-8 space-y-4">
                {benefits.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-white">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
                      <Icon className="h-4 w-4" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="mt-10 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-accent shadow-sm transition-all hover:bg-blue-50 hover:shadow-md">
                Submit RFQ
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative hidden bg-charcoal/30 p-8 lg:block lg:p-14">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
              <div className="relative flex h-full flex-col justify-center">
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <p className="text-sm font-medium text-blue-200">What to include in your RFQ</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-300">
                    <li>• Part drawings or 3D models (STEP, IGES, PDF)</li>
                    <li>• Material specification and finish requirements</li>
                    <li>• Quantity and delivery timeline</li>
                    <li>• Tolerance and inspection requirements</li>
                    <li>• Any existing tooling or fixture needs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
