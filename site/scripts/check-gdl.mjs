import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { compile } from '@mdx-js/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const dir = 'src/content/notes/research-areas/invariance-and-equivariance';
const files = (await fs.readdir(dir)).filter(f => f.endsWith('.zh.mdx'));
const all = await Promise.all(files.map(async name => ({name, text: await fs.readFile(path.join(dir,name),'utf8')})));
const registry = await fs.readFile('src/lib/notes.ts', 'utf8');
const aliasBlock = registry.match(/export const mergedNoteAliases[^=]*=\s*\{([\s\S]*?)\n\};/)[1];
const aliases = new Map([...aliasBlock.matchAll(/'([^']+)': '([^']+)'/g)].map(m => [m[1], m[2]]));
const active = all.filter(n => !aliases.has(n.text.match(/^slug: "([^"]+)"/m)[1]));
const labels = new Set(all.map(n => n.text.match(/^label: "([^"]+)"/m)?.[1]));
const plannedLabels = new Set([...registry.matchAll(/^  '([^']+)': \{ slug: '[^']+', group: 'G\d+ ·/gm)].map(m => m[1]));
const units = new Map();
for (const {name,text} of active) {
  const group = text.match(/^group: "(G\d+) ·/m)?.[1];
  assert.ok(group, name+': group');
  units.set(group, (units.get(group)||0)+1);
  assert.equal((text.match(/<Question>/g)||[]).length,1,name+': question count');
  assert.equal((text.match(/<Answer>/g)||[]).length,1,name+': answer count');
  assert.equal((text.match(/<Quiz /g)||[]).length,3,name+': quiz count');
  assert.ok(text.includes('<Objectives>')&&text.includes('<Bridge'),name+': teaching blocks');
  assert.ok(!/^\$$/m.test(text),name+': display math must use double-dollar delimiters');
  for (const match of text.matchAll(/<(?:Ref|Bridge) to="([^"]+)"/g))
    assert.ok(labels.has(match[1]) || plannedLabels.has(match[1]),name+': missing reference '+match[1]);
  for (const match of text.matchAll(/(?:src|href)="\/personal_website\/([^"]+)"/g)) {
    const asset=match[1].split('?')[0];
    if(asset.startsWith('notes/research_areas/'))
      await fs.access(path.join('public',asset));
  }
  assert.ok(!/旋鈕|套餐|先說清楚|localhost|TODO/.test(text),name+': excluded language');
  const content=text.replace(/^---[\s\S]*?\n---\s*/,'');
  await compile(content,{remarkPlugins:[remarkMath],rehypePlugins:[[rehypeKatex,{throwOnError:true,strict:'error'}]]});
}
assert.deepEqual([...units.entries()].sort((a,b)=>Number(a[0].slice(1))-Number(b[0].slice(1))),
  [['G1',6],['G2',5],['G3',4],['G4',6],['G5',5],['G6',5]]);
const expansion = new Map();
const plannedBlock = registry.slice(registry.indexOf("  'gdl-g6-0': {"), registry.indexOf('// Old URLs;'));
for (const match of plannedBlock.matchAll(/group: '(G\d+) ·/g))
  expansion.set(match[1], (expansion.get(match[1]) || 0) + 1);
assert.deepEqual([...expansion], [['G7',7],['G8',8],['G9',7],['G10',5],['G11',7]]);
for (const [slug,target] of aliases) {
  if (!slug.startsWith('gdl-')) continue;
  assert.ok(active.some(n => n.text.includes('slug: "' + target + '"')), 'Missing redirect target: ' + target);
}
await import('../public/notes/research_areas/invariance-and-equivariance/symmetry-math.js');
const m=globalThis.GDLSymmetry;
for(let q=-12;q<=12;q++) {
  assert.ok(m.translation(q,1,'circular').defect<1e-12);
  if(q%2===0)assert.ok(m.translation(q,2,'circular').defect<1e-12);
}
for(let q=0;q<4;q++) {
  const r=m.rotation(q);
  assert.ok(r.liftDefect<1e-12);
  assert.ok(r.groupDefect<1e-12);
  assert.ok(m.reluVector(q).gateDefect<1e-12);
}
assert.ok(m.reluVector(1).reluDefect>0.5);
const points=[[-1,0],[0,2],[1,1]],p=[2,0,1];
assert.ok(m.error(m.setOutput(points,'sum'),m.setOutput(p.map(i=>points[i]),'sum'))<1e-12);
const attention=m.attention(points);
assert.ok(m.error(m.attention(p.map(i=>points[i])).flat(),p.map(i=>attention[i]).flat())<1e-12);
for(let rounds=0;rounds<7;rounds++)for(const mode of ['sum','mean','gcn']){
  const c=m.graph('cycle'),t=m.graph('triangles');
  assert.equal(m.sum(m.messages(m.adjacency(c),c.values,rounds,mode)),
               m.sum(m.messages(m.adjacency(t),t.values,rounds,mode)));
}
const tetra=[[0,0,0],[1,0,0],[0,1,0],[0,0,1]];
for(const mirror of [false,true]) {
  const r=m.geometry(tetra,.7,.4,mirror);
  assert.ok(r.distanceDefect<1e-12 && r.energyDefect<1e-12 && r.forceDefect<1e-12);
  assert.ok(Math.abs(r.actual.volume-(mirror?-1:1))<1e-12);
}

await import('../public/notes/research_areas/invariance-and-equivariance/attention-math.js');
const a=globalThis.GDLAttention;
const h=[[-1,.2],[-.4,1.1],[.5,.9],[1.2,-.5],[.2,-1]];
const pos=h.map((_,i)=>[Math.sin(i*1.3),Math.cos(i*.9)]);
const bias=h.map((_,i)=>h.map((_,j)=>-.6*Math.abs(i-j)));
const mask=h.map((_,i)=>h.map((_,j)=>j>i));
function permutations(xs) {
  if(!xs.length)return [[]];
  return xs.flatMap((x,i)=>permutations(xs.filter((_,j)=>i!==j)).map(rest=>[x,...rest]));
}
for(const p of permutations([0,1,2,3,4]))for(const options of [{},{positions:pos},{bias},{mask}]) {
  const base=a.attention(h,options),moved={...options};
  if(options.positions)moved.positions=a.permute(pos,p);
  if(options.bias)moved.bias=a.conjugate(bias,p);
  if(options.mask)moved.mask=a.conjugate(mask,p);
  const result=a.attention(a.permute(h,p),moved);
  assert.ok(a.error(result.output,a.permute(base.output,p))<1e-12);
  assert.ok(a.error(result.weights,a.conjugate(base.weights,p))<1e-12);
  for(const row of result.weights)assert.ok(Math.abs(row.reduce((s,x)=>s+x,0)-1)<1e-12);
}
const reverse=[4,3,2,1,0],absolute=a.attention(h,{positions:pos});
assert.ok(a.error(a.attention(a.permute(h,reverse),{positions:pos}).output,a.permute(absolute.output,reverse))>.1);
const causal=a.attention(h,{mask});
for(let i=0;i<5;i++)for(let j=i+1;j<5;j++)assert.equal(causal.weights[i][j],0);
const future=h.map((row,i)=>i>2?row.map(v=>v+20):row);
assert.ok(a.error(a.attention(future,{mask}).output.slice(0,3),causal.output.slice(0,3))<1e-12);
assert.throws(()=>a.attention(h,{mask:h.map(()=>Array(5).fill(true))}),/visible key/);
assert.throws(()=>a.attention(h,{temperature:0}),/positive/);
const padded=[...h,[100,200]],valid=[true,true,true,true,true,false];
assert.ok(a.error(a.attention(padded,{valid}).output.slice(0,5),a.attention(h).output)<1e-12);

console.log('GDL: 31 active MDX notes; core sizes 6/5/4/6/5/5; planned sizes 7/8/7/5/7; aliases, teaching blocks, references, assets, KaTeX, and attention/symmetry identities passed.');
