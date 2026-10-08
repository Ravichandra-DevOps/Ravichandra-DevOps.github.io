/* Living still photo (used until the talking videos exist):
   eyes follow the cursor, the head turns slightly toward it, natural blinks and breathing.
   Landmarks are pixel coords in assets/presenter-full.png (403 x 1339). */
import * as THREE from 'three';

const LM = { size: [403, 1339], eyeL: [149, 111], eyeR: [201, 111], eyeRad: [11.5, 5.2], neck: [178, 205] };

export const portrait = { look: new THREE.Vector2(), target: null, enabled: true };

export function initPortrait(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-.5, .5, .5, -.5, 0, 1);
  const tex = new THREE.TextureLoader().load('assets/presenter-full.png', () => canvas.classList.add('ready'));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.anisotropy = 4;

  const u = {
    uTex: { value: tex }, uSize: { value: new THREE.Vector2(...LM.size) },
    uEyeL: { value: new THREE.Vector2(...LM.eyeL) }, uEyeR: { value: new THREE.Vector2(...LM.eyeR) }, uEyeRad: { value: new THREE.Vector2(...LM.eyeRad) },
    uNeck: { value: new THREE.Vector2(...LM.neck) },
    uLook: { value: new THREE.Vector2() }, uHead: { value: new THREE.Vector2() }, uBlink: { value: 0 }, uBreath: { value: 0 },
  };
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial({
    uniforms: u, transparent: true, premultipliedAlpha: true,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy * 2.0, 0.0, 1.0); }',
    fragmentShader: /* glsl */`
      precision highp float;
      uniform sampler2D uTex; uniform vec2 uSize, uEyeL, uEyeR, uEyeRad, uNeck, uLook, uHead; uniform float uBlink, uBreath;
      varying vec2 vUv;
      vec4 tex(vec2 p){ return texture2D(uTex, vec2(p.x / uSize.x, 1.0 - p.y / uSize.y)); }
      // move the iris inside the eye opening (eyelid corners stay put)
      vec2 eyeWarp(vec2 h, vec2 eye) {
        vec2 e = (h - eye) / uEyeRad;
        float w = 1.0 - smoothstep(0.35, 1.05, length(e));
        return h - uLook * vec2(3.2, 1.4) * w;
      }
      float lid(vec2 h, vec2 eye) {
        vec2 e = (h - eye) / uEyeRad;
        float inside = 1.0 - smoothstep(0.85, 1.15, length(e));
        float line = -1.5 + 2.7 * uBlink;
        return inside * smoothstep(line + 0.3, line - 0.05, e.y);
      }
      void main() {
        vec2 p = vec2(vUv.x * uSize.x, (1.0 - vUv.y) * uSize.y);
        // breathing: chest rises a touch
        p.y = uSize.y - (uSize.y - p.y) / (1.0 + uBreath * 0.0035);
        // head turn toward the cursor (fades out below the neck)
        float wh = 1.0 - smoothstep(uNeck.y - 25.0, uNeck.y + 20.0, p.y);
        vec2 h = p - uHead * wh;
        float a = -uHead.x * 0.004 * wh;
        vec2 d = h - uNeck; h = uNeck + mat2(cos(a), -sin(a), sin(a), cos(a)) * d;
        vec2 s = h;
        if (distance(h, uEyeL) < uEyeRad.x * 1.3) s = eyeWarp(h, uEyeL);
        else if (distance(h, uEyeR) < uEyeRad.x * 1.3) s = eyeWarp(h, uEyeR);
        vec4 c = tex(s);
        if (uBlink > 0.01) {
          float bl = max(lid(h, uEyeL), lid(h, uEyeR));
          vec2 eye = h.x < (uEyeL.x + uEyeR.x) * 0.5 ? uEyeL : uEyeR;
          float yy = eye.y - uEyeRad.y * 2.4;
          vec3 skin = (tex(vec2(h.x - 2.0, yy)).rgb + tex(vec2(h.x + 2.0, yy)).rgb + tex(vec2(h.x, yy - 2.0)).rgb) / 3.0;
          c.rgb = mix(c.rgb, skin * 0.94, bl);
        }
        if (c.a < 0.01) discard;
        gl_FragColor = vec4(c.rgb * c.a, c.a);
      }`,
  })));

  const resize = () => { const r = canvas.getBoundingClientRect(); if (r.width) renderer.setSize(r.width, r.height, false); };
  new ResizeObserver(resize).observe(canvas);

  const mouse = { x: innerWidth / 2, y: innerHeight / 3, idle: 0 };
  addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.idle = performance.now(); }, { passive: true });

  let blink = -1e9, nextBlink = performance.now() + 1500;
  const look = new THREE.Vector2(), head = new THREE.Vector2();
  const clock = new THREE.Clock();
  (function tick() {
    requestAnimationFrame(tick);
    if (!portrait.enabled) return;
    const t = clock.getElapsedTime(), now = performance.now();
    // where are the eyes on screen?
    const r = canvas.getBoundingClientRect();
    const ex = r.left + r.width * ((LM.eyeL[0] + LM.eyeR[0]) / 2 / LM.size[0]);
    const ey = r.top + r.height * (LM.eyeL[1] / LM.size[1]);
    let tx, ty;
    if (portrait.target) { [tx, ty] = portrait.target; }            // e.g. glance at Piku
    else if (now - mouse.idle > 6000) { tx = ex + Math.sin(t * .4) * 200; ty = ey + 60; }   // idle: gentle wander
    else { tx = mouse.x; ty = mouse.y; }
    const dx = (tx - ex) / (innerWidth * .45), dy = (ty - ey) / (innerHeight * .45);
    const tl = new THREE.Vector2(Math.max(-1, Math.min(1, dx)), Math.max(-1, Math.min(1, dy)));
    look.lerp(tl, .18);
    head.lerp(new THREE.Vector2(tl.x * 2.6, tl.y * 1.2), .05);
    if (now > nextBlink) { blink = now; nextBlink = now + (Math.random() < .12 ? 260 : 2600 + Math.random() * 3000); }
    const bp = (now - blink) / 150;               // time-based: ~150 ms blink on any frame rate
    u.uLook.value.copy(look);
    portrait.look.copy(look);
    u.uHead.value.copy(head);
    u.uBlink.value = bp >= 0 && bp < 1 ? Math.sin(bp * Math.PI) : 0;
    u.uBreath.value = Math.sin(t * 1.5) * .5 + .5;
    renderer.render(scene, camera);
  })();
  return portrait;
}
