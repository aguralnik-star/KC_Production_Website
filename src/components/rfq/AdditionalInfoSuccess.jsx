import { CheckCircle2 } from 'lucide-react';
import CTAButton from '../CTAButton';
import { COMPANY } from '../../data/company';

export default function AdditionalInfoSuccess() {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" aria-hidden="true" />
      <h2 className="mt-4 text-2xl font-bold text-charcoal">Submission Received</h2>
      <p className="mt-3 text-sm leading-relaxed text-charcoal">
        Thank you. Your additional information has been submitted to K&amp;C Design and Manufacturing.
      </p>
      <p className="mt-2 text-sm text-metallic">
        Our team will review your updated files and notes. If we need anything else, we will contact you directly.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <CTAButton href={`mailto:${COMPANY.email}`}>Contact K&amp;C</CTAButton>
        <CTAButton to="/" variant="secondary">Return Home</CTAButton>
      </div>
    </div>
  );
}
