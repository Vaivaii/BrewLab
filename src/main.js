import { calculateRecipes, recipeSources } from './brewing/calculator.js';
const $=id=>document.getElementById(id);
let recipeOptions=[],currentRecipe=null,timerId=null,seconds=0,running=false;
const journalKey='brewlab.tastings.v1';
const fmt=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const getForm=()=>({dose:$('dose').value,device:$('device').value,roast:$('roast').value,goal:$('goal').value,grinder:$('grinder').value,bean:$('bean').value,process:$('process').value,water:$('water').value,filter:$('filter').value});
function loadJournal(){try{return JSON.parse(localStorage.getItem(journalKey)||'[]');}catch{return[];}}
function sourceLinks(ids){return[...new Set(ids||[])].map(id=>{const s=recipeSources[id];return s?`<a href="${s.url}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`:'';}).filter(Boolean).join('');}
function resetTimer(){clearInterval(timerId);running=false;seconds=0;$('clock').textContent='00:00';$('timer-start').textContent='Mulai timer';}
function renderRecipe(resetClock=false){
 $('dose-display').textContent=$('dose').value||'13';document.querySelectorAll('[data-dose]').forEach(b=>b.classList.toggle('active',Number(b.dataset.dose)===Number($('dose').value)));
 const oldId=currentRecipe?.id;if(resetClock&&currentRecipe)resetTimer();recipeOptions=calculateRecipes(getForm());
 currentRecipe=recipeOptions.find(r=>r.id===oldId)||recipeOptions.find(r=>r.id===($('goal').value==='bright'?'pulse-5':$('goal').value==='sweet'||$('goal').value==='strong'?'pulse-3':'pulse-4'))||recipeOptions[0];
 $('recipe-options').innerHTML=recipeOptions.map(r=>`<button type="button" class="recipe-option ${r.id===currentRecipe.id?'selected':''}" data-recipe-id="${r.id}" aria-pressed="${r.id===currentRecipe.id}"><span class="option-kicker">${esc(r.label)}</span><strong>${esc(r.title)}</strong><small>${r.water} g air · ${r.temp}°C · ${esc(r.grind)}</small><em>${esc(r.descriptor)}</em></button>`).join('');
 $('recipe-options').querySelectorAll('[data-recipe-id]').forEach(btn=>btn.addEventListener('click',()=>{currentRecipe=recipeOptions.find(r=>r.id===btn.dataset.recipeId)||recipeOptions[0];resetTimer();renderSelectedRecipe();renderRecipeOptionSelection();renderSteps();renderTimerCue();}));
 renderSelectedRecipe();renderSteps();renderTimerCue();
}
function renderRecipeOptionSelection(){$('recipe-options').querySelectorAll('[data-recipe-id]').forEach(b=>{const yes=b.dataset.recipeId===currentRecipe.id;b.classList.toggle('selected',yes);b.setAttribute('aria-pressed',String(yes));});}
function renderSelectedRecipe(){
 if(!currentRecipe)return;const r=currentRecipe;
 $('recipe').innerHTML=`
 <div class="recipe-top"><span class="eyebrow">RESEP TERPILIH / ${esc(r.methodName)}</span><span class="recipe-dot"></span></div><h3 class="selected-title">${esc(r.title)}</h3><p class="selected-descriptor">${esc(r.descriptor)}</p>
 <div class="recipe-stats"><div><small>KOPI</small><strong>${r.dose}<small> g</small></strong></div><div><small>AIR TOTAL</small><strong>${r.water}<small> g</small></strong></div></div>
 <div class="recipe-details"><div><span>Rasio kopi:air</span><b>1:${r.ratio}</b></div><div><span>Suhu air</span><b>${r.temp}°C</b></div><div><span>Grinder starting point</span><b>${esc(r.grind)}</b></div><div><span>Jumlah tuangan</span><b>${r.pourCount==null?'Tidak berlaku · moka':r.pourCount+(r.kind==='pour'?' kali total':' tahap / pour')}</b></div></div>
 <p class="grind-explanation">${esc(r.grindExplanation||'')}</p>${r.sourceNote?`<p class="source-note">${esc(r.sourceNote)}</p>`:''}
 <div class="recipe-steps"><h3>Jadwal tuangan & target timbangan</h3><p class="timeline-intro">Target timbangan adalah air kumulatif, bukan tambahan tiap kali. Jam adalah waktu mulai tahap; durasi ditaksir dari flow sekitar 5 g/detik.</p>
 ${r.steps.map((s,i)=>`<div class="recipe-step"><span>${String(i+1).padStart(2,'0')}</span><div class="step-body"><div class="step-heading"><b>${esc(s.title)}</b><time>${fmt(s.atSeconds)}</time></div><small>${esc(s.detail)}</small>${s.target!==undefined?`<span class="step-math">${s.amount>0?'+'+s.amount+' g tuang':'tanpa tambahan air'} · total ${s.target} g</span>`:''}</div></div>`).join('')}</div>
 <div class="recipe-meta"><strong>Dial-in & variabel yang dikurasi</strong><p>${esc(r.target)}</p><ul>${(r.contextNotes||[]).map(n=>`<li>${esc(n)}</li>`).join('')}</ul><p class="note">${esc(r.note||'')}</p></div>
 <details class="source-list"><summary>Sumber yang digunakan untuk resep ini</summary><div>${sourceLinks(r.sources)||'<span>Belum ada sumber khusus.</span>'}</div></details>
 <button id="use-timer" class="secondary-btn">Gunakan timer resep ↗</button>`;
 $('use-timer').onclick=()=>{setTab('timer');resetTimer();renderSteps();renderTimerCue();};
}
function setTab(name){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));['brew','timer','journal'].forEach(n=>$(n+'-panel').classList.toggle('hidden',n!==name));if(name==='journal')renderJournal();window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
$('calculate').addEventListener('click',()=>renderRecipe(true));
['dose','device','roast','goal','grinder','bean','process','water','filter'].forEach(id=>$(id).addEventListener(id==='dose'?'input':'change',()=>renderRecipe(true)));
$('dose-minus').addEventListener('click',()=>{ $('dose').value=Math.max(5,Number($('dose').value||13)-0.5);renderRecipe(true); });
$('dose-plus').addEventListener('click',()=>{ $('dose').value=Math.min(40,Number($('dose').value||13)+0.5);renderRecipe(true); });
document.querySelectorAll('[data-dose]').forEach(b=>b.addEventListener('click',()=>{ $('dose').value=b.dataset.dose;renderRecipe(true); }));

