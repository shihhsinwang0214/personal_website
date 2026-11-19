const wrap=(body)=>`<svg viewBox="0 0 640 285" role="img" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10" fill="currentColor"/></marker></defs>${body}</svg>`;
const line=(x1,y1,x2,y2,cls='green')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="3" marker-end="url(#arrow)"/>`;
const dot=(x,y,cls='green',r=5)=>`<circle cx="${x}" cy="${y}" r="${r}" class="${cls}"/>`;
const text=(x,y,t,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}">${t}</text>`;
const cloud=(cx,cy,cls)=>Array.from({length:30},(_,i)=>dot(cx+Math.sin(i*2.399)*Math.sqrt(i)*7,cy+Math.cos(i*2.399)*Math.sqrt(i)*5,cls,3.3)).join('');
export const figures = {
transport:{title:'每次只改一點位置，整群人的形狀就跟著改',svg:wrap(
 cloud(100,140,'green')+cloud(320,140,'muted')+cloud(540,140,'gold')+
 line(165,140,247,140)+line(387,140,465,140)+
 text(100,57,'起點 p₀')+text(320,57,'中間 pₜ')+text(540,57,'終點 p₁')+
 text(320,246,'每個位置的移動，累積成整群分布的改變')
),caption:'點雲是 distribution 的示意，不代表某一張照片的語意對應。是否保留個別內容，需要另外設計。'},
reference:{title:'先知道兩端，就能算出路上的位置與速度',svg:`<svg class="reference-map" viewBox="0 0 640 360" role="group" aria-label="可拖曳起點與終點的 reference path" xmlns="http://www.w3.org/2000/svg">
 <g class="reference-grid" aria-hidden="true"><path d="M64 180H576M320 52V308"/><path d="M160 175V185M240 175V185M400 175V185M480 175V185M315 110H325M315 250H325"/></g>
 <g data-distributions hidden aria-hidden="true"></g>
 <line data-reference-line x1="160" y1="236" x2="480" y2="110" class="green" stroke-width="2.5"/>
 <g data-endpoint="0" transform="translate(160 236)" tabindex="0" role="button" aria-label="起點 x₀，可拖曳或使用方向鍵移動"><circle class="endpoint-hit" r="22"/><circle class="endpoint-dot green" r="9"/></g>
 <g data-endpoint="1" transform="translate(480 110)" tabindex="0" role="button" aria-label="終點 x₁，可拖曳或使用方向鍵移動"><circle class="endpoint-hit" r="22"/><circle class="endpoint-dot gold" r="9"/></g>
 <circle data-reference-current cx="320" cy="173" r="7" class="ink"/>
 <text data-endpoint-label="0" x="160" y="264" text-anchor="middle">x₀</text><text data-endpoint-label="1" x="480" y="138" text-anchor="middle">x₁</text>
 <text data-reference-label x="320" y="149" text-anchor="middle">Iₜ</text>
 </svg>`,caption:'拖曳兩端，改變這組 reference path；時間滑桿決定中途位置。端點聚焦後也可用方向鍵移動。這條路用來製造 training input 與 velocity label，生成時尚不知道終點。',control:'reference'},
average:{title:'同一個 input，模型只能給一個速度',svg:wrap(
 line(320,228,470,78,'gold')+line(320,228,170,78,'gold')+line(320,228,320,78)+dot(320,228,'ink',7)+
 text(480,48,'(2, 2)')+text(150,48,'(−2, 2)')+`<text data-average-label x="320" y="112" text-anchor="middle" style="fill:var(--green);stroke:var(--green-soft);stroke-width:7px;paint-order:stroke;stroke-linejoin:round">(0, 2)</text>`+text(320,272,'相同時間、相同位置')
),caption:'圖示兩條來路等可能時的條件平均。改變右側來路的權重，看平均箭頭如何變動；這不是在證明整條 trajectory 的形狀。',control:'average'},
flux:{title:'固定地面上的區域，數流入與流出',svg:wrap(
 `<rect x="185" y="65" width="270" height="155" rx="8" class="area"/>`+
 line(40,140,175,140)+line(465,140,600,140,'gold')+
 text(105,100,'流入 6')+text(535,100,'流出 4')+text(320,127,'區間內')+text(320,170,'每秒增加 2')+
 text(190,260,'x')+text(450,260,'x + Δx')
),caption:'這是向右流的數值例子。邊界上的 flux 帶有方向；區間內的變化率由流入減流出決定。'},
conversion:{title:'同一個 noisy state，換一種輸出表示',html:`<div class="flow-diagram"><div><small>固定觀察</small><b>同一個 x、t</b><span>相同 path 與 noise level</span></div><i>→</i><div><small>已學到</small><b>平均 noise</b><span>εθ(x, t)</span></div><i>→</i><div><small>按 schedule 換算</small><b>velocity</b><span>位置項 ＋ noise 項</span></div></div>`,caption:'U1 的 τ：資料 → noise；U2 的 t：noise → 資料。時間與係數需要一起對齊，不能只換模型輸出的名稱。'},
coupling:{title:'兩端的人數相同，改的是誰去找誰',svg:wrap(
 text(160,35,'配到對面')+text(480,35,'配到同側')+
 line(60,90,260,220,'gold')+line(60,220,260,90,'gold')+
 line(380,90,580,90)+line(380,220,580,220)+
 [60,380].map(x=>dot(x,90,'green',9)+dot(x,220,'green',9)).join('')+
 [260,580].map(x=>dot(x,90,'gold',9)+dot(x,220,'gold',9)).join('')+
 text(320,280,'p₀、p₁ 相同；reference paths 與中間 pₜ 可以不同')
),caption:'左右各是一組兩點的配對示意。用來看 coupling 的差異，不把交叉點的單一箭頭當作平滑 ODE 的存在保證。'},
lab:{title:'同一個 toy，分開查三種不同的誤差',html:`<div class="flow-diagram"><div><small>端點抽樣</small><b>reference labels</b><span>同 input 可能有分歧</span></div><i>→</i><div><small>梯度更新</small><b>learned field</b><span>與 exact field 比較</span></div><i>→</i><div><small>有限步積分</small><b>生成樣本</b><span>與精確 ODE 比較</span></div></div>`,caption:'Training label MSE、模型 field error、solver error 有不同的比較對象。提高其中一項的精度，不會自動消除另外兩項。'}
};
