/** Standalone visual comparison; never changes or publishes the website. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { profile, heroContent } from '../src/data/content.ts';
import { navigationIconMotion, navigationIconOrder } from '../src/lib/navigationIcons.ts';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const motionMode = process.argv.includes('--motion');
const paletteMode = process.argv.includes('--palettes') || motionMode;
const output = path.resolve(site, motionMode ? '../output/icon-motion-preview' : paletteMode ? '../output/icon-palette-preview' : '../output/icon-page-preview');
const source = path.join(site, 'src/assets/navigation', paletteMode ? 'matched-palettes' : 'clear-directions');
const manifest = JSON.parse(await fs.readFile(path.join(source, 'prompts-v1.json'), 'utf8'));
if (motionMode) manifest.concepts = manifest.concepts.slice(0, 1);
const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const publicUrl = (route = '') => `https://shihhsinwang0214.github.io/personal_website/${route}`;
const descriptions = paletteMode ? manifest.concepts.map((c) => c.description) : ['清楚輪廓、柔和彩色', '漫畫描邊、輕量道具感', '16-bit 像素、遊戲感較強', '紫色線條、琥珀重點色', '圓潤立體、實體道具感'];
const previewTitle = motionMode ? '海藍杏橙・互動圖示預覽' : paletteMode ? '漫畫大圖 × 像素小圖・五種配色' : '五套圖示，放進頁面看看';
const compareLabel = paletteMode ? '五色一起看' : '五套一起看';
const hint = motionMode ? '滑鼠移入卡片：筆記翻頁、問答選取、論文輕抬、研究室螢幕亮起。' : paletteMode ? '大圖固定用漫畫版，小圖固定用像素版；右上角可切換深淺色。' : '切換版本，或往下比較五套；右上角可切換深淺色。';
const targets = [
  { title: '課程與筆記', kicker: '想循序學習', desc: '選一門課，依單元建立直覺、推導與實作。', href: 'zh/notes' },
  { title: '互動學習', kicker: '想邊想邊學', desc: '從情境與問題開始，選擇做法，再比較理由。', href: 'zh/dojo' },
  { title: '研究著作', kicker: '想了解研究', desc: '查看論文、研究主題與相關資源。', href: 'zh/publications' },
  { title: '研究室', kicker: '想認識或加入團隊', desc: '認識研究室成員，了解研究方式與招募資訊。', href: 'zh/handbook' },
];

// Inspect alpha to find each icon's viewport. The bitmap stays intact; SVG
// viewBoxes display the four regions from the original sheet without cutting it.
async function sheet(file, id, pixel = false) {
  const input = path.join(source, file);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const counts = Array(info.width).fill(0);
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 190) counts[x]++;
  }
  const splits = [0];
  for (let n = 1; n < 4; n++) {
    let best = Math.round(info.width * n / 4), score = Infinity;
    for (let x = best - 110; x < info.width * n / 4 + 110; x++) {
      const value = counts.slice(x - 3, x + 4).reduce((a, b) => a + b, 0);
      if (value < score) { score = value; best = x; }
    }
    splits.push(best);
  }
  splits.push(info.width);
  const boxes = targets.map((_, i) => {
    const width = splits[i + 1] - splits[i], seen = new Uint8Array(width * info.height);
    const queue = new Uint32Array(seen.length);
    let largest = { count: 0, left: 0, right: width - 1, top: 0, bottom: info.height - 1 };
    // Ignore disconnected cutout specks when choosing the display viewport.
    // No pixels are removed or rewritten in the source or embedded image.
    for (let start = 0; start < seen.length; start++) {
      if (seen[start]) continue;
      seen[start] = 1;
      const sx = start % width, sy = Math.floor(start / width);
      if (data[(sy * info.width + splits[i] + sx) * 4 + 3] <= 190) continue;
      let head = 0, tail = 1;
      queue[0] = start;
      const part = { count: 0, left: sx, right: sx, top: sy, bottom: sy };
      while (head < tail) {
        const pos = queue[head++], x = pos % width, y = Math.floor(pos / width);
        part.count++; part.left = Math.min(part.left, x); part.right = Math.max(part.right, x);
        part.top = Math.min(part.top, y); part.bottom = Math.max(part.bottom, y);
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= info.height) continue;
          const next = ny * width + nx;
          if (seen[next]) continue;
          seen[next] = 1;
          if (data[(ny * info.width + splits[i] + nx) * 4 + 3] > 190) queue[tail++] = next;
        }
      }
      if (part.count > largest.count) largest = part;
    }
    const left = splits[i] + largest.left, right = splits[i] + largest.right;
    const { top, bottom } = largest;
    return [Math.max(splits[i], left - 6), Math.max(0, top - 6), Math.min(splits[i + 1], right + 7) - Math.max(splits[i], left - 6), Math.min(info.height, bottom + 7) - Math.max(0, top - 6)];
  });
  const bitmap = await sharp(input).webp(pixel ? { lossless: true } : { quality: 88 }).toBuffer();
  return { id, boxes, definition: `<image id="sheet-${id}" width="${info.width}" height="${info.height}" href="data:image/webp;base64,${bitmap.toString('base64')}"/>` };
}

const sheets = await Promise.all(manifest.concepts.map((c, i) => sheet(c.file, i + 1, !paletteMode && i === 2)));
const smallSheets = paletteMode ? await Promise.all(manifest.concepts.map((c, i) => sheet(c.smallFile, i + 6, true))) : sheets;
const icon = (style, index, extra = '', small = false) => {
  const s = (small ? smallSheets : sheets)[style - 1];
  const pixel = paletteMode ? small : style === 3;
  const svg = `<svg class="${motionMode ? 'nav-illustration__image' : `preview-icon ${pixel ? 'preview-icon--pixel' : ''} ${extra}`}" viewBox="${s.boxes[index].join(' ')}" aria-hidden="true" focusable="false"><use href="#sheet-${s.id}"/></svg>`;
  if (!motionMode) return svg;
  const kind = navigationIconOrder[index];
  return `<span class="preview-icon nav-illustration nav-illustration--${kind} nav-illustration--${small ? 'small preview-icon--pixel' : 'large nav-illustration--animated'} ${extra}" aria-hidden="true">${svg}${small ? '' : navigationIconMotion(kind)}</span>`;
};
const sets = manifest.concepts.map((c, i) => `<section class="preview-set" data-style="${i + 1}" ${i ? 'hidden' : ''} aria-label="${escape(c.name)}">
  <header class="preview-set-head"><h2>${escape(c.name)}</h2><p>${descriptions[i]}</p>${paletteMode ? `<div class="preview-swatches" aria-hidden="true">${c.colors.map((color) => `<span style="--swatch:${color}"></span>`).join('')}</div>` : ''}</header>
  <nav class="visitor-paths" aria-label="${escape(c.name)}的網站入口">${targets.map((t, j) => `<a href="${publicUrl(t.href)}" target="_blank" rel="noopener">
    <span class="visitor-path-cursor" aria-hidden="true">▸</span><span class="visitor-path-code" aria-hidden="true">0${j + 1} / 04</span>
    ${icon(i + 1, j, 'visitor-path-image')}
    <span class="visitor-path-kicker">${t.kicker}</span><strong>${t.title} <span aria-hidden="true">↗</span></strong><span class="visitor-path-desc">${t.desc}</span>
  </a>`).join('')}</nav>
  <div class="preview-small-row"><span>${paletteMode ? '32px 像素小圖' : '小尺寸效果'}</span>${targets.map((t, j) => `<span class="preview-small-item">${icon(i + 1, j, '', true)}<span>${t.title}</span></span>`).join('')}</div>
</section>`).join('');
const css = (await Promise.all(['global.css', 'site-polish.css', 'scholar-theme.css', 'navigation-icons.css'].map((f) => fs.readFile(path.join(site, 'src/styles', f), 'utf8')))).join('\n');
const atlas = await sharp(path.join(site, `src/assets/navigation/research-atlas-${motionMode ? 'v2' : 'v1'}.png`)).resize({ width: 600 }).webp({ quality: 85 }).toBuffer();
const avatar = await fs.readFile(path.join(site, 'public', profile.avatar));
const nav = [['首頁', 'zh'], ['課程筆記', 'zh/notes'], ['互動學習', 'zh/dojo'], ['研究室', 'zh/handbook'], ['著作', 'zh/publications'], ['關於', 'zh/about']];
const paletteCss = paletteMode ? manifest.concepts.map((c, i) => ['light', 'dark'].map((theme) => `:root[data-theme=${theme}] .preview-set[data-style="${i + 1}"]{--accent:${theme === 'light' ? c.uiLight : c.uiDark};--accent-soft:color-mix(in srgb,var(--accent) 9%,var(--surface));--field-rule:color-mix(in srgb,var(--accent) 42%,var(--border))}`).join('\n')).join('\n') : '';
const html = `<!doctype html><html lang="zh-Hant" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${previewTitle}</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>${css}
${paletteCss}
/* Comparison controls are separate from the unchanged site palette. */
.preview-toolbar{position:sticky;top:calc(var(--header-h) + 8px);z-index:20;max-width:960px;margin:0 auto 28px;padding:20px 22px;border:1px solid var(--field-rule);border-radius:5px;background:var(--surface);box-shadow:var(--shadow-sm)}
.motion-preview .preview-choices,.motion-preview .preview-mobile-select,.motion-preview .preview-status{display:none}.motion-preview .preview-toolbar-top{margin-bottom:0}
.preview-toolbar-top{display:flex;justify-content:space-between;gap:16px;align-items:baseline;margin-bottom:14px;flex-wrap:wrap}
.preview-toolbar h2{font-size:1rem;line-height:1.5;margin:0}.preview-toolbar p{margin:0;color:var(--text-muted);font-size:.78rem;line-height:1.7}
.preview-choices{border:0;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}.preview-choices legend{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.preview-choices label{position:relative;cursor:pointer}.preview-choices input{position:absolute;opacity:0;width:1px;height:1px}
.preview-choices label>span{display:flex;align-items:center;min-height:44px;padding:9px 12px;font-size:.78rem;border:1px solid var(--border-strong);border-radius:4px;color:var(--text-muted);background:var(--bg)}
.preview-choices input:checked+span{border-color:var(--accent);color:var(--accent);background:var(--accent-soft);font-weight:700}.preview-choices input:focus-visible+span{outline:2px solid var(--focus-ring);outline-offset:3px}
.preview-mobile-select{display:none}.preview-mobile-select select{flex:1;min-width:0;min-height:44px;border:1px solid var(--border-strong);border-radius:4px;padding:8px 12px;background:var(--bg);color:var(--text);font:inherit}
.preview-status{margin-top:12px!important}.preview-toolbar a{color:var(--text-muted);font-size:.76rem;text-underline-offset:3px}
.preview-header-links{display:flex;gap:16px;margin-left:auto;font-size:.8rem}.preview-header-links a{color:var(--text-muted);text-decoration:none;min-height:44px;display:flex;align-items:center}
.sprite-definitions{position:absolute;width:0;height:0;overflow:hidden;pointer-events:none}.preview-icon{display:block;overflow:hidden;width:112px;height:112px;flex:none}.preview-icon--pixel{image-rendering:pixelated}
.preview-set{margin:0}.home--scholar .preview-set .visitor-paths{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.home--scholar .preview-set .visitor-paths a{min-height:162px;padding:28px 24px 22px;grid-template-columns:minmax(0,1fr) 112px;grid-template-rows:auto auto 1fr;column-gap:20px;align-items:start}
.home--scholar .preview-set .visitor-path-image{grid-column:2;grid-row:1/4;width:112px;height:112px;align-self:center;transform:none}
.home--scholar .preview-set .visitor-path-kicker{grid-column:1;grid-row:1}.home--scholar .preview-set strong{grid-column:1;grid-row:2}.home--scholar .preview-set .visitor-path-desc{grid-column:1;grid-row:3}
.preview-set-head{display:none;margin-bottom:14px}.preview-set-head h2{font-size:1.2rem;margin:0 0 5px}.preview-set-head p{font-size:.8rem;color:var(--text-muted);margin:0}
.preview-swatches{display:flex;gap:6px;margin-top:10px}.preview-swatches>span{display:block;width:18px;height:18px;border-radius:3px;background:var(--swatch);border:1px solid var(--border-strong)}
.is-comparing .preview-set-head{display:block}.is-comparing .preview-set+.preview-set{margin-top:40px;padding-top:28px;border-top:1px solid var(--field-rule)}
.preview-small-row{display:flex;flex-wrap:wrap;align-items:center;gap:14px 22px;margin-top:18px;padding:12px 0;color:var(--text-muted);font-size:.72rem}
.preview-small-item{display:flex;align-items:center;gap:8px}.preview-small-item .preview-icon{width:32px;height:32px}
.preview-read-section{margin-top:32px;border-top:1px solid var(--border);padding-top:26px}.preview-read-section h2{font-size:1.15rem;margin:0 0 16px}.preview-course-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.preview-course{border:1px solid var(--border);border-top:2px solid var(--tone-dma);border-radius:5px;padding:20px;background:var(--surface);text-decoration:none;color:var(--text);line-height:1.8}.preview-course:last-child{border-top-color:var(--tone-gdl)}.preview-course strong{font-size:.95rem}.preview-course p{font-size:.8rem;color:var(--text-muted);margin:8px 0 12px}.preview-course>span{font-size:.75rem;color:var(--accent)}
.preview-footer-note{font-size:.76rem;line-height:1.8;color:var(--text-muted);margin:26px 0 0}
@media(max-width:959px){.preview-header-links{display:none}.home--scholar .preview-set .visitor-paths a{padding:26px 18px 20px;grid-template-columns:minmax(0,1fr) 90px;column-gap:14px}.home--scholar .preview-set .visitor-path-image{width:90px;height:96px}}
@media(max-width:600px){#main{padding-top:20px}.preview-toolbar{padding:16px;margin-bottom:24px}.preview-toolbar-top{margin-bottom:12px}.preview-toolbar-top>p,.preview-choices{display:none}.preview-mobile-select{display:flex;align-items:center;gap:12px;font-size:.8rem}.preview-status{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}.home--scholar .preview-set .visitor-paths{grid-template-columns:1fr;gap:10px}.home--scholar .preview-set .visitor-paths a{grid-template-columns:minmax(0,1fr) 72px;min-height:126px;padding:20px 16px;column-gap:14px}.home--scholar .preview-set .visitor-path-image{width:72px;height:80px}.preview-small-row{gap:12px 20px}.preview-small-row>span:first-child{width:100%}.preview-small-item{min-width:calc(50% - 10px)}.preview-course-grid{grid-template-columns:1fr}.hero-opening{margin-bottom:12px}.preview-set-head h2{font-size:1.05rem}}
</style></head><body class="scholar-site ${motionMode ? 'motion-preview' : ''}">
<a class="skip-link" href="#main">跳至主要內容</a><header class="site-header"><div class="topbar-inner"><a class="brand" href="${publicUrl('zh')}" target="_blank" rel="noopener" aria-label="Shih-Hsin Wang 王士欣"><img class="brand-avatar" width="32" height="32" alt="" src="data:image/jpeg;base64,${avatar.toString('base64')}"><span class="brand-short">王士欣</span><span class="brand-name">Shih-Hsin Wang <span class="brand-zh">王士欣</span></span></a>
<nav class="preview-header-links" aria-label="網站主要入口">${nav.map(([title, href]) => `<a href="${publicUrl(href)}" target="_blank" rel="noopener">${title}</a>`).join('')}</nav>
<button class="theme-toggle" type="button" aria-label="切換深色模式" aria-pressed="false"><svg class="icon icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg><svg class="icon icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button></div></header>
<svg class="sprite-definitions" aria-hidden="true" focusable="false"><defs>${[...sheets, ...(paletteMode ? smallSheets : [])].map((s) => s.definition).join('')}</defs></svg>
<div id="main" tabindex="-1"><aside class="preview-toolbar" aria-label="圖示比較工具"><div class="preview-toolbar-top"><h2>${previewTitle}</h2><p>${hint}</p></div>
<fieldset class="preview-choices"><legend>選擇圖示版本</legend>${manifest.concepts.map((c, i) => `<label><input type="radio" name="icon-style" value="${i + 1}" ${!i ? 'checked' : ''}><span>${escape(c.name)}</span></label>`).join('')}<label><input type="radio" name="icon-style" value="all"><span>${compareLabel}</span></label></fieldset><label class="preview-mobile-select">${paletteMode ? '配色版本' : '圖示版本'}<select id="mobile-style">${manifest.concepts.map((c, i) => `<option value="${i + 1}">${escape(c.name)}</option>`).join('')}<option value="all">${compareLabel}</option></select></label><p class="preview-status" role="status">目前：${escape(manifest.concepts[0].name)}</p></aside>
<main class="home home--scholar"><section class="hero"><div class="hero-opening"><div class="hero-copy"><div class="field-heading" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.4"><path d="m5 17 7-11 7 11H5Z"/><circle cx="12" cy="6" r="2.5" fill="var(--bg)"/><circle cx="5" cy="17" r="2.5" fill="var(--bg)"/><circle cx="19" cy="17" r="2.5" fill="var(--bg)"/></svg><span>RESEARCHER’S FIELDNOTES</span><span class="field-heading-rule"></span></div><p class="eyebrow">${escape(heroContent.eyebrow.zh)}</p><h1 class="hero-title">Shih-Hsin Wang <span class="zh">王士欣</span></h1><div class="hero-rule"></div><p class="hero-lead">研究幾何深度學習、生成模型與 AI for Science，將直覺轉化為有理論基礎、可靠且高效的工具。</p></div><div class="hero-atlas" aria-hidden="true"><img width="300" height="300" alt="" src="data:image/webp;base64,${atlas.toString('base64')}"><span>RESEARCH ATLAS</span></div></div>
<div class="path-selection-label"><span>選一條路線，開始探索</span><span aria-hidden="true">SELECT A PATH</span></div><div id="icon-sets">${sets}</div>
<div class="hero-links"><a href="${escape(profile.contact.scholar)}" target="_blank" rel="noopener">Google Scholar</a><a href="${escape(profile.contact.github)}" target="_blank" rel="noopener">GitHub</a><a href="${escape(profile.contact.linkedin)}" target="_blank" rel="noopener">LinkedIn</a><a href="${publicUrl(profile.cv)}" target="_blank" rel="noopener">CV</a><a href="mailto:${escape(profile.contact.email)}">Email</a></div></section>
<section class="preview-read-section"><h2>課程與筆記</h2><div class="preview-course-grid"><a class="preview-course" href="${publicUrl('zh/notes/course/diffusion-models-applications')}" target="_blank" rel="noopener"><strong>Diffusion Models and Their Applications</strong><p>從 Diffusion Models 與 Flow Matching 出發，延伸至離散生成與生成時的引導。</p><span>瀏覽課程 →</span></a><a class="preview-course" href="${publicUrl('zh/notes/course/geometric-deep-learning')}" target="_blank" rel="noopener"><strong>Geometric Deep Learning</strong><p>從 symmetry 的問題出發，理解幾何、結構與模型設計之間的關係。</p><span>瀏覽課程 →</span></a></div></section><p class="preview-footer-note">${motionMode ? '海藍杏橙・漫畫大圖與像素小圖。滑鼠移入或以鍵盤聚焦卡片可看動作；減少動態模式下維持靜態。' : '圖示效果比較頁・入口保留清楚文字，圖片作為導引。正式網站尚未套用任何一套。'}</p></main></div>
<footer class="site-footer"><span>© 2026 Shih-Hsin Wang 王士欣</span><span>圖示設計預覽</span></footer>
<script>
const names=${JSON.stringify(manifest.concepts.map((c) => c.name))};
const compareLabel=${JSON.stringify(compareLabel)};
const sets=document.querySelectorAll('[data-style]');
function showStyle(value){if(!['all',...names.map((_,i)=>String(i+1))].includes(value))value='1';sets.forEach(s=>s.hidden=value!=='all'&&s.dataset.style!==value);document.querySelector('#icon-sets').classList.toggle('is-comparing',value==='all');document.querySelector('input[name="icon-style"][value="'+value+'"]').checked=true;document.querySelector('#mobile-style').value=value;document.querySelector('.preview-status').textContent=value==='all'?'目前：'+compareLabel+'，往下比較相同版面。':'目前：'+names[Number(value)-1];try{const url=new URL(location.href);url.searchParams.set('style',value);history.replaceState(null,'',url);}catch{}}
document.querySelectorAll('input[name="icon-style"]').forEach(input=>input.addEventListener('change',()=>showStyle(input.value)));
document.querySelector('#mobile-style').addEventListener('change',event=>showStyle(event.target.value));
const toggle=document.querySelector('.theme-toggle');function theme(value){document.documentElement.dataset.theme=value;toggle.setAttribute('aria-pressed',String(value==='dark'));try{localStorage.setItem('icon-preview-theme',value);}catch{}}
toggle.addEventListener('click',()=>theme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
let initial='light';try{initial=localStorage.getItem('icon-preview-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');}catch{}theme(initial==='dark'?'dark':'light');showStyle(new URLSearchParams(location.search).get('style')||'1');
</script></body></html>`;
await fs.mkdir(output, { recursive: true });
await fs.writeFile(path.join(output, 'index.html'), html);
await fs.writeFile(path.join(output, 'viewports.json'), JSON.stringify([...sheets, ...(paletteMode ? smallSheets : [])].map(({ id, boxes }) => ({ id, boxes })), null, 2));
console.log(`Saved ${path.join(output, 'index.html')} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`);
