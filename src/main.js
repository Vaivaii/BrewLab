import { calculateRecipe, methodNames } from './brewing/calculator.js';
const $=id=>document.getElementById(id);
let currentRecipe=calculateRecipe({}), timerId=null, seconds=0, running=false, phase=0;
const fmt=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
const getForm=()=>({dose:$('dose').value,device:$('device').value,roast:$('roast').value,goal:$('goal').value,grinder:$('grinder').value});
function renderRecipe(){
 currentRecipe=calculateRecipe(getForm());
 const grind=currentRecipe.clicks===null?'Kalibrasi manual':currentRecipe.clicks+' klik dari nol*';
 $('recipe').innerHTML=`<div class="recipe-top"><span class="eyebrow">RESEP AWAL / ${methodNames[currentRecipe.method]}</span><span class="recipe-dot"></span></div>
 <div class="recipe-stats"><div><small>KOPI</small><strong>${currentRecipe.dose}<small> g</small></strong></div><div><small>AIR</small><strong>${currentRecipe.water}<small> g</small></strong></div></div>
 <div class="recipe-details"><div><span>Rasio</span><b>1:${currentRecipe.ratio}</b></div><div><span>Suhu air</span><b>${currentRecipe.temp}°C</b></div><div><span>Grind C3S</span><b>${grind}</b></div><div><span>Target</span><b>${currentRecipe.target}</b></div></div>
 <div class="recipe-steps"><h3>Urutan seduh</h3>${currentRecipe.steps.map((s,i)=>`<div class="recipe-step"><span>0${i+1}</span><div><b>${s[0]}</b><small>${s[1]}</small></div></div>`).join('')}</div>
 <button id="use-timer" class="secondary-btn">Gunakan timer resep ↗</button>`;
 $('use-timer').onclick=()=>{setTab('timer');renderSteps();};
}
function setTab(name){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));['brew','timer','journal'].forEach(n=>$(`${n}-panel`).classList.toggle('hidden',n!==name));if(name==='journal')renderJournal();}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
$('calculate').addEventListener('click',renderRecipe);
function renderSteps(){$('steps').innerHTML=currentRecipe.steps.map((s,i)=>`<div class="timer-step"><span>0${i+1}</span><div><b>${s[0]}</b><small>${s[1]}</small></div></div>`).join('');}
function tick(){seconds++;$('clock').textContent=fmt(seconds);if(seconds===40){$('timer-phase').textContent='LANJUTKAN TUANGAN';$('timer-hint').textContent='Lanjut ke tahap berikutnya sesuai resep.';}if(seconds===60){$('timer-phase').textContent='PERHATIKAN ALIRAN';}}
$('timer-start').addEventListener('click',()=>{if(running){clearInterval(timerId);running=false;$('timer-start').textContent='Lanjutkan';}else{running=true;$('timer-start').textContent='Jeda';$('timer-phase').textContent='SEDANG MENYEDUH';timerId=setInterval(tick,1000);}});
$('timer-reset').addEventListener('click',()=>{clearInterval(timerId);running=false;seconds=0;$('clock').textContent='00:00';$('timer-start').textContent='Mulai timer';$('timer-phase').textContent='SIAP MEMULAI';$('timer-hint').textContent='Siapkan alat dan air.';});
const key='brewlab.tastings.v1';
function loadJournal(){try{return JSON.parse(localStorage.getItem(key)||'[]');}catch{return [];}}
function renderJournal(){const entries=loadJournal();$('entry-count').textContent=entries.length+' CATATAN';$('journal-list').innerHTML=entries.length?entries.map(e=>`<article class="journal-entry"><div class="entry-head"><strong>${escapeHtml(e.origin)}</strong><small>${new Date(e.date).toLocaleDateString('id-ID')}</small></div><div class="entry-tags"><span>${e.drawdown}</span><span>Acidity: ${e.acidity}</span><span>Manis: ${e.sweetness}</span><span>Body: ${e.body}</span></div><p>${escapeHtml(e.notes||'Belum ada catatan rasa.')}</p><small class="next-tip">${suggest(e)}</small></article>`).join(''):'<div class="empty-state">Belum ada catatan. Simpan hasil seduhan pertamamu di atas.</div>';}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function suggest(e){if(e.acidity==='Terlalu tajam')return 'Eksperimen berikutnya: turunkan suhu 1–2°C, parameter lain tetap.';if(e.acidity==='Rendah')return 'Eksperimen berikutnya: naikkan suhu 1–2°C atau sedikit perhalus grind; ubah satu hal saja.';if(e.sweetness==='Rendah')return 'Coba satu perubahan kecil untuk meningkatkan ekstraksi, lalu bandingkan.';return 'Hasil terlihat cukup seimbang. Pertahankan resep sebagai kontrol sebelum eksperimen berikutnya.';}
$('tasting-form').addEventListener('submit',e=>{e.preventDefault();const entries=loadJournal();entries.unshift({origin:$('origin').value,drawdown:$('drawdown').value,acidity:$('acidity').value,sweetness:$('sweetness').value,body:$('body').value,notes:$('notes').value,date:new Date().toISOString(),recipe:currentRecipe});localStorage.setItem(key,JSON.stringify(entries.slice(0,100)));e.target.reset();renderJournal();});
renderRecipe();renderSteps();renderJournal();
if('serviceWorker' in navigator && location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
