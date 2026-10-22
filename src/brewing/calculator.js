const methods = {
  b75:{ratio:16,temp:93,grind:16,steps:[["Bloom", "45 g · 0:00–0:40"],["Pour 1","hingga 150 g · perlahan"],["Pour 2","hingga target air · selesai sekitar 2:45"]]},
  v60:{ratio:16,temp:93,grind:16,steps:[["Bloom","3× berat kopi · 0:00–0:40"],["Pour 1","hingga 60% air"],["Pour 2","hingga total air · target 2:30–3:15"]]},
  switch:{ratio:16,temp:93,grind:17,steps:[["Bloom","3× berat kopi · 0:00–0:40"],["Immersion","tuang hingga target · tutup 1:00"],["Release","buka switch dan tunggu drawdown"]]},
  orea:{ratio:16,temp:93,grind:16,steps:[["Bloom","3× berat kopi · 0:00–0:40"],["Pour 1","hingga 60% air"],["Pour 2","hingga total air · drawdown merata"]]},
  aero:{ratio:14,temp:90,grind:14,steps:[["Tuang","masukkan seluruh air"],["Aduk","aduk lembut dan rendam 1:00"],["Press","tekan perlahan 0:30"]]},
  moka:{ratio:10,temp:90,grind:10,steps:[["Isi","air panas di bawah katup"],["Racik","kopi rata, jangan dipadatkan"],["Seduh","api kecil; angkat saat aliran mulai pucat"]]}
};
export function calculateRecipe({dose=15,device="b75",roast="medium",goal="balanced",grinder="c3s"}) {
  dose = Math.max(5, Math.min(40, Number(dose)||15));
  const m=methods[device]||methods.b75;
  let temp=m.temp, ratio=m.ratio, clicks=m.grind;
  if(roast==="light") temp+=2;
  if(roast==="dark") temp-=4;
  if(goal==="sweet") { temp-=1; ratio-=1; }
  if(goal==="bright") temp+=1;
  if(goal==="strong") ratio-=2;
  if(device==="moka") ratio=Math.max(8,ratio);
  if(grinder!=="c3s") clicks=null;
  return {dose, water:Math.round(dose*ratio),ratio,temp,clicks,method:device,steps:m.steps,
    target:device==="moka"?"berhenti sebelum sputtering":"2:30–3:15 sebagai titik awal",
    disclaimer:"Rekomendasi awal. Biji, burr, air, filter, dan teknik mengubah hasil nyata."};
}
export const methodNames={b75:"Timemore B75",v60:"Hario V60",switch:"Hario Switch",orea:"Orea",aero:"AeroPress",moka:"Moka pot"};
