import { Link } from 'react-router-dom';
import Quality from '../components/Quality';
import { ArrowRight, ClipboardCheck, ScanLine, FileText, Repeat, TrendingUp, ShieldCheck } from 'lucide-react';

const qualityAreas = [
  {
    icon: ScanLine,
    title: 'Inspection & Verification',
    description: 'Every critical dimension is verified using CMM inspection, calibrated hand tools, and surface plate techniques. First-article inspection is standard for new jobs, with in-process checks throughout production runs.',
    points: ['CMM dimensional inspection', 'First-article inspection reports', 'In-process quality checks', 'Final inspection before shipment'],
  },
  {
    icon: FileText,
    title: 'Documentation & Traceability',
    description: 'We maintain detailed records of inspection results, material certifications, and process parameters. Documentation packages are available to support your quality system and audit requirements.',
    points: ['Inspection reports on request', 'Material certifications available', 'Process documentation for repeat jobs', 'Revision control on customer drawings'],
  },
  {
    icon: Repeat,
    title: 'Repeatability & Consistency',
    description: 'Documented setups, controlled tooling, and standardized programming ensure that part number 1 matches part number 1,000. Our customers depend on consistent quality across every production run.',
    points: ['Documented setup sheets', 'Controlled tooling management', 'Standardized Mastercam programming', 'Periodic process audits'],
  },
  {
    icon: TrendingUp,
    title: 'Continuous Improvement',
    description: 'Quality is never static. We invest in employee training, equipment upgrades, and process refinement to deliver better results, faster turnaround, and fewer surprises for our customers.',
    points: ['Ongoing machinist training', 'Equipment maintenance programs', 'Customer feedback integration', 'Process optimization initiatives'],
  },
];

const commitments = [
  'Parts inspected to your specified tolerances',
  'Non-conforming material identified and segregated',
  'Clear communication on any dimensional concerns',
  'Corrective action for quality issues',
  'Partnership approach to resolving challenges',
];

export default function QualityPage() {
  return (
    <>
      <section className="bg-charcoal py-16 sm:py-20">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <p className="section-label text-accent-light">Quality</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">Quality You Can Measure, Trust You Can Count On</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            At K&amp;C, quality isn&apos;t a checkbox — it&apos;s the foundation of every relationship we build. Precision inspection, thorough documentation, and a commitment to repeatability define how we work.
          </p>
        </div>
      </section>

      <Quality />

      <section className="section-padding">
        <div className="section-container space-y-8">
          {qualityAreas.map(({ icon: Icon, title, description, points }) => (
            <div key={title} className="card overflow-hidden p-0">
              <div className="grid lg:grid-cols-3">
                <div className="border-b border-slate-100 bg-slate-50 p-6 lg:border-b-0 lg:border-r lg:p-8">
                  <Icon className="h-8 w-8 text-accent" />
                  <h2 className="mt-4 text-xl font-bold text-charcoal">{title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-metallic">{description}</p>
                </div>
                <ul className="grid gap-3 p-6 sm:grid-cols-2 lg:col-span-2 lg:p-8">
                  {points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-charcoal">
                      <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-accent" />
              <h2 className="section-title">Our Quality Commitments</h2>
            </div>
            <p className="section-subtitle">Every part that leaves our facility represents our name and our reputation. These commitments guide our team every day.</p>
            <ul className="mt-8 space-y-4">
              {commitments.map((commitment) => (
                <li key={commitment} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor"><path d="M10.28 2.28a.75.75 0 00-1.06-1.06L4.5 6.94 2.78 5.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.75-5.75z" /></svg>
                  </span>
                  <span className="text-charcoal">{commitment}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container text-center">
          <h2 className="section-title">Partner with a Shop That Takes Quality Seriously</h2>
          <p className="section-subtitle mx-auto">Tell us about your tolerance requirements and inspection needs — we&apos;ll build a quality plan into your quote from day one.</p>
          <Link to="/contact" className="btn-primary mt-8">Request a Quote<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
