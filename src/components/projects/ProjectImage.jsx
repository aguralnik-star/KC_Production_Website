import { useState } from 'react';
import { Factory } from 'lucide-react';

export function ProjectImagePlaceholder({ icon: Icon = Factory, alt, className = '' }) {
  return (
    <div
      className={`project-showcase-card__placeholder ${className}`.trim()}
      role="img"
      aria-label={alt}
    >
      <div className="project-showcase-card__placeholder-glow" aria-hidden="true" />
      <div className="project-showcase-card__placeholder-lines" aria-hidden="true" />
      <Icon className="project-showcase-card__placeholder-icon" aria-hidden="true" />
      <p className="project-showcase-card__placeholder-label">Representative Example</p>
    </div>
  );
}

export function ProjectImage({ src, alt, icon: Icon, className = '', priority = false }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <ProjectImagePlaceholder icon={Icon} alt={alt} className={className} />;
  }

  return (
    <div className={`project-showcase-card__media ${className}`.trim()}>
      <img
        src={src}
        alt={alt}
        className="project-showcase-card__image"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        width={640}
        height={400}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
