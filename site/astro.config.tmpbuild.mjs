import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkRemoveFirstH1 from './src/lib/remarkRemoveFirstH1.mjs';
export default defineConfig({
  site: 'https://shihhsinwang0214.github.io',
  base: '/personal_website/',
  cacheDir: '/sessions/rcw-01jlx5p1mpsvu2rrtndduc8q/bt/abcache',
  outDir: '/sessions/rcw-01jlx5p1mpsvu2rrtndduc8q/bt/dist',
  integrations: [mdx(), sitemap()],
  markdown: { remarkPlugins: [remarkMath, remarkRemoveFirstH1], rehypePlugins: [rehypeKatex] },
  vite: { cacheDir: '/sessions/rcw-01jlx5p1mpsvu2rrtndduc8q/bt/vitecache' },
});
