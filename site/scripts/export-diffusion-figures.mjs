import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..', '..');
const sourceRoot = path.join(repoRoot, 'design', 'diffusion-figures');
const notesRoot = path.join(
  repoRoot,
  'site',
  'src',
  'content',
  'notes',
  'research-areas',
  'diffusion-models-and-their-applications',
);

const embeddedAssets = new Map([
  [
    'asset://dog-data-sample',
    path.join(sourceRoot, 'assets', 'dog-data-sample.png'),
  ],
]);

async function collectSvgFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === 'assets') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectSvgFiles(absolute)));
    if (entry.isFile() && entry.name.endsWith('.svg')) files.push(absolute);
  }

  return files;
}

async function embedRasterAssets(svg) {
  let result = svg;
  for (const [token, assetPath] of embeddedAssets) {
    if (!result.includes(token)) continue;
    const bytes = await fs.readFile(assetPath);
    result = result.replaceAll(token, `data:image/png;base64,${bytes.toString('base64')}`);
  }
  return result;
}

async function exportFigure(sourcePath) {
  const week = path.basename(path.dirname(sourcePath));
  if (!/^week-[3-7]$/.test(week)) {
    throw new Error(`Unexpected figure directory: ${sourcePath}`);
  }

  const outputName = `${path.basename(sourcePath, '.svg')}.png`;
  const outputPath = path.join(notesRoot, week, 'imgs', outputName);
  const svg = await embedRasterAssets(await fs.readFile(sourcePath, 'utf8'));

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outputPath);

  const metadata = await sharp(outputPath).metadata();
  if (!metadata.width || !metadata.height || metadata.width < 1600) {
    throw new Error(`Invalid output dimensions for ${outputName}`);
  }

  return `${path.relative(repoRoot, outputPath)} (${metadata.width}x${metadata.height})`;
}

const svgFiles = (await collectSvgFiles(sourceRoot)).sort();
if (svgFiles.length === 0) throw new Error(`No SVG masters found in ${sourceRoot}`);

for (const svgFile of svgFiles) {
  console.log(`exported ${await exportFigure(svgFile)}`);
}
