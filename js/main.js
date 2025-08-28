// ===== Pink Mood Garden — 最小可运行版 =====
if(i < startWeek){ d = prevMonthDays - startWeek + i + 1; thisMonth = false; }
else if(i >= startWeek + daysInMonth){ d = i - (startWeek + daysInMonth) + 1; thisMonth = false; }
else { d = i - startWeek + 1; }
if(!thisMonth) cell.classList.add('other');
cell.textContent = d;


const dateObj = thisMonth ? new Date(viewYear, viewMonth, d) : (i<startWeek ? new Date(viewYear, viewMonth-1, d) : new Date(viewYear, viewMonth+1, d));
cell.addEventListener('click', ()=> openMood(dateObj));
calGrid.appendChild(cell);
}
}


function openMood(dateObj){
const key = dateObj.toISOString().slice(0,10);
const modal = $('#moodModal');
const img = $('#moodImg');
const quote = $('#moodQuote');
const payload = MOODS[Math.floor(Math.random()*MOODS.length)];
img.src = payload.img; quote.textContent = `${payload.quote} ( ${key} )`;
modal.classList.add('open');
}


$('#prevBtn').addEventListener('click', ()=> setYM(new Date(viewYear, viewMonth-1, 1)));
$('#nextBtn').addEventListener('click', ()=> setYM(new Date(viewYear, viewMonth+1, 1)));
$('#closeModal').addEventListener('click', ()=> $('#moodModal').classList.remove('open'));
window.addEventListener('keydown', e=>{ if(e.key==='Escape') $('#moodModal').classList.remove('open'); });


// --- 匿名小纸条（localStorage） ---
const WALL_KEY = 'pink-mood-notes-v1';
const wall = $('#wall');
const noteForm = $('#noteForm');
const noteInput = $('#noteInput');
const exportBtn = $('#exportBtn');
const importFile = $('#importFile');
const clearBtn = $('#clearBtn');


function readNotes(){ try{ return JSON.parse(localStorage.getItem(WALL_KEY)||'[]'); }catch{ return [] } }
function writeNotes(arr){ localStorage.setItem(WALL_KEY, JSON.stringify(arr)); }
function addNote(text){ const arr = readNotes(); arr.unshift({ id: crypto.randomUUID(), text, ts: Date.now() }); writeNotes(arr); renderWall(); }
function removeNote(id){ const arr = readNotes().filter(n=> n.id!==id); writeNotes(arr); renderWall(); }
function renderWall(){
const arr = readNotes(); wall.innerHTML='';
arr.forEach(n=>{
const card = document.createElement('div'); card.className='sticky';
card.innerHTML = `<div>${escapeHTML(n.text).replace(/\n/g,'<br>')}</div>`;
const meta = document.createElement('div'); meta.className='time'; meta.textContent = new Date(n.ts).toLocaleString();
const del = document.createElement('button'); del.textContent='删除'; del.className='btn'; del.style.cssText='position:absolute; top:10px; right:10px; padding:6px 10px; font-size:12px;';
del.addEventListener('click', ()=> removeNote(n.id));
card.appendChild(del); card.appendChild(meta); wall.appendChild(card);
})
}


noteForm.addEventListener('submit', e=>{ e.preventDefault(); const v = noteInput.value.trim(); if(!v) return; addNote(v); noteInput.value=''; });
exportBtn.addEventListener('click', ()=>{ const blob = new Blob([JSON.stringify(readNotes(), null, 2)], {type:'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `pink-notes-${Date.now()}.json`; a.click(); URL.revokeObjectURL(a.href); });
importFile.addEventListener('change', async ()=>{ const f = importFile.files?.[0]; if(!f) return; try{ const text = await f.text(); const data = JSON.parse(text); if(Array.isArray(data)) { writeNotes(data); renderWall(); } }catch{} importFile.value=''; });
clearBtn.addEventListener('click', ()=>{ if(confirm('确定要清空本地小纸条吗？')){ writeNotes([]); renderWall(); } });


// --- 点击爱心/花瓣特效（极简版，后续会拆到 effects.js） ---
function spawnHeart(x,y){
const el = document.createElement('div'); el.className='heart';
el.textContent = '❤';
Object.assign(el.style,{ position:'fixed', left:`${x-8}px`, top:`${y-8}px`, fontSize:`${12+Math.random()*16}px`, opacity:'1', transform:`translate(-50%,-50%) scale(${1+Math.random()*0.6})`});
document.body.appendChild(el);
const dx = (Math.random()-0.5)*2 * 40; const dy = - (40 + Math.random()*40); const duration = 800 + Math.random()*600; const start = performance.now();
function frame(t){
const p = Math.min(1, (t-start)/duration);
el.style.transform = `translate(${dx*p}px, ${dy*p}px) scale(${1+0.4*p})`;
el.style.opacity = String(1 - p);
if(p<1) requestAnimationFrame(frame); else el.remove();
}
requestAnimationFrame(frame);
}


document.addEventListener('click', (e)=>{ spawnHeart(e.clientX, e.clientY); });


// --- 启动 ---
(async function init(){
await loadMoods();
setYM(new Date());
renderWall();
})();