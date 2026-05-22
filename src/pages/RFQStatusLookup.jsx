import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import PageHead from '../components/PageHead';
import SectionHeading from '../components/SectionHeading';
import CTAButton from '../components/CTAButton';
import RFQStatusLookupForm from '../components/RFQStatusLookupForm';
import RFQStatusResultCard from '../components/RFQStatusResultCard';
import { COMPANY } from '../data/company';

export default function RFQStatusLookup() {
  const [result, setResult] = useState(null);
  const [notFoundMessage, setNotFoundMessage] = useState('');

  const handleResult = (data) => {
    setResult(data);
    setNotFoundMessage('');
  };

  const handleNotFound = (message) => {
    setResult(null);
    setNotFoundMessage(
      message || 'We could not locate an RFQ using that reference number and email combination.',
    );
  };

  const handleReset = () => {
    setResult(null);
    setNotFoundMessage('');
  };

  return (
    <>
      <PageHead
        title="Check RFQ Status | K&C Design and Manufacturing"
        description="Check your RFQ status securely using your reference number and email address."
      />

      <section className="page-hero">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="RFQ Status"
            title="Check Your RFQ Status"
            description="Enter your RFQ reference number and the email address used during submission."
            dark
          />
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container max-w-3xl space-y-8">
          {!result ? (
            <>
              <RFQStatusLookupForm
                onResult={handleResult}
                onNotFound={handleNotFound}
                onError={() => setNotFoundMessage('')}
              />

              {notFoundMessage && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900" role="status">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  {notFoundMessage}
                </div>
              )}
            </>
          ) : (
            <>
              <RFQStatusResultCard result={result} />

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <CTAButton href={`mailto:${COMPANY.email}`}>Contact K&amp;C</CTAButton>
                <CTAButton to="/contact" variant="secondary">Submit Another RFQ</CTAButton>
                <CTAButton type="button" variant="secondary" onClick={handleReset}>
                  Check Another RFQ
                </CTAButton>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
