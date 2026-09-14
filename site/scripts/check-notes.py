#!/usr/bin/env python3
"""筆記自查腳本（見 claude/dma-notes-style-guide.md §8）。

用法：從 site/ 目錄執行
    python scripts/check-notes.py $(find src/content/notes -name "*.zh.mdx" ! -name "n2d-*" ! -name "dfc-*")

檢查五件事：
  BAN       禁用句型（舊體例、已停用的舊課代號、localhost 連結）
  REF       <Ref to/week> 指到不存在的 label
  BARE-LT   數學／inline code／fence／JSX 屬性字串之外的裸 <
  BOLD      CJK 粗體斷裂（收尾 ** 前是標點、後面接非標點非空白）
  IMPORT    用了元件但漏了 import

label 來源＝所有筆記的 frontmatter ＋ src/lib/notes.ts 的登錄表。
會跳過 fence（支援 3 個以上的 backtick／tilde，收尾 marker 必須不短於開頭）與多行 $$ 區塊。
"""
import io,os,re,sys,glob,unicodedata
ROOT="src/content/notes"
labels=set()
for f in glob.glob(ROOT+"/**/*.mdx",recursive=True)+glob.glob(ROOT+"/**/*.md",recursive=True):
    s=io.open(f,encoding='utf-8').read()
    m=re.search(r'^label:\s*"([^"]+)"',s,re.M)
    if m: labels.add(m.group(1))
reg=io.open("src/lib/notes.ts",encoding='utf-8').read()
labels|=set(re.findall(r"^\s*'([a-z0-9-]+)':\s*\{",reg,re.M))
weeks=set(re.findall(r"'(dma-week-[a-z-]+)'",reg))
for f in glob.glob("src/components/notes/*.astro"):
    weeks|=set(re.findall(r"'(dma-week-[a-z-]+)'",io.open(f,encoding='utf-8').read()))
def ispunct(ch):
    return unicodedata.category(ch).startswith('P') or ch in '，。：；、（）？！＋－＝'
BAN=["先說清楚","課堂上收到的答案","課堂上收到的候選","課堂答案","少數人會說","幾乎沒有人主動說",
     "課堂上大多數人會說","from-noise-to-data","n2d-","dfc-","localhost"]
KNOWNTAG = re.compile(r'^</?(?:[A-Z][A-Za-z0-9]*|br|iframe|sub|sup|b|i|em|strong|code|span|div|p|a|img|details|summary|table|thead|tbody|tr|td|th|ul|ol|li|hr)\b')
bad=0
for f in sys.argv[1:]:
    s=io.open(f,encoding='utf-8').read(); name=os.path.basename(f)
    for b in BAN:
        if b in s: print("BAN",name,b); bad+=1
    for lab in re.findall(r'<Ref\s+to="([^"]+)"',s):
        if lab not in labels: print("MISSING to=",name,lab); bad+=1
    for lab in re.findall(r'<Ref\s+week="([^"]+)"',s):
        if lab not in weeks: print("MISSING week=",name,lab); bad+=1
    lines=s.split("\n"); fence=None; indisp=False
    for ln,line in enumerate(lines,1):
        m=re.match(r"^\s{0,3}(`{3,}|~{3,})(.*)$", line)
        if m:
            mark=m.group(1)
            if fence is None:
                fence=mark; continue
            # 收尾的 marker 至少要和開頭一樣長，而且後面不能有 info string
            if mark[0]==fence[0] and len(mark)>=len(fence) and m.group(2).strip()=="":
                fence=None; continue
            continue
        if fence is not None: continue
        if line.strip()=="$$": indisp = not indisp; continue
        if indisp: continue
        # 把數學、行內 code、JSX 屬性字串遮掉之後，剩下的 "<" 才是 MDX 的危險
        masked = re.sub(r'\$\$?[^$\n]*\$\$?', lambda m: ' '*len(m.group(0)), line)
        masked = re.sub(r'`[^`\n]*`', lambda m: ' '*len(m.group(0)), masked)
        masked = re.sub(r'"[^"\n]*"', lambda m: ' '*len(m.group(0)), masked)
        for m in re.finditer('<', masked):
            i=m.start(); rest=line[i:]
            if KNOWNTAG.match(rest): continue
            nxt = line[i+1] if i+1 < len(line) else ' '
            if nxt in ' \t' or line[max(0,i-1):i]=='\\': continue
            print("BARE-LT",name,"L%d"%ln,repr(line[max(0,i-30):i+20])); bad+=1
        # CJK 粗體斷裂：收尾 ** 前面是標點、後面又緊接非標點非空白
        pos=[m.start() for m in re.finditer(r'\*\*',line)]
        for k in range(1,len(pos),2):
            i=pos[k]
            before=line[i-1] if i>0 else ' '
            after=line[i+2] if i+2<len(line) else ' '
            if ispunct(before) and after.strip() and not ispunct(after):
                print("BOLD-BREAK",name,"L%d"%ln,repr(line[max(0,i-14):i+6])); bad+=1
    used=set(re.findall(r'<([A-Z][A-Za-z]*)',re.sub(r'\$\$?[^$\n]*\$\$?','',s)))
    imp=set(re.findall(r'^import\s+([A-Za-z]+)\s+from',s,re.M))
    miss=used-imp
    if miss: print("IMPORT?",name,sorted(miss)); bad+=1
print("issues:",bad)
