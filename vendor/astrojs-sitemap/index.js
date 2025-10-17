import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const toPath = (dir) => (typeof dir === 'string' ? dir : fileURLToPath(dir));

export default function sitemap() {
  let site = '';

  return {
    name: '@astrojs/sitemap-local',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = config.site ? config.site.toString() : '';
      },
      'astro:build:done': async ({ dir, pages }) => {
        if (!site || !pages) return;
        const outputDir = toPath(dir);
        const urls = [];

        for (const page of pages) {
          const pathname = page?.pathname ?? page?.route ?? page?.path ?? page?.url?.pathname;
          if (!pathname) continue;
          const url = new URL(pathname, site).toString();
          urls.push(url);
        }

        const uniqueUrls = Array.from(new Set(urls));
        if (!uniqueUrls.length) return;

        const sitemapBody = uniqueUrls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n');
        const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapBody}\n</urlset>\n`;
        const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>${new URL('sitemap-0.xml', site).toString()}</loc></sitemap>\n</sitemapindex>\n`;

        await mkdir(outputDir, { recursive: true });
        await writeFile(join(outputDir, 'sitemap-0.xml'), sitemapXml, 'utf8');
        await writeFile(join(outputDir, 'sitemap-index.xml'), sitemapIndexXml, 'utf8');
      }
    }
  };
}
