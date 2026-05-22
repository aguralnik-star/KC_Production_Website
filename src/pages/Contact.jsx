import { Phone, Mail, MapPin, Printer } from 'lucide-react';
import PageHead from '../components/PageHead';
import SectionHeading from '../components/SectionHeading';
import RFQForm from '../components/RFQForm';
import { COMPANY } from '../data/company';

export default function Contact() {
  return (
    <>
      <PageHead
        title="Contact & Request a Quote | K&C Design and Manufacturing"
        description="Contact K&C at (630) 543-3386 or submit an RFQ. 422 S. Irmen Drive, Addison, IL 60101."
      />

      <section className="page-hero">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Contact / RFQ"
            title="Request a Prompt, Competitive Quote"
            description="Complete the form below or call us directly. When you contact K&C, you'll speak with someone knowledgeable who can respond to your needs — no phone maze."
            dark
          />
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid gap-12 lg:grid-cols-5">
            <aside className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-charcoal">Get in Touch</h2>
              <p className="mt-3 leading-relaxed text-metallic">
                What can we help you with? Call us or email — we respond quickly and provide prompt quotations.
              </p>

              <address className="mt-8 space-y-5 not-italic">
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-charcoal">Phone</p>
                    <a href={`tel:${COMPANY.phoneTel}`} className="text-sm text-metallic hover:text-accent">{COMPANY.phone}</a>
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
                    <a href={`mailto:${COMPANY.email}`} className="text-sm text-metallic hover:text-accent">{COMPANY.email}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-charcoal">Location</p>
                    <p className="text-sm text-metallic">{COMPANY.address}<br />{COMPANY.city}</p>
                  </div>
                </div>
              </address>

              <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-sm font-semibold text-charcoal">Tips for a faster quote</h3>
                <ul className="mt-3 space-y-2 text-sm text-metallic">
                  <li>• Attach drawings or 3D models (PDF, STEP, DWG, DXF, ZIP)</li>
                  <li>• Up to 5 files, 20 MB each</li>
                  <li>• Specify material and quantity</li>
                  <li>• Note tolerance and finish requirements</li>
                  <li>• Include your target delivery date</li>
                </ul>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <RFQForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
