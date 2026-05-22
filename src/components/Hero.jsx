import { ArrowRight } from 'lucide-react';
import CTAButton from './CTAButton';
import { COMPANY, CREDIBILITY } from '../data/company';

export default function Hero() {
  return (
    <section className="relative overflow-hidden hero-gradient">
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_55%)]" aria-hidden="true" />

      <div className="section-padding relative">
        <div className="section-container">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent-light">
                {COMPANY.shortName}
              </p>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
                Precision Machining Built on Quality, Service, and Long-Term Trust
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
                K&amp;C Design and Manufacturing provides precision CNC machining, tooling, fixtures, gauges, and custom manufacturing services for industries across the Midwest.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CTAButton to="/contact">
                  Request a Quote
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton to="/capabilities" variant="light">
                  View Capabilities
                </CTAButton>
              </div>
            </div>

            <div className="relative" aria-hidden="true">
              <div className="cnc-panel aspect-[4/3] shadow-2xl">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(59,130,246,0.08)_50%,transparent_60%)]" />
                <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                  <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                    <svg viewBox="0 0 64 64" className="h-12 w-12 text-accent-light" fill="none" stroke="currentColor" strokeWidth="1.25">
                      <rect x="10" y="22" width="44" height="28" rx="2" />
                      <path d="M18 22V14h28v8" />
                      <circle cx="32" cy="36" r="9" />
                      <path d="M32 27v3M32 42v3M23 36h3M38 36h3" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-white">Haas CNC Machining Centers</p>
                  <p className="mt-1 text-sm text-slate-400">Milling • Turning • Inspection</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-xl border border-white/10 bg-charcoal-light px-5 py-4 shadow-xl sm:-bottom-6 sm:-left-6">
                <p className="text-sm font-medium text-slate-400">Addison, Illinois</p>
                <p className="text-lg font-bold text-white">Since {COMPANY.founded}</p>
              </div>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 border-t border-white/10 pt-10 sm:grid-cols-4">
            {CREDIBILITY.map(({ value, label }) => (
              <div key={value} className="text-center sm:text-left">
                <p className="text-lg font-bold text-white sm:text-xl">{value}</p>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
