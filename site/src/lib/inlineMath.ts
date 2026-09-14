/**
 * inlineMath.ts — 把「純文字屬性」裡的 $…$ 用 KaTeX 渲染成 HTML。
 *
 * 為什麼需要它：`summary="…"` 是 MDX 的 JSX 屬性，會被當成 JavaScript 字串常值
 * 直接交給元件，從頭到尾沒有進過 markdown 管線（`astro.config.mjs` 掛的
 * remarkMath / rehypeKatex 只看文件的 markdown 語法樹）。所以屬性裡的 $…$ 只是
 * 字元。這個函式在元件裡補上那一步，讓 summary 這類單行屬性也能寫數學。
 *
 * 用法（元件端）：
 *   import { inlineMath } from '../../lib/inlineMath';
 *   <span class="more-title" set:html={inlineMath(summary)} />
 *
 * 規則：
 *   - `$…$` 與 `$$…$$` 都以**行內模式**渲染。這些屬性是單行的可點標題，
 *     display 模式會把版面撐開。
 *   - `\$` 是字面上的錢字號。
 *   - 沒有配對的 `$` 原樣留著，不會把後面的字吃掉。
 *   - 數學之外的文字一律 HTML 轉義（所以 summary 裡可以安全地寫 `<`、`&`）。
 *   - `throwOnError: false`：寫錯的式子會在頁面上顯示成紅色，而不是讓 build 爆掉。
 *
 * 輸出 html + mathml（KaTeX 預設），和內文數學一致，螢幕閱讀器讀得到。
 */
import katex from 'katex';

const ESC: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** HTML 轉義，並把 `\$` 還原成字面上的 `$`。只用在「非數學」的片段上。 */
function text(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ESC[c]).replace(/\\\$/g, '$');
}

/** 下一個「沒有被反斜線轉義」的 `$` 的位置；找不到回傳 -1。 */
function findDollar(s: string, from: number): number {
  for (let i = from; i < s.length; i += 1) {
    if (s[i] !== '$') continue;
    let back = 0;
    while (i - 1 - back >= 0 && s[i - 1 - back] === '\\') back += 1;
    if (back % 2 === 0) return i; // 偶數個反斜線 → 這個 $ 沒被轉義
  }
  return -1;
}

export function inlineMath(input: string | undefined | null): string {
  if (!input) return '';
  const src = String(input);
  let out = '';
  let i = 0;

  while (i < src.length) {
    const open = findDollar(src, i);
    if (open < 0) {
      out += text(src.slice(i));
      break;
    }

    const display = src.slice(open, open + 2) === '$$';
    const delimLen = display ? 2 : 1;

    let close = findDollar(src, open + delimLen);
    if (display) {
      // `$$` 要連續兩個 `$` 才算收尾
      while (close >= 0 && src.slice(close, close + 2) !== '$$') {
        close = findDollar(src, close + 1);
      }
    }

    if (close < 0) {
      // 沒有配對：把這個 `$` 當字面字元，繼續往後掃
      out += text(src.slice(i, open + delimLen));
      i = open + delimLen;
      continue;
    }

    out += text(src.slice(i, open));
    const expr = src.slice(open + delimLen, close).trim();
    if (expr) {
      out += katex.renderToString(expr, {
        throwOnError: false,
        displayMode: false,
        strict: false,
      });
    }
    i = close + delimLen;
  }

  return out;
}
