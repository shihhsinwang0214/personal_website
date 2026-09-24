import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..', '..');
const sourceDir = path.join(repoRoot, 'design', 'diffusion-figures', 'tests');
const outputDir = path.join(repoRoot, 'output', 'diffusion-style-tests');
const assets = new Map([
  [
    'asset://dog-shiba-data',
    path.join(repoRoot, 'design', 'diffusion-figures', 'assets', 'dog-shiba-data.png'),
  ],
]);

async function embedAssets(svg) {
  let result = svg;
  for (const [token, assetPath] of assets) {
    if (!result.includes(token)) continue;
    const bytes = await fs.readFile(assetPath);
    result = result.replaceAll(token, `data:image/png;base64,${bytes.toString('base64')}`);
  }
  return result;
}

await fs.mkdir(outputDir, { recursive: true });
const files = (await fs.readdir(sourceDir))
  .filter((name) => name.endsWith('.svg'))
  .sort();

for (const name of files) {
  const sourcePath = path.join(sourceDir, name);
  const outputPath = path.join(outputDir, name.replace(/\.svg$/i, '.png'));
  const svg = await embedAssets(await fs.readFile(sourcePath, 'utf8'));
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outputPath);
  const { width, height } = await sharp(outputPath).metadata();
  console.log(`${path.relative(repoRoot, outputPath)} (${width}x${height})`);
}
