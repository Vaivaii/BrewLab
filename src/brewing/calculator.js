// Curated, dose-scaled recipe engine. Click settings are model-specific starting points.
const SOURCES = {
 harioV60:{label:"Hario USA — James Hoffmann 1 Cup V60",url:"https://www.hario-usa.com/blogs/recipes-and-more-from-friends/james-hoffmann-1-cup-v60-technique"},
 harioGuide:{label:"Hario UK — Expert V60 Brew Guide",url:"https://www.hario.co.uk/pages/brew-guides-v60-expert"},
 orea:{label:"OREA — official V4 brewing guides",url:"https://www.orea.uk/guides-v4"},
 switch:{label:"Hario Global — MUGEN SWITCH recipe/interview (PDF)",url:"https://global.hario.com/MUSD%20Recipe%20%26%20Interview.pdf"},
 switchHybrid:{label:"The Coffee Chronicler — Hario Switch hybrid method",url:"https://coffeechronicler.com/hario-switch/"},
 immersion:{label:"Unpacking Coffee — Hario Switch full immersion",url:"https://unpacking.coffee/recipes/24-hario-switch-full-immersion"},
 aeropress:{label:"AeroPress — official brewing instructions",url:"https://aeropress.com/pages/how-to-use"},
 aeropressTemp:{label:"AeroPress — temperature by roast",url:"https://aeropress.com/pages/whats-the-optimal-brewing-temperature-for-aeropress-coffee-makers"},
 comandante:{label:"Comandante — official grind-setting FAQ",url:"https://comandantegrinder.com/pages/faq"},
 c3s:{label:"TIMEMORE C3S grind guide (manual copy; approximate)",url:"https://manuals.plus/asin/B0F6WC75PQ.pdf"},
 sca:{label:"SCA Brewing Best Practices (protocol PDF)",url:"https://www.scith.coffee/wp-content/uploads/2021/03/SCA-Protocols-_-Best-Practices.pdf"}
};
const POUR_PROFILES=[
 {id:"pulse-3",title:"Compact · 3 tuangan",label:"Bloom + 2 tuangan",descriptor:"Dua pulse utama; resep ringkas sebagai baseline.",count:3,targets:[.60,1],times:[45,75],offsets:{c3s:-1,c40:-1},style:"Tuang spiral lembut, stabil; jangan menyiram kertas."},
 {id:"pulse-4",title:"Balanced · 4 tuangan",label:"Bloom + 3 tuangan",descriptor:"Air dibagi merata dengan jeda antar-pour.",count:4,targets:[.50,.75,1],times:[45,75,105],offsets:{c3s:0,c40:0},style:"Tuang spiral kecil dan pertahankan bed tetap rata."},
 {id:"pulse-5",title:"Pulse · 5 tuangan",label:"Bloom + 4 tuangan",descriptor:"Pulse lebih banyak; grind disetel agar aliran tidak terlalu lambat.",count:5,targets:[.40,.60,.80,1],times:[45,70,90,110],offsets:{c3s:1,c40:2},style:"Aliran sekitar 4–5 g/detik; tunggu level air turun mendekati bed sebelum pulse berikutnya."}
];
const METHOD={
 b75:{name:"Timemore B75",kind:"pour",ratio:16,temp:93,c3s:15,c40:22,grind:"medium / medium-fine",finish:"Target drawdown awal 2:30–3:15; sesuaikan menurut aliran dan rasa.",sources:["orea","sca","c3s","comandante","roast"],sourceNote:"Pola flat-bottom diadaptasi dari panduan pulse OREA; bukan klaim resep resmi TIMEMORE B75."},
 v60:{name:"Hario V60",kind:"pour",ratio:16.7,temp:93,c3s:15,c40:24,grind:"medium-fine",finish:"Target drawdown awal 2:30–3:15; panduan Hario dasar sekitar 2:30.",sources:["harioV60","harioGuide","sca","c3s","comandante","roast"]},
 orea:{name:"OREA",kind:"pour",ratio:16.25,temp:94,c3s:15,c40:22,grind:"medium / medium-coarse",finish:"Target selesai 2:30–3:15; OREA menyarankan flow sekitar 5 g/detik.",sources:["orea","c3s","comandante","roast"]},
 switch:{name:"Hario Switch",kind:"switch",ratio:15.4,temp:92,c3s:16,c40:23,grind:"medium",finish:"Ikuti waktu buka/tutup valve dari teknik terpilih.",sources:["switch","switchHybrid","immersion","c3s","comandante","roast"]},
 aero:{name:"AeroPress",kind:"aero",ratio:14,temp:85,c3s:14,c40:18,grind:"medium",finish:"Press perlahan; jangan memaksa plunger.",sources:["aeropress","aeropressTemp"]},
 moka:{name:"Moka pot",kind:"moka",ratio:10,temp:90,c3s:10,c40:16,grind:"fine (bukan espresso-fine)",finish:"Api kecil; angkat saat aliran memucat sebelum sputtering.",sources:["c3s","comandante"]}
};
const round=n=>Math.round(n), clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
const stamp=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
const safeDose=n=>clamp(Number(n)||15,5,40);
function roastTemp(base,roast,kind){
 if(kind==="aero"){if(roast==="dark")return 80;if(roast==="medium-dark")return 82;return 85;}
 const a={light:3,medium:0,"medium-dark":-2,dark:-4}[roast]??0;return clamp(base+a,80,98);
}
function goalAdjust(goal){if(goal==="sweet")return{ratio:-.5,temp:-1};if(goal==="bright")return{ratio:.5,temp:1};if(goal==="strong")return{ratio:-1,temp:-1};return{ratio:0,temp:0};}
function grinderRecommendation(device,grinder,roast,offset=0){
 const m=METHOD[device];if(grinder==="other")return{label:m.grind,clicks:null,explanation:"Angka klik tidak ditampilkan: titik nol dan jarak klik berbeda antar-model."};
 let click=(grinder==="c40"?m.c40:m.c3s)+(m.kind==="pour"?offset:0);
 if(roast==="light")click--;if(roast==="dark")click++;
 if(grinder==="c3s"){const b=m.kind==="moka"?[9,12]:m.kind==="aero"?[12,16]:[13,16];click=clamp(click,...b);return{clicks:click,label:`${click} klik`,explanation:`${click} klik dari titik nol C3S sebagai starting point. Panduan C3S yang tersedia memberi rentang filter sekitar 13–16 klik; dial-in tetap diperlukan.`};}
 const b=m.kind==="moka"?[14,20]:m.kind==="aero"?[15,22]:device==="orea"&&offset>=1?[22,26]:device==="orea"?[20,24]:[18,35];
 click=clamp(click,...b);return{clicks:click,label:`${click} klik (awal)`,explanation:`${click} klik dari zero C40. Rentang pabrikan pour-over lebar (18–35); OREA memberi rentang lebih spesifik menurut resep dan kertas.`};
}
function contextNotes({bean,process,roast,goal,device,water,filter}){
 const n=[];
 if(roast==="light")n.push("Light roast: mulai dengan air lebih panas dan grind sedikit lebih halus dibanding roast gelap; jika asam-kosong, tingkatkan ekstraksi satu variabel setiap kali.");
 if(roast==="dark"||roast==="medium-dark")n.push("Roast lebih gelap: mulai lebih sejuk dan sedikit lebih kasar untuk menahan ekstraksi berlebih.");
 if(process==="natural"||process==="anaerobic")n.push("Natural/anaerobic dapat memiliki kelarutan dan drain berbeda-beda. Gunakan waktu alir nyata; jangan anggap semua lot perlu setting sama.");
 if(process==="washed")n.push("Washed yang padat/dense bisa mengalir lambat; bila drawdown melewati target, uji satu klik lebih kasar.");
 if(bean==="robusta")n.push("Robusta dipilih. Spesies bukan pengganti tasting; nilai rasio dan body dari cangkir aktual.");
 if(bean==="blend")n.push("Blend 70:30 dipilih. Jadikan resep sebagai kontrol; komposisi blend tidak menentukan satu angka grind universal.");
 if(bean==="arabica")n.push("Arabika dipilih; origin, varietas, roast, dan proses tetap memengaruhi hasil lebih jauh daripada label spesies saja.");
 if(goal==="bright")n.push("Target clarity/acidity: pertahankan pouring rapi dan hindari agitasi bed yang tidak perlu.");
 if(goal==="sweet")n.push("Target manis/body: resep memakai rasio sedikit lebih pendek dan suhu sedikit lebih rendah sebagai eksperimen awal.");
 if(device==="b75")n.push("B75 memakai bed flat-bottom. Pola pulse ini adaptasi dari panduan flat-bottom OREA, bukan resep resmi pabrikan B75.");
 if(water==="mineral")n.push("Air mineral dipilih, tetapi komposisi mineral berbeda antar-merek. Pakai sumber air konsisten; kalkulator tidak menebak kandungan mineral.");
 else n.push("Air tersaring/bersih dipakai sebagai baseline. Kualitas dan mineral air memengaruhi ekstraksi; ganti sumber air berarti variabel baru.");
 if(filter==="fast")n.push("Kertas fast-flow: jika drawdown terlalu cepat atau cangkir tipis, coba grind satu langkah lebih halus. Tidak diubah otomatis karena tiap kertas berbeda.");
 if(filter==="slow")n.push("Kertas high-resistance: jika drawdown terlalu lambat, coba sedikit lebih kasar atau tuang lebih lembut.");
 if(filter==="standard")n.push("Gunakan kertas yang sesuai dripper. Resistansi filter memengaruhi drain; angka resep OREA juga terkait tipe paper/bottom yang mereka sebut.");
 return n;
}
function makeStep({title,at,target,prev,duration,detail,action="Pour"}){return{title,at,atSeconds:at,target:round(target),amount:Math.max(0,round(target-prev)),durationSeconds:duration,duration:`±${duration} detik`,action,detail};}
function makePourRecipe(form,profile,m,dose,ratio,temp){
 const water=round(dose*ratio),bloom=Math.max(round(dose*3),round(dose*2.5));
 const grind=grinderRecommendation(form.device,form.grinder,form.roast,profile.offsets[form.grinder]||0);
 const steps=[makeStep({title:"Bloom / basahi seluruh bed",at:0,target:bloom,prev:0,duration:Math.max(5,round(bloom/5)),detail:`Tuang spiral merata ${bloom} g; pastikan tidak ada dry pocket. Swirl lembut dan tunggu sampai 0:45.`,action:"Bloom"})];
 let prev=bloom;
 profile.targets.forEach((fraction,i)=>{const target=i===profile.targets.length-1?water:Math.max(prev,round(water*fraction)),amount=target-prev,at=profile.times[i],duration=Math.max(3,round(amount/5));
  steps.push(makeStep({title:`Tuangan ${i+1} · ${target} g kumulatif`,at,target,prev,duration,detail:`Mulai ${stamp(at)}; tambahkan ${amount} g (target timbangan total ${target} g) selama ±${duration} detik. ${profile.style}`}));prev=target;});
 return{id:profile.id,title:profile.title,label:profile.label,descriptor:profile.descriptor,method:form.device,methodName:m.name,kind:m.kind,dose,water,ratio:Number(ratio.toFixed(1)),temp,clicks:grind.clicks,grind:grind.label,grindExplanation:grind.explanation,pourCount:profile.count,steps,target:m.finish,sources:m.sources,sourceNote:m.sourceNote||"",contextNotes:contextNotes(form),note:"Waktu adalah target awal. Flow nyata dipengaruhi burr, kopi, tinggi tuang, filter, dan kualitas air."};
}
function makeSwitchRecipes(form,m,dose,roast,grinder){
 const water=round(dose*15.4),firstTemp=roastTemp(92,roast,"pour"),click=grinderRecommendation("switch",grinder,roast),bloom=round(dose*3.08);
 const hybrid={id:"switch-hybrid",title:"Hario MUGEN SWITCH · multi-temperature",label:"Hybrid · 3 tahap",descriptor:"Immersion awal, percolation, lalu air lebih sejuk; diadaptasi dari resep Hario Global.",method:"switch",methodName:m.name,kind:"switch",dose,water,ratio:15.4,temp:firstTemp,clicks:click.clicks,grind:click.label,grindExplanation:click.explanation,pourCount:3,
  steps:[
   {title:"Tuangan 1 · valve tertutup",at:0,atSeconds:0,target:bloom,amount:bloom,duration:"±8 detik",durationSeconds:8,action:"Immersion",detail:`Valve CLOSED. Tuang ${bloom} g air ${firstTemp}°C hingga semua kopi basah; tahan sampai 0:40.`},
   {title:"Tuangan 2 · buka valve",at:40,atSeconds:40,target:round(water*.5),amount:Math.max(0,round(water*.5)-bloom),duration:`±${Math.max(3,round((water*.5-bloom)/5))} detik`,durationSeconds:Math.max(3,round((water*.5-bloom)/5)),action:"Percolation",detail:`Pada 0:40 buka valve dan tuang hingga total ${round(water*.5)} g dengan spiral.`},
   {title:"Tuangan 3 · suhu lebih rendah",at:80,atSeconds:80,target:water,amount:water-round(water*.5),duration:`±${round(water*.5/5)} detik`,durationSeconds:Math.max(3,round(water*.5/5)),action:"Immersion",detail:`Pada 1:20 tutup valve, tambahkan air 75°C hingga total ${water} g. Pada 2:20 buka valve; angkat dripper sekitar 2:30.`}
  ],target:"Buka valve sekitar 2:20; angkat dripper sekitar 2:30.",sources:["switch","c3s","comandante","roast"],contextNotes:contextNotes(form),note:"Suhu 75°C pada tuangan terakhir berasal dari resep kompetisi Hario Global; hasil dapat berbeda pada model/ukuran Switch lain."};
 const total=round(dose*16.7);
 const immersion={id:"switch-immersion",title:"Hario Switch · full immersion",label:"Rendam · 1 tuangan",descriptor:"Tuang sekaligus, rendam, kemudian buka valve; teknik sederhana dengan body lebih terasa.",method:"switch",methodName:m.name,kind:"switch",dose,water:total,ratio:16.7,temp:firstTemp,clicks:click.clicks,grind:"Medium-coarse",grindExplanation:"Mulai sedikit lebih kasar daripada V60 untuk immersion; klik perlu diuji di model grinder.",pourCount:1,
  steps:[
   {title:"Tuang seluruh air",at:0,atSeconds:0,target:total,amount:total,duration:"±30 detik",durationSeconds:30,action:"Immersion",detail:`Valve CLOSED. Tuang ${total} g air ${firstTemp}°C dalam ±30 detik.`},
   {title:"Aduk lembut & rendam",at:60,atSeconds:60,target:total,amount:0,duration:"2:00",durationSeconds:120,action:"Steep",detail:"Aduk lembut agar semua grounds basah. Biarkan valve tertutup sampai sekitar 4:00."},
   {title:"Drain",at:240,atSeconds:240,target:total,amount:0,duration:"hingga selesai",durationSeconds:60,action:"Release",detail:"Buka valve sekitar 4:00 dan biarkan turun; target selesai kira-kira 5:00."}
  ],target:"Target selesai sekitar 5:00.",sources:["immersion","c3s","comandante","roast"],contextNotes:contextNotes(form),note:"Adaptasi rasio/waktu untuk dosis pilihan; recipe asal memakai 15 g kopi dan 250 g air."};
 return[hybrid,immersion];
}
function makeAeroRecipes(form,m,dose,roast,grinder){
 const temp=roastTemp(m.temp,roast,"aero");
 return[
  {id:"aero-balanced",title:"AeroPress · smooth",label:"Baseline 1:14",descriptor:"Starting point mendekati panduan pabrikan.",ratio:14,steep:60},
  {id:"aero-strong",title:"AeroPress · concentrated",label:"Lebih pekat 1:12",descriptor:"Lebih sedikit air bila ingin seduhan lebih pekat.",ratio:12,steep:75},
  {id:"aero-bright",title:"AeroPress · longer ratio",label:"Lebih ringan 1:16",descriptor:"Air lebih banyak; nilai clarity dan body setelah dicicip.",ratio:16,steep:60}
 ].map(p=>{const water=round(dose*p.ratio),grind=grinderRecommendation("aero",grinder,roast),duration=Math.max(3,round(water/5));
  return{id:p.id,title:p.title,label:p.label,descriptor:p.descriptor,method:"aero",methodName:m.name,kind:"aero",dose,water,ratio:p.ratio,temp,clicks:grind.clicks,grind:grind.label,grindExplanation:grind.explanation,pourCount:1,
   steps:[
    {title:"Tuang",at:0,atSeconds:0,target:water,amount:water,duration:`±${duration} detik`,durationSeconds:duration,action:"Pour",detail:`Tuang ${water} g air ${temp}°C; mulai dengan medium grind menurut AeroPress.`},
    {title:"Aduk & steep",at:10,atSeconds:10,target:water,amount:0,duration:`${p.steep} detik`,durationSeconds:p.steep,action:"Steep",detail:`Aduk lembut sekitar 3 detik, masukkan plunger untuk menghentikan drip-through, lalu tunggu ${p.steep} detik.`},
    {title:"Press",at:10+p.steep,atSeconds:10+p.steep,target:water,amount:0,duration:"20–30 detik",durationSeconds:25,action:"Press",detail:"Tekan dengan tekanan stabil dan lembut; jangan dipaksa keras."}
   ],target:"Seduh sekitar 1:30–2:00 termasuk press.",sources:["aeropress","aeropressTemp","c3s","comandante","roast"],contextNotes:contextNotes(form),note:"Rasio 1:12 dan 1:16 adalah varian eksperimen; gunakan rasio dan rasa sebagai pembanding."};
 });
}
function makeMokaRecipes(form,m,dose,roast,grinder){
 const temp=roastTemp(m.temp,roast,"moka");
 return[
  {id:"moka-classic",title:"Moka pot · classic",label:"Rasio 1:10",ratio:10,descriptor:"Baseline; api kecil dan berhenti sebelum sputtering."},
  {id:"moka-short",title:"Moka pot · body",label:"Rasio 1:9",ratio:9,descriptor:"Sedikit lebih pekat; jangan memadatkan kopi di basket."}
 ].map(p=>{const water=round(dose*p.ratio),grind=grinderRecommendation("moka",grinder,roast);
  return{id:p.id,title:p.title,label:p.label,descriptor:p.descriptor,method:"moka",methodName:m.name,kind:"moka",dose,water,ratio:p.ratio,temp,clicks:grind.clicks,grind:grind.label,grindExplanation:grind.explanation,pourCount:null,
   steps:[
    {title:"Isi chamber bawah",at:0,atSeconds:0,target:water,amount:water,duration:"sebelum dipanaskan",durationSeconds:0,action:"Prepare",detail:`Isi air ${water} g sampai di bawah katup pengaman; jumlah nyata mengikuti garis katup ukuran pot.`},
    {title:"Isi basket",at:0,atSeconds:0,action:"Prepare",detail:`Masukkan ${dose} g kopi, ratakan tanpa menekan/memadatkan.`},
    {title:"Panas rendah",at:30,atSeconds:30,action:"Brew",detail:"Rakit dengan aman, panaskan api kecil, angkat sebelum sputtering."}
   ],target:m.finish,sources:["c3s","comandante","roast"],contextNotes:contextNotes(form),note:"Rasio air terisi tidak sama dengan berat minuman keluar; sesuaikan dengan ukuran pot dan katup."};
 });
}
export function calculateRecipes({dose=15,device="b75",roast="medium",goal="balanced",grinder="c3s",bean="arabica",process="washed",water="filtered",filter="standard"}={}){
 dose=safeDose(dose);device=METHOD[device]?device:"b75";
 roast=["light","medium","medium-dark","dark"].includes(roast)?roast:"medium";
 grinder=["c3s","c40","other"].includes(grinder)?grinder:"c3s";
 bean=["arabica","robusta","blend"].includes(bean)?bean:"arabica";
 process=["washed","natural","honey","anaerobic","wet-hulled"].includes(process)?process:"washed";
 goal=["balanced","sweet","bright","strong"].includes(goal)?goal:"balanced";
 water=["filtered","mineral"].includes(water)?water:"filtered";filter=["standard","fast","slow"].includes(filter)?filter:"standard";
 const form={dose,device,roast,goal,grinder,bean,process,water,filter},m=METHOD[device],adj=goalAdjust(goal);
 if(m.kind==="pour"){const ratio=clamp(m.ratio+adj.ratio,12,20),temp=clamp(roastTemp(m.temp,roast,"pour")+adj.temp,85,98);return POUR_PROFILES.map(p=>makePourRecipe(form,p,m,dose,ratio,temp));}
 if(m.kind==="switch")return makeSwitchRecipes(form,m,dose,roast,grinder);
 if(m.kind==="aero")return makeAeroRecipes(form,m,dose,roast,grinder);
 return makeMokaRecipes(form,m,dose,roast,grinder);
}
export function calculateRecipe(form={}){const rs=calculateRecipes(form),goal=form.goal||"balanced";const prefer=goal==="bright"?(form.device==="switch"?"switch-hybrid":"pulse-5"):goal==="sweet"||goal==="strong"?(form.device==="switch"?"switch-immersion":"pulse-3"):"pulse-4";return rs.find(r=>r.id===prefer)||rs[0];}
export const methodNames=Object.fromEntries(Object.entries(METHOD).map(([k,v])=>[k,v.name]));
export const recipeSources=SOURCES;
