#!/usr/bin/env node
/**
 * Build the downloadable Research Reflection Questionnaire (.docx) from the
 * markdown pages, so the Word file can never drift from the website.
 *
 *   npm run build:questionnaire        # writes both zh and en into public/assets
 *
 * Source of truth:
 *   src/content/handbook/joining/research-reflection-questionnaire.{zh,en}.md
 *     - "## 基本資料" / "## Basic information"  -> the fill-in fields
 *     - "### 1. ..." headings                  -> the questions (stems only)
 *
 * The Word file deliberately contains ONLY the basic-info fields and the
 * question stems — the prompts and guidance stay on the website.
 *
 * Requires the `docx` package:  npm i -D docx
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(SITE, 'src/content/handbook/joining');
const OUT = join(SITE, 'public/assets');

let docx;
try {
  docx = await import('docx');
} catch {
  console.error('Missing dependency "docx".  Run:  npm i -D docx');
  process.exit(1);
}
const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = docx;

const LOCALE = {
  zh: {
    file: 'research-reflection-questionnaire.zh.md',
    out: 'research-reflection-questionnaire-zh.docx',
    font: 'Microsoft JhengHei',
    title: '研究反思問卷',
    subtitle: '王士欣實驗室 — 申請文件',
    note:
      '每題的思考面向、填寫注意事項與 AI 工具使用規範，請見網站「研究反思問卷」頁面。多數題目以 5–10 句回答即可；回答空間不足時，請自行延伸段落。完成後請將本文件轉成 PDF，隨申請信一起寄出。',
    basicHeading: '基本資料',
    basicIntro: '請提供穩定而且實際可行的估計，不需要為了表現投入程度而誇大時間。',
    questionsHeading: '問題',
    basicSection: /^##\s+基本資料\s*$/m,
  },
  en: {
    file: 'research-reflection-questionnaire.en.md',
    out: 'research-reflection-questionnaire-en.docx',
    font: 'Calibri',
    title: 'Research Reflection Questionnaire',
    subtitle: "Shih-Hsin Wang's Lab — Application Document",
    note:
      'For the thinking prompts under each question, writing guidelines, and the policy on AI tools, see the "Research Reflection Questionnaire" page on the website. Five to ten sentences is enough for most questions; extend the space as needed. When finished, convert this document to PDF and attach it to your application email.',
    basicHeading: 'Basic Information',
    basicIntro: 'Please give a stable, realistic estimate — no need to inflate your hours to signal commitment.',
    questionsHeading: 'Questions',
    basicSection: /^##\s+Basic information\s*$/m,
  },
};

/** Strip markdown links/emphasis so the Word file reads as plain prose. */
const plain = (s) =>
  s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();

function extract(md, locale) {
  // Questions: "### 1. <stem>" up to the end of the heading line.
  const questions = [...md.matchAll(/^###\s+\d+\.\s+(.+)$/gm)].map((m) => plain(m[1]));

  // Basic-info fields: bullet list inside the basic-information section.
  const start = md.search(locale.basicSection);
  if (start === -1) throw new Error(`could not find the basic-information section in ${locale.file}`);
  const after = md.slice(start);
  const sectionEnd = after.slice(3).search(/^##\s+/m);
  const section = sectionEnd === -1 ? after : after.slice(0, sectionEnd + 3);
  const fields = [...section.matchAll(/^[*-]\s+(.+)$/gm)]
    .map((m) => plain(m[1]))
    .map((s) => s.replace(/[;；]$/, '').replace(/[.。]$/, ''))
    .map((s) => (/[:：]$/.test(s) ? s : `${s}：`.replace(/：$/, locale === LOCALE.en ? ':' : '：')));

  if (!questions.length) throw new Error(`no "### N." questions found in ${locale.file}`);
  if (!fields.length) throw new Error(`no basic-information fields found in ${locale.file}`);
  return { questions, fields };
}

function buildDoc(locale, { questions, fields }) {
  const { font } = locale;
  const text = (t, opts = {}) =>
    new TextRun({ text: t, font, size: opts.size ?? 22, bold: opts.bold, color: opts.color });
  const para = (t, opts = {}) =>
    new Paragraph({ spacing: { after: opts.after ?? 160 }, children: [text(t, opts)] });
  const ruledLine = (t, after) =>
    new Paragraph({
      spacing: { after },
      border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: 'BFBFBF', space: 6 } },
      children: [text(t)],
    });

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [text(locale.title, { size: 34, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [text(locale.subtitle, { color: '595959' })],
    }),
    para(locale.note, { size: 20, color: '595959', after: 320 }),
    para(locale.basicHeading, { size: 26, bold: true, after: 120 }),
    para(locale.basicIntro, { size: 20, color: '595959', after: 200 }),
    ...fields.map((f) => ruledLine(f, 240)),
    para(locale.questionsHeading, { size: 26, bold: true, after: 200 }),
  ];

  questions.forEach((q, i) => {
    children.push(para(`${i + 1}. ${q}`, { bold: true, after: 160 }));
    children.push(ruledLine('', 360)); // answer space
  });

  return new Document({
    styles: { default: { document: { run: { font, size: 22 } } } },
    sections: [{ properties: {}, children }],
  });
}

for (const key of ['zh', 'en']) {
  const locale = LOCALE[key];
  const md = readFileSync(join(SRC, locale.file), 'utf8');
  const parsed = extract(md, locale);
  const buffer = await Packer.toBuffer(buildDoc(locale, parsed));
  writeFileSync(join(OUT, locale.out), buffer);
  console.log(`${locale.out}: ${parsed.fields.length} fields, ${parsed.questions.length} questions`);
}
