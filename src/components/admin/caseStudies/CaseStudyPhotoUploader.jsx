import { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { MAX_CASE_STUDY_PHOTOS, PHOTO_CATEGORIES } from '../../../data/caseStudyData';
import AccessibleButton from '../../AccessibleButton';

const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

export default function CaseStudyPhotoUploader({ caseStudyId, photoCount, onUpload, uploading }) {
  const [metadata, setMetadata] = useState({ alt_text: '', caption: '', category: '' });
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(async (files) => {
    const file = files?.[0];
    if (!file) return;
    await onUpload(file, metadata);
    setMetadata({ alt_text: '', caption: '', category: metadata.category });
  }, [metadata, onUpload]);

  const onDrop = async (event) => {
    event.preventDefault();
    setDragOver(false);
    await handleFiles(event.dataTransfer.files);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Photo upload">
      <h3 className="text-lg font-bold text-charcoal">4. Photo Upload</h3>
      <p className="mt-1 text-sm text-metallic">
        Max {MAX_CASE_STUDY_PHOTOS} photos · 10MB each · JPG, JPEG, PNG, WEBP · Alt text and category required.
      </p>
      <p className="mt-1 text-xs text-metallic">{photoCount}/{MAX_CASE_STUDY_PHOTOS} photos uploaded</p>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Alt Text *
          <input type="text" value={metadata.alt_text} onChange={(e) => setMetadata((m) => ({ ...m, alt_text: e.target.value }))} className={`mt-1 ${inputClass}`} required />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Caption
          <input type="text" value={metadata.caption} onChange={(e) => setMetadata((m) => ({ ...m, caption: e.target.value }))} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Category *
          <select value={metadata.category} onChange={(e) => setMetadata((m) => ({ ...m, category: e.target.value }))} className={`mt-1 ${inputClass}`} required>
            <option value="">Select category</option>
            {PHOTO_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center ${dragOver ? 'border-accent bg-accent/5' : 'border-slate-200 bg-slate-50'}`}
      >
        <Upload className="h-8 w-8 text-metallic" aria-hidden="true" />
        <p className="mt-3 text-sm font-medium text-charcoal">Drag and drop a photo here</p>
        <label className="mt-3">
          <span className="sr-only">Choose photo file</span>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="text-sm"
            disabled={uploading || photoCount >= MAX_CASE_STUDY_PHOTOS}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
        {uploading ? <p className="mt-2 text-xs text-metallic">Uploading…</p> : null}
      </div>
    </section>
  );
}
