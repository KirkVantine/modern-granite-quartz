// Where quote requests go. Set ONE of these before launch:
//   QUOTE_ENDPOINT: a form service URL that accepts POST (Formspree, Basin, Netlify Forms, etc.)
//   QUOTE_EMAIL:    fallback that opens the visitor's email app with the request filled in
const QUOTE_ENDPOINT = '';
const QUOTE_EMAIL = '';
const FACEBOOK_URL = 'https://www.facebook.com/modern.granite.quartz.2025';

document.getElementById('year').textContent = new Date().getFullYear();

/* Hero dimension line: the reading counts up in eighths of an inch while the rule draws out */
const measureValue = document.querySelector('.measure-value');
if (measureValue && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const TARGET = 118.75;
  const FRACTIONS = ['', '⅛', '¼', '⅜', '½', '⅝', '¾', '⅞'];
  const format = (inches) => {
    const eighths = Math.round(inches * 8);
    const whole = Math.floor(eighths / 8);
    const frac = FRACTIONS[eighths % 8];
    return frac ? `${whole} ${frac}` : String(whole);
  };
  const delay = 300, duration = 1800;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const start = performance.now() + delay;
  measureValue.textContent = format(0);
  const tick = (now) => {
    const t = Math.min(Math.max((now - start) / duration, 0), 1);
    measureValue.textContent = format(TARGET * easeOut(t));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* Header: border once scrolled, mobile menu */
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
const setNav = (open) => {
  nav.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
};
navToggle.addEventListener('click', () => setNav(!nav.classList.contains('open')));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('open')) { setNav(false); navToggle.focus(); }
});

/* Highlight the nav link for the section in view */
const navLinks = [...nav.querySelectorAll('a[href^="#"]:not(.btn)')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => {
      if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach((a) => { const s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });

/* Edge profile picker. Every shape uses the same command list so the outline can morph. */
const EDGES = {
  eased: {
    name: 'Eased',
    d: 'M40 60 L296 60 C299 60 300 61 300 64 L300 136 C300 139 299 140 296 140 L40 140 Z',
    desc: 'A square edge with the sharp corners lightly sanded off. Clean, modern and the easiest to keep clean.',
    fit: 'Shaker and flat-panel kitchens, full-height backsplashes, most quartz.'
  },
  bevel: {
    name: 'Bevel',
    d: 'M40 60 L276 60 C284 68 292 76 300 84 L300 136 C300 139 299 140 296 140 L40 140 Z',
    desc: 'A 45-degree cut along the top corner catches the light and gives a crisp, tailored line.',
    fit: 'Transitional kitchens and granite with a strong pattern.'
  },
  half: {
    name: 'Half bullnose',
    d: 'M40 60 L262 60 C284 60 300 80 300 104 L300 136 C300 139 299 140 296 140 L40 140 Z',
    desc: 'The top corner is rounded over and the bottom stays square. Soft to lean on, with a solid-looking face.',
    fit: 'Family kitchens, islands where people sit, vanities.'
  },
  full: {
    name: 'Full bullnose',
    d: 'M40 60 L260 60 C282 60 300 78 300 100 L300 100 C300 122 282 140 260 140 L40 140 Z',
    desc: 'Rounded top and bottom into one smooth curve. No corners to bump into.',
    fit: 'Homes with small children, bar tops, traditional baths.'
  },
  ogee: {
    name: 'Ogee',
    d: 'M40 60 L266 60 C292 60 272 96 294 100 C300 101 300 108 300 114 L300 136 C300 139 299 140 296 140 L40 140 Z',
    desc: 'A decorative S-shaped curve cut into the face of the stone. The most formal of the classic edges.',
    fit: 'Traditional kitchens, natural granite and marble-look quartz.'
  },
  miter: {
    name: 'Mitered waterfall',
    d: 'M40 60 L360 60 C360 60 360 60 360 60 L360 232 C360 232 360 232 360 232 L300 232 L300 140 L40 140 Z',
    miter: 'M300 140 L360 60',
    desc: 'The slab turns 90 degrees and runs down to the floor. We cut both pieces at 45 degrees so the veins carry over the corner.',
    fit: 'Islands and peninsulas that you want to be the centerpiece.'
  }
};

const tabs = [...document.querySelectorAll('.edge-tabs [role="tab"]')];
const panel = document.getElementById('edge-panel');
const shape = panel.querySelector('.edge-shape');
const clipShape = panel.querySelector('.edge-clip-shape');
const miterLine = panel.querySelector('.edge-miter');
const nameEl = panel.querySelector('.edge-name');
const descEl = panel.querySelector('.edge-desc');
const fitEl = panel.querySelector('.edge-fit');

function selectEdge(tab, focus = false) {
  const edge = EDGES[tab.dataset.edge];
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', tab.id);
  shape.setAttribute('d', edge.d);
  shape.style.d = `path("${edge.d}")`;
  clipShape.setAttribute('d', edge.d);
  miterLine.setAttribute('d', edge.miter || '');
  nameEl.textContent = edge.name;
  descEl.textContent = edge.desc;
  fitEl.innerHTML = '<strong>Good for:</strong> ' + edge.fit;
  if (focus) tab.focus();
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectEdge(tab));
  tab.addEventListener('keydown', (e) => {
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
    if (e.key === 'Home') next = tabs[0];
    if (e.key === 'End') next = tabs[tabs.length - 1];
    if (next) { e.preventDefault(); selectEdge(next, true); }
  });
});
selectEdge(tabs[0]);

