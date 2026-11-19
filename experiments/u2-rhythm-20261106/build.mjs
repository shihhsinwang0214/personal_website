import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {unified} from '../../site/node_modules/unified/index.js';
import parse from '../../site/node_modules/remark-parse/index.js';
import gfm from '../../site/node_modules/remark-gfm/index.js';
import math from '../../site/node_modules/remark-math/index.js';
import rehype from '../../site/node_modules/remark-rehype/index.js';
import raw from '../../site/node_modules/rehype-raw/index.js';
import katexPlugin from '../../site/node_modules/rehype-katex/index.js';
import stringify from '../../site/node_modules/rehype-stringify/index.js';
import katex from '../../site/node_modules/katex/dist/katex.mjs';
import {chapters,formulas,references,quizzes} from './content.mjs';
import {figures} from './figures.mjs';

const dir=path.dirname(fileURLToPath(import.meta.url));
const out=path.join(dir,'dist');
await fs.mkdir(out,{recursive:true});
await fs.cp(path.resolve(dir,'../../site/node_modules/katex/dist'),path.join(out,'katex'),{recursive:true});
await fs.cp(path.join(dir,'python'),path.join(out,'python'),{recursive:true});
for(const file of ['style.css','app.js','python-worker.js']) await fs.copyFile(path.join(dir,file),path.join(out,file));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const processor=unified().use(parse).use(gfm).use(math).use(rehype,{allowDangerousHtml:true}).use(raw).use(katexPlugin,{throwOnError:true,strict:'error'}).use(stringify);
let formulaCount=0;
async function md(source){
 source=source.replace(/\$\$([\s\S]*?)\$\$/g,(_,tex)=>'\n\n$$\n'+tex.trim()+'\n$$\n\n');
 const result=await processor.process(source);
 if(result.messages.some(m=>m.fatal||m.message.includes('KaTeX'))) throw new Error(result.messages.map(m=>m.message+' '+(m.cause?.message||'')+' '+JSON.stringify(m.place)).join('\n'));
 return String(result);
}
function formula(id,unique){
 const f=formulas[id];
 if(!f)throw new Error('Missing formula '+id);
 formulaCount++;
 const equation=katex.renderToString(f.formula,{displayMode:true,throwOnError:true,strict:'ignore',trust:ctx=>ctx.command==='\\htmlClass',macros:{'\\reveal':String.raw`\htmlClass{formula-fragment formula-fragment-#1}{#2}`}});
 const groups=[...equation.matchAll(/class="enclosing formula-fragment formula-fragment-(\d+)"/g)].map(m=>Number(m[1]));
 if(groups.some(g=>g<1||g>f.stages.length)||f.stages.some((_,i)=>!groups.includes(i+1)))throw new Error('Invalid reveal groups in '+id);
 const stages=f.stages.map(([,caption],i)=>`<p class="formula-caption" data-index="${i}">${escape(caption)}</p>`).join('');
 return `<figure class="formula" id="formula-${unique}" data-step-count="${f.stages.length}"><figcaption>${escape(f.title)}</figcaption><div class="math-stage formula-equation">${equation}</div><div class="formula-stack">${stages}</div><div class="formula-controls"><button data-formula="first" aria-label="回到第一步">↶ 起點</button><button data-formula="prev" aria-label="公式上一步">←</button><span class="formula-counter" aria-live="polite"></span><button data-formula="next" aria-label="公式下一步">→</button><button data-formula="all">完整公式</button></div></figure>`;
}
function figure(id,unique){
 const f=figures[id];if(!f)throw new Error('Missing figure '+id);
 const control=f.control?`<label class="figure-control">${f.control==='average'?'右側來路的權重':'時間 t'} <input type="range" min="0" max="1" step="0.01" value="${f.control==='reference'?'0':'0.5'}" data-diagram="${f.control}" aria-label="${f.control==='average'?'右側來路權重':'Reference path 時間'}"><output>0.50</output></label><p class="figure-stat" aria-live="polite"></p>`:'';
 const drawing=f.svg?f.svg.replaceAll('id="arrow"',`id="arrow-${unique}"`).replaceAll('url(#arrow)',`url(#arrow-${unique})`):f.html;
 const extras=f.control==='reference'?`<div class="reference-tools"><button type="button" data-reference-play aria-pressed="false">播放</button><button type="button" data-toggle-distributions aria-pressed="false">顯示分布示意</button><button type="button" data-reset-endpoints>還原端點</button></div><div class="distribution-guide" data-distribution-guide hidden><div class="distribution-legend"><span class="source">起點 p₀</span><span class="middle">中途 pₜ</span><span class="target">終點 p₁</span></div><p>兩個可拖曳端點也作為示意分布的中心；拖曳會平移對應整團點雲，保持形狀與配對不變。深色線連接中心，淡色點由 200 組固定偏移配對產生；每組都用同一條直線插值算出中途位置。這是有限樣本示意，不是 density 曲面。</p></div>`:'';
 return `<figure class="mechanism" id="figure-${unique}"><h3>${f.title}</h3>${drawing}${control}${extras}<figcaption>${f.caption}</figcaption></figure>`;
}
async function experiment(id){
 const code=await fs.readFile(path.join(dir,'python',id+'.py'),'utf8');
 return `<section class="experiment" data-experiment="${id}"><header><span class="eyebrow">自己改，再跑一次</span><h3>Python 小實驗</h3></header><p class="experiment-hint">參數在程式最上方。可直接編輯；執行時才載入 Python，第一次需要下載環境。</p><label for="code-${id}" class="code-label">可編輯的 Python 程式</label><textarea id="code-${id}" spellcheck="false" autocapitalize="off" autocomplete="off">${escape(code)}</textarea><div class="experiment-controls"><button class="primary" data-run>執行 Python</button><button data-stop disabled>停止</button><button data-reset>還原程式</button><a href="python/${id}.py" download>下載 .py</a></div><p class="runtime-status" role="status">尚未執行。程式在你的瀏覽器運算。</p><pre class="python-output" aria-live="polite">輸出會顯示在這裡。</pre><div class="plot" hidden></div><noscript>互動執行需要 JavaScript；可下載程式，以 Python 3 執行。</noscript></section>`;
}
async function sectionBody(source,prefix){
 let html=await md(source);
 let tokenIndex=0;
 const tokens=[...html.matchAll(/<p>\[\[(formula|figure|python|question):([\s\S]*?)\]\]<\/p>/g)];
 for(const match of tokens){
  const [,kind,arg]=match;let replacement;
  const unique=prefix+'-'+tokenIndex++;
  if(kind==='formula')replacement=formula(arg,unique);
  if(kind==='figure')replacement=figure(arg,unique);
  if(kind==='python')replacement=await experiment(arg);
  if(kind==='question'){
   const [q,a]=arg.split('|');
   replacement=`<aside class="question"><p class="eyebrow">課堂提問 · Q1</p><p class="question-text">${q}</p><details><summary>看看這個做法卡在哪裡</summary><p>${a}</p></details></aside>`;
  }
  html=html.replace(match[0],replacement);
 }
 if(/\[\[(formula|figure|python|question):/.test(html)) throw new Error('Unexpanded token in '+prefix);
 return html;
}
const articles=[];
for(let ci=0;ci<chapters.length;ci++){
 const c=chapters[ci];
 const sections=[];
 for(let si=0;si<c.sections.length;si++){
  const [title,body]=c.sections[si];
  sections.push(`<section class="beat" id="${c.id}-beat-${si}" data-beat="${si}"><div class="beat-kicker">${String(si+1).padStart(2,'0')} <span>／ ${String(c.sections.length).padStart(2,'0')}</span></div><h2>${await md(title).then(x=>x.replace(/^<p>|<\/p>\n?$/g,''))}</h2>${await sectionBody(body,c.id+'-'+si)}</section>`);
 }
 const quizHtml=quizzes[c.id].map(([q,opts,correct,explanation],qi)=>`<fieldset class="quiz" data-correct="${correct}"><legend>${qi+1}. ${q}</legend>${opts.map((opt,oi)=>`<button data-option="${oi}" aria-pressed="false">${opt}</button>`).join('')}<p class="quiz-feedback" aria-live="polite" data-explanation="${escape(explanation)}"></p></fieldset>`).join('');
 articles.push(`<article id="${c.id}" class="chapter" data-chapter-index="${ci}" aria-labelledby="title-${c.id}"><header class="chapter-header"><p class="eyebrow">${c.number} · FLOW MATCHING</p><h1 id="title-${c.id}">${c.title}</h1><p class="lead">${c.lead}</p><details class="objectives"><summary>這篇要走到哪裡</summary><ol>${c.objectives.map(x=>`<li>${x}</li>`).join('')}</ol></details></header>${sections.join('\n')}<section class="chapter-end"><h2>快速回顧一下</h2><p>選一個回答，看看剛才的推理有沒有接起來。</p>${quizHtml}<aside class="bridge"><span class="eyebrow">${c.next?'接著想':'走向 U3'}</span><p>${c.bridge}</p>${c.next?`<a class="primary" href="#${c.next}">讀 ${chapters[ci+1].number} →</a>`:''}</aside><details class="references"><summary>參考文獻與推導來源</summary><ol>${c.refs.map(key=>`<li><a href="${references[key][1]}" target="_blank" rel="noopener">${references[key][0]}</a></li>`).join('')}</ol><p>本頁沿用原課程符號，以散場與 Gaussian toy 作教學推導。圖解及小實驗為此試稿製作，沒有把示意圖當成實測結果。</p></details></section></article>`);
}
const nav=chapters.map(c=>`<a href="#${c.id}" data-chapter-link="${c.id}"><span>${c.number}</span><b>${c.title}</b></a>`).join('');
const html=`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><title>U2 · 跟著人潮學會怎麼走｜節奏試讀</title><meta name="description" content="U2 完整獨立試稿：短段問題推進、逐步公式、圖解與可執行 Python。"><link rel="icon" href="data:,"><link rel="stylesheet" href="katex/katex.min.css"><link rel="stylesheet" href="style.css"></head><body><a class="skip" href="#reading">跳到正文</a><div class="reading-progress"><i></i></div><header class="topbar"><a class="brand" href="#u20">SH / NOTES <span>閱讀試作</span></a><div class="top-actions"><button id="mode" aria-pressed="false">逐段閱讀</button><button id="theme" aria-label="切換明暗主題">切換深色</button><button id="print">列印全文</button></div></header><aside class="sidebar"><p class="eyebrow">DIFFUSION MODELS & APPLICATIONS</p><p class="sidebar-title">跟著人潮<br>學會怎麼走</p><p class="sidebar-intro">Unit 2 · 完整試稿<br>問題 → 直覺 → 數學 → 實驗</p><nav aria-label="U2 篇章">${nav}</nav><div class="scope-note">獨立試讀 · 2026.11.06<br>正式 notes 保持原樣。</div></aside><main id="reading" tabindex="-1"><div class="prototype-note">U2 節奏試讀 <span>從一個問題，走到下一個答案。</span></div>${articles.join('\n')}<div class="focus-navigation" hidden><button id="beat-prev">← 前一段</button><span id="beat-status" aria-live="polite"></span><button id="beat-next" class="primary">下一段 →</button></div><footer class="bottom-navigation"><button id="chapter-prev">← 前一篇</button><span id="chapter-status"></span><button id="chapter-next">下一篇 →</button></footer><div id="toc" class="toc" aria-label="篇內段落"></div></main><script src="app.js" defer></script></body></html>`;
const assetHash=createHash('sha256').update(await fs.readFile(path.join(dir,'app.js'))).update(await fs.readFile(path.join(dir,'style.css'))).digest('hex').slice(0,12);
await fs.writeFile(path.join(out,'index.html'),html.replace('href="style.css"',`href="style.css?v=${assetHash}"`).replace('src="app.js"',`src="app.js?v=${assetHash}"`));
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify({chapters:chapters.map(c=>({id:c.id,title:c.title,sections:c.sections.length})),formulaCount,experiments:['u20','u21','u22','u23','u24','lab','solver'],builtAt:new Date().toISOString()},null,2));
console.log(`Built ${chapters.length} chapters, ${chapters.reduce((n,c)=>n+c.sections.length,0)} sections, ${formulaCount} staged formulas, 7 runnable experiments.`);
