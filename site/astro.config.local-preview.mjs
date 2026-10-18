import base from './astro.config.mjs';

// Keep the private preview separate from the dist/ artifact uploaded by CI.
export default {
  ...base,
  cacheDir: './.astro-local-preview',
  outDir: './dist-local',
  vite: { ...base.vite, cacheDir: './node_modules/.vite-local-preview' },
};
