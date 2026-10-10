# Geometric Deep Learning 分子圖：背景插畫規格

給製作素材的 agent。整份文件可以直接交出去，連同同資料夾的三張參考圖：

| 檔案 | 是什麼 |
|---|---|
| `molecule-map-art-guide.png` | **版位圖**：12 個格子、每格的安靜區（紅虛線圓）、標籤帶（藍色）、每格的主題物件 |
| `molecule-map-overlay-light.png` | 淺色主題下，**會疊在你的圖上面**的向量圖層（分子、標籤） |
| `molecule-map-overlay-dark.png` | 深色主題下的同一層 |

**用途**：筆記首頁（`/notes`）星圖下方的 Geometric Deep Learning 課程地圖。每個單元是一個分子，
分子由程式以向量即時畫出（會跟著閱讀進度變色）。**你畫的是分子底下的背景**——它的工作是讓每個單元
「在講什麼對稱」這件事，多一層可以感受到、而不用讀的畫面。

---

## 0. 硬性條件

- **兩個版本**：`-day`（淺色）與 `-night`（深色）。深色版**重新生成、重新配色**，不是把淺色版調暗。
- **尺寸**：交付 **2240×944**（版面 1120×472 的 2 倍）。比例錯了會被裁切。
- **圖裡不要有任何文字、字母、數字、符號。** 單元名稱由網頁疊上去。
- **不要畫分子、原子、化學鍵、六角形苯環。** 分子是向量圖層的工作；背景再畫一次就會打架，
  而且網站的視覺識別明確禁止「六角形分子」這類科技陳腔濫調。
- **安靜區**：每格中央半徑 140px（2x）的圓，是分子的位置。這裡要是整張圖**最平靜、對比最低**的地方：
  不要密集排線、不要高對比邊緣、不要任何可能被誤認成原子的圓點。細節往格子的邊緣與角落放。
- **標籤帶**：每格下方的藍色帶狀區域保持平坦、低對比，單元名稱要能清楚閱讀。
- **格子之間不要畫邊框。** 12 個格子是同一張紙上的 12 個小場景，彼此自然融合。
- 單檔控制在 **250 KB 以內**（webp）。

## 1. 整體概念：一個對稱物件的標本櫃

想像一位 19 世紀博物學家的標本抽屜，或一張科學圖鑑的圖版：12 個小格，每格放著一件
**本身就體現了某種對稱的真實物件**。分子是圖版上的主角；背景物件是它旁邊淡淡的「實物對照」。

上排（G1–G6）是已經寫好的單元：完整、清楚的墨線加淡彩。
下排（G7–G11）是規劃中的單元：**畫成鉛筆草稿**——較淡、線條未完成、少上色。
右下角（G12）目前沒有單元：一頁**空白的筆記本紙**，暗示「還會再增加」。

## 2. 每一格畫什麼（版位見 guide 圖）

座標以 1x 計（交付時乘 2）。每格寬 186.7，安靜區圓心如下。

| 格 | 單元 | 圓心 (1x) | 背景物件 | 和單元的關係 |
|---|---|---|---|---|
| G1 | Symmetry and Translation | (93, 100) | 一條**連續花邊／壁紙飾帶**，同一個圖樣沿水平方向重複 | 平移對稱：移動一個週期就和自己重合 |
| G2 | Rotations and Feature Types | (280, 100) | **玫瑰窗**或**測角儀**的刻度圓盤 | 旋轉對稱；網站內容以 C4（四個旋轉）為主 |
| G3 | Sets and Permutations | (467, 100) | 紙上**一把散落、完全相同的小石子或種子** | 集合沒有順序，交換任兩個也沒差別 |
| G4 | Attention and Transformers | (653, 100) | **織布機的經緯線**，或釘板上彼此交錯的**繞線畫** | 每個元素都連向每個元素，強弱不同 |
| G5 | Graphs and Message Passing | (840, 100) | 一張**舊街道地圖**的片段：路口與道路（筆記的主例是台北的路口） | 圖：只沿著連線傳遞訊息 |
| G6 | Euclidean Geometry | (1027, 100) | **一面手鏡，鏡前一雙手套**（左手與右手） | 手性：旋轉怎麼轉都疊不回去，只有鏡射可以 |
| G7 | Tensor Features | (93, 312) | **渾天儀**（armillary sphere）的環 | 球面上的方向與 spherical harmonics |
| G8 | Graph Structure and Spectral Methods | (280, 312) | **克拉德尼圖形**：振動板上的沙排成的節線 | 特徵模態（eigenmode），就是頻譜方法的實物版 |
| G9 | Surfaces and Local Frames | (467, 312) | **貝殼**或彎曲殼面，上面幾個小小的切平面 | 曲面上每一點都有自己的局部座標系 |
| G10 | Approximate Symmetry and Canonicalization | (653, 312) | **一片不完全對稱的雪花**或葉子 | 近似對稱：幾乎對稱，但不完全 |
| G11 | Geometric Generative Models | (840, 312) | 一道光束裡**塵埃逐漸凝聚成一顆結晶** | 從雜訊到結構（也呼應網站的視覺概念） |
| G12 | （未來單元） | (1027, 312) | **空白的筆記本紙頁**，可有極淡的格線 | 還沒寫的那一頁 |

