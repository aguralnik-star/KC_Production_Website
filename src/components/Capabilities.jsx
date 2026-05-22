import { ArrowRight, Cpu, Factory, FlaskConical, RotateCw, Ruler, Wrench } from 'lucide-react';
import CapabilityCard from './CapabilityCard';
import CTAButton from './CTAButton';
import SectionHeading from './SectionHeading';
import { CAPABILITIES, MATERIALS } from '../data/company';

const capabilityIcons = [Cpu, RotateCw, FlaskConical, Factory, Ruler, Wrench];

export default function Capabilities({
  showHeadingActions = true,
  showMaterials = true,
  className = '',
}) {
  return (
    <section className={`section-padding bg-brand-light ${className}`.trim()} aria-labelledby="capabilities-heading">
      <div className="section-container">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            label="Capabilities"
            title="Precision Machining & Manufacturing"
            description="From CNC milling and turning to custom fixtures, gauges, and production tooling — K&C delivers the precision and service Midwest manufacturers depend on."
          />
          {showHeadingActions ? (
            <CTAButton to="/capabilities" variant="secondary" className="shrink-0">
              All Capabilities
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CTAButton>
          ) : null}
        </div>

        <div id="capabilities-heading" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((cap, i) => (
            <CapabilityCard key={cap.title} icon={capabilityIcons[i]} {...cap} />
          ))}
        </div>

        {showMaterials ? (
          <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-metallic">Materials We Machine</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {MATERIALS.map((material) => (
                <span
                  key={material}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-charcoal"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
