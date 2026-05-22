import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import SectionHeading from '../components/SectionHeading';
import AdditionalInfoRequestCard from '../components/rfq/AdditionalInfoRequestCard';
import AdditionalInfoUploadForm from '../components/rfq/AdditionalInfoUploadForm';
import AdditionalInfoSuccess from '../components/rfq/AdditionalInfoSuccess';
import AdditionalInfoExpired from '../components/rfq/AdditionalInfoExpired';
import { validateAdditionalInfoToken } from '../services/additionalInfoService';

export default function AdditionalInfoUpload() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState(null);
  const [invalidMessage, setInvalidMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadToken() {
      setLoading(true);
      setInvalidMessage('');
      setRequestData(null);
      setSubmitted(false);

      try {
        const result = await validateAdditionalInfoToken(token);
        if (!active) return;

        if (result?.valid) {
          setRequestData(result);
        } else {
          setInvalidMessage(result?.message || 'This additional information request link is invalid, expired, or has already been used.');
        }
      } catch {
        if (active) {
          setInvalidMessage('This additional information request link is invalid, expired, or has already been used.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (token) {
      loadToken();
    } else {
      setLoading(false);
      setInvalidMessage('This additional information request link is invalid, expired, or has already been used.');
    }

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <>
      <SEO {...PAGE_SEO.additionalInfo} />

      <section className="page-hero">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Secure Upload"
            title="Provide Additional RFQ Information"
            description="Use this secure link to upload revised files or provide the additional details requested by our team."
            dark
          />
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container max-w-3xl">
          {loading ? (
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Validating secure link" />
            </div>
          ) : submitted ? (
            <AdditionalInfoSuccess />
          ) : invalidMessage ? (
            <AdditionalInfoExpired message={invalidMessage} />
          ) : (
            <div className="space-y-8">
              <AdditionalInfoRequestCard requestData={requestData} />
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-charcoal">Upload Form</h2>
                <p className="mt-1 text-sm text-metallic">
                  Confirm your contact details, add notes, and upload any requested files before the link expires.
                </p>
                <div className="mt-6">
                  <AdditionalInfoUploadForm
                    requestToken={token}
                    requestData={requestData}
                    onSuccess={() => setSubmitted(true)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
