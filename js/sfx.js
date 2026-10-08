/* Procedural sound design: every effect is synthesised live with the Web Audio API
   (no audio files, nothing to license). Quiet by default, off unless the visitor chose sound. */
let ctx = null, master = null, verb = null;
let enabled = false;
try { enabled = localStorage.getItem('rv-sfx') !== 'off'; } catch { enabled = true; }
let allowed = false;                       // set when the visitor enters "with sound"

function ensure() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return true; }
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = .32; master.connect(ctx.destination);
    // tiny feedback-delay "room" for chimes
    const d = ctx.createDelay(); d.delayTime.value = .19;
    const fb = ctx.createGain(); fb.gain.value = .28;
    const wet = ctx.createGain(); wet.gain.value = .35;
    d.connect(fb); fb.connect(d); d.connect(wet); wet.connect(master);
    verb = d;
    return true;
  } catch { return false; }
}
const on = () => allowed && enabled && ensure();

function tone({ f = 440, f2 = null, t = 0, dur = .3, type = 'sine', vol = .3, attack = .005, wet = false }) {
  const now = ctx.currentTime + t;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f, now);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, now + dur);
  g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(vol, now + attack); g.gain.exponentialRampToValueAtTime(.0001, now + dur);
  o.connect(g); g.connect(master); if (wet) g.connect(verb);
  o.start(now); o.stop(now + dur + .05);
}
function noise({ t = 0, dur = .5, vol = .2, from = 400, to = 4000, q = 1 }) {
  const now = ctx.currentTime + t;
  const len = Math.ceil(ctx.sampleRate * dur), buf = ctx.createBuffer(1, len, ctx.sampleRate), ch = buf.getChannelData(0);
  for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q;
  bp.frequency.setValueAtTime(from, now); bp.frequency.exponentialRampToValueAtTime(to, now + dur);
  const g = ctx.createGain(); g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(vol, now + dur * .3); g.gain.exponentialRampToValueAtTime(.0001, now + dur);
  src.connect(bp); bp.connect(g); g.connect(master); src.start(now); src.stop(now + dur);
}

let pad = null;
export const sfx = {
  allow(v) { allowed = v; if (v) ensure(); },
  get enabled() { return enabled; },
  toggle() { enabled = !enabled; try { localStorage.setItem('rv-sfx', enabled ? 'on' : 'off'); } catch {} if (!enabled) this.padStop(); return enabled; },
  tick() { if (on()) tone({ f: 1800 + Math.random() * 600, dur: .03, type: 'square', vol: .025 }); },
  click() { if (on()) tone({ f: 900, f2: 600, dur: .06, type: 'triangle', vol: .06 }); },
  chime() { if (on()) [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone({ f, t: i * .09, dur: 1.1, vol: .14, wet: true })); },
  whoosh() { if (on()) { noise({ dur: 1.1, vol: .22, from: 180, to: 2600, q: .7 }); tone({ f: 70, f2: 45, dur: .9, vol: .18, attack: .2 }); } },
  thud() { if (on()) { tone({ f: 90, f2: 40, dur: .35, vol: .3 }); noise({ dur: .18, vol: .08, from: 300, to: 120 }); } },
  flight() { if (on()) { tone({ f: 600, f2: 1600, dur: 1.4, type: 'sine', vol: .05, attack: .3 }); [1318, 1568, 1760, 2093, 2637].forEach((f, i) => tone({ f, t: .15 + i * .22, dur: .5, vol: .05, wet: true })); } },
  boing() { if (on()) tone({ f: 520, f2: 180, dur: .32, type: 'sine', vol: .18 }); },
  pop() { if (on()) { tone({ f: 1400, f2: 300, dur: .09, vol: .2 }); [1568, 2093].forEach((f, i) => tone({ f, t: .08 + i * .07, dur: .4, vol: .07, wet: true })); } },
  giggle() { if (on()) [880, 1046, 932, 1174].forEach((f, i) => tone({ f, f2: f * 1.15, t: i * .08, dur: .12, type: 'triangle', vol: .07 })); },
  cheer() { if (on()) [659, 784, 988, 1318, 1568].forEach((f, i) => tone({ f, t: i * .06, dur: .7, vol: .1, wet: true })); },
  padStart() {
    if (!on() || pad) return;
    const now = ctx.currentTime, g = ctx.createGain();
    g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(.05, now + 2);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
    const oscs = [110, 164.8, 220, 277.2].map((f, i) => { const o = ctx.createOscillator(); o.type = i % 2 ? 'triangle' : 'sine'; o.frequency.value = f; o.detune.value = (i - 1.5) * 6; o.connect(lp); o.start(); return o; });
    lp.connect(g); g.connect(master);
    pad = { g, oscs };
  },
  padStop() {
    if (!pad || !ctx) return;
    const p = pad; pad = null; const now = ctx.currentTime;
    p.g.gain.cancelScheduledValues(now); p.g.gain.setValueAtTime(p.g.gain.value, now); p.g.gain.linearRampToValueAtTime(0, now + 1.5);
    setTimeout(() => p.oscs.forEach((o) => o.stop()), 1700);
  },
};
