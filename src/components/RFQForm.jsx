import { useState } from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';
import CTAButton from './CTAButton';

const projectTypes = [
  'Prototype',
  'Short Run Production',
  'Production Machining',
  'Fixtures & Gauges',
  'Production Tooling',
  'Custom Components',
  'Other',
];

const materials = [
  'Aluminum',
  'Stainless Steel',
  'Carbon Steel',
  'Tool Steel',
  'Brass',
  'Copper',
  'Bronze',
  'Plastic',
  'Other / Unsure',
];

const timelines = ['ASAP / Rush', '1–2 Weeks', '2–4 Weeks', '1–2 Months', 'Flexible / Planning Stage'];

const initialForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  projectType: '',
  material: '',
  quantity: '',
  timeline: '',
  notes: '',
};

const inputClass =
  'mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';

export default function RFQForm() {
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

  if (submitted) {
    return (
      <div className="card flex flex-col items-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-charcoal">RFQ Submitted</h2>
        <p className="mt-3 max-w-md text-metallic">
          Thank you, {form.name || 'there'}. We&apos;ve received your request and will respond promptly — typically within one business day.
        </p>
        <CTAButton
          variant="secondary"
          className="mt-8"
          onClick={() => {
            setForm(initialForm);
            setSubmitted(false);
          }}
        >
          Submit Another RFQ
        </CTAButton>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6" aria-label="Request for quote form">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-charcoal">
            Name <span className="text-accent">*</span>
          </label>
          <input type="text" id="name" name="name" required value={form.name} onChange={handleChange} className={inputClass} placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-charcoal">Company</label>
          <input type="text" id="company" name="company" value={form.company} onChange={handleChange} className={inputClass} placeholder="Company name" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-charcoal">
            Email <span className="text-accent">*</span>
          </label>
          <input type="email" id="email" name="email" required value={form.email} onChange={handleChange} className={inputClass} placeholder="you@company.com" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-charcoal">Phone</label>
          <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="(630) 543-3386" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="projectType" className="block text-sm font-medium text-charcoal">Project Type</label>
          <select id="projectType" name="projectType" value={form.projectType} onChange={handleChange} className={`${inputClass} bg-white`}>
            <option value="">Select project type</option>
            {projectTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="material" className="block text-sm font-medium text-charcoal">Material</label>
          <select id="material" name="material" value={form.material} onChange={handleChange} className={`${inputClass} bg-white`}>
            <option value="">Select material</option>
            {materials.map((mat) => <option key={mat} value={mat}>{mat}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-charcoal">Quantity</label>
          <input type="text" id="quantity" name="quantity" value={form.quantity} onChange={handleChange} className={inputClass} placeholder="e.g. 1, 25, 500+" />
        </div>
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-charcoal">Timeline</label>
          <select id="timeline" name="timeline" value={form.timeline} onChange={handleChange} className={`${inputClass} bg-white`}>
            <option value="">Select timeline</option>
            {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-charcoal">Project Notes</label>
        <textarea id="notes" name="notes" rows={5} value={form.notes} onChange={handleChange} className={inputClass} placeholder="Describe your project, tolerances, finish requirements, and delivery needs..." />
      </div>

      <div>
        <span className="block text-sm font-medium text-charcoal">File Upload</span>
        <div className="mt-1.5 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10">
          <Upload className="h-8 w-8 text-metallic" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-charcoal">Drag and drop files here, or click to browse</p>
          <p className="mt-1 text-xs text-metallic">PDF, STEP, IGES, DWG, DXF — frontend placeholder only</p>
          <input type="file" className="mt-4 text-sm text-metallic file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" multiple disabled aria-label="File upload placeholder" />
        </div>
      </div>

      <CTAButton type="submit" className="w-full sm:w-auto">Submit RFQ</CTAButton>
    </form>
  );
}
