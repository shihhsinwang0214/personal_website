#!/usr/bin/env python3
"""照 claude/dma-notes-style-guide.md 的新規則做「軟」稽核（只報告，不是硬錯）。

用法（從 site/ 執行）：
    python scripts/audit-notes.py src/content/notes/research-areas/diffusion-models-and-their-applications/*/*.zh.mdx

檢查：
  LONG      一個 ## 節的「主線散文」超過 20 段（§1；元件內部與清單不算）
  NOGLOSS   $$ 展示式後面不是白話散文或收束句（§5）
  BUTx3     短距離內連續 3 個以上「但」開頭（§2）
  EDIT      編輯口吻的轉場（§2）
  BQ        blockquote 數不在 2–4（§6）
"""
import io, re, sys, os

EDITORIAL = ["要特別分清楚", "先說清楚", "總結一下", "綜上所述", "值得一提的是",
             "接下來我們將", "本節將", "首先，我們", "換了一種思路"]

def blocks(lines):
    """回傳 (kind, start, end) 的串列；kind in prose/math/fence/comp/head/list/bq/blank"""
    out, i, n = [], 0, len(lines)
    fence = None
    while i < n:
        L = lines[i]
        m = re.match(r"^\s{0,3}(`{3,}|~{3,})", L)
        if m:
            mark = m.group(1)
            j = i + 1
            while j < n and not re.match(r"^\s{0,3}" + re.escape(mark[0]) + "{" + str(len(mark)) + ",}\\s*$", lines[j]):
                j += 1
            out.append(("fence", i, j)); i = j + 1; continue
        if L.strip() == "$$":
            j = i + 1
            while j < n and lines[j].strip() != "$$":
                j += 1
            out.append(("math", i, j)); i = j + 1; continue
        if not L.strip():
            out.append(("blank", i, i)); i += 1; continue
        if L.startswith("#"):
            out.append(("head", i, i)); i += 1; continue
        if L.startswith(">"):
            out.append(("bq", i, i)); i += 1; continue
        if re.match(r"^\s*[-*+]\s|^\s*\d+\.\s", L):
            out.append(("list", i, i)); i += 1; continue
        if L.startswith("<") or L.startswith("|") or L.startswith("!["):
            out.append(("comp", i, i)); i += 1; continue
        out.append(("prose", i, i)); i += 1
    return out

def audit(path):
    src = io.open(path, encoding="utf-8").read()
    body = src.split("---", 2)[-1]
    lines = body.split("\n")
    bl = blocks(lines)
    name = os.path.basename(path).replace(".zh.mdx", "")
    hits = []

    # LONG：只數「主線散文」的段數——元件內部（Question/Answer/VizPlan/Remark/Details）
    # 和清單都不算，因為它們本身就是路標。W3.1 那個 27 段是連續的主線散文才難讀。
    OPEN = re.compile(r"^<(Question|Answer|VizPlan|Remark|Details|QuizBlock)\b")
    CLOSE = re.compile(r"^</(Question|Answer|VizPlan|Remark|Details|QuizBlock)>")
    sec, cnt, depth = None, 0, 0
    for k, a, b in bl:
        L = lines[a]
        if CLOSE.match(L): depth = max(0, depth - 1); continue
        if OPEN.match(L): depth += 1; continue
        if k == "head" and L.startswith("## "):
            if sec and cnt > 20: hits.append(("LONG", f"{sec} → {cnt} 段"))
            sec, cnt = L[3:].strip(), 0
        elif depth == 0 and k == "prose" and len(L) > 15:
            cnt += 1
    if sec and cnt > 20: hits.append(("LONG", f"{sec} → {cnt} 段"))

    # NOGLOSS：$$ 之後第一個非空區塊不是 prose
    for idx, (k, a, b) in enumerate(bl):
        if k != "math": continue
        for k2, a2, b2 in bl[idx+1:]:
            if k2 == "blank": continue
            if k2 not in ("prose", "bq"):
                hits.append(("NOGLOSS", f"L{a+1} 之後是 {k2}"))
            break

    # BUTx3
    starts = [i for i, L in enumerate(lines) if re.match(r"^但", L.strip()) or "。但" in L]
    for i in range(len(starts) - 2):
        if starts[i+2] - starts[i] <= 6:
            hits.append(("BUTx3", f"L{starts[i]+1}–{starts[i+2]+1}")); break

    # EDIT
    for w in EDITORIAL:
        if w in body: hits.append(("EDIT", w))

    # BQ
    nbq = len([1 for k, a, b in bl if k == "bq"])
    if nbq < 2 or nbq > 4: hits.append(("BQ", str(nbq)))
    return name, hits

rows = [audit(p) for p in sys.argv[1:]]
tot = {}
for name, hits in rows:
    if hits:
        kinds = {}
        for k, d in hits: kinds.setdefault(k, []).append(d)
        print(f"{name}")
        for k, ds in kinds.items():
            print(f"    {k:8} {'; '.join(ds[:3])}{' …' if len(ds)>3 else ''}")
        for k, d in hits: tot[k] = tot.get(k, 0) + 1
print("\n=== 合計 ===")
for k, v in sorted(tot.items(), key=lambda x: -x[1]): print(f"{k:8} {v}")
print(f"有 flag 的篇數 {len([1 for _,h in rows if h])} / {len(rows)}")
