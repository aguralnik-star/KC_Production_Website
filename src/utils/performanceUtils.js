export function lazyWithRetry(factory, retries = 2) {
  return new Promise((resolve, reject) => {
    factory()
      .then(resolve)
      .catch((error) => {
        if (retries <= 0) {
          reject(error);
          return;
        }
        window.setTimeout(() => {
          lazyWithRetry(factory, retries - 1).then(resolve).catch(reject);
        }, 800);
      });
  });
}

export function preloadRoute(factory) {
  if (typeof window === 'undefined') return;
  window.requestIdleCallback?.(() => {
    factory().catch(() => {});
  });
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getImageProps({ src, alt, width, height, priority = false }) {
  return {
    src,
    alt,
    width,
    height,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    className: 'h-auto max-w-full',
    style: width && height ? { aspectRatio: `${width} / ${height}` } : undefined,
  };
}
