import { copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');
const sitemapIndex = join(dist, 'sitemap-index.xml');
const sitemapAlias = join(dist, 'sitemap.xml');

if (existsSync(sitemapIndex)) {
  copyFileSync(sitemapIndex, sitemapAlias);
}
