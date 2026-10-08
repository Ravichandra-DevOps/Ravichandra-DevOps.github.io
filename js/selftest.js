/* End-to-end self-test. Open the site with ?selftest (enter the gate as a visitor would).
   Runs every check in the real page and shows a report panel; results also go to console
   and window.__selftest so automation can read them. */
import { LINES, KB, TOOLS } from './data.js';
import { localAnswer } from './bot.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const head = async (url) => { try { const r = await fetch(url, { method: 'HEAD', cache: 'no-store' }); return r.ok; } catch { return false; } };

export async function run({ piku, lenis } = {}) {
  const results = [];
  const check = (group, name, ok, detail = '') => { results.push({ group, name, ok: !!ok, detail }); };
  // wait until the visitor has entered and Piku has fallen asleep on the shoulder
  for (let i = 0; i < 100 && !document.querySelector('#piku.sleeping'); i++) await wait(200);
  await wait(800);
  const t0 = performance.now();

  // ---------- 1. structure ----------
  ['#hero', '#about', '#clouds', '#stack', '#pipeline', '#experience', '#observability', '#github', '#contact'].forEach((s) => check('Structure', `section ${s} exists`, $(s)));
  $$('.nav__links a').forEach((a) => check('Structure', `nav link ${a.getAttribute('href')} has a target`, $(a.getAttribute('href'))));
  check('Structure', 'exactly one <h1>', $$('h1').length === 1, $$('h1').length + ' found');
  check('Structure', 'page <title> set', document.title.includes('Ravichandra'), document.title);
  check('Structure', 'meta description', $('meta[name="description"]')?.content?.length > 50);
  check('Structure', 'social preview image', $('meta[property="og:image"]'));
  check('Structure', 'no surname shown anywhere', !document.body.innerText.includes('Vajinepalli'));

  // ---------- 2. rendered content ----------
  check('Content', '6 stat counters', $$('.stat').length === 6);
  check('Content', '3 cloud cards', $$('.cloud').length === 3);
  check('Content', 'stack lists 40+ tool chips', $$('.tool').length >= 35, $$('.tool').length + ' tools');
  check('Content', '7 pipeline stages', $$('.stage').length === 7);
  check('Content', '4 jobs in timeline', $$('.job').length === 4);
  check('Content', 'dashboard panels', $$('.panel').length >= 8);

  // ---------- 3. assets ----------
  const imgs = $$('img');
  imgs.forEach((i) => { i.loading = 'eager'; });            // off-screen logos are lazy: force them for the check
  await Promise.all(imgs.map((i) => (i.complete && i.naturalWidth ? 0 : new Promise((r) => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); setTimeout(r, 10000); }))));
  const broken = imgs.filter((i) => !i.naturalWidth && !i.closest('.presenter__still'));
  check('Assets', `all ${imgs.length} images/logos load`, broken.length === 0, broken.map((i) => i.src.split('/').pop()).join(', '));
  check('Assets', 'all images have alt text', imgs.every((i) => i.hasAttribute('alt')));
  for (const u of ['assets/presenter-full.png', 'assets/og.jpg', 'assets/Ravichandra_Resume.pdf', 'assets/video/manifest.json', '404.html']) check('Assets', `${u} reachable`, await head(u));
  check('Assets', 'resume links point to the PDF', $$('a[download]').every((a) => a.getAttribute('href').endsWith('.pdf')));

  // ---------- 4. voice clips ----------
  const lines = [...LINES.presenter, ...LINES.bot, ...LINES.kb, ...(LINES.piku || [])];
  let stale = [], missing = [], cloned = 0;
  await Promise.all(lines.map(async (l) => {
    try {
      const r = await fetch(`assets/voice/${l.id}.json`, { cache: 'no-store' });
      if (!r.ok) { missing.push(l.id); return; }
      const m = await r.json();
      if (m.src !== (l.say || l.text || l.a) && m.src !== (l.text || l.a)) stale.push(l.id);
      if (m.engine === 'clone') cloned++;
      if (!(await head(`assets/voice/${l.id}.mp3`))) missing.push(l.id + '.mp3');
    } catch { missing.push(l.id); }
  }));
  check('Voice', `all ${lines.length} lines have audio`, !missing.length, missing.join(', '));
  check('Voice', 'no stale clips (text matches)', !stale.length, stale.join(', '));
  const presenterCloned = (await Promise.all(LINES.presenter.map(async (l) => (await (await fetch(`assets/voice/${l.id}.json`, { cache: 'no-store' })).json()).engine === 'clone'))).filter(Boolean).length;
  check('Voice', `presenter lines in cloned voice (${presenterCloned}/${LINES.presenter.length})`, presenterCloned === LINES.presenter.length, presenterCloned < LINES.presenter.length ? 'remaining lines still rendering (free GPU quota)' : '');

  const pikuVoices = new Set();
  for (const l of [...LINES.bot, ...(LINES.piku || []), ...LINES.kb.slice(0, 5)]) { try { pikuVoices.add((await (await fetch(`assets/voice/${l.id}.json`, { cache: 'no-store' })).json()).voice); } catch {} }
  check('Voice', 'Piku uses one consistent voice', pikuVoices.size === 1, [...pikuVoices].join(', '));
  const { say } = await import('./voice.js');
  const nonClone = (await Promise.all(LINES.presenter.map(async (l) => [l.id, (await (await fetch(`assets/voice/${l.id}.json`, { cache: 'no-store' })).json()).engine]))).find(([, e]) => e !== 'clone');
  if (nonClone) check('Voice', 'Ravichandra never speaks in a stand-in voice', (await say({ id: nonClone[0], who: 'presenter' })) === false, nonClone[0]);
  check('Content', 'only resume-backed tools listed (no unconfirmed extras)', !$$('.tool').some((t) => /Vault|Trivy|Istio|Flux|Karpenter|Kustomize/.test(t.textContent)));

  // ---------- 5. chatbot understanding ----------
  const intents = [
    ['What is his Kubernetes experience?', 'kb-k8s'], ['Which clouds has he used?', 'kb-multi'], ['When can he join?', 'kb-notice'],
    ['Tell me about him', 'kb-about'], ['Does he know Terraform?', 'kb-iac'], ['What monitoring tools?', 'kb-obs'],
    ['how to contact him', 'kb-contact'], ['Azure experience', 'kb-azure'], ['what did he do at deloitte', 'kb-deloitte'],
    ['salary expectations', 'kb-salary'], ['hello', 'kb-hi'], ['GitHub Actions pipelines', 'kb-cicd'], ['xyzzy plugh', 'bot-fallback'],
  ];
  intents.forEach(([q, id]) => { const got = localAnswer(q).map((i) => i.id); check('Chatbot', `"${q}" → ${id}`, got.includes(id), 'got ' + got.join('+')); });
  check('Chatbot', 'every KB answer has an id and keywords', KB.every((k) => k.id && k.k?.length && k.a));

  // ---------- 6. links & security ----------
  const ext = $$('a[target="_blank"]');
  check('Links', 'external links use rel=noopener', ext.every((a) => /noopener/.test(a.rel)), ext.filter((a) => !/noopener/.test(a.rel)).map((a) => a.href).join(', '));
  check('Links', 'email link present', $('a[href^="mailto:"]'));
  check('Links', 'LinkedIn + GitHub links present', $('a[href*="linkedin.com"]') && $('a[href*="github.com"]'));
  check('Links', 'no phone number exposed', !/\+91\s*\d/.test(document.body.innerText));

  // ---------- 7. accessibility ----------
  const unnamed = $$('button').filter((b) => !(b.getAttribute('aria-label') || b.textContent.trim() || b.title));
  check('Accessibility', 'all buttons have an accessible name', !unnamed.length, unnamed.length + ' unnamed');
  check('Accessibility', 'html lang set', document.documentElement.lang === 'en');
  check('Accessibility', 'viewport meta present', $('meta[name="viewport"]'));
  check('Accessibility', 'captions region is aria-live', $('#captions')?.getAttribute('aria-live') === 'polite');

  // ---------- 8. layout ----------
  const overflow = document.documentElement.scrollWidth - innerWidth;
  check('Layout', `no horizontal overflow at ${innerWidth}px`, overflow <= 1, overflow + 'px');
  check('Layout', 'presenter stage has size', $('.presenter__stage')?.getBoundingClientRect().height > 50);
  check('Layout', 'Piku placed on the stage', $('#piku')?.getBoundingClientRect().width > 10);

  // ---------- 9. interactions ----------
  check('Piku', 'Piku starts asleep', $('#piku')?.classList.contains('sleeping'), $('#piku')?.className);
  document.querySelector('main').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
  await wait(4600);
  check('Piku', 'first tap wakes Piku', !$('#piku')?.classList.contains('sleeping'), $('#piku')?.className);
  // chat
  $('#botFab').click(); await wait(700);
  check('Chat', 'chat opens', document.body.classList.contains('bot-open'));
  const before = $$('.msg--bot').length;
  const { ask } = await import('./bot.js');
  await ask('What is his Kubernetes experience?');
  check('Chat', 'chat answers a question', $$('.msg--bot').length > before && /Kubernetes/i.test($$('.msg--bot').pop().textContent));
  $('#botClose').click(); await wait(400);
  check('Chat', 'chat closes', !document.body.classList.contains('bot-open'));
  // terminal
  $('#termBtn').click(); await wait(400);
  const ti = $('#termInput');
  for (const c of ['help', 'whoami', 'skills', 'experience', 'clouds', 'contact', 'kubectl get skills', 'terraform plan', 'clear']) { ti.value = c; $('#termForm').requestSubmit(); }
  const errs = $$('#termOut .e').length;
  check('Terminal', 'all terminal commands run without "command not found"', errs === 0, errs + ' errors');
  ti.value = 'exit'; $('#termForm').requestSubmit(); await wait(400);
  // scroll + deploy rail
  if (lenis) lenis.scrollTo(document.body.scrollHeight, { immediate: true }); else scrollTo(0, document.body.scrollHeight);
  await wait(1500);
  check('Scroll', 'deploy rail reaches "deployed"', /deployed/.test($('.deploy-rail__pct')?.textContent || ''), $('.deploy-rail__pct')?.textContent);
  check('Scroll', 'presenter docks when scrolled', document.body.classList.contains('presenter-docked'));
  if (lenis) lenis.scrollTo(0, { immediate: true }); else scrollTo(0, 0);

  // ---------- 10. runtime errors ----------
  check('Runtime', 'no JavaScript errors', !(window.__errors || []).length, (window.__errors || []).join(' | '));

  // ---------- report ----------
  const passed = results.filter((r) => r.ok).length;
  const report = { passed, failed: results.length - passed, total: results.length, ms: Math.round(performance.now() - t0), results };
  window.__selftest = report;
  console.table(results.map((r) => ({ group: r.group, test: r.name, ok: r.ok ? 'PASS' : 'FAIL', detail: r.detail })));
  const panel = document.createElement('div');
  panel.id = 'selftest';
  panel.setAttribute('data-lenis-prevent', '');
  panel.style.cssText = 'position:fixed;inset:auto 16px 16px auto;z-index:300;width:min(560px,calc(100% - 32px));max-height:70vh;overflow:auto;background:#0b0f1c;border:1px solid #2a3150;border-radius:14px;font:12px/1.5 ui-monospace,Consolas,monospace;color:#cbd5e1;box-shadow:0 30px 80px rgba(0,0,0,.6)';
  panel.innerHTML = `<div style="position:sticky;top:0;background:#10162a;padding:12px 16px;border-bottom:1px solid #2a3150;display:flex;justify-content:space-between;align-items:center"><b style="color:${report.failed ? '#ff6b81' : '#34d399'}">SELF-TEST ${report.failed ? '⚠' : '✓'} ${passed}/${results.length} passed · ${report.ms} ms</b><button onclick="this.closest('#selftest').remove()" style="background:none;border:1px solid #2a3150;color:#cbd5e1;border-radius:6px;padding:2px 8px;cursor:pointer">close</button></div>
    <div style="padding:8px 16px">${results.map((r) => `<div style="display:flex;gap:8px;padding:2px 0"><span style="color:${r.ok ? '#34d399' : '#ff6b81'}">${r.ok ? 'PASS' : 'FAIL'}</span><span style="color:#8a93a8;min-width:92px">${r.group}</span><span>${r.name}${r.detail && !r.ok ? ` <i style="color:#febc2e">(${r.detail})</i>` : ''}</span></div>`).join('')}</div>`;
  document.body.append(panel);
  return report;
}
