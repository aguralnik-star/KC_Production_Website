import { Award, Crosshair, MapPin, Phone, ShieldCheck, Wrench } from 'lucide-react';
import { COMPANY } from '../../data/company';

const STEPS = [
  'K&C reviews your RFQ and drawings.',
  'We contact you if more details are needed.',
  'Your project is reviewed for machining, tooling, fixture, or gauge requirements.',
  'You receive a quote or next-step follow-up.',
];

const BADGES = [
  { label: 'Founded in 1987', icon: Award },
  { label: 'Addison, IL', icon: MapPin },
  { label: 'Precision CNC Machining', icon: Crosshair },
  { label: 'Fixtures, Gauges & Tooling', icon: Wrench },
  { label: 'Quality Inspection Support', icon: ShieldCheck },
];

export default function RFQTrustPanel() {
  return (
    <aside className="rfq-trust-panel" aria-labelledby="rfq-trust-heading">
      <div className="rfq-trust-panel__inner">
        <h2 id="rfq-trust-heading" className="rfq-trust-panel__title">
          What Happens After You Submit?
        </h2>
        <ol className="rfq-trust-panel__steps">
          {STEPS.map((step, index) => (
            <li key={step}>
              <span className="rfq-trust-panel__step-number" aria-hidden="true">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <ul className="rfq-trust-panel__badges">
          {BADGES.map(({ label, icon: Icon }) => (
            <li key={label}>
              <Icon className="h-4 w-4 shrink-0 text-brand-accent" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        <div className="rfq-trust-panel__contact">
          <p className="rfq-trust-panel__contact-title">Need help?</p>
          <p className="mt-2 flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
            <a href={`tel:${COMPANY.phoneTel}`} className="hover:text-white">
              Call: {COMPANY.phone}
            </a>
          </p>
          <p className="mt-2 text-sm">
            Email:{' '}
            <a href={`mailto:${COMPANY.email}`} className="hover:text-white">
              {COMPANY.email}
            </a>
          </p>
        </div>

        <p className="rfq-trust-panel__privacy">
          Your files are used only to review your RFQ. Uploaded files are stored privately.
        </p>
      </div>
    </aside>
  );
}
