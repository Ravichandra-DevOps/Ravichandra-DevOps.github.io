/* Opening scene: "late-night deploy" → stage doors.
   1. A dark room, two glowing monitors: a live deploy terminal + a cluster dashboard (pods turn green).
   2. "✓ DEPLOYED TO PROD".
   3. The room gives way to two heavy stage doors; the status lamp turns green, light leaks
      through the seam, and the doors slide open to reveal Ravichandra on stage.
   Resolves when the doors START opening, so the stage reveal plays in sync. Skippable. */
import { sfx } from './sfx.js';

const LOG = [
  ['c', '$ git push origin release/v10'],
  ['', '✓ pipeline #4821 triggered'],
  ['c', '$ mvn -B clean verify'],
  ['ok', 'BUILD SUCCESS · 1,284 tests · 0 failures'],
  ['c', '$ sonar-scanner && image-scan app:9f3c1e'],
  ['ok', 'quality gate PASSED · 0 critical · SBOM signed'],
  ['c', '$ terraform apply -auto-approve'],
  ['ok', 'Apply complete! 14 added, 3 changed, 0 destroyed'],
  ['c', '$ argocd app sync prod-banking'],
  ['v', 'Sync OK · Healthy · revision 9f3c1e'],
  ['c', '$ kubectl rollout status deploy/api -n prod'],
  ['ok', 'deployment "api" successfully rolled out (12/12)'],
];

export function monitorsIntro({ short = false } = {}) {
  return new Promise((resolve) => {
    const el = document.createElement('div');
    el.className = 'intro';
    el.innerHTML = `
      <div class="intro__doors">
        <div class="door door--l"><span class="door__label">PROD</span></div>
        <div class="door door--r"><span class="door__label">READY</span></div>
        <div class="door__seam"></div>
        <div class="door__lamp"><i></i></div>
        <div class="door__flash"></div>
      </div>
      <div class="intro__room">
        <div class="intro__clock"><span class="pulse"></span> 02:14 AM · prod-release #4821</div>
        <div class="intro__desk"></div>
        <div class="mon mon--l"><div class="mon__screen">
          <div class="mon__bar"><i></i><i></i><i></i><span>ravichandra@deploy: ~</span></div>
          <pre class="mon__log"></pre>
        </div><div class="mon__stand"></div></div>
        <div class="mon mon--r"><div class="mon__screen">
          <div class="mon__bar"><span>⎈ prod-cluster · eks-ap-south-1 · aks-centralindia</span></div>
          <div class="mon__dash">
            <div class="mon__pods">${Array.from({ length: 48 }, () => '<i></i>').join('')}</div>
            <svg class="mon__chart" viewBox="0 0 300 90" preserveAspectRatio="none"><path d="M0 70 C30 64 40 40 70 46 S110 72 140 50 S190 20 220 34 S270 30 300 14" /></svg>
            <div class="mon__kpis"><span>Rollout <b class="k-roll">0/12</b></span><span>p99 <b>182 ms</b></span><span>Errors <b>0.00%</b></span><span>SLO <b>99.9%</b></span></div>
          </div>
        </div><div class="mon__stand"></div></div>
        <div class="intro__stamp">✓ DEPLOYED TO PROD</div>
        <div class="intro__glow"></div>
      </div>
      <button class="intro__skip" type="button">Skip intro ⏭</button>`;
    document.body.append(el);
    const $ = (s) => el.querySelector(s);
    const log = $('.mon__log'), pods = [...el.querySelectorAll('.mon__pods i')], roll = $('.k-roll');
    const path = $('.mon__chart path');
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

    const k = short ? 0.45 : 1;   // repeat visitors get a shorter cut
    const D = 3.2 * k;
    sfx.padStart();
    const tl = gsap.timeline();
    tl.fromTo('.intro__room', { autoAlpha: 0 }, { autoAlpha: 1, duration: .5 }, 0)
      .fromTo('.mon__screen', { scaleY: .02, filter: 'brightness(4)' }, { scaleY: 1, filter: 'brightness(1)', duration: .45, stagger: .18, ease: 'power3.out' }, .2)
      .fromTo('.intro__clock', { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: .5 }, .4)
      .to(path, { strokeDashoffset: 0, duration: D, ease: 'power1.inOut' }, .7)
      .to({ v: 0 }, { v: 1, duration: D, ease: 'none', onUpdate() {
        const p = this.targets()[0].v;
        const lines = Math.round(p * LOG.length);
        if (log.childElementCount < lines) {
          for (let i = log.childElementCount; i < lines; i++) {
            const [c, t] = LOG[i];
            const d = document.createElement('div'); d.className = c; d.textContent = t; log.append(d);
            sfx.tick(); setTimeout(() => sfx.tick(), 60);
          }
          log.scrollTop = log.scrollHeight;
        }
        const g = Math.round(p * pods.length);
        pods.forEach((q, i) => q.className = i < g ? 'ok' : i < g + 6 ? 'pend' : '');
        roll.textContent = `${Math.round(p * 12)}/12`;
      } }, .7)
      .add(() => { el.classList.add('done'); sfx.chime(); }, .7 + D)
      .fromTo('.intro__stamp', { autoAlpha: 0, scale: .6 }, { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(2.5)' }, .75 + D)
      .add(() => doors(), 1.9 + D);

    let opened = false, finished = false;
    // the room gives way to the stage doors, which slide open
    function doors(fast = false) {
      if (opened) return; opened = true;
      tl.kill();
      const f = fast ? .5 : 1;
      gsap.timeline({ onComplete: finish })
        .to('.intro__room', { autoAlpha: 0, scale: 1.08, duration: .6 * f, ease: 'power2.in' }, 0)
        .set(el, { backgroundColor: 'transparent' }, .6 * f)
        .add(() => { el.classList.add('lamp-green'); sfx.thud(); sfx.padStop(); }, .7 * f)
        .to('.door__seam', { scaleY: 1, opacity: 1, duration: .45 * f, ease: 'power2.out' }, .8 * f)
        .add(() => { sfx.whoosh(); resolve(); }, 1.15 * f)                       // stage reveal starts now
        .to('.door--l', { xPercent: -101, duration: 1.35 * f, ease: 'power3.inOut' }, 1.15 * f)
        .to('.door--r', { xPercent: 101, duration: 1.35 * f, ease: 'power3.inOut' }, 1.15 * f)
        .fromTo('.door__flash', { opacity: 0 }, { opacity: .85, duration: .25 * f, ease: 'power2.out' }, 1.2 * f)
        .to('.door__flash', { opacity: 0, duration: .9 * f }, 1.45 * f)
        .to('.door__seam, .door__lamp', { opacity: 0, duration: .3 * f }, 1.3 * f);
    }
    function finish() {
      if (finished) return; finished = true;
      el.remove();
      try { localStorage.setItem('rv-intro-seen', '1'); } catch {}
      resolve();
    }
    $('.intro__skip').addEventListener('click', () => { sfx.click(); doors(true); });
    addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { removeEventListener('keydown', esc); doors(true); } });
  });
}

export const introSeen = () => { try { return localStorage.getItem('rv-intro-seen') === '1'; } catch { return false; } };
