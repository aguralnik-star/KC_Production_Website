import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_SITE_URL = 'https://www.kcdesignmfg.com';

export const SITEMAP_ENTRIES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/contact', priority: '0.9', changefreq: 'monthly' },
  { path: '/capabilities', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/cnc-machining', priority: '0.85', changefreq: 'monthly' },
  { path: '/services/cnc-milling', priority: '0.85', changefreq: 'monthly' },
  { path: '/services/cnc-turning', priority: '0.85', changefreq: 'monthly' },
  { path: '/services/tooling', priority: '0.85', changefreq: 'monthly' },
  { path: '/services/fixtures', priority: '0.85', changefreq: 'monthly' },
  { path: '/services/gauges', priority: '0.85', changefreq: 'monthly' },
  { path: '/services/prototype-machining', priority: '0.85', changefreq: 'monthly' },
  { path: '/services/production-machining', priority: '0.85', changefreq: 'monthly' },
  { path: '/projects', priority: '0.8', changefreq: 'monthly' },
  { path: '/industries', priority: '0.8', changefreq: 'monthly' },
  { path: '/quality', priority: '0.8', changefreq: 'monthly' },
  { path: '/equipment', priority: '0.75', changefreq: 'monthly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/rfq/status', priority: '0.5', changefreq: 'monthly' },
];

function resolveSiteUrl() {
  return (process.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
}

export function generateSitemapXml(siteUrl = resolveSiteUrl()) {
  const baseUrl = siteUrl.replace(/\/$/, '');
  const urls = SITEMAP_ENTRIES.map(
    ({ path, priority, changefreq }) => `  <url>
    <loc>${baseUrl}${path === '/' ? '/' : path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function writeSitemap(outputPath, siteUrl = resolveSiteUrl()) {
  writeFileSync(outputPath, `${generateSitemapXml(siteUrl)}\n`, 'utf8');
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectRun) {
  const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');
  writeSitemap(join(rootDir, 'public/sitemap.xml'));
  console.log('Generated public/sitemap.xml');
}
