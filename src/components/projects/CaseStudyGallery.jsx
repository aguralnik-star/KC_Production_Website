import { useState } from 'react';

export default function CaseStudyGallery({ photos = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = photos[activeIndex];

  if (!photos.length) return null;

  return (
    <section className="mt-10" aria-label="Project photo gallery">
      <h2 className="text-2xl font-bold text-charcoal">Project Gallery</h2>
      {active?.signedUrl ? (
        <figure className="mt-4">
          <img
            src={active.signedUrl}
            alt={active.alt_text}
            className="aspect-[16/10] w-full rounded-xl object-cover"
            loading="lazy"
            decoding="async"
            width={1200}
            height={750}
          />
          {active.caption ? (
            <figcaption className="mt-2 text-sm text-metallic">{active.caption}</figcaption>
          ) : null}
        </figure>
      ) : null}

      {photos.length > 1 ? (
        <ul className="mt-4 flex flex-wrap gap-2" role="list">
          {photos.map((photo, index) => (
            <li key={photo.id}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View photo ${index + 1}: ${photo.alt_text}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                className={`overflow-hidden rounded-lg border-2 ${index === activeIndex ? 'border-accent' : 'border-transparent'}`}
              >
                {photo.signedUrl ? (
                  <img src={photo.signedUrl} alt="" className="h-16 w-24 object-cover" loading="lazy" width={96} height={64} />
                ) : (
                  <span className="flex h-16 w-24 items-center justify-center bg-slate-100 text-xs">Photo</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
