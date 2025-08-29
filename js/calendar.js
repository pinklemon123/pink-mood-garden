// Calendar & Mood modal
export function initCalendar({ ymEl, gridEl, prevBtn, nextBtn, modalEls, moodsUrl = '/assets/data/moods.json' }){
const { modal, imgEl, quoteEl, closeBtn } = modalEls;
const FALLBACK_MOODS = [
{ img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop", quote: "愿你所到之处，皆是粉色的温柔光。" },
{ img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=1600&auto=format&fit=crop", quote: "花会沿路开放，你以温柔相伴。" },
{ img: "https://images.unsplash.com/photo-1516542076529-1ea3854896e1?q=80&w=1600&auto=format&fit=crop", quote: "把心事折成纸鹤，放进微风和晚霞里。" },
{ img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1600&auto=format&fit=crop", quote: "今天也要被爱与好运围绕。" },
];
let MOODS = [...FALLBACK_MOODS];


let viewYear, viewMonth; // 0-11


async function loadMoods(){
try{ const res = await fetch(moodsUrl); if(res.ok){ MOODS = await res.json(); } }catch{}
}


function setYM(date){
viewYear = date.getFullYear();
viewMonth = date.getMonth();
renderCalendar();
}


function renderCalendar(){
ymEl.textContent = `${viewYear} 年 ${String(viewMonth+1).padStart(2,'0')} 月`;
gridEl.innerHTML = '';
const firstDay = new Date(viewYear, viewMonth, 1);
const startWeek = (firstDay.getDay() + 6) % 7; // 周一=0
const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();


for(let i=0;i<42;i++){
const cell = document.createElement('div');
cell.className = 'day';
let d, thisMonth = true;
if(i < startWeek){ d = prevMonthDays - startWeek + i + 1; thisMonth = false; }
else if(i >= startWeek + daysInMonth){ d = i - (startWeek + daysInMonth) + 1; thisMonth = false; }
else { d = i - startWeek + 1; }
if(!thisMonth) cell.classList.add('other');
cell.textContent = d;


const dateObj = thisMonth ? new Date(viewYear, viewMonth, d) : (i<startWeek ? new Date(viewYear, viewMonth-1, d) : new Date(viewYear, viewMonth+1, d));
cell.addEventListener('click', ()=> openMood(dateObj));
gridEl.appendChild(cell);
}
}


function openMood(dateObj){
const key = dateObj.toISOString().slice(0,10);
const payload = MOODS[Math.floor(Math.random()*MOODS.length)];
imgEl.src = payload.img;
quoteEl.textContent = `${payload.quote} ( ${key} )`;
modal.classList.add('open');
}


prevBtn.addEventListener('click', ()=> setYM(new Date(viewYear, viewMonth-1, 1)));
nextBtn.addEventListener('click', ()=> setYM(new Date(viewYear, viewMonth+1, 1)));
closeBtn.addEventListener('click', ()=> modal.classList.remove('open'));
window.addEventListener('keydown', e=>{ if(e.key==='Escape') modal.classList.remove('open'); });


(async function init(){
await loadMoods();
setYM(new Date());
})();
}