function renderSteps(){$('steps').innerHTML=currentRecipe?currentRecipe.steps.map((s,i)=>`<div class="timer-step" data-step="${i}"><span>${String(i+1).padStart(2,'0')}</span><div class="step-body"><div class="step-heading"><b>${esc(s.title)}</b><time>${fmt(s.atSeconds)}</time></div><small>${esc(s.detail)}</small>${s.target!==undefined?`<span class="step-math">${s.amount>0?'+'+s.amount+' g':'tanpa tambahan air'} · total ${s.target} g</span>`:''}</div></div>`).join(''):'';}
function renderTimerCue(){
 if(!currentRecipe)return;const steps=currentRecipe.steps,next=steps.find(s=>s.atSeconds>seconds);let activeIndex=-1;steps.forEach((s,i)=>{if(s.atSeconds<=seconds)activeIndex=i;});
 document.querySelectorAll('.timer-step').forEach((el,i)=>{el.classList.toggle('current',i===activeIndex);el.classList.toggle('done',i<activeIndex);});const last=steps[steps.length-1]?.atSeconds||1;$('timer-progress-fill').style.width=Math.min(100,seconds/last*100)+'%';
 const active=activeIndex>=0?steps[activeIndex]:null;
 if(seconds===0&&!running){$('timer-phase').textContent='SIAP MEMULAI';$('timer-hint').textContent=`${currentRecipe.methodName} · ${currentRecipe.title}. Mulai timer saat mulai menyeduh.`;}
 else if(next){const gap=next.atSeconds-seconds;$('timer-phase').textContent=active?.action?String(active.action).toUpperCase():'SEDANG MENYEDUH';$('timer-hint').textContent=gap<=5?`Siapkan tahap berikut: ${next.title} pada ${fmt(next.atSeconds)}. ${next.detail}`:`Tahap sekarang: ${active?.title||'Persiapan'}. Berikutnya ${fmt(next.atSeconds)} — ${next.title}. ${active?.detail||''}`;}
 else{$('timer-phase').textContent='DRAW-DOWN / SELESAI';$('timer-hint').textContent=currentRecipe.target;}
}
function tick(){seconds++;$('clock').textContent=fmt(seconds);renderTimerCue();}
$('timer-start').addEventListener('click',()=>{if(running){clearInterval(timerId);running=false;$('timer-start').textContent='Lanjutkan';}else{running=true;$('timer-start').textContent='Jeda';timerId=setInterval(tick,1000);}renderTimerCue();});
$('timer-reset').addEventListener('click',()=>{resetTimer();renderTimerCue();});
function renderJournal(){
 const entries=loadJournal();$('entry-count').textContent=entries.length+' CATATAN';
 $('journal-list').innerHTML=entries.length?entries.map(e=>`<article class="journal-entry"><div class="entry-head"><strong>${esc(e.origin)}</strong><small>${new Date(e.date).toLocaleDateString('id-ID')}</small></div><div class="entry-tags"><span>${esc(e.drawdown)}</span><span>Acidity: ${esc(e.acidity)}</span><span>Manis: ${esc(e.sweetness)}</span><span>Body: ${esc(e.body)}</span></div><p>${esc(e.notes||'Belum ada catatan rasa.')}</p><small class="next-tip">${esc(suggest(e))}</small>${e.recipe?`<small class="saved-recipe">${esc(e.recipe.methodName||'')} · ${e.recipe.dose} g → ${e.recipe.water} g · ${esc(e.recipe.title||'')}</small>`:''}</article>`).join(''):'<div class="empty-state">Belum ada catatan. Simpan hasil seduhan pertamamu di atas.</div>';
}
function suggest(e){if(e.acidity==='Terlalu tajam')return'Eksperimen berikutnya: turunkan suhu 1–2°C atau ubah grind satu klik; ubah satu hal saja.';if(e.acidity==='Rendah')return'Coba naikkan suhu 1–2°C atau sedikit perhalus grind; ubah satu hal saja.';if(e.sweetness==='Rendah')return'Coba satu perubahan kecil untuk meningkatkan ekstraksi, lalu bandingkan.';return'Hasil terlihat cukup seimbang. Pertahankan resep sebagai kontrol sebelum eksperimen berikutnya.';}
$('tasting-form').addEventListener('submit',e=>{e.preventDefault();const entries=loadJournal();entries.unshift({origin:$('origin').value,drawdown:$('drawdown').value,acidity:$('acidity').value,sweetness:$('sweetness').value,body:$('body').value,notes:$('notes').value,date:new Date().toISOString(),recipe:currentRecipe});localStorage.setItem(journalKey,JSON.stringify(entries.slice(0,100)));e.target.reset();renderJournal();});
let touchX=0,touchY=0,touchStartedOnControl=false;const tabNames=['brew','timer','journal'];document.addEventListener('touchstart',e=>{const target=e.target;touchStartedOnControl=!!target.closest('button,a,input,select,textarea,summary,.dose-chips,.bottom-nav');touchX=e.changedTouches[0].screenX;touchY=e.changedTouches[0].screenY;},{passive:true});document.addEventListener('touchend',e=>{if(touchStartedOnControl)return;const dx=e.changedTouches[0].screenX-touchX,dy=e.changedTouches[0].screenY-touchY;if(Math.abs(dx)<85||Math.abs(dx)<Math.abs(dy)*1.25)return;const active=document.querySelector('.bottom-nav .tab.active')?.dataset.tab||'brew';const idx=tabNames.indexOf(active);const next=tabNames[Math.max(0,Math.min(tabNames.length-1,idx+(dx<0?1:-1)))];if(next!==active)setTab(next);},{passive:true});
renderRecipe();renderJournal();
if('serviceWorker'in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
