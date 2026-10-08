/* Dark minimal studio background.
   One full-screen shader: graphite backdrop, a soft spotlight that follows the presenter,
   a very faint perspective floor, slow light haze and a few drifting dust motes.
   Calm on purpose: the content and the presenter are the show. */
import * as THREE from 'three';

export function initScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(innerWidth, innerHeight);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // state driven from main.js
  const state = { spot: new THREE.Vector2(.72, .45), spotSize: 1, floor: 1, energy: 0, dim: 0, power: 1, accent: new THREE.Color(0x3ef2ff) };

  const uniforms = {
    uT: { value: 0 }, uRes: { value: new THREE.Vector2(innerWidth, innerHeight) },
    uSpot: { value: state.spot.clone() }, uSpotSize: { value: 1 }, uFloor: { value: 1 },
    uEnergy: { value: 0 }, uDim: { value: 0 }, uPower: { value: 1 }, uAccent: { value: state.accent.clone() },
  };
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: /* glsl */`
      precision highp float;
      uniform float uT, uSpotSize, uFloor, uEnergy, uDim, uPower; uniform vec2 uRes, uSpot; uniform vec3 uAccent;
      varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
        return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
      void main(){
        vec2 uv = vUv;
        float asp = uRes.x / uRes.y;
        vec2 p = vec2(uv.x * asp, uv.y);
        // graphite backdrop, slightly lighter at the top
        vec3 c = mix(vec3(0.020, 0.023, 0.032), vec3(0.042, 0.047, 0.062), smoothstep(0.0, 1.0, uv.y));
        // slow, very low-contrast haze
        float hz = n(p * 1.6 + vec2(uT * 0.02, -uT * 0.015)) * n(p * 0.8 - vec2(uT * 0.01, 0.0));
        c += uAccent * hz * 0.025;
        // spotlight behind the presenter (follows him)
        vec2 sp = vec2(uSpot.x * asp, uSpot.y);
        vec2 d = (p - sp) / vec2(0.55, 0.75) / uSpotSize;
        float spot = exp(-dot(d, d) * 1.6);
        c += vec3(0.11, 0.13, 0.17) * spot * (0.9 + uEnergy * 0.25) * uPower;
        c += uAccent * spot * 0.035 * uPower;
        // faint perspective floor under the stage
        float horizon = 0.30;
        float fl = uFloor * uPower;
        if (uv.y < horizon) {
          float y = (horizon - uv.y) / horizon;
          float z = 1.0 / max(y, 0.02);
          vec2 g = vec2((uv.x - uSpot.x) * asp * z * 1.4, z * 1.2 - uT * 0.05);
          vec2 gl = abs(fract(g) - 0.5) / fwidth(g);
          float line = 1.0 - min(min(gl.x, gl.y), 1.0);
          float fade = smoothstep(0.0, 0.5, y) * (1.0 - smoothstep(0.6, 1.0, y) * 0.5) * exp(-abs(uv.x - uSpot.x) * 2.2);
          c += uAccent * line * fade * 0.045 * fl;
          vec2 fp = vec2((uv.x - uSpot.x) * asp, (uv.y - (horizon - 0.06)) * 3.2);
          c += vec3(0.08, 0.1, 0.13) * exp(-dot(fp, fp) * 7.0) * fl;   // pool of light where he stands
          c *= 1.0 - 0.18 * y;
        }
        c += uAccent * exp(-abs(uv.y - horizon) * 140.0) * 0.05 * fl;  // horizon glow
        // a few dust motes catching the light
        vec2 q = p * 18.0 + vec2(0.0, uT * 0.25);
        vec2 cell = floor(q);
        vec2 f = fract(q) - 0.5 - (vec2(h(cell), h(cell + 3.1)) - 0.5) * 0.6;
        float mote = step(0.965, h(cell + 7.7)) * smoothstep(0.06, 0.0, length(f));
        c += vec3(0.6, 0.75, 0.9) * mote * (0.12 + spot * 0.4) * (0.5 + 0.5 * sin(uT * 1.3 + h(cell) * 40.0));
        // vignette + section dim
        float v = smoothstep(1.25, 0.25, length((uv - 0.5) * vec2(asp * 0.8, 1.0)));
        c *= mix(0.55, 1.0, v);
        c *= 1.0 - uDim * 0.25;
        c *= mix(0.45, 1.0, uPower);
        c += (h(uv * uRes + uT) - 0.5) / 255.0;   // dither to avoid banding
        gl_FragColor = vec4(c, 1.0);
      }`,
  })));

  addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); uniforms.uRes.value.set(innerWidth, innerHeight); });
  let visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
  const clock = new THREE.Clock();
  (function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    uniforms.uT.value = clock.getElapsedTime();
    uniforms.uSpot.value.lerp(state.spot, .08);
    uniforms.uSpotSize.value += (state.spotSize - uniforms.uSpotSize.value) * .08;
    uniforms.uFloor.value += (state.floor - uniforms.uFloor.value) * .08;
    uniforms.uEnergy.value += (state.energy - uniforms.uEnergy.value) * .1;
    uniforms.uDim.value += (state.dim - uniforms.uDim.value) * .08;
    uniforms.uPower.value = state.power;
    uniforms.uAccent.value.lerp(state.accent, .03);
    renderer.render(scene, camera);
  })();
  return state;
}
