
// Configure Marked.js globally so it doesn't get called multiple times
marked.use(window.markedKatex({ throwOnError: false }));

let currentLang = localStorage.getItem("lang") || "en";

// ==========================================
// 1. ADD YOUR NOTES HERE
// ==========================================
const notesData = {
    "themes": [
        {
            group: { en: "Flow Matching", zh: "Flow Matching" },
            title: { en: "Flow ODE: From a Sand Pile to a Sandcastle", zh: "Flow ODE：沙堆到沙堡" },
            file: { en: "notes/research_areas/flow-matching/story-en.md", zh: "notes/research_areas/flow-matching/story-zh.md" } // Fixed EN path
        },
        {
            group: { en: "Flow Matching", zh: "Flow Matching" },
            title: { en: "How to Train Flow Matching Models", zh: "訓練 Flow Matching：隨群體而動" },
            file: { en: "notes/research_areas/flow-matching/training-en.md", zh: "notes/research_areas/flow-matching/training-zh.md" }
        }
    ],
    "skills": [
        {
            group: { en: "Paper Writing", zh: "論文寫作" }, // Unified logic: added a group for skills
            title: { en: "How to Write a Compelling Introduction", zh: "如何寫一個有說服力的 Introduction" },
            file: { en: "notes/academic_skills/write-intro-en.md", zh: "notes/academic_skills/write-intro-zh.md" }
        }
    ]
};

const categoryTitles = {
    "themes": { en: "Research Areas", zh: "研究領域" },
    "skills": { en: "Academic Skills", zh: "學術技能" }
};

const homeTranslations = {
    "home-title": { en: "Notes & Guides", zh: "筆記與指南" },
    "home-subtitle": { en: "A collection of research skill guides and technical notes on my research areas, intended as an open resource for anyone.", zh: "一些關於研究技能與相關領域的筆記，開放給所有對這些主題有興趣或從事研究的人。" },
    "tree-root-title": { en: "Note Repository", zh: "筆記庫" },
    "updates-title": { en: "Recent Updates", zh: "最新更新" },
    "upd-1": { en: "Preparing introductory notes on Flow Matching.", zh: "新增 Flow Matching 筆記。" },
    "upd-2": { en: "Added new guide on writing compelling paper introductions.", zh: "新增「如何寫出具說服力的論文 Introduction」。" },
    "upd-3": { en: "Launched the Resources portal.", zh: "正式建立資源站。" }
};

function translateHome() {
    for (const [id, texts] of Object.entries(homeTranslations)) {
        const el = document.getElementById(id);
        if (el) el.innerText = texts[currentLang];
    }
}

function buildDynamicTree() {
    const treeContainer = document.getElementById('dynamic-tree');
    treeContainer.innerHTML = ''; 

    for (const categoryId in notesData) {
        let html = `<div class="tree-branch">
            <div class="tree-category" onclick="loadCategory('${categoryId}')">${categoryTitles[categoryId][currentLang]}</div>
            <div class="tree-leaves">`;

        let currentGroup = null;
        
        notesData[categoryId].forEach((note, index) => {
            if (note.group && note.group[currentLang] !== currentGroup) {
                currentGroup = note.group[currentLang];
                html += `<div style="font-size: 0.9rem; font-weight: 700; color: var(--text); margin: 15px 0 5px 0px; border-bottom: 1px dashed var(--border); padding-bottom: 4px;">📂 ${currentGroup}</div>`;
            }
            const indentStyle = note.group ? 'margin-left: 15px;' : '';
            html += `<div class="tree-leaf-item" style="${indentStyle}">
                        <span class="tree-leaf" onclick="loadCategory('${categoryId}', event, ${index})">${note.title[currentLang]}</span>
                     </div>`;
        });

        html += `</div></div>`;
        treeContainer.innerHTML += html;
    }
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    
    translateHome();
    buildDynamicTree(); 

    const container = document.getElementById('main-container');
    if (container.classList.contains('home-active')) { return; }

    const activeCategoryBtn = document.querySelector('.cat-btn.active-cat');
    let activeCategory = "skills"; 
    
    if (activeCategoryBtn) {
        if (activeCategoryBtn.getAttribute('onclick').includes('themes')) activeCategory = 'themes';
        if (activeCategoryBtn.getAttribute('onclick').includes('skills')) activeCategory = 'skills';
    }

    const activeNoteBtn = document.querySelector('.note-list button.active-note');
    let activeIndex = 0;
    if (activeNoteBtn) { activeIndex = activeNoteBtn.getAttribute("data-index"); }

    loadCategory(activeCategory, null, activeIndex);
}

function loadHome() {
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active-cat'));
    document.getElementById('btn-home').classList.add('active-cat');
    
    document.getElementById('main-container').classList.add('home-active');
    localStorage.setItem("currentCategory", "home");
    translateHome();
    buildDynamicTree();

    window.history.replaceState({}, '', window.location.pathname);
    sessionStorage.setItem("currentCategory", "home");
}

