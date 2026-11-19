(()=>{
 'use strict';
 const $=(selector,root=document)=>root.querySelector(selector);
 const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
 const chapters=$$('.chapter');
 $('.skip').onclick=e=>{e.preventDefault();$('#reading').focus();$('#reading').scrollIntoView({block:'start'});};
 const saved=(key,value)=>{try{if(value===undefined)return localStorage.getItem(key);localStorage.setItem(key,value);}catch{}return null;};
 let focus=saved('u2-prototype-mode')==='focus',current=0,beat=0;
 document.documentElement.classList.add('enhanced');
 function setTheme(theme){document.documentElement.dataset.theme=theme;$('#theme').textContent=theme==='dark'?'切換淺色':'切換深色';saved('u2-prototype-theme',theme);$$('.plot').forEach(p=>{if(p.chartData)plot(p,p.chartData);});}
 setTheme(saved('u2-prototype-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
 $('#theme').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
 let closedDetails=[];
 window.addEventListener('beforeprint',()=>{closedDetails=$$('details:not([open])');closedDetails.forEach(d=>d.open=true);});
 window.addEventListener('afterprint',()=>closedDetails.forEach(d=>d.open=false));
 $('#print').onclick=()=>window.print();
 function route(){
  const [id,index]=location.hash.slice(1).split('/');
  const found=chapters.findIndex(c=>c.id===id);
  current=found<0?0:found;
  beat=Math.max(0,Math.min(Number(index)||0,$$('.beat',chapters[current]).length));
  chapters.forEach((c,i)=>{c.hidden=i!==current;});
  $$('[data-chapter-link]').forEach(a=>{a.toggleAttribute('aria-current',a.dataset.chapterLink===chapters[current].id);if(a.hasAttribute('aria-current'))a.setAttribute('aria-current','page');});
  $('#chapter-prev').disabled=current===0;$('#chapter-next').disabled=current===chapters.length-1;
  $('#chapter-status').textContent=`${current+1} / ${chapters.length} 篇`;
  renderMode();
  document.title=`${$('.eyebrow',chapters[current]).textContent.split(' · ')[0]} · ${$('h1',chapters[current]).textContent}｜節奏試讀`;
  const active=$('[data-chapter-link][aria-current]');if(innerWidth<=750)active?.scrollIntoView({block:'nearest',inline:'nearest'});
 }
 function renderMode(){
  document.body.classList.toggle('focus',focus);
  const c=chapters[current],sections=$$('.beat',c),end=$('.chapter-end',c);
  sections.forEach((s,i)=>s.hidden=focus&&i!==beat);
  end.hidden=focus&&beat<sections.length;
  $('.focus-navigation').hidden=!focus;
  $('#mode').textContent=focus?'全文閱讀':'逐段閱讀';$('#mode').setAttribute('aria-pressed',String(focus));
  $('#beat-prev').disabled=beat===0;$('#beat-next').disabled=beat===sections.length;
  $('#beat-status').textContent=beat<sections.length?`第 ${beat+1} / ${sections.length} 段`:'回顧與下一篇';
  $('#beat-next').textContent=beat===sections.length-1?'回顧與提問 →':'下一段 →';
  $('#toc').innerHTML=sections.map((s,i)=>`<a href="#${c.id}/${i}"${i===beat?' aria-current="true"':''}>${i+1}. ${$('h2',s).textContent}</a>`).join('');
  updateProgress();
 }
 function go(index){location.hash=chapters[Math.max(0,Math.min(index,chapters.length-1))].id;}
 $('#chapter-prev').onclick=()=>go(current-1);$('#chapter-next').onclick=()=>go(current+1);
 $('#beat-prev').onclick=()=>{location.hash=`${chapters[current].id}/${Math.max(0,beat-1)}`;};
 $('#beat-next').onclick=()=>{location.hash=`${chapters[current].id}/${beat+1}`;};
 $('#mode').onclick=()=>{focus=!focus;saved('u2-prototype-mode',focus?'focus':'full');renderMode();};
 window.addEventListener('hashchange',()=>{route();if(focus&&beat>0){$(`[data-beat="${beat}"]`,chapters[current])?.scrollIntoView({block:'start',behavior:'instant'});if(beat===$$('.beat',chapters[current]).length)$('.chapter-end',chapters[current]).scrollIntoView({block:'start',behavior:'instant'});}else if(location.hash.includes('/')){$(`[data-beat="${beat}"]`,chapters[current])?.scrollIntoView({block:'start',behavior:'instant'});}else{window.scrollTo({top:0,behavior:'instant'});}});
 function updateProgress(){const c=chapters[current];let progress;if(focus){progress=beat/Math.max(1,$$('.beat',c).length);}else{const remaining=c.getBoundingClientRect().bottom-innerHeight;const total=Math.max(1,c.offsetHeight-innerHeight+150);progress=Math.max(0,Math.min(1,1-remaining/total));}$('.reading-progress i').style.width=`${progress*100}%`;}
 window.addEventListener('scroll',updateProgress,{passive:true});
 $$('.formula').forEach(f=>{
  const captions=$$('.formula-caption',f),count=Number(f.dataset.stepCount);
  const fragments=$$('.formula-fragment',f).map(element=>({element,step:Number(element.className.match(/formula-fragment-(\d+)/)[1])}));
  let step=1;
  const update=()=>{
   f.dataset.step=step;
   fragments.forEach(({element,step:group})=>{element.classList.toggle('is-future',group>step);element.classList.toggle('is-current',group===step);});
   captions.forEach((caption,i)=>{const active=i===Math.min(step,count)-1;caption.classList.toggle('current',active);caption.setAttribute('aria-hidden',String(!active));});
   $('.formula-counter',f).textContent=step>count?'完整公式':`${step} / ${count}`;
   $('[data-formula=first]',f).disabled=$('[data-formula=prev]',f).disabled=step===1;
   $('[data-formula=next]',f).disabled=$('[data-formula=all]',f).disabled=step===count+1;
  };
  const show=value=>{step=Math.max(1,Math.min(count+1,value));update();};
  $$('[data-formula]',f).forEach(b=>b.onclick=()=>{const cmd=b.dataset.formula;show(cmd==='first'?1:cmd==='all'?count+1:step+(cmd==='next'?1:-1));});
  $('.formula-controls',f).addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();show(event.key==='Home'?1:event.key==='End'?count+1:step+(event.key==='ArrowRight'?1:-1));});
  update();f.dataset.ready='true';
 });
 $$('[data-diagram]').forEach(input=>{
  const f=input.closest('figure');
  if(input.dataset.diagram==='reference'){
   const svg=$('.reference-map',f),cloud=$('[data-distributions]',f),guide=$('[data-distribution-guide]',f),toggle=$('[data-toggle-distributions]',f);
   const initial=[[-2,-.8],[2,1]],ends=initial.map(p=>p.slice());
   const px=p=>[320+80*p[0],180-70*p[1]],pair=p=>`(${Number(p[0].toFixed(2))}, ${Number(p[1].toFixed(2))})`;
   let seed=27;const uniform=()=>{seed=(1664525*seed+1013904223)>>>0;return(seed+.5)/4294967296;};
   const normal=()=>Math.sqrt(-2*Math.log(uniform()))*Math.cos(2*Math.PI*uniform());
   // Fixed paired offsets preserve each cloud's shape while its center moves.
   const pairs=Array.from({length:200},()=>[[.4*normal(),.34*normal()],[.4*normal(),.34*normal()]]);
   const play=$('[data-reference-play]',f);let playing=false,frameId=0;
   const updatePlay=()=>{play.textContent=playing?'暫停':Number(input.value)>=1?'重播':'播放';play.setAttribute('aria-pressed',String(playing));$('.figure-stat',f).setAttribute('aria-live',playing?'off':'polite');};
   const pause=()=>{playing=false;cancelAnimationFrame(frameId);updatePlay();};
   const stats=$('.figure-stat',f),positionText=document.createElement('span'),velocityText=document.createElement('span');
   positionText.className='reference-position';velocityText.className='reference-velocity';stats.replaceChildren(positionText,velocityText);
   const circles=[];
   for(let group=0;group<3;group++)for(let i=0;i<pairs.length;i++){
    const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('r',group===2?'2.8':'2.4');c.setAttribute('class',['reference-source','reference-target','reference-middle'][group]);cloud.append(c);circles.push(c);
   }
   const render=()=>{
    const t=Number(input.value),positions=ends.map(px),middle=ends[0].map((v,j)=>(1-t)*v+t*ends[1][j]),point=px(middle);
    $('output',f).textContent=t.toFixed(2);
    const line=$('[data-reference-line]',f);['x1','y1','x2','y2'].forEach((attr,i)=>line.setAttribute(attr,positions.flat()[i]));
    $$('[data-endpoint]',f).forEach((node,i)=>{node.setAttribute('transform',`translate(${positions[i].join(' ')})`);node.setAttribute('aria-label',`${i?'終點 x₁':'起點 x₀'} ${pair(ends[i])}，可拖曳或使用方向鍵移動`);});
    $$('[data-endpoint-label]',f).forEach((label,i)=>{label.setAttribute('x',Math.max(100,Math.min(540,positions[i][0])));label.setAttribute('y',positions[i][1]+28);label.textContent=`${i?'x₁':'x₀'} ${pair(ends[i])}`;});
    const current=$('[data-reference-current]',f);current.setAttribute('cx',point[0]);current.setAttribute('cy',point[1]);
    const label=$('[data-reference-label]',f);label.setAttribute('x',Math.max(45,Math.min(595,point[0])));label.setAttribute('y',point[1]-23);
    positionText.textContent=`位置 Iₜ = ${pair(middle)}`;
    velocityText.textContent=`速度 x₁ − x₀ = ${pair(ends[1].map((v,j)=>v-ends[0][j]))}`;
    for(let group=0;group<3;group++)pairs.forEach(([oa,ob],i)=>{const a=oa.map((v,j)=>v+ends[0][j]),b=ob.map((v,j)=>v+ends[1][j]);const p=group===0?a:group===1?b:a.map((v,j)=>(1-t)*v+t*b[j]);const q=px(p),c=circles[group*pairs.length+i];c.setAttribute('cx',q[0]);c.setAttribute('cy',q[1]);});
   };
   const setEndpoint=(i,x,y)=>{ends[i]=[Math.max(-3,Math.min(3,x)),Math.max(-1.5,Math.min(1.5,y))];render();};
   $$('[data-endpoint]',f).forEach(node=>{
    const i=Number(node.dataset.endpoint);let pointer=null;
    node.addEventListener('pointerdown',event=>{if(event.button!==0)return;pause();event.preventDefault();pointer=event.pointerId;node.setPointerCapture(pointer);node.classList.add('dragging');node.focus({preventScroll:true});});
    node.addEventListener('pointermove',event=>{if(pointer!==event.pointerId)return;const screen=svg.getScreenCTM();if(!screen)return;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(screen.inverse());setEndpoint(i,(p.x-320)/80,(180-p.y)/70);});
    const release=event=>{if(pointer!==event.pointerId)return;pointer=null;node.classList.remove('dragging');};
    node.addEventListener('pointerup',release);node.addEventListener('pointercancel',release);node.addEventListener('lostpointercapture',release);
    node.addEventListener('keydown',event=>{const delta={ArrowLeft:[-.1,0],ArrowRight:[.1,0],ArrowUp:[0,.1],ArrowDown:[0,-.1]}[event.key];if(!delta)return;pause();event.preventDefault();const scale=event.shiftKey?5:1;setEndpoint(i,ends[i][0]+delta[0]*scale,ends[i][1]+delta[1]*scale);});
   });
   const showCloud=show=>{cloud.toggleAttribute('hidden',!show);guide.hidden=!show;toggle.setAttribute('aria-pressed',String(show));toggle.textContent=show?'隱藏分布示意':'顯示分布示意';};
   toggle.onclick=()=>{const show=cloud.hasAttribute('hidden');if(!show)pause();showCloud(show);};
   play.onclick=()=>{
    if(playing){pause();return;}
    if(Number(input.value)>=1)input.value='0';
    showCloud(true);playing=true;updatePlay();render();
    const from=Number(input.value),started=performance.now();
    const tick=now=>{if(!playing)return;const t=Math.min(1,from+(now-started)/1500);input.value=String(t);render();if(t>=1){pause();return;}frameId=requestAnimationFrame(tick);};
    frameId=requestAnimationFrame(tick);
   };
   $('[data-reset-endpoints]',f).onclick=()=>{pause();initial.forEach((p,i)=>ends[i]=p.slice());input.value='0';render();updatePlay();};
   input.addEventListener('input',()=>{pause();render();});
   document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
   new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)pause();}).observe(f);
   render();updatePlay();return;
  }
  const update=()=>{
   const t=Number(input.value);$('output',f).textContent=t.toFixed(2);
    const lines=$$('line',f),vx=4*t-2,tipX=320+vx*75;
    lines[2].setAttribute('x2',tipX);
    const label=$('[data-average-label]',f);label.setAttribute('x',tipX);label.textContent=`(${Number(vx.toFixed(2))}, 2)`;
    $('.figure-stat',f).textContent=`右 ${Math.round(t*100)}%，左 ${Math.round((1-t)*100)}%。`;
  };input.addEventListener('input',update);update();
 });
 $$('.quiz').forEach(q=>$$('[data-option]',q).forEach(b=>b.onclick=()=>{
  const correct=Number(q.dataset.correct);$$('[data-option]',q).forEach(a=>{a.setAttribute('aria-pressed',String(a===b));a.classList.toggle('selected',a===b);a.classList.toggle('correct',a===b&&Number(a.dataset.option)===correct);});
  $('.quiz-feedback',q).textContent=(Number(b.dataset.option)===correct?'對。':'這個想法少了一步：')+$('.quiz-feedback',q).dataset.explanation;
 }));
 function plot(container,data){
  container.hidden=false;container.chartData=data;container.replaceChildren();
  const title=document.createElement('h4');title.textContent=data.title;container.append(title);
  const canvas=document.createElement('canvas');canvas.setAttribute('role','img');canvas.setAttribute('aria-label',data.title);container.append(canvas);
  const width=Math.max(240,container.clientWidth-40),height=190,dpr=devicePixelRatio||1;
  canvas.width=width*dpr;canvas.height=height*dpr;const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
  const css=getComputedStyle(document.documentElement),colors=[css.getPropertyValue('--green').trim(),css.getPropertyValue('--gold').trim()];
  const points=data.points.filter(p=>p.every(Number.isFinite));if(!points.length)return;
  const xmax=Math.max(...points.map(p=>p[0]),1),ymax=Math.max(...points.flatMap(p=>p.slice(1)),.001)*1.08;
  const left=43,right=12,top=12,bottom=29;
  ctx.strokeStyle=css.getPropertyValue('--line');ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(left,top);ctx.lineTo(left,height-bottom);ctx.lineTo(width-right,height-bottom);ctx.stroke();
  ctx.font='10px system-ui';ctx.fillStyle=css.getPropertyValue('--muted');ctx.fillText(ymax.toPrecision(2),0,17);ctx.fillText('0',24,height-bottom);ctx.fillText(String(xmax),width-40,height-8);ctx.fillText(data.labels?'field calls':'training steps',left+15,height-8);
  for(let i=1;i<points[0].length;i++){
   ctx.strokeStyle=colors[(i-1)%colors.length];ctx.lineWidth=2;ctx.beginPath();points.forEach((p,j)=>{const x=left+p[0]/xmax*(width-left-right),y=height-bottom-p[i]/ymax*(height-top-bottom);j?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
  }
  if(data.labels){const legend=document.createElement('div');legend.className='legend';legend.textContent='綠色 Euler · 棕色 Heun；詳細數字見上方輸出。';container.append(legend);}
 }
 // Keep only one Python environment alive across the entire unit.
 // Several retained Pyodide workers can exhaust the in-app browser's memory.
 let runtimeOwner=null,globalBusy=false;
 $$('.experiment').forEach(exp=>{
  const code=$('textarea',exp),original=code.value,status=$('.runtime-status',exp),output=$('.python-output',exp),run=$('[data-run]',exp),stop=$('[data-stop]',exp),reset=$('[data-reset]',exp);
  let worker=null,busy=false,timer;
  const finish=()=>{busy=false;globalBusy=false;$$('[data-run]').forEach(b=>b.disabled=false);stop.disabled=true;reset.disabled=false;clearTimeout(timer);};
  run.onclick=()=>{
   if(busy||globalBusy)return;
   if(runtimeOwner&&runtimeOwner.id!==exp.dataset.experiment){runtimeOwner.release();runtimeOwner=null;}
   busy=true;globalBusy=true;$$('[data-run]').forEach(b=>b.disabled=true);stop.disabled=false;reset.disabled=true;output.textContent='';$('.plot',exp).hidden=true;
   status.textContent=worker?'正在執行…':'正在下載 Python 環境…第一次可能需要一點時間。';
   if(!worker){worker=new Worker('python-worker.js',{type:'module'});
    runtimeOwner={id:exp.dataset.experiment,release:()=>{worker?.terminate();worker=null;}};
    worker.onmessage=({data})=>{
     if(data.kind==='loading')status.textContent='正在載入 Python…需要網路下載，之後同一實驗可重用。';
     if(data.kind==='running')status.textContent='Python 已就緒，正在實際計算…';
     if(data.kind==='done'||data.kind==='error'){
      let chart;const lines=(data.stdout||'').split('\n').filter(line=>{if(line.startsWith('__PLOT__')){try{chart=JSON.parse(line.slice(8));}catch{}return false;}return true;});
      output.textContent=lines.join('\n')+(data.stderr?'\n'+data.stderr:'')+(data.error?'\n'+data.error:'');
      status.textContent=data.kind==='done'?'執行完成。可修改參數，再比較一次。':'執行失敗。檢查下方錯誤；下載失敗時可重試，或下載 .py 在本機執行。';
      if(chart)plot($('.plot',exp),chart);finish();
     }
    };
    worker.onerror=e=>{output.textContent=e.message||'無法啟動 Python worker。';status.textContent='環境載入失敗。請重試或下載程式執行。';worker.terminate();worker=null;finish();};
   }
   timer=setTimeout(()=>{if(busy)status.textContent='仍在載入或計算。可以按停止；若網路無法下載環境，也可下載 .py 執行。';},25000);
   worker.postMessage({code:code.value});
  };
  stop.onclick=()=>{worker?.terminate();worker=null;runtimeOwner=null;finish();status.textContent='已停止。下次執行會重新載入環境。';};
  reset.onclick=()=>{code.value=original;output.textContent='程式已還原。按執行以重新計算。';$('.plot',exp).hidden=true;status.textContent='已還原原始參數與程式。';};
  code.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const start=code.selectionStart,end=code.selectionEnd;code.setRangeText('    ',start,end,'end');}});
 });
 route();
})();
