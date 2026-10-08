import { PROFILE, TOOLS, STACK, CLOUDS, PIPELINE, STATS, EXPERIENCE, EDUCATION, LINES, SECTION_LINES } from './data.js';
import { initScene } from './scene.js';
import { say, stop, voiceState, onVoice, unlockAudio, preload as preloadVoice, clipInfo } from './voice.js';
import { initPresenter, presenter } from './presenter.js';
import { initPortrait } from './portrait.js';
import { monitorsIntro, introSeen } from './intro.js';
import { sfx } from './sfx.js';
import { initExtras, greeting } from './extras.js';
import { initPiku } from './piku.js';
import { initFX, opening } from './fx.js';
import { initBot, toggleBot, ask } from './bot.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);
window.__errors = [];
addEventListener('error', (e) => window.__errors.push(String(e.message || e)));
addEventListener('unhandledrejection', (e) => window.__errors.push('promise: ' + String(e.reason?.message || e.reason)));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ======================================================================
   Helpers
   ====================================================================== */
function logo(key, extraClass = '') {
  const t = TOOLS[key];
  if (!t) return '';
  const inner = t.txt
    ? `<span class="txt" style="color:${t.color || '#111'}">${t.txt}</span>`
    : t.color
    ? `<span class="mask" style="--m:url('${t.icon}');--c:${t.color}"></span>`
    : `<img src="${t.icon}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'txt',textContent:'${t.name.slice(0, 3)}'}))">`;
  return `<span class="logo ${extraClass}" title="${t.name}">${inner}${t.badge ? `<span class="badge">${t.badge}</span>` : ''}</span>`;
}

/* ======================================================================
   Render content from data
   ====================================================================== */
function render() {
  // marquee
  const keys = Object.keys(TOOLS).filter((k) => !['bedrock', 'eks', 'aks', 'lambda', 'ecr', 'cfn', 'sbom', 'gitops', 'appd'].includes(k));
  const half = Math.ceil(keys.length / 2);
  const mq = (list) => list.map((k) => `<span class="mq-item">${logo(k)}${TOOLS[k].name}</span>`).join('');
  $('#marquee1').innerHTML = mq(keys.slice(0, half)).repeat(2);
  $('#marquee2').innerHTML = mq(keys.slice(half)).repeat(2);

  // stats
  $('#stats').innerHTML = STATS.map((s) => `<div class="stat"><b data-count="${s.value}" data-dec="${s.decimals || 0}" data-suffix="${s.suffix}">0</b><span>${s.label}</span></div>`).join('');

  // clouds
  $('#cloudGrid').innerHTML = CLOUDS.map((c) => `
    <article class="cloud" style="--cc:${c.color}" data-tilt>
      <div class="cloud__top">${logo(c.key)}<span class="cloud__lvl">${c.level}</span></div>
      <h3>${c.name}</h3>
      <p>${c.blurb}</p>
      <div class="cloud__svc">${c.services.map((s) => `<span>${s}</span>`).join('')}</div>
    </article>`).join('');

  // stack
  $('#stackBoard').innerHTML = STACK.map((c) => `
    <div class="cat" style="--cc:${c.color}">
      <h4>${c.cat}</h4>
      <div class="cat__items">${c.items.map((k) => `<span class="tool">${logo(k)}${TOOLS[k].name}</span>`).join('')}</div>
    </div>`).join('');

  // pipeline
  $('#pipeTrack').insertAdjacentHTML('beforeend', PIPELINE.map((p) => `
    <article class="stage">
      <span class="stage__state">○ pending</span>
      <div class="stage__n">${p.step}</div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="stage__tools">${p.tools.map((k) => logo(k)).join('')}</div>
      <div class="stage__cmd">${p.cmd}</div>
    </article>`).join(''));

  // experience
  $('#timeline').insertAdjacentHTML('beforeend', EXPERIENCE.map((j, i) => `
    <article class="job" style="--jc:${j.color}">
      <div class="job__side">
        <div class="job__period">${j.period}</div>
        <div class="job__co">${j.company}</div>
        <div class="job__domain">${j.domain}</div>
        <button class="job__listen" data-job="${i}" data-magnetic>🔊 Hear it from me</button>
      </div>
      <div class="job__main">
        <div class="job__role">${j.role}</div>
        <div class="job__metrics">${j.metrics.map((m) => `<span>${m}</span>`).join('')}</div>
        <ul>${j.points.map((p) => `<li>${p}</li>`).join('')}</ul>
        <div class="job__tools">${j.tools.map((k) => logo(k)).join('')}</div>
      </div>
    </article>`).join(''));
  $('#edu').textContent = EDUCATION;
  $('#yr').textContent = new Date().getFullYear();

  // dashboard bits
  const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const rel = [120, 150, 175, 200, 210, 220, 160, 260, 320, 380];
  $('#bars').innerHTML = years.map((y, i) => `<span data-y="'${String(y).slice(2)}" style="height:${(rel[i] / 380) * 100}%"></span>`).join('');
  const skills = 60;
  $('#heat').innerHTML = Array.from({ length: skills }, () => `<i style="opacity:${(.25 + Math.random() * .75).toFixed(2)}"></i>`).join('');
  $('#ghGraph').innerHTML = Array.from({ length: 26 * 7 }, () => '<i></i>').join('');

  $('#botMsgs').setAttribute('data-lenis-prevent', '');
  $('#termOut').setAttribute('data-lenis-prevent', '');
}

