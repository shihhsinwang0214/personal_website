// Build config for sandboxed shells that cannot delete files inside the mounted
// repo: cache and output go under $HOME. Usage: npx astro build --config astro.config.homebuild.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkRemoveFirstH1 from './src/lib/remarkRemoveFirstH1.mjs';
const home = process.env.HOME ?? '/tmp';
export default defineConfig({
  site: 'https://shihhsinwang0214.github.io',
  base: '/personal_website/',
  cacheDir: `${home}/bt/abcache`,
  outDir: `${home}/bt/dist`,
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkRemoveFirstH1],
      rehypePlugins: [rehypeKatex],
    }),
  },
  vite: { cacheDir: `${home}/bt/vitecache` },
});
