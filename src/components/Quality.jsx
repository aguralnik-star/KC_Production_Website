import { Link } from 'react-router-dom';
import { CheckCircle2, FileCheck, Target, RefreshCw, ArrowRight } from 'lucide-react';

const pillars = [
  { icon: Target, title: 'Precision Inspection', description: 'CMM and calibrated hand inspection verify every critical dimension before parts leave our facility.' },
  { icon: FileCheck, title: 'Documentation', description: 'Inspection reports, material traceability, and process documentation available upon request.' },
  { icon: CheckCircle2, title: 'Repeatability', description: 'Documented setups and controlled processes ensure consistent results from first article to final run.' },
  { icon: RefreshCw, title: 'Continuous Improvement', description: 'We invest in training, equipment, and process refinement to deliver better results over time.' },
];

export default function Quality({ compact = false }) {
  return (
    <section className={`section-padding ${compact ? 'bg-slate-50' : 'bg-charcoal text-white'}`}>
      <div className="section-container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className={`section-label ${compact ? '' : 'text-accent-light'}`}>Quality Commitment</p>
            <h2 className={`section-title ${compact ? '' : 'text-white'}`}>Built on Precision, Backed by Trust</h2>
            <p className={`mt-4 text-lg leading-relaxed ${compact ? 'text-metallic' : 'text-slate-400'}`}>
              Quality isn&apos;t a department at K&amp;C — it&apos;s embedded in every setup, every cut, and every inspection. Our customers depend on us for parts that fit, function, and perform run after run.
            </p>
            {!compact && (
              <Link to="/quality" className="btn-primary mt-8">
                Our Quality Standards
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map(({ icon: Icon, title, description }) => (
              <div key={title} className={compact ? 'card' : 'rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm'}>
                <Icon className={`mb-3 h-6 w-6 ${compact ? 'text-accent' : 'text-accent-light'}`} />
                <h3 className={`font-semibold ${compact ? 'text-charcoal' : 'text-white'}`}>{title}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${compact ? 'text-metallic' : 'text-slate-400'}`}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
