/* Presenter: plays real talking-avatar videos of Ravichandra (made in HeyGen Avatar IV).
   Drop files into assets/video/ (see guide.html):
     idle.mp4          10–15 s silent loop (standing, breathing, small natural movement)
     intro.mp4, tour-about.mp4, … job-3.mp4   one clip per line in js/lines.js
   Videos are recorded on a solid GREEN background; the green is keyed out live in WebGL,
   so he stands cleanly in the page. Without videos, the still cut-out photo is shown. */
import * as THREE from 'three';

const DIR = 'assets/video/';
// assets/video/manifest.json lists the clips that exist, e.g. {"clips": ["idle", "intro", "tour-about"]}
// (avoids probing for missing files, which would log 404s in production)
let manifest = null;
const loadManifest = () => (manifest ??= fetch(DIR + 'manifest.json', { cache: 'no-cache' })
  .then((r) => (r.ok ? r.json() : { clips: [] })).then((j) => new Set(j.clips || [])).catch(() => new Set()));

export const presenter = { mode: 'still', aspect: null, busy: false, onAspect: null };

let renderer, scene, camera, canvas;
let idleV = null, clipV = null;
const texIdle = { value: null }, texClip = { value: null };
const uMix = { value: 0 }, uKey = { value: new THREE.Color(0, 1, 0) }, uHasIdle = { value: 0 };

function makeVideo(src, loop) {
  const v = document.createElement('video');
  v.src = src; v.loop = loop; v.muted = loop; v.playsInline = true; v.preload = 'auto'; v.crossOrigin = 'anonymous';
  return v;
}

// sample the corners of the first frame to learn the exact green used
function learnKey(v) {
  try {
    const c = document.createElement('canvas'); c.width = 64; c.height = 64;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(v, 0, 0, 64, 64);
    let r = 0, g = 0, b = 0;
    [[2, 2], [61, 2], [2, 30], [61, 30]].forEach(([px, py]) => { const d = x.getImageData(px, py, 1, 1).data; r += d[0]; g += d[1]; b += d[2]; });
    const col = new THREE.Color(r / 1020, g / 1020, b / 1020);
    if (col.g > col.r * 1.3 && col.g > col.b * 1.3) uKey.value.copy(col);
  } catch { /* keep default green */ }
}

function initGL() {
  canvas = document.querySelector('#presenterVideo');
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-.5, .5, .5, -.5, 0, 1);
  const mat = new THREE.ShaderMaterial({
    transparent: true, premultipliedAlpha: true,
    uniforms: { tIdle: texIdle, tClip: texClip, uMix, uKey, uHasIdle },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy * 2.0, 0.0, 1.0); }',
    fragmentShader: /* glsl */`
      precision highp float;
      uniform sampler2D tIdle, tClip; uniform float uMix, uHasIdle; uniform vec3 uKey; varying vec2 vUv;
      vec2 cbcr(vec3 c){ return vec2(-0.168736*c.r - 0.331264*c.g + 0.5*c.b, 0.5*c.r - 0.418688*c.g - 0.081312*c.b); }
      vec4 keyed(sampler2D t) {
        vec3 c = texture2D(t, vUv).rgb;
        float d = distance(cbcr(c), cbcr(uKey));
        float a = smoothstep(0.075, 0.16, d);
        float spill = max(0.0, c.g - max(c.r, c.b));   // pull green fringe back to neutral
        c.g -= spill * (1.0 - a * 0.35);
        return vec4(c, a);
      }
      void main() {
        vec4 a = uHasIdle > 0.5 ? keyed(tIdle) : vec4(0.0);
        vec4 o = mix(a, keyed(tClip), uMix);
        if (o.a < 0.01) discard;
        gl_FragColor = vec4(o.rgb * o.a, o.a);
      }`,
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat));
  const resize = () => { const r = canvas.getBoundingClientRect(); if (r.width) renderer.setSize(r.width, r.height, false); };
  new ResizeObserver(resize).observe(canvas);
  const tick = () => { requestAnimationFrame(tick); if (presenter.mode === 'video') renderer.render(scene, camera); };
  tick();
}

function setAspect(a) { presenter.aspect = a; presenter.onAspect?.(a); }

export async function initPresenter() {
  const body = document.querySelector('.presenter__body');
  const still = document.querySelector('.presenter__still');
  const stillAspect = () => { if (presenter.mode === 'still' && still.naturalWidth) setAspect(still.naturalWidth / still.naturalHeight); };
  still.addEventListener('load', stillAspect);
  stillAspect();

  if (!(await loadManifest()).has('idle')) return presenter;   // still-photo mode until videos exist
  initGL();
  idleV = makeVideo(DIR + 'idle.mp4', true);
  idleV.addEventListener('loadeddata', () => {
    learnKey(idleV);
    setAspect(idleV.videoWidth / idleV.videoHeight);
    texIdle.value = new THREE.VideoTexture(idleV); texIdle.value.colorSpace = THREE.SRGBColorSpace;
    uHasIdle.value = 1;
    presenter.mode = 'video';
    body.classList.add('has-video');
    idleV.play().catch(() => {});
  }, { once: true });
  return presenter;
}

/** Is there a recorded video for this line? (checked lazily, cached) */
export async function hasClip(id) { return (await loadManifest()).has(id); }

/** Play a clip; resolves true when it finished, false if stopped. */
export function playClip(id, { onTime } = {}) {
  return new Promise((resolve) => {
    if (!renderer) initGL();
    stopClip();
    const body = document.querySelector('.presenter__body');
    const v = makeVideo(DIR + id + '.mp4', false);
    clipV = v;
    let done = false;
    const finish = (ok) => {
      if (done) return; done = true;
      v.ontimeupdate = v.onended = v.onerror = null;
      v.pause();
      gsap.to(uMix, { value: 0, duration: .35, onComplete: () => { if (clipV === v) clipV = null; } });
      if (!uHasIdle.value) { presenter.mode = 'still'; body.classList.remove('has-video'); }
      presenter.busy = false;
      resolve(ok);
    };
    v._finish = finish;
    v.addEventListener('loadeddata', () => {
      learnKey(v);
      if (!uHasIdle.value) setAspect(v.videoWidth / v.videoHeight);
      texClip.value = new THREE.VideoTexture(v); texClip.value.colorSpace = THREE.SRGBColorSpace;
      presenter.mode = 'video';
      body.classList.add('has-video');
      v.play().then(() => { presenter.busy = true; gsap.to(uMix, { value: 1, duration: .3 }); }).catch(() => finish(false));
    }, { once: true });
    v.ontimeupdate = () => onTime?.(v.currentTime, v.duration || 1);
    v.onended = () => finish(true);
    v.onerror = () => finish(false);
  });
}

export function stopClip() { if (clipV) clipV._finish?.(false); }
