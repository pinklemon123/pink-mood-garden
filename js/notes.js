// Anonymous notes with localStorage
export function initNotes({ wallEl, formEl, textareaEl, exportBtn, importInput, clearBtn, storageKey = 'pink-mood-notes-v1' }){
const $escape = (s) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));


function read(){ try{ return JSON.parse(localStorage.getItem(storageKey)||'[]'); }catch{ return [] } }
function write(arr){ localStorage.setItem(storageKey, JSON.stringify(arr)); }
function add(text){ const arr = read(); arr.unshift({ id: crypto.randomUUID(), text, ts: Date.now() }); write(arr); render(); }
function remove(id){ const arr = read().filter(n=> n.id!==id); write(arr); render(); }


function render(){
const arr = read(); wallEl.innerHTML='';
arr.forEach(n=>{
const card = document.createElement('div'); card.className='sticky';
card.innerHTML = `<div>${$escape(n.text).replace(/\n/g,'<br>')}</div>`;
const meta = document.createElement('div'); meta.className='time'; meta.textContent = new Date(n.ts).toLocaleString();
const del = document.createElement('button'); del.textContent='删除'; del.className='btn'; del.style.cssText='position:absolute; top:10px; right:10px; padding:6px 10px; font-size:12px;';
del.addEventListener('click', ()=> remove(n.id));
card.appendChild(del); card.appendChild(meta); wallEl.appendChild(card);
});
}


formEl.addEventListener('submit', e=>{ e.preventDefault(); const v = textareaEl.value.trim(); if(!v) return; add(v); textareaEl.value=''; });
exportBtn.addEventListener('click', ()=>{ const blob = new Blob([JSON.stringify(read(), null, 2)], {type:'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `pink-notes-${Date.now()}.json`; a.click(); URL.revokeObjectURL(a.href); });
importInput.addEventListener('change', async ()=>{ const f = importInput.files?.[0]; if(!f) return; try{ const text = await f.text(); const data = JSON.parse(text); if(Array.isArray(data)) { write(data); render(); } }catch{} importInput.value=''; });
clearBtn.addEventListener('click', ()=>{ if(confirm('确定要清空本地小纸条吗？')){ write([]); render(); } });


render();
}