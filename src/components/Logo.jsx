import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const LOGO_ASSETS = {
  default: {
    src: '/kc-logo.svg',
    fallback: '/kc-logo-original.png',
    alt: 'K&C Design and Manufacturing',
  },
  white: {
    src: '/kc-logo-white.svg',
    fallback: '/kc-logo-original.png',
    alt: 'K&C Design and Manufacturing',
  },
  mark: {
    src: '/kc-logo-mark.svg',
    fallback: '/kc-logo-original.png',
    alt: 'K&C Design and Manufacturing mark',
  },
};

export default function Logo({
  variant = 'default',
  className = '',
  showText = true,
  asLink = false,
  linkClassName = '',
  ...props
}) {
  const [useFallback, setUseFallback] = useState(false);
  const resolvedVariant = showText ? variant : 'mark';
  const asset = LOGO_ASSETS[resolvedVariant] ?? LOGO_ASSETS.default;
  const src = useMemo(() => (useFallback ? asset.fallback : asset.src), [asset.fallback, asset.src, useFallback]);

  const image = (
    <img
      src={src}
      alt={asset.alt}
      className={className}
      decoding="async"
      loading="eager"
      onError={() => {
        if (!useFallback) {
          setUseFallback(true);
        }
      }}
      {...props}
    />
  );

  if (asLink) {
    return (
      <Link to="/" className={linkClassName} aria-label="K&C Design and Manufacturing home">
        {image}
      </Link>
    );
  }

  return image;
}