/* ======================================================================
   Preloader
   ====================================================================== */
function preload() {
  return new Promise((resolve) => {
    const lines = [
      ['$ ', 'c', 'kubectl apply -f ravichandra.yaml'],
      ['', 'ok', 'namespace/portfolio created'],
      ['', 'ok', 'deployment.apps/experience-10y configured'],
      ['', 'ok', 'service/aws-azure-gcp exposed'],
      ['', 'ok', 'configmap/terraform-ansible synced'],
      ['', 'ok', 'servicemonitor/observability ready'],
      ['$ ', 'c', 'kubectl rollout status deploy/ravichandra'],
      ['', 'v', 'successfully rolled out ✔'],
    ];
    const log = $('#loaderLog');
    let i = 0;
    const tl = gsap.timeline();
    tl.to('#loaderFill', { width: '100%', duration: reduced ? .2 : 2.2, ease: 'power2.inOut', onUpdate() { $('#loaderPct').textContent = Math.round(this.progress() * 100) + '%'; } }, 0);
    const iv = setInterval(() => {
      if (i >= lines.length) { clearInterval(iv); return; }
      const [p, c, t] = lines[i++];
      log.insertAdjacentHTML('beforeend', `${p}<span class="${c}">${t}</span>\n`);
    }, reduced ? 10 : 250);
    // cinematic gate: the click is also what browsers require before audio may play
    tl.add(() => {
      gsap.to('.loader__term', { y: () => -Math.min(140, innerHeight * .14), autoAlpha: .35, scale: .92, duration: .8, ease: 'expo.out' });
      gsap.fromTo('#gate', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .9, ease: 'expo.out' });
    }, '+=.25');
    const go = (sound) => {
      if (sound) unlockAudio();
      document.body.classList.remove('loading');
      gsap.to('#loader', { yPercent: -100, duration: 1.1, ease: 'expo.inOut', onComplete: () => $('#loader').remove() });
      resolve(sound);
    };
    $('#enterSound').addEventListener('click', () => go(true), { once: true });
    $('#enterMute').addEventListener('click', () => go(false), { once: true });
  });
}

/* ======================================================================
   Smooth scroll
   ====================================================================== */
let lenis;
function initLenis() {
  if (reduced || typeof Lenis === 'undefined') return;
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: id === '#hero' ? 0 : -10, duration: 1.6 }); }
  }));
}
function scrollToEl(sel) {
  return new Promise((r) => {
    if (lenis) lenis.scrollTo(sel, { duration: 1.8, onComplete: r, offset: 0 });
    else { gsap.to(window, { scrollTo: sel, duration: 1.2, onComplete: r }); }
  });
}

/* ======================================================================
   Animations
   ====================================================================== */
function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const split = new SplitText('#heroTitle .line', { type: 'words,chars', charsClass: 'ch' });
  tl.from(split.chars, { yPercent: 115, rotate: 8, duration: 1.3, stagger: .028 })
    .from('.hero .eyebrow, .hero__role, .hero__lead', { y: 30, autoAlpha: 0, duration: 1, stagger: .1 }, '-=.9')
    .from('.hero__cta .btn', { y: 20, autoAlpha: 0, duration: .8, stagger: .08 }, '-=.7')
    .from('.hero__meta span', { y: 10, autoAlpha: 0, duration: .6, stagger: .06 }, '-=.6')
    .from('.nav', { y: -40, autoAlpha: 0, duration: 1 }, .3)
    .fromTo('.bot-fab', { y: 80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, clearProps: 'transform' }, 1);
  return tl;
}

function rotator() {
  const el = $('#rotator');
  let i = 0;
  const roles = PROFILE.roles;
  const type = (txt) => {
    const tl = gsap.timeline();
    tl.to({}, { duration: .04 * el.textContent.length, onUpdate() { el.textContent = el.textContent.slice(0, Math.floor(el.textContent.length * (1 - this.progress())) || 0); } })
      .to({}, { duration: .05 * txt.length, onUpdate() { el.textContent = txt.slice(0, Math.ceil(txt.length * this.progress())); } });
    return tl;
  };
  setInterval(() => { i = (i + 1) % roles.length; type(roles[i]); }, 2800);
}

