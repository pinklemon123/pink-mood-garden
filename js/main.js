import { initCalendar } from './calendar.js';
import { initNotes } from './notes.js';
import { enableClickHearts } from './effects.js';


// Calendar
initCalendar({
ymEl: document.getElementById('ym'),
gridEl: document.getElementById('calGrid'),
prevBtn: document.getElementById('prevBtn'),
nextBtn: document.getElementById('nextBtn'),
modalEls: {
modal: document.getElementById('moodModal'),
imgEl: document.getElementById('moodImg'),
quoteEl: document.getElementById('moodQuote'),
closeBtn: document.getElementById('closeModal'),
},
moodsUrl: '/assets/data/moods.json', // 可选：若不存在则回退内置样例
});


// Notes
initNotes({
wallEl: document.getElementById('wall'),
formEl: document.getElementById('noteForm'),
textareaEl: document.getElementById('noteInput'),
exportBtn: document.getElementById('exportBtn'),
importInput: document.getElementById('importFile'),
clearBtn: document.getElementById('clearBtn'),
});


// Click effects
enableClickHearts({ emoji: '✿' }); // 想换花瓣可传 emoji: '❀' 或 '✿''❤'
// === 今日心情（图片 + 语句） ===

// 语句池：可以随时扩充
const MOOD_QUOTES = [
  "今天也要好好生活呀 🌸",
  "给自己一个拥抱 🤗",
  "慢慢来，比较快 💫",
  "愿你被世界温柔以待 🍀",
  "保持热爱，奔赴山海 🌊",
  "生活要有一点小幸运 ✨",
  "再平凡的日子也值得记录 📖",
  "别忘了抬头看看天空 ☁️",
  "总有意想不到的惊喜 🎁",
  "心情好，一切都好 🌼",
  "做一个温暖的人 🌞",
  "今天也要笑一笑 😄",
  "小确幸是生活的底色 🌈",
  "在细碎的日常里找到闪光 ✨",
  "你已经很棒啦 💖",
  "善待自己就是善待生活 🌿",
  "慢慢变好，是人生的必修课 📚",
  "愿所有美好都恰逢其时 🕊️",
  "今天的小幸运会是什么呢？ 🍀",
  "世界很大，日子很美 👣",
  "小小的坚持，也会带来改变 💡",
  "让心情在阳光下晾一晾 ☀️",
  "把喜欢的事做到极致 ❤️",
  "今天的风很温柔 🌬️",
];

const MOOD_TOTAL_IMAGES = 24;

// ——— A. 按日期固定（推荐）：同一天内固定，不随刷新变化
function getDateSeed() {
  const d = new Date();
  // 例如 2025-08-30 → 20250830 作为种子
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
function seededIndex(seed, modulo) {
  // 简单线性同余法，避免偏态（无需第三方库）
  let x = seed >>> 0;
  x = (x ^ 0x6D2B79F5) >>> 0;
  x = Math.imul(x ^ (x >>> 15), 1 | x);
  x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
  x = (x ^ (x >>> 14)) >>> 0;
  return x % modulo;
}
function pickTodayImagePath() {
  const idx = seededIndex(getDateSeed(), MOOD_TOTAL_IMAGES) + 1; // 1..24
  return `img/mood${idx}.png`;
}
function pickTodayQuote() {
  const idx = seededIndex(getDateSeed() + 1314, MOOD_QUOTES.length);
  return MOOD_QUOTES[idx];
}

// ——— B. 每次刷新都随机（如需此模式，把下方两行换成 random 版本即可）
// function pickTodayImagePath() {
//   const idx = Math.floor(Math.random() * MOOD_TOTAL_IMAGES) + 1;
//   return `img/mood${idx}.png`;
// }
// function pickTodayQuote() {
//   const idx = Math.floor(Math.random() * MOOD_QUOTES.length);
//   return MOOD_QUOTES[idx];
// }

function showMoodModal(imgPath, quote) {
  const modal = document.getElementById('moodModal');
  const imgEl = document.getElementById('moodImg');
  const quoteEl = document.getElementById('moodQuote');
  const closeBtn = document.getElementById('closeModal');

  if (!modal || !imgEl || !quoteEl) return;

  imgEl.src = imgPath;
  imgEl.alt = '今日心情';
  quoteEl.textContent = quote;

  // 打开弹窗
  modal.style.display = 'block';
  modal.classList.add('open');

  // 关闭逻辑
  const close = () => {
    modal.classList.remove('open');
    modal.style.display = 'none';
    closeBtn?.removeEventListener('click', close);
    modal?.removeEventListener('click', maskClose);
  };
  const maskClose = (e) => {
    if (e.target === modal) close();
  };
  closeBtn?.addEventListener('click', close);
  modal?.addEventListener('click', maskClose);
}

// 提供一个统一的初始化函数，供页面加载 & 日历点击调用
export function initTodayMood({openOnLoad = true} = {}) {
  const imgPath = pickTodayImagePath();
  const quote = pickTodayQuote();

  // 如果希望一进页面就弹出今日心情
  if (openOnLoad) {
    showMoodModal(imgPath, quote);
  }

  // 也把“今天”这一天点开时，弹出当日心情（如果你已有日历点击事件，这里只暴露方法）
  // 你可以在已有的日历 onClick(day) 里调用：showMoodModal(imgPath, quote)
}

// 页面加载后自动展示一次（如果你已有 DOMContentLoaded 监听，把这行合并进去）
document.addEventListener('DOMContentLoaded', () => {
  initTodayMood({ openOnLoad: true });
});
