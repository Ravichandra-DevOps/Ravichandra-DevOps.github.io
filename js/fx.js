/* Cinematic motion layer.
   - opening title sequence: letterbox, stage light powering on, light sweep across the name
   - "deploying portfolio" scroll rail: the page scroll is a CI/CD rollout
   - giant outlined section numbers with parallax, heading light-sweeps, scan-line dividers
   - cursor-follow glow on every card, live "all systems operational" status pill */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const STAGES = [
  ['#hero', 'init'], ['#about', 'summary'], ['#clouds', 'clouds'], ['#stack', 'toolbox'], ['#pipeline', 'pipeline'],
  ['#experience', 'career'], ['#observability', 'telemetry'], ['#github', 'oss'], ['#contact', 'release'],
];

/* ---------- opening title sequence ---------- */
export function opening(scene) {
  const tl = gsap.timeline();
  if (scene) {
    scene.power = 0;
    tl.to(scene, { keyframes: { power: [0, .35, .05, .6, .2, 1] }, duration: 1.1, ease: 'none' }, .15);
  }
  tl.fromTo('.letterbox i', { scaleY: 1 }, { scaleY: 0, duration: 1.2, ease: 'expo.inOut', stagger: 0 }, .9)
    .fromTo('.hero__presenting', { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: .6 }, .7)
    .add(() => $('#heroTitle')?.classList.add('sweep'), 1.6);
  return tl;
}

/* ---------- scroll rail: the page is a deployment ---------- */
function rail() {
  const el = document.createElement('aside');
  el.className = 'deploy-rail';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `<div class="deploy-rail__head"><span class="deploy-rail__dot"></span><span class="deploy-rail__pct">deploying · 0%</span></div>
    <div class="deploy-rail__track"><span class="deploy-rail__fill"></span><i class="deploy-rail__packet"></i>
    ${STAGES.map(([sel, name], i) => `<button class="deploy-rail__stage" data-target="${sel}" style="top:${(i / (STAGES.length - 1)) * 100}%" tabindex="-1"><b></b><span>${name}</span></button>`).join('')}</div>`;
  document.body.append(el);
  const fill = $('.deploy-rail__fill', el), packet = $('.deploy-rail__packet', el), pct = $('.deploy-rail__pct', el), stages = $$('.deploy-rail__stage', el);
  stages.forEach((b) => b.addEventListener('click', () => window.__lenis ? window.__lenis.scrollTo(b.dataset.target, { duration: 1.6 }) : $(b.dataset.target).scrollIntoView({ behavior: 'smooth' })));
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (s) => {
      const p = s.progress;
      fill.style.transform = `scaleY(${p})`;
      packet.style.top = (p * 100) + '%';
      const n = Math.round(p * 100);
      pct.textContent = n >= 99 ? '✓ deployed to prod' : `deploying · ${n}%`;
      el.classList.toggle('done', n >= 99);
      stages.forEach((b, i) => b.classList.toggle('passed', p >= i / (STAGES.length - 1) - .01));
    },
  });
}

/* ---------- section numbers, sweeps, scan-lines ---------- */
function sections() {
  $$('section .kicker').forEach((k) => {
    const sec = k.closest('section');
    const num = (k.textContent.match(/(\d{2})/) || [])[1];
    if (!num || !sec) return;
    const big = document.createElement('span');
    big.className = 'sec-num';
    big.textContent = num;
    big.setAttribute('aria-hidden', 'true');
    (sec.querySelector('.stack__pin, .pipeline__pin') || sec).prepend(big);
    gsap.fromTo(big, { yPercent: 30 }, { yPercent: -30, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    const line = document.createElement('span');
    line.className = 'scanline';
    line.setAttribute('aria-hidden', 'true');
    k.before(line);
    gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: k, start: 'top 90%' } });
  });
  $$('.h2, .contact__big').forEach((h) => ScrollTrigger.create({ trigger: h, start: 'top 75%', once: true, onEnter: () => setTimeout(() => h.classList.add('sweep'), 500) }));
}

/* ---------- cursor glow on cards ---------- */
function glow() {
  const sel = '.cloud, .cat, .stage, .job, .panel, .gh__card, .stat';
  $$(sel).forEach((c) => c.classList.add('glowable'));
  document.addEventListener('pointermove', (e) => {
    const c = e.target.closest?.('.glowable');
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--gx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--gy', (e.clientY - r.top) + 'px');
  }, { passive: true });
}

/* ---------- nav status pill ---------- */
function status() {
  const pill = document.createElement('span');
  pill.className = 'status-pill';
  pill.innerHTML = '<span class="pulse"></span><span class="status-pill__txt">All systems operational</span>';
  $('.nav__actions')?.prepend(pill);
  const msgs = ['All systems operational', 'Uptime 99.9% · 10 yrs', 'Open to new opportunities', 'Latency p99 182 ms'];
  let i = 0;
  setInterval(() => {
    const t = $('.status-pill__txt', pill);
    gsap.to(t, { autoAlpha: 0, y: -6, duration: .25, onComplete: () => { i = (i + 1) % msgs.length; t.textContent = msgs[i]; gsap.fromTo(t, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3 }); } });
  }, 3800);
}

export function initFX() {
  rail();
  sections();
  glow();
  status();
}