function scrollAnimations(scene) {
  // nav state + active links
  ScrollTrigger.create({ start: 80, onToggle: (s) => $('#nav').classList.toggle('scrolled', s.isActive) });
  $$('.nav__links a').forEach((a) => {
    const sec = $(a.getAttribute('href'));
    ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => a.classList.toggle('active', s.isActive) });
  });

  // ---- studio background: spotlight follows the presenter, accent shifts per section
  if (scene) {
    const accents = { '#clouds': 0xffb36b, '#stack': 0x8fb8ff, '#pipeline': 0x3ef2ff, '#experience': 0xb9a6ff, '#observability': 0x34d399, '#contact': 0x3ef2ff };
    Object.entries(accents).forEach(([sel, col]) => ScrollTrigger.create({
      trigger: sel, start: 'top 60%', end: 'bottom 40%',
      onToggle: (st) => { if (st.isActive) scene.accent.setHex(col); },
    }));
    ScrollTrigger.create({ trigger: '#hero', start: 'top top', end: 'bottom top', onLeaveBack: () => scene.accent.setHex(0x3ef2ff) });
    gsap.ticker.add(() => {
      scene.energy = voiceState.speaking ? 1 : 0;
      scene.dim = gsap.utils.clamp(0, 1, scrollY / innerHeight);
    });
  }

  // hero copy parallax out
  gsap.to('.hero__copy', { yPercent: -18, autoAlpha: .2, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });

  // marquee driven by scroll velocity
  const m1 = gsap.to('#marquee1', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
  const m2 = gsap.fromTo('#marquee2', { xPercent: -50 }, { xPercent: 0, duration: 40, ease: 'none', repeat: -1 });
  ScrollTrigger.create({
    onUpdate: (s) => {
      const v = gsap.utils.clamp(-8, 8, s.getVelocity() / 300);
      gsap.to([m1, m2], { timeScale: 1 + Math.abs(v), duration: .3, overwrite: true, onComplete: () => gsap.to([m1, m2], { timeScale: 1, duration: 1 }) });
    },
  });

  // big statement: word-by-word scrub highlight
  const big = new SplitText('.reveal-text', { type: 'words' });
  gsap.fromTo(big.words, { opacity: .12 }, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '.reveal-text', start: 'top 80%', end: 'bottom 45%', scrub: true } });

  // kickers + headings
  $$('.h2').forEach((h) => {
    const s = new SplitText(h, { type: 'words' });
    // background-clip:text breaks on transformed children → move gradient onto each word
    h.querySelectorAll('.grad').forEach((g) => { g.classList.remove('grad'); g.querySelectorAll('div').forEach((w) => w.classList.add('grad')); });
    gsap.from(s.words, { yPercent: 100, autoAlpha: 0, duration: 1, stagger: .04, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
  });
  $$('.kicker').forEach((k) => gsap.from(k, { x: -20, autoAlpha: 0, duration: .8, scrollTrigger: { trigger: k, start: 'top 90%' } }));

  // counters
  const counter = (el) => {
    const end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, suf = el.dataset.suffix || '';
    const o = { v: 0 };
    gsap.to(o, { v: end, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => { el.textContent = (end < 0 ? '' : '') + o.v.toFixed(dec) + suf; } });
  };
  $$('[data-count]').forEach(counter);
  gsap.from('.stat', { y: 40, autoAlpha: 0, stagger: .08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#stats', start: 'top 85%' } });
  gsap.from('.about__cols p', { y: 30, autoAlpha: 0, stagger: .15, duration: 1, scrollTrigger: { trigger: '.about__cols', start: 'top 85%' } });

  // clouds: 3D flip in
  gsap.from('.cloud', { rotateX: -55, y: 120, z: -200, autoAlpha: 0, stagger: .15, duration: 1.4, ease: 'expo.out', transformOrigin: '50% 100%', scrollTrigger: { trigger: '#cloudGrid', start: 'top 85%' } });

  // stack: logos assemble from a 3D explosion
  const mm = gsap.matchMedia();
  mm.add('(min-width: 761px)', () => {
    const tools = $$('.tool');
    const cats = $$('.cat');
    const tl = gsap.timeline({ scrollTrigger: { trigger: '#stack', start: 'top top', end: '+=140%', pin: '.stack__pin', scrub: 1, anticipatePin: 1 } });
    tl.from(cats, { autoAlpha: 0, scale: .9, duration: .3, stagger: .03 }, 0)
      .from(tools, {
        x: () => gsap.utils.random(-innerWidth * .6, innerWidth * .6),
        y: () => gsap.utils.random(-innerHeight * .6, innerHeight * .6),
        z: () => gsap.utils.random(-800, 400),
        rotateX: () => gsap.utils.random(-180, 180), rotateY: () => gsap.utils.random(-180, 180),
        autoAlpha: 0, scale: .3, duration: 1, stagger: { each: .015, from: 'random' }, ease: 'power3.out',
      }, 0)
      .to({}, { duration: .3 });
  });
  mm.add('(max-width: 760px)', () => {
    $$('.cat').forEach((c) => gsap.from(c.querySelectorAll('.tool'), { y: 30, autoAlpha: 0, scale: .8, stagger: .05, duration: .7, ease: 'back.out(2)', scrollTrigger: { trigger: c, start: 'top 85%' } }));
  });

  // pipeline: horizontal scroll with packet + stage activation
  const track = $('#pipeTrack');
  const stages = $$('.stage');
  const dist = () => Math.max(0, track.scrollWidth - innerWidth);
  const htl = gsap.to(track, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: {
      trigger: '#pipeline', start: 'top top', end: () => '+=' + (dist() + innerHeight * .6), pin: '.pipeline__pin', scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: (s) => {
        const p = s.progress;
        gsap.set('#pipeFill', { scaleX: p });
        const wire = $('.pipeline__wire');
        gsap.set('#pipePacket', { left: p * wire.offsetWidth });
        let active = 0;
        stages.forEach((st, i) => {
          const on = p >= (i / stages.length) * .97;
          if (on) active++;
          if (st.classList.contains('active') !== on) {
            st.classList.toggle('active', on);
            st.querySelector('.stage__state').textContent = on ? '● passed' : '○ pending';
            if (on) gsap.fromTo(st, { y: -10 }, { y: 0, duration: .6, ease: 'back.out(3)' });
          }
        });
        const done = active === stages.length && p > .98;
        $('.pipeline__status').classList.toggle('done', done);
        $('#pipeStatus').textContent = done ? 'pipeline #4821 · passed ✓ deployed to prod' : `pipeline #4821 · running · stage ${Math.max(1, active)}/${stages.length}`;
      },
    },
  });
  void htl;

  // experience: line draw + cards
  gsap.to('#timelineFill', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#timeline', start: 'top 60%', end: 'bottom 60%', scrub: true } });
  $$('.job').forEach((j) => {
    gsap.from(j, { x: 80, autoAlpha: 0, rotateY: -12, transformPerspective: 1200, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: j, start: 'top 82%' } });
    gsap.from(j.querySelectorAll('li, .job__metrics span, .job__tools .logo'), { y: 16, autoAlpha: 0, stagger: .04, duration: .6, scrollTrigger: { trigger: j, start: 'top 70%' } });
  });

  // dashboard
  gsap.from('.panel', { y: 40, autoAlpha: 0, stagger: .06, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.dash', start: 'top 80%' } });
  gsap.to('#gaugeFg', { strokeDashoffset: 157 * (1 - .999), duration: 2.2, ease: 'power3.out', scrollTrigger: { trigger: '.dash', start: 'top 75%' } });
  gsap.from('#bars span', { scaleY: 0, stagger: .06, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#bars', start: 'top 90%' } });
  gsap.from('#heat i', { scale: 0, stagger: { each: .01, from: 'random' }, duration: .4, scrollTrigger: { trigger: '#heat', start: 'top 90%' } });

  // github graph + card
  gsap.from('.gh__card', { y: 80, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '#github', start: 'top 80%' } });
  ScrollTrigger.create({
    trigger: '#ghGraph', start: 'top 85%', once: true,
    onEnter: () => {
      $$('#ghGraph i').forEach((c, i) => {
        const lvl = Math.random();
        const col = lvl > .85 ? '#3ef2ff' : lvl > .65 ? '#2bb6c4' : lvl > .45 ? '#1d6f80' : '#161c2e';
        gsap.to(c, { backgroundColor: col, delay: (i % 26) * .02 + Math.random() * .2, duration: .4 });
      });
    },
  });

  // contact big text
  const cs = new SplitText('.contact__big span', { type: 'words,chars' });
  gsap.from(cs.chars, { yPercent: 120, rotate: 10, stagger: .025, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.contact__big', start: 'top 80%' } });
  gsap.from('.contact__links .btn', { y: 30, autoAlpha: 0, stagger: .1, duration: 1, scrollTrigger: { trigger: '.contact__links', start: 'top 90%' } });
}

/* ======================================================================
   Micro-interactions: cursor, magnetic, tilt
   ====================================================================== */
function interactions() {
  if (finePointer) {
    const dot = $('.cursor__dot'), ring = $('.cursor__ring');
    const xd = gsap.quickTo(dot, 'x', { duration: .1 }), yd = gsap.quickTo(dot, 'y', { duration: .1 });
    const xr = gsap.quickTo(ring, 'x', { duration: .45, ease: 'power3' }), yr = gsap.quickTo(ring, 'y', { duration: .45, ease: 'power3' });
    addEventListener('pointermove', (e) => { xd(e.clientX); yd(e.clientY); xr(e.clientX); yr(e.clientY); });
    document.addEventListener('pointerover', (e) => { if (e.target.closest('a, button, [data-tilt], .tool, select, input')) $('.cursor').classList.add('is-hover'); });
    document.addEventListener('pointerout', (e) => { if (e.target.closest('a, button, [data-tilt], .tool, select, input')) $('.cursor').classList.remove('is-hover'); });

    $$('[data-magnetic]').forEach((el) => {
      const xt = gsap.quickTo(el, 'x', { duration: .6, ease: 'elastic.out(1,.4)' }), yt = gsap.quickTo(el, 'y', { duration: .6, ease: 'elastic.out(1,.4)' });
      el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); xt((e.clientX - r.left - r.width / 2) * .3); yt((e.clientY - r.top - r.height / 2) * .35); });
      el.addEventListener('pointerleave', () => { xt(0); yt(0); });
    });

    $$('[data-tilt]').forEach((el) => {
      const rx = gsap.quickTo(el, 'rotationX', { duration: .6 }), ry = gsap.quickTo(el, 'rotationY', { duration: .6 });
      gsap.set(el, { transformPerspective: 1000 });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        ry((px - .5) * 12); rx(-(py - .5) * 10);
        el.style.setProperty('--mx', px * 100 + '%'); el.style.setProperty('--my', py * 100 + '%');
      });
      el.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });

    $$('.tool').forEach((t) => {
      t.addEventListener('pointerenter', () => gsap.to(t, { y: -4, scale: 1.06, duration: .3, ease: 'back.out(3)' }));
      t.addEventListener('pointerleave', () => gsap.to(t, { y: 0, scale: 1, duration: .4 }));
    });
  }
}

/* ======================================================================
   Live-ish dashboard (latency chart + logs)
   ====================================================================== */
function dashboard() {
  const cv = $('#latency'), ctx = cv.getContext('2d');
  const N = 90;
  const rps = Array.from({ length: N }, (_, i) => 60 + Math.sin(i / 6) * 15 + Math.random() * 10);
  const lat = Array.from({ length: N }, () => 40 + Math.random() * 20);
  let running = false;
  ScrollTrigger.create({ trigger: '#observability', start: 'top bottom', end: 'bottom top', onToggle: (s) => { running = s.isActive; } });

  function draw() {
    const dpr = Math.min(devicePixelRatio, 2);
    const W = cv.clientWidth, H = cv.clientHeight;
    if (cv.width !== W * dpr) { cv.width = W * dpr; cv.height = H * dpr; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(140,170,255,.08)'; ctx.lineWidth = 1;
    for (let y = 0; y <= 4; y++) { ctx.beginPath(); ctx.moveTo(0, (H / 4) * y); ctx.lineTo(W, (H / 4) * y); ctx.stroke(); }
    const plot = (arr, max, color, fill) => {
      ctx.beginPath();
      arr.forEach((v, i) => { const x = (i / (N - 1)) * W, y = H - (v / max) * H * .9; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, fill); g.addColorStop(1, 'transparent'); ctx.fillStyle = g; ctx.fill(); }
    };
    plot(rps, 110, '#3ef2ff', 'rgba(62,242,255,.25)');
    plot(lat, 110, '#a78bfa');
    ctx.font = '11px JetBrains Mono'; ctx.fillStyle = '#3ef2ff'; ctx.fillText('● req/s ' + rps[N - 1].toFixed(0), 8, 14);
    ctx.fillStyle = '#a78bfa'; ctx.fillText('● p99 ' + lat[N - 1].toFixed(0) + 'ms', 110, 14);
  }
  draw();
  addEventListener('resize', draw);
  setInterval(() => {
    if (!running) return;
    rps.shift(); rps.push(gsap.utils.clamp(30, 100, rps[N - 2] + (Math.random() - .5) * 14));
    lat.shift(); lat.push(gsap.utils.clamp(25, 80, lat[N - 2] + (Math.random() - .5) * 8));
    draw();
  }, 500);

  const logs = $('#logs');
  const L = [
    ['s', 'argocd', 'app prod-banking synced · healthy'],
    ['i', 'terraform', 'apply complete · 0 to destroy'],
    ['s', 'sonarqube', 'quality gate PASSED · 0 critical'],
    ['i', 'k8s', 'hpa scaled api 4 → 9 replicas'],
    ['s', 'trivy', 'image app:9f3c1e · 0 HIGH/CRITICAL'],
    ['i', 'jenkins', 'build #4821 finished in 3m12s'],
    ['w', 'prometheus', 'alert CPUThrottling resolved (self-heal)'],
    ['s', 'datadog', 'SLO availability 99.95% (30d)'],
    ['i', 'otel', 'trace 7d1a… p99 182ms checkout'],
    ['s', 'ansible', 'play recap ok=42 changed=3 failed=0'],
    ['i', 'eks', 'node group upgraded 1.29 → 1.30 · zero downtime'],
    ['s', 'gha', 'workflow release.yml ✓ all checks passed'],
    ['i', 'aks', 'cluster autoscaler added node aks-np-2'],
    ['s', 'cloudwatch', 'alarm cost-anomaly OK · −25% MoM'],
  ];
  let k = 0;
  setInterval(() => {
    if (!running) return;
    const [lvl, src, msg] = L[k++ % L.length];
    const t = new Date().toTimeString().slice(0, 8);
    const d = document.createElement('div');
    d.innerHTML = `<span class="muted">${t}</span> <span class="${lvl}">${lvl === 'w' ? 'WARN' : lvl === 's' ? ' OK ' : 'INFO'}</span> [${src}] ${msg}`;
    logs.append(d);
    gsap.from(d, { autoAlpha: 0, x: -10, duration: .4 });
    if (logs.children.length > 22) logs.firstElementChild.remove();
  }, 900);
}

/* ======================================================================
   GitHub (live)
   ====================================================================== */
async function github() {
  const ul = $('#ghRepos');
  const fallback = () => { ul.innerHTML = `<li><a href="${PROFILE.github}" target="_blank" rel="noopener"><span>📦 ${PROFILE.githubUser}</span><small>view all ↗</small></a></li>`; };
  try {
    const r = await fetch(`https://api.github.com/users/${PROFILE.githubUser}/repos?sort=updated&per_page=6`);
    if (!r.ok) return fallback();
    const repos = await r.json();
    if (!repos.length) return fallback();
    ul.innerHTML = repos.slice(0, 5).map((x) => `<li><a href="${x.html_url}" target="_blank" rel="noopener"><span>📦 ${x.name}</span><small>${x.language || 'config'} · ★ ${x.stargazers_count}</small></a></li>`).join('');
  } catch { fallback(); }
}

/* ======================================================================
   Presenter: stage reveal, docking, section-by-section narration
   ====================================================================== */
const INTRO = LINES.presenter.find((l) => l.id === 'intro');
const line = (id) => LINES.presenter.find((l) => l.id === id);
const sayLine = (l, label) => say({ id: l.id, text: l.text, src: l.text, who: 'presenter', label });
let touring = false, autoNarrate = false, currentSection = null;
const narrated = new Set();
let sceneRef = null;

function presenterLayout() {
  const stage = $('.presenter__stage'), slot = $('#presenterSlot');
  let k = 0;
  const CROP = .46, CROPX = .12;                 // docked card: head-to-waist, trimmed sides
  presenter.onAspect = (a) => { slot.style.aspectRatio = String(a); ScrollTrigger.refresh(); };
  if (presenter.aspect) presenter.onAspect(presenter.aspect);
  const place = () => {
    const r = slot.getBoundingClientRect();
    const w = r.width, h = r.height;
    if (!h) return;
    stage.style.width = w + 'px'; stage.style.height = h + 'px';
    const mob = innerWidth < 760;
    const e = gsap.parseEase('power3.inOut')(k);
    const visH = h * (1 - CROP * e);             // visible height while cropping toward the card
    const dockH = mob ? 150 : 230;
    const s = 1 + (dockH / (h * (1 - CROP)) - 1) * e;
    const dx = mob ? 10 : 22, dy = innerHeight - dockH - (mob ? 92 : 64);
    const x = r.left + (dx - w * CROPX * s - r.left) * e;
    const y = r.top + (dy - r.top) * e;
    stage.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    stage.style.setProperty('--crop', (CROP * e * 100).toFixed(2) + '%');
    stage.style.setProperty('--cropx', (CROPX * e * 100).toFixed(2) + '%');
    stage.style.setProperty('--dock', e.toFixed(3));
    document.body.classList.toggle('presenter-docked', k > .97);
    if (sceneRef) {
      // spotlight follows him (in normalised screen coords, y up)
      const cx = (x + w * s / 2) / innerWidth, cy = 1 - (y + visH * s * .42) / innerHeight;
      sceneRef.spot.set(cx, cy);
      sceneRef.spotSize = 1 - e * .55;
      sceneRef.floor = 1 - e;
    }
  };
  ScrollTrigger.create({ trigger: '#hero', start: 'top top', end: 'bottom 35%', onUpdate: (st) => { k = st.progress; } });
  gsap.ticker.add(place);
}

let piku = null;
const PIKU_WAKE = LINES.piku.find((l) => l.id === 'piku-wake');

function revealStage(sound) {
  // the doors have just opened: stage light powers on, he is revealed standing in the light
  opening(sceneRef);
  gsap.timeline()
    .fromTo('.presenter__body', { autoAlpha: 0, scale: .96, filter: 'brightness(2.2) blur(6px)' },
      { autoAlpha: 1, scale: 1, filter: 'brightness(1) blur(0px)', duration: 1.4, ease: 'power3.out', clearProps: 'filter,transform' }, .1)
    .fromTo('.presenter__shadow', { autoAlpha: 0, scaleX: .5 }, { autoAlpha: 1, scaleX: 1, duration: 1.2, ease: 'power3.out' }, .2)
    // Piku flies in, lands on his shoulder, yawns and dozes off hugging him
    .add(async () => {
      await piku?.flyIn();
      piku?.say('zZz… (tap anywhere to wake me 😴)', 600000, { hint: true });
      armWake(sound);
    }, 1.2);
}

function armWake(sound) {
  const wakeUp = async (e) => {
    if (e?.target?.closest?.('#loader, .term, .bot, .intro')) return;
    document.removeEventListener('pointerdown', wakeUp, true);
    document.removeEventListener('keydown', wakeUp, true);
    piku.say('', 1);
    unlockAudio();
    const introClicked = e?.target?.closest?.('#playIntro, #startTour');
    await piku.wake();
    if (introClicked || voiceState.speaking) return;
    piku.say(`${greeting()} I'm Piku 👋`, 3000);
    if (!sound) { setTimeout(() => piku.say("I'm Ravichandra's assistant. Tap me to chat!", 5000), 3100); return; }
    const ok = await say({ id: PIKU_WAKE.id, text: PIKU_WAKE.text, src: PIKU_WAKE.text, who: 'bot', label: 'Piku' });
    if (ok && !voiceState.speaking) playIntro();
  };
  document.addEventListener('pointerdown', wakeUp, true);
  document.addEventListener('keydown', wakeUp, true);
}

async function playIntro() {
  touring = false;
  narrated.add('tour-about');                 // the intro already covers the summary
  $('#playIntro').classList.add('is-speaking');
  await sayLine(INTRO, 'introducing myself');
  $('#playIntro').classList.remove('is-speaking');
}

function narrate(id, force) {
  const l = line(id);
  if (!l) return;
  if (!force && (!autoNarrate || touring || narrated.has(id))) return;
  // never cut off the intro, a job story or the bot; we catch up when they finish
  if (!force && voiceState.speaking && !/^tour-/.test(voiceState.id || '')) return;
  narrated.add(id);
  sayLine(l, 'explaining');
}

async function tour() {
  if (touring) { touring = false; stop(); $('#startTour').innerHTML = '🎧 Guided voice tour'; return; }
  unlockAudio();
  touring = true;
  $('#startTour').innerHTML = '■ Stop tour';
  for (const l of SECTION_LINES) {
    if (!touring) break;
    await scrollToEl(l.target);
    if (!touring) break;
    narrated.add(l.id);
    const ok = await sayLine(l, 'guided tour');
    if (!touring) break;
    if (!ok) await new Promise((r) => setTimeout(r, 2500));   // line not yet in his voice: pause, keep touring
    await new Promise((r) => setTimeout(r, 450));
  }
  touring = false;
  $('#startTour').innerHTML = '🎧 Guided voice tour';
}

function voiceControls() {
  preloadVoice(['intro', ...SECTION_LINES.map((l) => l.id)]);
  SECTION_LINES.forEach((l) => {
    ScrollTrigger.create({
      trigger: l.target, start: 'top 55%', end: 'bottom 45%',
      onToggle: (st) => { if (st.isActive) { currentSection = l.id; narrate(l.id); } },
    });
  });
  onVoice((e) => {
    if (e.type === 'start') $('.captions__who').textContent = e.who === 'bot' ? 'PIKU' : 'RAVICHANDRA';
    if (e.type === 'end' || e.type === 'stop') {
      $$('.job__listen.is-speaking').forEach((b) => { b.classList.remove('is-speaking'); b.textContent = '🔊 Hear it from me'; });
      $('#playIntro').classList.remove('is-speaking');
    }
    // when something finishes, catch up on the section the visitor is looking at
    if (e.type === 'end') setTimeout(() => { if (!voiceState.speaking && currentSection) narrate(currentSection); }, 700);
  });

  $('#playIntro').addEventListener('click', () => { unlockAudio(); if (voiceState.speaking) stop(); else playIntro(); });
  $('#startTour').addEventListener('click', tour);
  $('#stopVoice').addEventListener('click', () => { touring = false; stop(); $('#startTour').innerHTML = '🎧 Guided voice tour'; });
  const talk = () => {
    unlockAudio();
    if (voiceState.speaking && voiceState.who === 'presenter') { stop(); return; }
    if (!currentSection || scrollY < innerHeight * .5) playIntro(); else narrate(currentSection, true);
  };
  $('#presenterTalk').addEventListener('click', talk);
  $('.presenter__body').addEventListener('click', talk);
  $('#presenterMute').addEventListener('click', (e) => {
    autoNarrate = !autoNarrate;
    e.currentTarget.textContent = autoNarrate ? '🔊' : '🔇';
    if (!autoNarrate && voiceState.who === 'presenter') stop();
  });
  // only offer "Hear it from me" once that story exists in his cloned voice
  $$('.job__listen').forEach(async (b) => { const m = await clipInfo('job-' + b.dataset.job); b.hidden = !(m && m.engine === 'clone'); });
  $$('.job__listen').forEach((b) => b.addEventListener('click', async () => {
    unlockAudio();
    if (b.classList.contains('is-speaking')) { stop(); return; }
    $$('.job__listen').forEach((x) => x.classList.remove('is-speaking'));
    b.classList.add('is-speaking'); b.textContent = '■ Stop';
    await sayLine(line('job-' + b.dataset.job), 'telling my story');
    b.classList.remove('is-speaking'); b.textContent = '🔊 Hear it from me';
  }));
}

/* ======================================================================
   Terminal easter egg
   ====================================================================== */
function terminal() {
  const term = $('#term'), out = $('#termOut'), input = $('#termInput');
  let isOpen = false;
  const hist = []; let hi = 0;
  const print = (html) => { out.insertAdjacentHTML('beforeend', html + '\n'); out.scrollTop = out.scrollHeight; };
  const toggle = (f) => {
    isOpen = f ?? !isOpen;
    term.setAttribute('aria-hidden', String(!isOpen));
    gsap.to(term, { autoAlpha: isOpen ? 1 : 0, duration: .3 });
    gsap.fromTo('.term__win', { y: isOpen ? 30 : 0, scale: isOpen ? .96 : 1 }, { y: isOpen ? 0 : 20, scale: 1, duration: .4, ease: 'expo.out' });
    if (isOpen) { lenis?.stop(); setTimeout(() => input.focus(), 50); if (!out.textContent) cmd('welcome'); }
    else lenis?.start();
  };
  const cmds = {
    welcome: () => print(`<span class="c">Welcome to ravichandra-portfolio v10.0 (10 years in prod)</span>\nType <span class="ok">help</span> to see available commands.`),
    help: () => print(['whoami', 'skills', 'experience', 'clouds', 'contact', 'kubectl get skills', 'terraform plan', 'tour', 'intro', 'ask &lt;question&gt;', 'resume', 'sudo hire ravichandra', 'clear', 'exit'].map((c) => '  <span class="ok">' + c + '</span>').join('\n')),
    whoami: () => print(`${PROFILE.name}\n${PROFILE.title} · ${PROFILE.years} years\n${PROFILE.location}\n${PROFILE.availability}`),
    skills: () => print(STACK.map((c) => `<span class="v">${c.cat.padEnd(16)}</span>${c.items.map((k) => TOOLS[k].name).join(', ')}`).join('\n')),
    experience: () => print(EXPERIENCE.map((j) => `<span class="c">${j.period.padEnd(22)}</span>${j.company} · ${j.role}`).join('\n')),
    clouds: () => print(CLOUDS.map((c) => `<span class="v">${c.short.padEnd(6)}</span>${c.services.join(', ')}`).join('\n')),
    contact: () => print(`email    <a class="c" href="mailto:${PROFILE.email}">${PROFILE.email}</a>\nlinkedin <a class="c" href="${PROFILE.linkedin}" target="_blank">${PROFILE.linkedin}</a>\ngithub   <a class="c" href="${PROFILE.github}" target="_blank">${PROFILE.github}</a>`),
    'kubectl get skills': () => print('NAME                READY   STATUS    RESTARTS   AGE\n' + STACK.flatMap((c) => c.items).slice(0, 18).map((k) => `${TOOLS[k].name.toLowerCase().replace(/\s+/g, '-').padEnd(20)}1/1     <span class="ok">Running</span>   0          ${3 + Math.floor(Math.random() * 7)}y`).join('\n')),
    'sudo hire ravichandra': () => { window.dispatchEvent(new Event('rv:hire')); print('[sudo] password for recruiter: ********\n<span class="ok">✔ Apply complete! Resources: 1 added.</span>\nOpening mail client…'); setTimeout(() => { location.href = `mailto:${PROFILE.email}?subject=Let's talk — DevOps role`; }, 900); },
    resume: () => { print('Downloading resume…'); const a = document.createElement('a'); a.href = PROFILE.resume; a.download = ''; a.click(); },
    tour: () => { toggle(false); tour(); },
    intro: () => { toggle(false); unlockAudio(); playIntro(); },
    clear: () => { out.innerHTML = ''; },
    exit: () => toggle(false),
  };
  function cmd(raw) {
    const c = raw.trim().replace(/\s+/g, ' ');
    if (c !== 'welcome') print(`<span class="ok">➜ ~</span> ${c.replace(/</g, '&lt;')}`);
    if (!c) return;
    if (cmds[c.toLowerCase()]) return cmds[c.toLowerCase()]();
    if (/^ask /i.test(c)) { toggle(false); toggleBot(true); ask(c.slice(4)); return; }
    if (/^sudo/.test(c)) return print('<span class="e">nice try 😄 — did you mean: sudo hire ravichandra</span>');
    print(`<span class="e">command not found: ${c.split(' ')[0].replace(/</g, '&lt;')}</span> — type <span class="ok">help</span>`);
  }
  $('#termForm').addEventListener('submit', (e) => { e.preventDefault(); hist.push(input.value); hi = hist.length; cmd(input.value); input.value = ''; });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { hi = Math.max(0, hi - 1); input.value = hist[hi] || ''; e.preventDefault(); }
    if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; e.preventDefault(); }
    if (e.key === 'Tab') { e.preventDefault(); const m = Object.keys(cmds).find((k) => k.startsWith(input.value)); if (m) input.value = m; }
  });
  $('#termBtn').addEventListener('click', () => toggle(true));
  $('#termClose').addEventListener('click', () => toggle(false));
  term.addEventListener('click', (e) => { if (e.target === term) toggle(false); });
  addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
    if (e.key === '`' && (!typing || document.activeElement === input)) { e.preventDefault(); toggle(); }
    if (e.key === 'Escape') { if (isOpen) toggle(false); toggleBot(false); }
  });
}

