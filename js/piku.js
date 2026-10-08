/* Piku: Ravichandra's little cloud assistant who sits on his shoulder.
   Eyes follow the cursor, blinks, swings its legs, waves, lip-syncs to its own voice,
   glances at Ravichandra now and then, drops quips in a speech bubble, and opens the chat when tapped.
   It starts ASLEEP, hugging his neck (zZz…); the first tap anywhere wakes it up. */
import { voiceState } from './voice.js';
import { portrait } from './portrait.js';
import { sfx } from './sfx.js';

const SVG = `
<svg class="piku" viewBox="0 0 220 250" aria-hidden="true">
  <defs>
    <radialGradient id="pkBody" cx="40%" cy="32%" r="78%">
      <stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#eef7ff"/><stop offset=".82" stop-color="#c9e2ff"/><stop offset="1" stop-color="#b8b3ff"/>
    </radialGradient>
    <radialGradient id="pkCheek"><stop offset="0" stop-color="#ff7fa8" stop-opacity=".85"/><stop offset="1" stop-color="#ff7fa8" stop-opacity="0"/></radialGradient>
    <radialGradient id="pkBulb"><stop offset="0" stop-color="#fff7c2"/><stop offset=".45" stop-color="#ffd84d"/><stop offset="1" stop-color="#ffd84d" stop-opacity="0"/></radialGradient>
    <radialGradient id="pkSnot" cx="35%" cy="30%"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".5" stop-color="#d7f0ff" stop-opacity=".55"/><stop offset="1" stop-color="#9fd8ff" stop-opacity=".35"/></radialGradient>
    <linearGradient id="pkShoe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8f70"/><stop offset="1" stop-color="#ff5d7a"/></linearGradient>
    <pattern id="pkStripes" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="16" height="16" fill="#6c8cff"/><rect width="8" height="16" fill="#9fb4ff"/></pattern>
    <filter id="pkShadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity=".3"/></filter>
    <clipPath id="pkEyeL"><ellipse cx="88" cy="124" rx="17" ry="19"/></clipPath>
    <clipPath id="pkEyeR"><ellipse cx="136" cy="124" rx="17" ry="19"/></clipPath>
  </defs>
  <g class="pk-root">
    <!-- stubby legs + sneakers -->
    <g class="pk-leg pk-leg--l"><path d="M94 180 q-1 14 -2 22" stroke="#cfe3ff" stroke-width="12" stroke-linecap="round" fill="none"/><ellipse cx="90" cy="208" rx="13" ry="8" fill="url(#pkShoe)"/><ellipse cx="86" cy="205" rx="4" ry="2" fill="#fff" opacity=".7"/></g>
    <g class="pk-leg pk-leg--r"><path d="M130 180 q1 14 2 22" stroke="#cfe3ff" stroke-width="12" stroke-linecap="round" fill="none"/><ellipse cx="134" cy="208" rx="13" ry="8" fill="url(#pkShoe)"/><ellipse cx="130" cy="205" rx="4" ry="2" fill="#fff" opacity=".7"/></g>
    <!-- stubby arms -->
    <g class="pk-arm pk-arm--l"><path d="M44 142 q-10 -4 -16 -12" stroke="#dcebff" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="25" cy="127" r="10" fill="#fff" stroke="#c9e2ff" stroke-width="2"/></g>
    <g class="pk-arm pk-arm--r"><path d="M180 148 q10 6 12 14" stroke="#dcebff" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="194" cy="166" r="10" fill="#fff" stroke="#c9e2ff" stroke-width="2"/></g>
    <!-- antenna with a little star -->
    <g class="pk-antenna"><path d="M112 66 q-2 -14 5 -24" stroke="#b8cdf5" stroke-width="4" stroke-linecap="round" fill="none"/>
      <circle class="pk-bulb-glow" cx="118" cy="36" r="15" fill="url(#pkBulb)"/>
      <path d="M118 27 l2.8 6 6.4 .8 -4.7 4.4 1.2 6.4 -5.7 -3.1 -5.7 3.1 1.2 -6.4 -4.7 -4.4 6.4 -.8z" fill="#ffd84d" stroke="#fff3b0" stroke-width="1"/></g>
    <!-- chubby cloud body -->
    <path class="pk-body" filter="url(#pkShadow)" fill="url(#pkBody)" stroke="#ffffff" stroke-width="2.5"
      d="M58 186 C22 186 16 150 36 134 C26 102 52 80 80 88 C90 58 136 54 150 84 C180 78 204 102 194 130 C214 146 204 186 168 186 Z"/>
    <ellipse cx="78" cy="106" rx="16" ry="9" fill="#fff" opacity=".7" transform="rotate(-25 78 106)"/>
    <!-- tiny helm-wheel belly badge -->
    <g class="pk-badge" transform="translate(150 170)"><circle r="8.5" fill="#6c8cff"/><circle r="3.6" fill="none" stroke="#fff" stroke-width="1.6"/>
      <g stroke="#fff" stroke-width="1.5" stroke-linecap="round"><path d="M0-6.6v2.6M0 4v2.6M-6.6 0h2.6M4 0h2.6M-4.7-4.7l1.8 1.8M2.9 2.9l1.8 1.8M4.7-4.7l-1.8 1.8M-2.9 2.9l-1.8 1.8"/></g></g>
    <!-- face -->
    <ellipse cx="68" cy="150" rx="14" ry="9" fill="url(#pkCheek)"/><ellipse cx="156" cy="150" rx="14" ry="9" fill="url(#pkCheek)"/>
    <g class="pk-eyes">
      <path class="pk-brow pk-brow--l" d="M76 98 q12 -6 22 -1" stroke="#3a4f86" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <path class="pk-brow pk-brow--r" d="M126 97 q11 -5 22 1" stroke="#3a4f86" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <g clip-path="url(#pkEyeL)"><ellipse cx="88" cy="124" rx="17" ry="19" fill="#fff"/>
        <g class="pk-pupil"><circle cx="88" cy="126" r="11.5" fill="#33407a"/><circle cx="88" cy="128" r="6.5" fill="#141a3a"/><circle cx="83" cy="120" r="4.6" fill="#fff"/><circle cx="93" cy="131" r="2.2" fill="#fff" opacity=".85"/></g>
        <rect class="pk-lid" x="68" y="104" width="40" height="0" fill="#e6f2ff"/></g>
      <g clip-path="url(#pkEyeR)"><ellipse cx="136" cy="124" rx="17" ry="19" fill="#fff"/>
        <g class="pk-pupil"><circle cx="136" cy="126" r="11.5" fill="#33407a"/><circle cx="136" cy="128" r="6.5" fill="#141a3a"/><circle cx="131" cy="120" r="4.6" fill="#fff"/><circle cx="141" cy="131" r="2.2" fill="#fff" opacity=".85"/></g>
        <rect class="pk-lid" x="116" y="104" width="40" height="0" fill="#e6f2ff"/></g>
      <ellipse cx="88" cy="124" rx="17" ry="19" fill="none" stroke="#3a4f86" stroke-width="2.4"/>
      <ellipse cx="136" cy="124" rx="17" ry="19" fill="none" stroke="#3a4f86" stroke-width="2.4"/>
    </g>
    <!-- sleeping eyes with lashes -->
    <g class="pk-sleepeyes" stroke="#3a4f86" stroke-width="3.5" stroke-linecap="round" fill="none">
      <path d="M74 124 q14 12 28 0"/><path d="M122 124 q14 12 28 0"/>
      <path d="M78 129 l-4 4M88 132 v5M98 129 l4 4M126 129 l-4 4M136 132 v5M146 129 l4 4" stroke-width="2.2"/>
    </g>
    <path class="pk-mouth" d="M100 151 Q112 155 124 151 Q112 161 100 151Z" fill="#3a4f86"/>
    <path class="pk-tongue" d="M106 156 Q112 160 118 156" fill="#ff7a9a" opacity="0"/>
    <!-- sleep bubble from the nose -->
    <g class="pk-snot"><circle cx="128" cy="144" r="10" fill="url(#pkSnot)" stroke="#bfe6ff" stroke-width="1.4"/><circle cx="125" cy="140" r="2.6" fill="#fff"/></g>
    <!-- nightcap -->
    <g class="pk-cap">
      <path d="M76 92 Q100 22 170 30 Q152 50 158 86 Z" fill="url(#pkStripes)" stroke="#5a78f0" stroke-width="2"/>
      <path d="M70 92 Q114 70 162 88 Q164 98 158 102 Q114 84 74 104 Q66 99 70 92Z" fill="#fff" stroke="#dbe6ff" stroke-width="1.5"/>
      <circle cx="173" cy="31" r="11" fill="#fff" stroke="#dbe6ff" stroke-width="1.5"/>
    </g>
    <!-- the hugging arm: reaches over his collar -->
    <g class="pk-hug"><path d="M50 150 q-30 14 -56 30" stroke="#dcebff" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="-10" cy="182" r="10.5" fill="#fff" stroke="#c9e2ff" stroke-width="2"/></g>
    <g class="pk-zzz" fill="#d9e8ff" font-family="Syne, Inter, sans-serif" font-weight="800"><text x="176" y="70" font-size="18">z</text><text x="192" y="48" font-size="24">z</text><text x="210" y="22" font-size="32">Z</text></g>
    <text class="pk-bang" x="176" y="66" font-family="Syne, Inter, sans-serif" font-weight="800" font-size="44" fill="#ffd166">!</text>
  </g>
</svg>`;

