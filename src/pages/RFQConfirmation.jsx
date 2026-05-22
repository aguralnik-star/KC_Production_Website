import { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import SectionHeading from '../components/SectionHeading';
import CTAButton from '../components/CTAButton';
import RFQConfirmationCard from '../components/RFQConfirmationCard';
import RFQNextSteps from '../components/RFQNextSteps';
import { COMPANY } from '../data/company';

export default function RFQConfirmation() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const confirmation = useMemo(() => {
    const routeState = location.state?.confirmation ?? {};
    const referenceFromQuery = searchParams.get('ref')?.trim() || '';

    return {
      referenceNumber: routeState.referenceNumber || referenceFromQuery,
      submittedAt: routeState.submittedAt || null,
      company: routeState.company || null,
      name: routeState.name || null,
      email: routeState.email || null,
      projectType: routeState.projectType || null,
      timeline: routeState.timeline || null,
      customerConfirmationSent: routeState.customerConfirmationSent ?? null,
      customerConfirmationStatus: routeState.customerConfirmationStatus ?? null,
    };
  }, [location.state, searchParams]);

  const emailNotice = useMemo(() => {
    if (confirmation.customerConfirmationSent === true && confirmation.email) {
      return {
        type: 'success',
        message: `A confirmation email has been sent to ${confirmation.email}.`,
      };
    }

    if (confirmation.customerConfirmationStatus === 'failed') {
      return {
        type: 'warning',
        message: 'Your RFQ was submitted successfully, but the confirmation email could not be sent. Please save your reference number.',
      };
    }

    return null;
  }, [confirmation.customerConfirmationSent, confirmation.customerConfirmationStatus, confirmation.email]);

  const hasDetails = Boolean(
    confirmation.name
    || confirmation.email
    || confirmation.company
    || confirmation.projectType
    || confirmation.timeline
    || confirmation.submittedAt,
  );

  return (
    <>
      <SEO {...PAGE_SEO.rfqConfirmation} />

      <section className="page-hero print:hidden">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="RFQ Confirmation"
            title="Thank you — your RFQ has been received."
            description="Your submission is in our queue for review. Save your reference number below for future communication."
            dark
          />
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container max-w-3xl">
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 print:hidden">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
            <div>
              <p className="font-semibold text-green-900">Submission successful</p>
              <p className="mt-1 text-sm text-green-800">
                {hasDetails
                  ? 'Your RFQ details are shown below.'
                  : 'Your RFQ was submitted successfully. Please reference the number below when contacting us.'}
              </p>
            </div>
          </div>

          {emailNotice && (
            <div
              className={`mb-8 flex items-start gap-3 rounded-xl px-5 py-4 print:hidden ${
                emailNotice.type === 'success'
                  ? 'border border-blue-200 bg-blue-50'
                  : 'border border-amber-200 bg-amber-50'
              }`}
              role="status"
            >
              {emailNotice.type === 'success' ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
              )}
              <p className={`text-sm ${emailNotice.type === 'success' ? 'text-blue-900' : 'text-amber-900'}`}>
                {emailNotice.message}
              </p>
            </div>
          )}

          <div className="space-y-8">
            <RFQConfirmationCard confirmation={confirmation} />
            <RFQNextSteps />

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap print:hidden">
              <CTAButton to="/contact">Submit Another RFQ</CTAButton>
              <CTAButton to="/" variant="secondary">Return to Home</CTAButton>
              <CTAButton href={`mailto:${COMPANY.email}`} variant="secondary">Contact K&amp;C</CTAButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
