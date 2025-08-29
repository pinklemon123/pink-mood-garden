// 匿名墙（LocalStorage 原型版）
const LS_KEY = 'pmg.wall.v1';
const COOLDOWN_SEC = 20; // 发帖冷却，防刷


const $ = (q) => document.querySelector(q);
const feedEl = $('#feed');
const inputEl = $('#moodInput');
const postBtn = $('#postBtn');
const tipEl = $('#tip');
const charCount = $('#charCount');
const emojiPick = $('#emojiPick');
const tabs = document.querySelectorAll('.tab');
const clearAllBtn = $('#clearAll');


let state = load();
let sortMode = 'new';


function load(){
try{
const raw = localStorage.getItem(LS_KEY);
return raw ? JSON.parse(raw) : { posts: [], lastPostAt: 0 };
}catch{ return { posts: [], lastPostAt: 0 }; }
}
function save(){ localStorage.setItem(LS_KEY, JSON.stringify(state)); }


function sanitize(text){
// 极简净化：去首尾、折叠空白、屏蔽少量敏感词（可按需扩展）
const block = [/https?:\/\//gi, /(辱骂|暴力|极端|人身攻击)/g];
let t = (text || '').trim().replace(/\s+/g,' ');
block.forEach(r=>{ t = t.replace(r, '＊'); });
return t;
}


function now(){ return Date.now(); }
function remaining(){
const passed = Math.floor((now() - state.lastPostAt)/1000);
return Math.max(0, COOLDOWN_SEC - passed);
}


function fmtTime(ts){
const d = new Date(ts);
const pad = (n)=> String(n).padStart(2,'0');
return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}


function render(){
let posts = [...state.posts];
posts = sortMode === 'hot' ? posts.sort((a,b)=> b.likes - a.likes || b.ts - a.ts)
: posts.sort((a,b)=> b.ts - a.ts);
feedEl.innerHTML = posts.map(p=> itemHTML(p)).join('') || emptyHTML();
bindItemEvents();
}


function emptyHTML(){
return `<li class="empty">还没有任何心情，做第一个小小的勇士吧～</li>`;
}
function itemHTML(p){
const em = p.emoji ? `<span class="emo">${p.emoji}</span>` : '';
return `<li class="post" data-id="${p.id}">
<div class="content">${escapeHTML(p.text)} ${em}</div>
<div class="meta row between">
<span class="time">${fmtTime(p.ts)}</span>
<div class="actions">
<button class="like" aria-label="点赞">❤ <b>${p.likes}</b></button>
<button class="reply" aria-label="留言">💬 ${p.comments.length}</button>
</div>
</div>
<div class="reply-box hidden">
<input class="reply-input" placeholder="写点暖心的话…（匿名）" maxlength="140" />
<button class="send">发送</button>
</div>
<ul class="replies">
${p.comments.map(c=> `<li>${escapeHTML(c.text)} <span class="rtime">${fmtTime(c.ts)}</span></li>`).join('')}
</ul>
</li>`;
}


function escapeHTML(str){
return (str || '').replace(/[&<>"']/g, s=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));
}


function bindItemEvents(){
document.querySelectorAll('.post .like').forEach(btn=>{
	btn.onclick = ()=>{
		const id = btn.closest('.post').dataset.id;
		// 这里可以添加点赞逻辑，比如增加 likes 数量
		const post = state.posts.find(p => p.id === id);
		if (post) {
			post.likes = (post.likes || 0) + 1;
			save();
			render();
		}
	};
});
}