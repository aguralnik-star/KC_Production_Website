import { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import PageHead from '../components/PageHead';
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
    };
  }, [location.state, searchParams]);

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
      <PageHead
        title="RFQ Confirmation | K&C Design and Manufacturing"
        description="Your request for quote has been received by K&C Design and Manufacturing."
      />

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
