import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users } from 'lucide-react';

const stats = [
  { value: '1987', label: 'Founded' },
  { value: '35+', label: 'Years of Experience' },
  { value: '1992', label: 'Machining Since' },
  { value: '100%', label: 'Made in USA' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-charcoal">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.12),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="section-padding relative">
        <div className="section-container">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
                <Shield className="h-4 w-4 text-accent-light" />
                Family-Owned American Manufacturing
              </div>

              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Precision CNC Machining You Can <span className="text-accent-light">Trust</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
                K&amp;C Design &amp; Manufacturing delivers tight-tolerance machined components, custom fixtures, gauges, and production tooling for industries that demand reliability and repeatability.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/contact" className="btn-primary">
                  Request a Quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/capabilities" className="btn-secondary border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30">
                  View Capabilities
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2"><Award className="h-4 w-4 text-accent-light" />ISO-Aligned Processes</span>
                <span className="flex items-center gap-2"><Users className="h-4 w-4 text-accent-light" />Multi-Generational Expertise</span>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-700 via-slate-800 to-charcoal">
                  <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                      <svg viewBox="0 0 64 64" className="h-10 w-10 text-accent-light" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="8" y="20" width="48" height="32" rx="2" />
                        <path d="M16 20V12h32v8" />
                        <circle cx="32" cy="36" r="10" />
                        <path d="M32 26v4M32 42v4M22 36h4M38 36h4" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-white">Haas CNC Equipment</p>
                    <p className="mt-1 text-sm text-slate-400">Milling • Turning • Inspection</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-xl border border-white/10 bg-charcoal-light p-4 shadow-xl sm:-bottom-6 sm:-left-6">
                <p className="text-2xl font-bold text-white">±0.0005&quot;</p>
                <p className="text-xs text-slate-400">Typical Tolerance Capability</p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 border-t border-white/10 pt-10 sm:grid-cols-4 sm:gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center sm:text-left">
                <p className="text-2xl font-bold text-white sm:text-3xl">{value}</p>
                <p className="mt-1 text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
