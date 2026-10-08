/* Small signature touches:
   - live Hyderabad clock + "career uptime" counter (since 1 Aug 2016) in the contact section
   - deploy-style confetti + a Piku cheer when someone reaches out (email click, `sudo hire`)
   - time-aware greeting for Piku
   - sound-effects toggle in the nav
   - easter egg: type "piku" anywhere */
import { sfx } from './sfx.js';

const $ = (s) => document.querySelector(s);
const CAREER_START = new Date('2016-08-01T09:00:00+05:30');

export function greeting() {
  const h = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23' }).format(new Date()));
  return h < 5 ? 'Up late? Same here 🌙' : h < 12 ? 'Good morning! ☀️' : h < 17 ? 'Good afternoon! 🌤' : h < 22 ? 'Good evening! 🌆' : 'Burning the midnight oil? 🌙';
}

function contactMeta() {
  const box = document.createElement('div');
  box.className = 'contact__meta';
  box.innerHTML = `<span><span class="pulse"></span>Hyderabad · <b class="hyd-time">--:--</b> IST · usually replies within a few hours</span>
    <span>Career uptime <b class="uptime">0y 0m 0d 00:00:00</b></span>`;
  $('.contact__links')?.after(box);
  const fmt = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' });
  const tick = () => {
    box.querySelector('.hyd-time').textContent = fmt.format(new Date());
    const now = new Date();
    let y = now.getFullYear() - CAREER_START.getFullYear(), m = now.getMonth() - CAREER_START.getMonth(), d = now.getDate() - CAREER_START.getDate();
    if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    const s = Math.floor((now - CAREER_START) / 1000) % 86400;
    const hh = String(Math.floor(s / 3600)).padStart(2, '0'), mm = String(Math.floor(s / 60) % 60).padStart(2, '0'), ss = String(s % 60).padStart(2, '0');
    box.querySelector('.uptime').textContent = `${y}y ${m}m ${d}d ${hh}:${mm}:${ss}`;
  };
  tick(); setInterval(tick, 1000);
}

export function confetti(x = innerWidth / 2, y = innerHeight / 2) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas'); c.className = 'confetti';
  const dpr = Math.min(devicePixelRatio, 2); c.width = innerWidth * dpr; c.height = innerHeight * dpr;
  document.body.append(c);
  const g = c.getContext('2d'); g.scale(dpr, dpr);
  const cols = ['#3ef2ff', '#8b5cf6', '#34d399', '#ffd84d', '#ff7fa8', '#ffffff'];
  const parts = Array.from({ length: 140 }, () => {
    const a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 9;
    return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, r: 3 + Math.random() * 5, c: cols[(Math.random() * cols.length) | 0], rot: Math.random() * 6, vr: (Math.random() - .5) * .3, shape: Math.random() < .25 ? 'cloud' : 'rect' };
  });
  let t = 0;
  (function draw() {
    t++;
    g.clearRect(0, 0, innerWidth, innerHeight);
    parts.forEach((p) => {
      p.vy += .25; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.globalAlpha = Math.max(0, 1 - t / 160); g.fillStyle = p.c;
      if (p.shape === 'cloud') { g.beginPath(); g.arc(-p.r * .6, 0, p.r * .6, 0, 7); g.arc(0, -p.r * .4, p.r * .75, 0, 7); g.arc(p.r * .6, 0, p.r * .6, 0, 7); g.fill(); }
      else g.fillRect(-p.r, -p.r * .45, p.r * 2, p.r * .9);
      g.restore();
    });
    if (t < 170) requestAnimationFrame(draw); else c.remove();
  })();
}

export function initExtras({ piku }) {
  contactMeta();
  // celebrate when someone reaches out
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href^="mailto:"], a[href*="linkedin.com"]');
    if (!a) return;
    const r = a.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + r.height / 2);
    sfx.cheer();
    piku?.say(a.href.startsWith('mailto:') ? 'Yay! He’ll love hearing from you 🎉' : 'Let’s connect! 🤝', 3500);
  });
  window.addEventListener('rv:hire', () => { confetti(); sfx.cheer(); piku?.say('Best decision today! 🎉🚀', 3500); });
  // sound-effects toggle
  const btn = document.createElement('button');
  btn.className = 'icon-btn sfx-btn';
  btn.setAttribute('aria-label', 'Toggle sound effects');
  btn.title = 'Sound effects on/off';
  const paint = () => { btn.textContent = sfx.enabled ? '♪' : '♪̸'; btn.classList.toggle('off', !sfx.enabled); };
  paint();
  btn.addEventListener('click', () => { sfx.toggle(); paint(); sfx.click(); });
  $('.nav__actions')?.prepend(btn);
  // subtle click feedback on buttons
  document.addEventListener('pointerdown', (e) => { if (e.target.closest?.('button, .btn')) sfx.click(); }, true);
  // easter egg: type "piku"
  let buf = '';
  addEventListener('keydown', (e) => {
    if (/INPUT|TEXTAREA/.test(document.activeElement?.tagName)) return;
    buf = (buf + (e.key || '')).slice(-4).toLowerCase();
    if (buf === 'piku') { piku?.party?.(); sfx.giggle(); }
  });
}