function loadCategory(categoryId, event, specificIndex = null) {
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active-cat'));
    document.getElementById('btn-' + categoryId).classList.add('active-cat');
    
    document.getElementById('main-container').classList.remove('home-active');
    document.getElementById('sidebar-title').innerText = categoryTitles[categoryId][currentLang];

    const listContainer = document.getElementById('note-list-container');
    listContainer.innerHTML = '';

    let currentGroup = null;

    notesData[categoryId].forEach((note, index) => {
        if (note.group && note.group[currentLang] !== currentGroup) {
            currentGroup = note.group[currentLang];
            const groupHeader = document.createElement('div');
            groupHeader.style.cssText = "font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin: 25px 0 8px 5px; text-transform: uppercase; letter-spacing: 0.5px;";
            groupHeader.innerText = currentGroup;
            listContainer.appendChild(groupHeader);
        }

        const li = document.createElement('li');
        const btn = document.createElement('button');

        if (note.group) { btn.style.paddingLeft = "15px"; }

        btn.innerText = note.title[currentLang];
        btn.setAttribute("data-file", note.file[currentLang]); 
        btn.setAttribute("data-index", index); 
        btn.onclick = (e) => loadMarkdown(note.file[currentLang], e.target, categoryId, index);

        li.appendChild(btn);
        listContainer.appendChild(li);
    });

    let indexToLoad = specificIndex;
    if (indexToLoad === null) {
        indexToLoad = localStorage.getItem("currentNoteIndex-" + categoryId);
    }
    
    let btnToClick = null;
    if (indexToLoad !== null) {
        btnToClick = listContainer.querySelector(`button[data-index="${indexToLoad}"]`);
    }
    if (!btnToClick) {
        btnToClick = listContainer.querySelector('button');
    }

    if (btnToClick) {
        loadMarkdown(btnToClick.getAttribute("data-file"), btnToClick, categoryId, btnToClick.getAttribute("data-index"));
    }
}

async function loadMarkdown(filePath, btnElement, categoryId, noteIndex) {
    document.querySelectorAll('.note-list button').forEach(b => b.classList.remove('active-note'));
    if (btnElement) btnElement.classList.add('active-note');

    sessionStorage.setItem("currentCategory", categoryId);
    sessionStorage.setItem("currentNoteIndex-" + categoryId, noteIndex);

    const newUrl = `${window.location.pathname}?cat=${categoryId}&id=${noteIndex}`;
    window.history.replaceState({path: newUrl}, '', newUrl);

    const contentDiv = document.getElementById('markdown-content');
    contentDiv.innerHTML = "Loading...";

    let textToParse = "";

    // Step 1: Try to fetch the file from the server
    try {
        const res = await fetch(filePath);
        if (!res.ok) throw new Error("File not found");
        textToParse = await res.text();
    } catch (networkError) {
        // ==== 404 NETWORK FALLBACK ====
        const comingSoonPath = `notes/coming-soon-${currentLang}.md`;
        const noteData = notesData[categoryId][noteIndex];
        if (!noteData.title.en.includes("Coming Soon")) noteData.title.en += " (Coming Soon!)";
        if (!noteData.title.zh.includes("即將推出")) noteData.title.zh += " (即將推出!)"; 

        if (btnElement) btnElement.innerText = noteData.title[currentLang]; 
        buildDynamicTree(); 

        try {
            const fallbackRes = await fetch(comingSoonPath);
            if (!fallbackRes.ok) throw new Error("Fallback file not found");
            textToParse = await fallbackRes.text();
        } catch (fallbackErr) {
            contentDiv.innerHTML = `
                <div style="text-align: center; margin-top: 50px;">
                    <h1 style="border: none;">🚧 ${currentLang === 'zh' ? '即將推出' : 'Coming Soon'}</h1>
                    <p style="color: var(--text-muted);">${currentLang === 'zh' ? '這篇筆記還在整理中，請確認檔案位置或伺服器連線。' : 'This note is currently being prepared, or the file path is incorrect. Check back later!'}</p>
                    <p style="font-size: 0.8rem; color: #a0a0a0;">Attempted to load: <code>${filePath}</code></p>
                </div>
            `;
            return; // Stop execution here if we have no text to parse
        }
    }

    // Step 2: Try to parse the fetched text with marked & KaTeX
    try {
        contentDiv.innerHTML = marked.parse(textToParse);
        Prism.highlightAllUnder(contentDiv);

    } catch (parseError) {
        // ==== PARSING ERROR FALLBACK (Usually caused by heavy LaTeX syntax errors) ====
        contentDiv.innerHTML = `
            <div style="margin-top: 20px; border-left: 4px solid #c65d4a; padding: 15px; background: #fff5f5;">
                <h2 style="margin-top: 0; color: #c65d4a;">⚠️ Markdown/Math Parsing Error</h2>
                <p>The file was found, but the parser crashed. This is usually caused by invalid LaTeX syntax in your document.</p>
                <code>${parseError.message}</code>
            </div>
        `;
    }
}

function init() {
    translateHome();
    buildDynamicTree();

    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    const idParam = urlParams.get('id');   
    const forceHome = urlParams.get('home') === 'true';

    if (catParam && notesData[catParam]) {
        const index = idParam !== null ? parseInt(idParam) : 0;
        loadCategory(catParam, null, index);
    } else if (forceHome) {
        loadHome();
    } else {
        let lastCategory = sessionStorage.getItem("currentCategory") || "home";
        if (lastCategory === "home") {
            loadHome();
        } else {
            loadCategory(lastCategory);
        }
    }
}

// 同時監聽兩種情況
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // 如果已經載入完成（從其他頁面跳轉過來時常發生）
    init();
}


window.addEventListener('message', function(e) {
  if (e.data && e.data.iframeHeight) {
    const wrappers = document.querySelectorAll('.demo-wrapper');
    wrappers.forEach(wrapper => {
      const frame = wrapper.querySelector('.demo-frame');
      if (!frame) return;
      
      // 用回報的實際高度取代固定 720
      const actualHeight = e.data.iframeHeight;
      frame.style.height = actualHeight + 'px';
      
      const scale = wrapper.offsetWidth / 1280;
      frame.style.transform = `scale(${scale})`;
      wrapper.style.height = (actualHeight * scale) + 'px';
    });
  }
});