/* ======================================================================
   Boot
   ====================================================================== */
(async function boot() {
  render();
  let scene = null;
  const qp = new URLSearchParams(location.search);
  try { if (!qp.has('noscene')) scene = initScene($('#gl')); } catch (err) { console.warn('WebGL unavailable', err); }
  sceneRef = scene;
  if (!qp.has('nopresenter')) initPresenter().catch((err) => console.warn('presenter', err));
  try { initPortrait($('#presenterLive')); } catch (err) { console.warn('portrait', err); }
  piku = initPiku({ onTap: () => toggleBot(true) });
  // mini Piku avatars for the chat button and chat header
  $$('.piku-mini').forEach((el) => { el.append($('#piku svg').cloneNode(true)); });
  initBot();
  terminal();
  dashboard();
  github();
  await document.fonts.ready;
  const sound = await preload();
  autoNarrate = sound;
  sfx.allow(sound);
  if (!qp.has('nointro') && !reduced) await monitorsIntro({ short: introSeen() });
  $('#presenterMute').textContent = sound ? '🔊' : '🔇';
  initLenis();
  window.__lenis = lenis;
  presenterLayout();
  voiceControls();
  const intro = heroIntro();
  revealStage(sound);
  rotator();
  scrollAnimations(scene);
  initFX();
  initExtras({ piku });
  intro.eventCallback('onComplete', interactions);
  if (document.readyState === 'complete') ScrollTrigger.refresh(); else addEventListener('load', () => ScrollTrigger.refresh());
  if (qp.has('selftest')) import('./selftest.js').then((m) => m.run({ piku, lenis }));
  setTimeout(() => ScrollTrigger.refresh(), 1200);
})();