/* Lightbox */
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
let lastOpener = null;
document.querySelectorAll('.tile-open').forEach((btn) => {
  btn.addEventListener('click', () => {
    const thumb = btn.querySelector('img');
    lightboxImg.src = btn.dataset.full;
    lightboxImg.alt = thumb.alt;
    lastOpener = btn;
    lightbox.showModal();
  });
});
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
lightbox.addEventListener('close', () => { if (lastOpener) lastOpener.focus(); });

/* Quote form */
const form = document.getElementById('quote-form');
const summary = document.getElementById('error-summary');
const statusEl = form.querySelector('.form-status');
const submitBtn = form.querySelector('button[type="submit"]');

const rules = [
  { id: 'name', test: (v) => v.trim().length > 1, msg: 'Enter your name.' },
  { id: 'phone', test: (v) => v.replace(/\D/g, '').length >= 10, msg: 'Enter a 10-digit phone number, like 248 555 0100.' },
  { id: 'email', test: (v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Enter an email like name@example.com, or leave it blank.' }
];

function checkField(rule) {
  const input = document.getElementById(rule.id);
  const err = document.getElementById(rule.id + '-err');
  const ok = rule.test(input.value);
  input.setAttribute('aria-invalid', String(!ok));
  err.textContent = ok ? '' : rule.msg;
  return ok;
}
rules.forEach((rule) => {
  const input = document.getElementById(rule.id);
  input.addEventListener('blur', () => { if (input.value) checkField(rule); });
  input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') checkField(rule); });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = '';
  const failed = rules.filter((r) => !checkField(r));
  const list = summary.querySelector('ul');
  list.innerHTML = '';
  if (failed.length) {
    failed.forEach((r) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + r.id;
      a.textContent = r.msg;
      a.addEventListener('click', (ev) => { ev.preventDefault(); document.getElementById(r.id).focus(); });
      li.appendChild(a);
      list.appendChild(li);
    });
    summary.hidden = false;
    summary.focus();
    return;
  }
  summary.hidden = true;

  const data = new FormData(form);
  const projects = data.getAll('project').join(', ') || 'Not specified';
  const body = [
    `Name: ${data.get('name')}`,
    `Phone: ${data.get('phone')}`,
    `Email: ${data.get('email') || '-'}`,
    `City: ${data.get('city') || '-'}`,
    `Project: ${projects}`,
    `Material: ${data.get('material') || 'Not sure yet'}`,
    '',
    `${data.get('details') || ''}`
  ].join('\n');

  if (QUOTE_ENDPOINT) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    try {
      const res = await fetch(QUOTE_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      statusEl.textContent = 'Quote request sent. We will call you within one business day.';
    } catch {
      statusEl.textContent = 'Your request did not send. Check your connection and try again, or message us on Facebook.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send my quote request';
    }
    return;
  }

  if (QUOTE_EMAIL) {
    window.location.href = `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent('Countertop quote request')}&body=${encodeURIComponent(body)}`;
    statusEl.textContent = 'Your email app should open with the request filled in. Press send to finish.';
    return;
  }

  statusEl.innerHTML = `Online requests aren't switched on yet. Please <a href="${FACEBOOK_URL}" target="_blank" rel="noopener">message us on Facebook</a> with these details.`;
});
