import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkRemoveFirstH1 from './src/lib/remarkRemoveFirstH1.mjs';

// GitHub Pages project site: https://shihhsinwang0214.github.io/personal_website/
export default defineConfig({
  site: 'https://shihhsinwang0214.github.io',
  base: '/personal_website/',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkMath, remarkRemoveFirstH1],
    rehypePlugins: [rehypeKatex],
  },
});