**物件不要正好放在安靜區中央。** 讓物件繞著安靜區、從邊緣或角落伸進來，或大而淡地墊在後面但中央留白。
例：G2 的玫瑰窗可以只畫外圈刻度，中心淡到幾乎看不見；G6 的手鏡在格子右側、手套在左下角。

## 3. 風格

與網站既有的 hero 插畫一致：**19 世紀科學田野筆記／圖鑑圖版**——細墨線、極淡的水彩暈染、大量留白、安靜。
不是資料視覺化，不是 UI，不是 3D 渲染。

## 4. 配色

分子是紫色（淺色 `#8a5ab0`、深色 `#b795dd`），**背景裡的紫色永遠要比它淡、比它灰**，讓分子保持是畫面上最飽和的紫。

- **淺色版**：底色平塗暖米色 `#efeae1`（無紋理）；線條用暖灰與石板藍灰；點綴極淡的灰紫。
- **深色版**：底色平塗 `#262830`；線條用淡暖灰與低彩度的灰紫，讓它在暗底上讀得出來，但依然退在後面。

## 5. Prompt

```
A wide scientific plate, 2240x944, laid out as an invisible grid of 6 columns and
2 rows: twelve small vignettes on one continuous sheet, with no borders between them.
Each vignette shows one real object whose shape embodies a kind of symmetry.

Top row, finished ink with a light watercolour wash, left to right:
1. a strip of repeating ornamental frieze, the same motif repeated horizontally;
2. a rose window / goniometer dial, drawn mostly as its outer ring of ticks;
3. a loose scatter of identical small pebbles on paper, in no order;
4. warp and weft threads on a loom, or string art criss-crossing between pegs;
5. a fragment of an old city street map: junctions and roads;
6. a hand mirror with a pair of gloves (a left and a right) in front of it.

Bottom row, as faint unfinished pencil under-drawing, left to right:
7. the rings of an armillary sphere;
8. Chladni figures: sand gathered along the nodal lines of a vibrating plate;
9. a curved seashell surface with a few tiny tangent planes sketched on it;
10. a snowflake that is almost, but not quite, symmetric;
11. dust in a beam of light condensing into one small crystal;
12. an empty notebook page with the faintest ruled lines.

Critical: in the centre of every vignette keep a calm, nearly empty circle about
one third of the vignette's width. A vector diagram will be placed there, so the
centre must be the quietest, lowest-contrast part of each vignette; push detail to
the edges and corners. Keep the strip just below each vignette flat and calm for a
text label.

Style: fine ink linework with light watercolour wash, in the manner of a 19th century
scientific field journal or naturalist's plate. Muted, restrained, generous empty space.

Absolutely exclude: any text, letters, numbers or glyphs; molecules, atoms, balls and
sticks, chemical bonds, hexagonal rings; borders or frames around the vignettes;
glowing effects, neon, circuit boards, brains, robots; 3D render look; vignette
darkening; heavy black outlines.
```

兩個版本，同一個 prompt，末尾各加一句：

- **淺色版**：`Background: flat warm parchment #efeae1, uniform, no texture. Linework in warm grey and slate blue-grey, with only the faintest grey-violet accents.`
- **深色版**：`Background: flat dark slate #262830. Linework in pale warm grey and muted grey-violet so it reads on a dark background. Same composition and subjects.`

## 6. 交付與放置

```
site/public/notes/molecule/molecule-day.webp     2240×944
site/public/notes/molecule/molecule-night.webp   2240×944
```

兩張都放進去，網站就會自動換成插畫版（`MoleculeMap.astro` 會偵測檔案）；只放一張則維持程式畫的背景。
**不用改任何程式碼。**

## 7. 驗收

1. 把 `molecule-map-overlay-light.png` 以 100% 疊在 `molecule-day` 上（深色同理）：每個分子都清楚、
   沒有任何背景線條穿過原子、單元名稱完全可讀。
2. 安靜區內沒有可能被誤認成原子的圓點。
3. 下排明顯比上排淡、像草稿；G12 是空白頁。
4. 圖中沒有任何文字或數字。

---

### 給維護者：版位為什麼固定

單元依**位置**排進固定的 6 欄格子（`MoleculeMap.astro` 的 `COLS`／`ROW0`／`ROW_STEP`），
從不依篇數或是否完成調整。所以新增或合併筆記不會移動任何格子；**最多 12 個單元**插畫都對得上。
若單元超過 12 個，版面會變成三排，插畫需要重畫（程式畫的背景則照常運作）。
