// Click hearts / petals effects
export function enableClickHearts({ emoji = '❤', scale = [1,1.6], drift = 40, duration = [800, 1400] } = {}){
function spawn(x,y){
const el = document.createElement('div'); el.className='heart'; el.textContent = emoji;
const fs = 12 + Math.random()*16; const sc = scale[0] + Math.random()*(scale[1]-scale[0]);
Object.assign(el.style,{ left:`${x-8}px`, top:`${y-8}px`, fontSize:`${fs}px`, opacity:'1', transform:`translate(-50%,-50%) scale(${sc})`});
document.body.appendChild(el);
const dx = (Math.random()-0.5)*2 * drift; const dy = - (drift + Math.random()*drift);
const total = duration[0] + Math.random()*(duration[1]-duration[0]);
const start = performance.now();
function frame(t){
const p = Math.min(1, (t-start)/total);
el.style.transform = `translate(${dx*p}px, ${dy*p}px) scale(${sc + 0.3*p})`;
el.style.opacity = String(1 - p);
if(p<1) requestAnimationFrame(frame); else el.remove();
}
requestAnimationFrame(frame);
}
document.addEventListener('click', e=> spawn(e.clientX, e.clientY));
}