/* Ravi.SI (Super Intelligence) — resume-grounded assistant.
   Works fully offline with a local knowledge base (lines.js → kb).
   Answers are spoken with pre-rendered natural voice clips (assets/voice/kb-*.mp3).
   Optional: set window.RAVI_BOT_ENDPOINT = 'https://your-worker.example/chat'
   to route questions to a real LLM backend (POST {question, history} → {answer}). */
import { KB, SUGGESTIONS, LINES } from './data.js';
import { say, sayAll, stop } from './voice.js';

const $ = (s) => document.querySelector(s);
const STOP = new Set('a an the is are was were be to of and or in on for with his her he she him you your me my i do does did can could would should what which how when where please much many any some has have had it its this that there their they at as by from'.split(' '));
const HELLO = LINES.bot.find((l) => l.id === 'bot-hello');
const FALLBACK = { id: 'bot-fallback', a: LINES.bot.find((l) => l.id === 'bot-fallback').text };

let open = false;
let greeted = false;
let voiceOn = true;
const history = [];

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s/+.-]/g, ' ');
const tokens = (s) => norm(s).split(/\s+/).filter((t) => t && !STOP.has(t));

export function localAnswer(q) {
  const qn = ' ' + norm(q) + ' ';
  const qt = tokens(q);
  let best = null, bestScore = 0, second = null, secondScore = 0;
  for (const item of KB) {
    let score = 0;
    for (const k of item.k) {
      if (k.includes(' ')) { if (qn.includes(k)) score += 3; continue; }
      for (const t of qt) {
        if (t === k) score += 2.2;
        else if (t.length > 3 && (t.startsWith(k) || k.startsWith(t))) score += 1.1;
      }
    }
    if (item.g) score *= .45;
    if (score > bestScore) { second = best; secondScore = bestScore; best = item; bestScore = score; }
    else if (score > secondScore) { second = item; secondScore = score; }
  }
  if (!best || bestScore < 1) return [FALLBACK];
  // blend in a second relevant fact for compound questions
  if (second && secondScore >= 2.2 && secondScore >= bestScore * .8) return [best, second];
  return [best];
}

async function answer(q) {
  const ep = window.RAVI_BOT_ENDPOINT;
  if (ep) {
    try {
      const r = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q, history: history.slice(-8) }) });
      if (r.ok) { const j = await r.json(); if (j.answer) return [{ a: j.answer }]; }
    } catch { /* fall back to local */ }
  }
  return localAnswer(q);
}

function scroll() { const m = $('#botMsgs'); m.scrollTop = m.scrollHeight; }

function linkify(el) {
  el.innerHTML = el.textContent
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/([a-z0-9.]+@[a-z0-9.]+\.[a-z]+)/gi, '<a href="mailto:$1" style="color:var(--cyan)">$1</a>')
    .replace(/(linkedin\.com\/in\/[a-z0-9-]+|github\.com\/[A-Za-z0-9-]+)/g, '<a href="https://$1" target="_blank" rel="noopener" style="color:var(--cyan)">$1</a>')
    .replace(/\n/g, '<br>');
}

function addMsg(text, who) {
  const el = document.createElement('div');
  el.className = `msg msg--${who}`;
  $('#botMsgs').append(el);
  if (who === 'me') { el.textContent = text; scroll(); return Promise.resolve(); }
  return new Promise((res) => {
    const words = text.split(/(\s+)/);
    let i = 0;
    const step = () => {
      if (i >= words.length) { linkify(el); res(); return; }
      el.textContent += words[i++];
      scroll();
      setTimeout(step, 18 + Math.random() * 22);
    };
    step();
  });
}

export async function ask(q) {
  q = q.trim();
  if (!q) return;
  $('#botText').value = '';
  await addMsg(q, 'me');
  history.push({ role: 'user', content: q });
  const typing = document.createElement('div');
  typing.className = 'msg msg--bot msg--typing';
  typing.innerHTML = '<i></i><i></i><i></i>';
  $('#botMsgs').append(typing); scroll();
  const [items] = await Promise.all([answer(q), new Promise((r) => setTimeout(r, 550 + Math.random() * 450))]);
  typing.remove();
  const a = items.map((i) => i.a).join('\n\n');
  history.push({ role: 'assistant', content: a });
  if (voiceOn) sayAll(items.map((i) => ({ id: i.id, text: i.say || i.a, src: i.say || i.a, who: 'bot', label: 'Ravi.SI answering' })));
  await addMsg(a, 'bot');
}

export function toggleBot(force) {
  open = force ?? !open;
  const bot = $('#bot'), fab = $('#botFab');
  bot.setAttribute('aria-hidden', String(!open));
  fab.classList.toggle('hidden', open);
  document.body.classList.toggle('bot-open', open);
  if (open) {
    gsap.to(bot, { autoAlpha: 1, y: 0, scale: 1, duration: .5, ease: 'expo.out' });
    setTimeout(() => $('#botText').focus({ preventScroll: true }), 200);
    if (!greeted) { greeted = true; if (voiceOn) say({ id: HELLO.id, text: HELLO.say || HELLO.text, src: HELLO.say || HELLO.text, who: 'bot' }); }
  } else {
    gsap.to(bot, { autoAlpha: 0, y: 30, scale: .96, duration: .3, ease: 'power2.in' });
  }
}

export function initBot() {
  $('#botChips').innerHTML = SUGGESTIONS.map((s) => `<button type="button">${s}</button>`).join('');
  $('#botChips').addEventListener('click', (e) => { if (e.target.tagName === 'BUTTON') ask(e.target.textContent); });
  $('#botForm').addEventListener('submit', (e) => { e.preventDefault(); ask($('#botText').value); });
  $('#botFab').addEventListener('click', () => toggleBot(true));
  $('#botClose').addEventListener('click', () => { toggleBot(false); stop(); });
  $('#botSpeak').addEventListener('click', (e) => { voiceOn = !voiceOn; e.currentTarget.classList.toggle('on', voiceOn); e.currentTarget.textContent = voiceOn ? '🔊' : '🔇'; if (!voiceOn) stop(); });

  // voice input
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const mic = $('#botMic');
  if (!SR) mic.style.display = 'none';
  else {
    const rec = new SR();
    rec.lang = 'en-IN'; rec.interimResults = true; rec.maxAlternatives = 1;
    let listening = false;
    rec.onresult = (e) => {
      const t = Array.from(e.results).map((r) => r[0].transcript).join('');
      $('#botText').value = t;
      if (e.results[e.results.length - 1].isFinal) ask(t);
    };
    rec.onend = rec.onerror = () => { listening = false; mic.classList.remove('rec'); };
    mic.addEventListener('click', () => {
      if (listening) { rec.stop(); return; }
      stop(); listening = true; mic.classList.add('rec');
      try { rec.start(); } catch { listening = false; mic.classList.remove('rec'); }
    });
  }
  addMsg(HELLO.text.replace('Ravi.SI,', 'Ravi.SI 🤖,'), 'bot');
}
