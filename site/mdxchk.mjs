import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import fs from 'node:fs'; import path from 'node:path';
const root = process.argv[2]; const files = [];
(function walk(d){ for (const e of fs.readdirSync(d,{withFileTypes:true})) { const p = path.join(d,e.name);
  if (e.isDirectory()) walk(p); else if (p.endsWith('.mdx')) files.push(p);} })(root);
let bad = 0;
for (const f of files) {
  let src = fs.readFileSync(f,'utf8').replace(/^---\n[\s\S]*?\n---\n/,'').replace(/^import .*$/gm,'').replace(/frontmatter\./g,'x.');
  try { await compile(src,{remarkPlugins:[remarkGfm,remarkMath]}); }
  catch(e){ bad++; console.log('FAIL', path.basename(f), String(e.message).split('\n')[0]); }
}
console.log(`checked ${files.length}, ${bad} failed`);
