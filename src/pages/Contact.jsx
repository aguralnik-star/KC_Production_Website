import { Phone, Mail, MapPin, Printer } from 'lucide-react';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import SectionHeading from '../components/SectionHeading';
import RFQForm from '../components/RFQForm';
import RFQTrustPanel from '../components/rfq/RFQTrustPanel';
import { COMPANY } from '../data/company';
import { trackEmailClick, trackPhoneClick } from '../utils/analytics';

export default function Contact() {
  return (
    <>
      <SEO {...PAGE_SEO.contact} />

      <section className="page-hero">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Contact / RFQ"
            title="Request a Prompt, Competitive Quote"
            description="Complete the form below or call us directly. When you contact K&C, you'll speak with someone knowledgeable who can respond to your needs — no phone maze."
            titleId="contact-hero-heading"
            headingLevel="h1"
            dark
          />
        </div>
      </section>

      <section className="section-padding bg-brand-light">
        <div className="section-container">
          <div className="rfq-contact-layout">
            <div className="order-2 lg:order-1 lg:col-span-7">
              <RFQForm />
            </div>

            <div className="order-1 lg:order-2 lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <RFQTrustPanel />
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="card lg:col-span-2">
              <h2 className="text-xl font-bold text-charcoal">Contact Information</h2>
              <address className="mt-6 grid gap-5 not-italic sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-charcoal">Phone</p>
                    <a
                      href={`tel:${COMPANY.phoneTel}`}
                      className="break-anywhere text-sm text-metallic hover:text-accent"
                      onClick={() => trackPhoneClick('contact_sidebar')}
                    >
                      {COMPANY.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Printer className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-charcoal">Fax</p>
                    <p className="text-sm text-metallic">{COMPANY.fax}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-charcoal">Email</p>
                    <a
                      href={`mailto:${COMPANY.email}`}
                      className="break-anywhere text-sm text-metallic hover:text-accent"
                      onClick={() => trackEmailClick('contact_sidebar')}
                    >
                      {COMPANY.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-charcoal">Location</p>
                    <p className="text-sm text-metallic">
                      {COMPANY.address}
                      <br />
                      {COMPANY.city}
                    </p>
                  </div>
                </div>
              </address>
            </div>

            <div className="card rfq-talk-first-card">
              <h2 className="text-xl font-bold text-charcoal">Prefer to talk first?</h2>
              <p className="mt-3 text-sm leading-relaxed text-metallic">
                Call K&amp;C to discuss your machining, tooling, fixture, or gauge project before submitting drawings.
              </p>
              <a
                href={`tel:${COMPANY.phoneTel}`}
                className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal-light"
                onClick={() => trackPhoneClick('contact_call_card')}
              >
                Call {COMPANY.phone}
              </a>
              <p className="mt-4 text-sm text-metallic">
                Or email{' '}
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="font-semibold text-brand-primary hover:text-brand-accent"
                  onClick={() => trackEmailClick('contact_call_card')}
                >
                  {COMPANY.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
