# 遠征介面 brief 的重新評估

針對「Build a lab website with a game-inspired expedition UI」那份 brief，對照
現況（`lab-rpg-rules.md`、`lab-interaction-plan.md`）逐項評估。

結論先講：**brief 裡大約六成已經做完了，只是名字不同；兩成值得做；兩成會讓網站
變差，我建議不要做。** 那份 brief 是在不知道現有網站與技術棧的前提下寫的，所以
它預設了一個從零開始的專案。

---

## 一、已經做完（只是名字不同）

| brief 的說法 | 站上實際的東西 |
|---|---|
| Lab framed as expedition team | 研究室 = 遠征隊，全站中文用詞已統一 |
| PI as expedition leader | 遠征隊隊長 + 燙金卡框（`Person.foil`） |
| Members → Crew roster | 遠征隊隊伍，卡片網格，正反面照片 |
| Openings → Join the expedition | `joining` 區，標籤 `RECRUITMENT QUEST` |
| HUD panels | `.hud` 角落括號、mono 標籤、`NODE n/m` |
| Map nodes | 首頁技能樹（`lab-tree`），讀過的節點會亮 |
| Mission cards | 怪物圖鑑卡、成員卡、ENCOUNTER 區塊 |
| Subtle motion | 照片翻面；`prefers-reduced-motion` 已遵守 |
| Clear navigation | 側欄分區 + 區塊 mono 標籤 + 路線選擇 |
| Mobile responsive | 既有斷點（460 / 760 / 960） |

這些不需要重做。**如果重做，要小心不是為了「符合 brief 的措辭」而破壞已經運作的東西。**

## 二、值得做（真正新增的部分）

### 1. 遠征地圖：研究方向 → Expedition Map ★ 最推薦

`research` 已經有三個方向（Geometric Deep Learning／Generative Models／AI for
Science），`notes/research-areas` 底下也已經有對應的內容，但**目前沒有任何一個
頁面把「方向」和「筆記」連起來**。

一張節點圖可以同時做三件事：
- 說明這個研究室在哪些地形上活動（對外）
- 讓讀者從方向直接走到對應的 notes（導覽）
- 顯示哪些方向已經有內容、哪些還是空白（誠實）

這是整份 brief 裡**唯一真正增加資訊**的項目——跟怪物圖鑑同一個等級。

實作：SVG 節點圖，三個主節點連到子節點（各方向的 notes）。沒有 JS 時是一張靜態
圖加一份連結清單。**不要做拖曳、縮放、視差**——它是目錄，不是遊戲小地圖。

### 2. 控制台式的研究室首頁

現在的 `/handbook` 是一份**由上往下讀的文件**（hero → 理念 → 技能樹 → 圖鑑卡）。
brief 想要的是一個**一眼掃完現況的面板**。這個差別是真的，而且值得做。

可以組成面板的資料**已經存在**：招募狀態、成員數、研究方向、最近消息、手冊路線。

**但有一個陷阱要先講清楚：資料稀疏的儀表板比文件更難看。** 三個半空的面板會顯得
這個研究室很冷清。所以規則是——**只放現在真的有資料的面板**，其餘等有內容再加。

### 3. Dispatches（研究室動態）

`news` 目前混在個人首頁，內容是玉山學者、SIAM、任職消息——那是**個人**的動態。
研究室自己的動態（有人加入、論文被接受、辦了什麼活動）目前無處可放。

這同時也補上 `lab-rpg-rules.md` 待建清單裡的「冒險日誌」。值得做，但**要等真的有
事情發生**，否則就是一個空欄位。

## 三、建議不要做

### ✗ 改寫成 Next.js + Tailwind

**這是 brief 裡最該擋下來的一項。** 現況是 Astro + 手寫 CSS，靜態輸出，預設不送
任何 JavaScript。整個設計的前提是漸進增強：沒有 JS 時每一頁都完整可讀。

換成 Next.js 得到什麼？沒有伺服器、沒有登入、沒有動態資料，**一項都用不到**。
會失去的是：目前這種「幾乎零 JS」的載入特性，以及一份已經穩定的樣式系統。
換 Tailwind 則要把 `global.css` 裡所有 CSS 變數與主題切換重做一次。

這是一次沒有收益的大型遷移。**不要做。**

### ✗ Expedition Mode / Classic Mode 切換

聽起來很吸引人，實際上是個陷阱，理由和先前否決「中英文用不同 register」一樣：
**每一個設計決定從此都要做兩次，而且永遠不能只改一邊。**

更根本的問題：一個可以關掉的遊戲介面，等於承認它是外衣。如果遠征的說法真的對應
研究室的運作方式（我們的前提就是這樣），它就不該有開關。

而且「給審查者看的樸素版本」**已經存在**——Publications 與 Experience 本來就維持
學術風格。這是**空間上的分區**，比模式切換好：不必維護兩套，而且讀者不需要知道
有這個切換存在。

### ✗ Publications / Awards → Achievements

**成本效益最差的一項。** 這兩頁是升等委員會、招聘委員會、玉山學者計畫會讀的頁面。
把它們做成「成就系統」，收益是一點趣味，風險是專業性受質疑。

`lab-rpg-rules.md` 早就寫了這條：遊戲語彙只用在 lab 區。這是同一條規則。

### ✗ 只做深色 HUD

站上有淺色與深色兩套主題，深色的 accent 本來就是金色，已經很 HUD。
砍掉淺色主題會影響在明亮環境或投影時閱讀的人。**HUD 感要在兩個主題下都成立**，
而不是逼所有人用深色。

### ✗ Courses → Training ground

2026 年 8 月才開始任職，目前沒有課。**先不要做空頁面。**

## 四、關於 brief 要求的「交付物」

sitemap／wireframe／moodboard／design system／mockup／component library 是外包
給設計公司時的交付清單。這個網站已經存在、已經有設計系統，而且只有一個人維護。
其中**真正有用的子集**：

| 交付物 | 判斷 |
|---|---|
| Sitemap | **值得做。** 站台長大得很快，目前沒有一份完整結構圖 |
| Design system 文件 | **值得做。** 系統其實已經存在（CSS 變數、`.hud`、mono 標籤、`--foil`），只是散在 `global.css` 沒有寫下來 |
| Component inventory | **值得做**，可以併進上一項 |
| Wireframe / moodboard | 跳過。網站已經上線，直接改真的頁面比畫線框快，而且看得到真實的字與圖 |
| Homepage mockup | 跳過，理由同上。要看效果就直接改 `/handbook` |

---

## 五、建議的順序

1. **遠征地圖**（研究方向 ↔ notes）——唯一真正增加資訊的
2. **研究室首頁改成面板式**——只放有資料的面板
3. **Design system + sitemap 文件**——把已經存在的規則寫下來
4. **Dispatches**——等真的有研究室動態再做

不做：Next.js 遷移、模式切換、Publications 遊戲化、只做深色、Training ground。

---

## 六、貫穿全部的三條底線

前面兩份文件已經立過，這裡重申，因為 brief 裡的用語（immersive、HUD、motion）
很容易把人推向違反它們的方向：

1. **每個遊戲元素都要對應研究室裡真實存在的東西**（`lab-rpg-rules.md` 第一原則）
2. **沒有 JS 時內容完整可讀**（`lab-interaction-plan.md` 第二關）
3. **外觀可以玩，文字必須嚴肅**

brief 裡的 "polished / elegant, not cartoonish" 其實和這三條同一個方向。真正衝突的
是 "immersive" 和 "Achievements"——沉浸感如果要靠犧牲可讀性或專業性來換，就不換。
