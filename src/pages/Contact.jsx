import { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Upload, CheckCircle2 } from 'lucide-react';

const projectTypes = ['Prototype', 'Short Run Production', 'Medium Run Production', 'Fixtures & Gauges', 'Tooling', 'Custom Components', 'Other'];
const materials = ['Aluminum', 'Stainless Steel', 'Carbon Steel', 'Tool Steel', 'Brass', 'Copper', 'Bronze', 'Plastic', 'Other / Unsure'];
const timelines = ['ASAP / Rush', '1–2 Weeks', '2–4 Weeks', '1–2 Months', 'Flexible / Planning Stage'];

const initialForm = { name: '', company: '', email: '', phone: '', projectType: '', material: '', quantity: '', timeline: '', notes: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section className="bg-charcoal py-16 sm:py-20">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <p className="section-label text-accent-light">Contact / RFQ</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">Request a Quote</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            Complete the form below with your project details. Our team will review your specifications and respond within 1–2 business days.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-charcoal">Get in Touch</h2>
              <p className="mt-3 leading-relaxed text-metallic">
                Prefer to reach us directly? Call or email our team — we&apos;re happy to discuss your project before you submit a formal RFQ.
              </p>
              <ul className="mt-8 space-y-5">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-medium text-charcoal">Phone</p>
                    <a href="tel:+15551234567" className="text-sm text-metallic hover:text-accent">(555) 123-4567</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-medium text-charcoal">Email</p>
                    <a href="mailto:quotes@kcdesign.com" className="text-sm text-metallic hover:text-accent">quotes@kcdesign.com</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-medium text-charcoal">Location</p>
                    <p className="text-sm text-metallic">1200 Industrial Parkway<br />Manufacturing District, USA 44101</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-medium text-charcoal">Hours</p>
                    <p className="text-sm text-metallic">Monday – Friday, 7:00 AM – 4:30 PM</p>
                  </div>
                </li>
              </ul>
              <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-charcoal">Tips for a faster quote</p>
                <ul className="mt-3 space-y-2 text-sm text-metallic">
                  <li>• Attach drawings or 3D models (STEP, PDF)</li>
                  <li>• Specify material and quantity</li>
                  <li>• Note tolerance and finish requirements</li>
                  <li>• Include your target delivery date</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-3">
              {submitted ? (
                <div className="card flex flex-col items-center py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-charcoal">RFQ Submitted</h2>
                  <p className="mt-3 max-w-md text-metallic">
                    Thank you, {form.name || 'there'}. We&apos;ve received your request and will review your project details. Expect a response within 1–2 business days.
                  </p>
                  <button type="button" className="btn-secondary mt-8" onClick={() => { setForm(initialForm); setSubmitted(false); }}>
                    Submit Another RFQ
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-charcoal">Name <span className="text-accent">*</span></label>
                      <input type="text" id="name" name="name" required value={form.name} onChange={handleChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="Your full name" />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-charcoal">Company</label>
                      <input type="text" id="company" name="company" value={form.company} onChange={handleChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="Company name" />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-charcoal">Email <span className="text-accent">*</span></label>
                      <input type="email" id="email" name="email" required value={form.email} onChange={handleChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="you@company.com" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-charcoal">Phone</label>
                      <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="(555) 123-4567" />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="projectType" className="block text-sm font-medium text-charcoal">Project Type</label>
                      <select id="projectType" name="projectType" value={form.projectType} onChange={handleChange} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20">
                        <option value="">Select project type</option>
                        {projectTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="material" className="block text-sm font-medium text-charcoal">Material</label>
                      <select id="material" name="material" value={form.material} onChange={handleChange} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20">
                        <option value="">Select material</option>
                        {materials.map((mat) => <option key={mat} value={mat}>{mat}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-charcoal">Quantity</label>
                      <input type="text" id="quantity" name="quantity" value={form.quantity} onChange={handleChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="e.g. 1, 25, 500+" />
                    </div>
                    <div>
                      <label htmlFor="timeline" className="block text-sm font-medium text-charcoal">Timeline</label>
                      <select id="timeline" name="timeline" value={form.timeline} onChange={handleChange} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20">
                        <option value="">Select timeline</option>
                        {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-charcoal">Project Notes</label>
                    <textarea id="notes" name="notes" rows={5} value={form.notes} onChange={handleChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="Describe your project, tolerance requirements, finish specs, and any other details..." />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal">File Upload</label>
                    <div className="mt-1.5 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 transition-colors hover:border-accent/40 hover:bg-slate-100">
                      <Upload className="h-8 w-8 text-metallic" />
                      <p className="mt-3 text-sm font-medium text-charcoal">Drag and drop files here, or click to browse</p>
                      <p className="mt-1 text-xs text-metallic">PDF, STEP, IGES, DWG, DXF — up to 25 MB (frontend placeholder)</p>
                      <input type="file" className="mt-4 text-sm text-metallic file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-accent-dark" multiple disabled title="File upload will be enabled with backend integration" />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full sm:w-auto">Submit RFQ</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