const QUIPS = {
  '#about': 'Ten years. Still the calmest person in every incident call 😌',
  '#clouds': 'AWS, Azure, GCP… he speaks all three fluently ☁️',
  '#stack': 'Psst… he has actually run every one of these in production 👀',
  '#pipeline': 'My favourite part: zero-downtime deploys 🚀',
  '#experience': 'From sysadmin to tech lead. Character development! 📈',
  '#observability': 'All green. As usual 💚',
  '#github': 'The best stuff is behind client firewalls 🔒',
  '#contact': 'Go on, say hi! He replies fast ✉️',
};

export function initPiku({ onTap } = {}) {
  const wrap = document.querySelector('#piku');
  wrap.innerHTML = SVG;
  const svg = wrap.querySelector('svg');
  const $ = (s) => svg.querySelector(s);
  const $$ = (s) => [...svg.querySelectorAll(s)];
  const pupils = $$('.pk-pupil'), lids = $$('.pk-lid'), mouth = $('.pk-mouth'), tongue = $('.pk-tongue');
  const bubble = document.querySelector('#pikuBubble');
  let sleeping = false, lidOverride = null, mouthOverride = null;

  // ---- entrance: pops onto the shoulder
  gsap.set(svg, { transformOrigin: '50% 90%' });
  const enter = () => { wrap.classList.add('in'); return gsap.timeline()
    .fromTo(svg, { scale: 0, rotate: -25, y: -60 }, { scale: 1, rotate: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, .55)' })
    .add(wave, .6); };

  // ---- sleeping: snuggled against his neck, hugging, slow breathing, zZz
  let breathe;
  function sleep({ animate = false } = {}) {
    sleeping = true;
    wrap.classList.add('in');
    if (animate) {
      // snuggles into his neck, then the nightcap pops on
      gsap.to(svg, { scale: 1, rotate: -16, xPercent: -16, yPercent: 6, duration: .9, ease: 'power2.inOut',
        onComplete: () => { wrap.classList.add('sleeping'); gsap.fromTo('.pk-cap', { scale: 0, svgOrigin: '116 92' }, { scale: 1, svgOrigin: '116 92', duration: .5, ease: 'back.out(2.5)' }); } });
    } else {
      wrap.classList.add('sleeping');
      gsap.set(svg, { scale: 1, rotate: -16, xPercent: -16, yPercent: 6 });
    }
    breathe = gsap.to('.pk-body, .pk-eyes, .pk-sleepeyes', { scaleY: 1.035, scaleX: .985, svgOrigin: '112 182', duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.set('.pk-bulb-glow', { opacity: .12 });
    gsap.set('.pk-cap, .pk-snot', { clearProps: 'all' });
  }

  // ---- waking up: flicker, flutter, "!", yawn + stretch, hop onto the shoulder, wave
  function wake() {
    if (!sleeping) return Promise.resolve();
    sleeping = false;
    wrap.classList.add('waking');                // keeps cap + bubble visible while they fly / pop
    return new Promise((done) => {
      const tl = gsap.timeline({ onComplete: () => { wrap.classList.remove('waking'); done(); } });
      tl.add(() => sfx.pop(), .1)
        .to('.pk-snot', { scale: 1.5, svgOrigin: '128 144', duration: .12, ease: 'power2.in' }, 0)
        .to('.pk-snot', { scale: 0, autoAlpha: 0, svgOrigin: '128 144', duration: .1 })        // pop!
        .to('.pk-zzz', { autoAlpha: 0, y: -10, duration: .3 }, 0)
        .to('.pk-cap', { x: 70, y: -90, rotate: 140, svgOrigin: '116 70', autoAlpha: 0, duration: .9, ease: 'power2.out' }, .5)   // nightcap flies off
        .to('.pk-bulb-glow', { opacity: 1, duration: .06, repeat: 5, yoyo: true }, 0)
        .to('.pk-bulb-glow', { opacity: .55, duration: .2 })
        .add(() => { wrap.classList.remove('sleeping'); lidOverride = 44; breathe?.kill(); gsap.set('.pk-body, .pk-eyes, .pk-sleepeyes', { clearProps: 'transform' }); }, .35)
        .to({ v: 44 }, { keyframes: { v: [44, 24, 40, 12, 30, 0] }, duration: .6, ease: 'none', onUpdate() { lidOverride = this.targets()[0].v; } }, .4)
        .add(() => { lidOverride = null; }, .95)
        .fromTo('.pk-bang', { autoAlpha: 0, scale: 0, svgOrigin: '180 60' }, { autoAlpha: 1, scale: 1, duration: .35, ease: 'back.out(3)' }, .9)
        .to('.pk-bang', { autoAlpha: 0, duration: .25 }, 1.6)
        // yawn + stretch
        .to({ v: 0 }, { v: 1, duration: .35, yoyo: true, repeat: 1, repeatDelay: .45, onUpdate() { mouthOverride = this.targets()[0].v; }, onComplete() { mouthOverride = null; } }, 1.25)
        .to('.pk-arm--l', { rotate: 55, svgOrigin: '44 140', duration: .4, yoyo: true, repeat: 1, repeatDelay: .3 }, 1.25)
        .to('.pk-arm--r', { rotate: -40, svgOrigin: '180 146', duration: .4, yoyo: true, repeat: 1, repeatDelay: .3 }, 1.25)
        // hop up onto the shoulder
        .to(svg, { rotate: 0, xPercent: 0, y: -26, yPercent: 0, duration: .35, ease: 'power2.out' }, 2.4)
        .to(svg, { y: 0, duration: .55, ease: 'bounce.out' }, 2.75)
        .add(wave, 3.1);
    });
  }
  const isSleeping = () => sleeping;

  // ---- flies in across the screen with a sparkle trail, lands on his shoulder, yawns, dozes off
  function flyIn() {
    wrap.classList.add('in');
    return new Promise((done) => {
      const trail = setInterval(() => {
        const r = svg.getBoundingClientRect();
        const star = document.createElement('i');
        star.className = 'pk-spark';
        star.style.left = (r.left + r.width * .5 + (Math.random() - .5) * r.width * .4) + 'px';
        star.style.top = (r.top + r.height * .55 + (Math.random() - .5) * r.height * .3) + 'px';
        document.body.append(star);
        setTimeout(() => star.remove(), 900);
      }, 45);
      const W = innerWidth, H = innerHeight;
      sfx.flight();
      gsap.timeline({ onComplete: () => { clearInterval(trail); done(); } })
        .fromTo(svg, { x: W * .55, y: -H * .7, rotate: -40, scale: .45 }, {
          keyframes: [
            { x: W * .3, y: -H * .55, rotate: 18, scale: .6, duration: .55, ease: 'sine.inOut' },
            { x: W * .12, y: -H * .25, rotate: -12, scale: .8, duration: .5, ease: 'sine.inOut' },
            { x: 0, y: -30, rotate: 6, scale: 1, duration: .45, ease: 'power2.out' },
            { x: 0, y: 0, rotate: 0, duration: .22, ease: 'power2.in' },
          ] })
        .to('.pk-leg--l, .pk-leg--r', { rotate: 0, duration: .01 }, 0)
        .add(() => clearInterval(trail), 1.6)
        .add(() => sfx.boing())
        .to(svg, { scaleY: .78, scaleX: 1.18, duration: .1, ease: 'power2.out' })          // landing squash
        .to(svg, { scaleY: 1, scaleX: 1, duration: .6, ease: 'elastic.out(1, .35)' })
        .add(wave, '-=.4')
        .add(() => say('Phew… long deploy night 😴', 2200), '+=.2')
        .to({ v: 0 }, { v: 1, duration: .4, yoyo: true, repeat: 1, repeatDelay: .5, onUpdate() { mouthOverride = this.targets()[0].v; }, onComplete() { mouthOverride = null; } }, '+=.4')
        .to('.pk-arm--l', { rotate: 50, svgOrigin: '44 140', duration: .4, yoyo: true, repeat: 1, repeatDelay: .3 }, '<')
        .add(() => sleep({ animate: true }), '+=.2')
        .to({}, { duration: 1.1 });
    });
  }

  // ---- waving
  function wave() {
    gsap.timeline()
      .to('.pk-arm--l', { rotate: 28, svgOrigin: '44 140', duration: .18, yoyo: true, repeat: 5, ease: 'sine.inOut' })
      .to('.pk-arm--l', { rotate: 0, svgOrigin: '44 140', duration: .2 });
  }

  // ---- idle loops
  gsap.to('.pk-leg--l', { rotate: 14, svgOrigin: '92 178', duration: .9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.pk-leg--r', { rotate: -12, svgOrigin: '130 178', duration: 1.05, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: .3 });
  gsap.to('.pk-root', { y: -4, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.pk-antenna', { rotate: 6, svgOrigin: '112 66', duration: 1.3, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  // ---- interaction
  wrap.addEventListener('pointerenter', () => gsap.to(svg, { scaleX: 1.06, scaleY: .94, duration: .25, ease: 'power2.out' }));
  wrap.addEventListener('pointerleave', () => gsap.to(svg, { scaleX: 1, scaleY: 1, duration: .6, ease: 'elastic.out(1, .4)' }));
  wrap.addEventListener('click', () => {
    if (sleeping) return;                       // the page-level tap handler wakes Piku
    gsap.timeline().to(svg, { y: -18, duration: .18, ease: 'power2.out' }).to(svg, { y: 0, duration: .5, ease: 'bounce.out' });
    onTap?.();
  });

  // ---- speech bubble (positioned near Piku in screen space)
  let bubbleTimer;
  function say(text, ms = 4200, { hint = false } = {}) {
    bubble.textContent = text;
    bubble.classList.toggle('hint', hint);
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), ms);
  }
  Object.entries(QUIPS).forEach(([sel, text]) => {
    if (!document.querySelector(sel)) return;
    let shown = false;
    const st = ScrollTrigger.create({ trigger: sel, start: 'top 45%', end: 'bottom 45%', onEnter: () => {
      if (shown || sleeping) return;
      setTimeout(() => {
        if (shown || !st.isActive || sleeping) return;          // only if the visitor is still here
        if (!voiceState.speaking || voiceState.who === 'presenter') { shown = true; say(text); }
      }, 1800);
    } });
  });

  // ---- per-frame: eyes, blink, mouth, glances
  const mouse = { x: innerWidth * .5, y: innerHeight * .4 };
  addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  let blink = -1e9, nextBlink = performance.now() + 2000, open = 0;
  let glanceUntil = 0, nextGlance = performance.now() + 9000;
  const look = { x: 0, y: 0 };
  gsap.ticker.add(() => {
    const now = performance.now();
    const r = wrap.getBoundingClientRect();
    if (!r.width) return;
    const cx = r.left + r.width * .5, cy = r.top + r.height * .48;
    // occasional glance: Piku looks at Ravichandra, and he glances back
    let tx = mouse.x, ty = mouse.y;
    if (sleeping) { tx = cx; ty = cy + 50; }
    if (now > nextGlance && !sleeping) { glanceUntil = now + 1400; nextGlance = now + 11000 + Math.random() * 8000; }
    const glancing = now < glanceUntil && !voiceState.speaking;
    if (glancing) { tx = cx - r.width * 1.4; ty = cy - r.height * .2; portrait.target = [cx, cy]; }
    else if (portrait.target) portrait.target = null;
    const dx = tx - cx, dy = ty - cy, len = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, len / 260);
    look.x += ((dx / len) * k * 5 - look.x) * .2;
    look.y += ((dy / len) * k * 5.5 - look.y) * .2;
    pupils.forEach((p) => p.setAttribute('transform', `translate(${look.x.toFixed(2)} ${look.y.toFixed(2)})`));
    // blink
    if (now > nextBlink) { blink = now; nextBlink = now + (Math.random() < .2 ? 240 : 2200 + Math.random() * 3000); }
    const bp = (now - blink) / 170;
    const lh = lidOverride ?? (bp >= 0 && bp < 1 ? Math.sin(bp * Math.PI) * 44 : 0);
    lids.forEach((l) => l.setAttribute('height', lh.toFixed(1)));
    // mouth: lip-sync to Piku's own voice
    const talking = !sleeping && voiceState.speaking && voiceState.who === 'bot';
    const target = mouthOverride ?? (talking ? voiceState.open : 0);
    open += (target - open) * (target > open ? .5 : .3);
    const o = open * 15, w = (sleeping ? 6 : 12) + open * 3;
    mouth.setAttribute('d', `M${112 - w} 151 Q112 ${155 - o * .2} ${112 + w} 151 Q112 ${161 + o * 1.5} ${112 - w} 151Z`);
    tongue.setAttribute('opacity', open > .3 ? .9 : 0);
    tongue.setAttribute('d', `M106 ${152 + o * .9} Q112 ${154 + o * 1.4} 118 ${152 + o * .9}`);
    wrap.classList.toggle('talking', talking);
    // bubble follows Piku
    bubble.style.left = (r.left + r.width * .5) + 'px';
    bubble.style.top = (r.top + r.height * .05) + 'px';
  });

  // easter egg: a happy spin
  function party() {
    if (sleeping) return;
    gsap.timeline().to(svg, { rotate: 360, y: -30, duration: .7, ease: 'power2.out' }).to(svg, { y: 0, duration: .5, ease: 'bounce.out' }).set(svg, { rotate: 0 });
    wave();
    say('Hehe, you found my secret! 🥳', 2600);
  }

  return { enter, wave, say, sleep, wake, isSleeping, flyIn, party };
}
