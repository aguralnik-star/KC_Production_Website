import { Calendar, TrendingUp, MapPin, Handshake } from 'lucide-react';

const milestones = [
  { year: '1987', event: 'K&C Design & Manufacturing founded as a family-owned precision shop.' },
  { year: '1992', event: 'CNC machining capabilities added, expanding into production manufacturing.' },
  { year: '2000s', event: 'Continued facility growth with additional Haas equipment and inspection capacity.' },
  { year: 'Today', event: 'Serving customers nationwide with CNC milling, turning, fixtures, and tooling.' },
];

export default function Credibility() {
  return (
    <section className="section-padding border-b border-slate-100">
      <div className="section-container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="section-label">Why K&amp;C</p>
            <h2 className="section-title">A Manufacturing Partner Built on Experience</h2>
            <p className="section-subtitle">
              For over three decades, K&amp;C has grown from a small family operation into a full-service precision manufacturer — without losing the personal accountability our customers value.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Calendar, label: 'Est. 1987', sub: 'Family-owned heritage' },
                { icon: TrendingUp, label: 'Since 1992', sub: 'CNC machining expertise' },
                { icon: MapPin, label: 'Made in USA', sub: 'American manufacturing' },
                { icon: Handshake, label: 'Long-Term Partners', sub: 'Repeat customer relationships' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-semibold text-charcoal">{label}</p>
                    <p className="text-sm text-metallic">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-slate-200 sm:left-6" />
            <div className="space-y-8">
              {milestones.map(({ year, event }) => (
                <div key={year} className="relative flex gap-6 pl-10 sm:pl-14">
                  <div className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-white sm:left-4.5" />
                  <div>
                    <p className="text-sm font-bold text-accent">{year}</p>
                    <p className="mt-1 text-sm leading-relaxed text-metallic">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
