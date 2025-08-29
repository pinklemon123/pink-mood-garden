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
enableClickHearts({ emoji: '❤' }); // 想换花瓣可传 emoji: '❀' 或 '✿'