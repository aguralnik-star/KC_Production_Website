import { AlertCircle } from 'lucide-react';
import CTAButton from '../CTAButton';
import { COMPANY } from '../../data/company';

export default function AdditionalInfoExpired({ message }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-amber-600" aria-hidden="true" />
      <h2 className="mt-4 text-2xl font-bold text-charcoal">Link Unavailable</h2>
      <p className="mt-3 text-sm leading-relaxed text-amber-900">
        {message || 'This additional information request link is invalid, expired, or has already been used.'}
      </p>
      <p className="mt-2 text-sm text-metallic">
        Please contact K&amp;C if you still need to provide updated files or information.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <CTAButton href={`mailto:${COMPANY.email}`}>Contact K&amp;C</CTAButton>
        <CTAButton to="/rfq/status" variant="secondary">Check RFQ Status</CTAButton>
      </div>
    </div>
  );
}
