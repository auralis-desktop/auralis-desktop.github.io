// Auralis website scripts

// ── Theme toggle ──────────────────────────────────────────────────────────────
const root   = document.documentElement;
const toggle = document.getElementById('themeToggle');
const icon   = toggle?.querySelector('.material-symbols-outlined');

function getTheme() {
  return localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

function applyTheme(t) {
  root.setAttribute('data-theme', t);
  if (icon) icon.textContent = t === 'dark' ? 'dark_mode' : 'light_mode';
  localStorage.setItem('theme', t);
}

applyTheme(getTheme());

toggle?.addEventListener('click', () => {
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ── Nav scroll style ──────────────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

// ── Copy install command ──────────────────────────────────────────────────────
function copyInstall(btn) {
  const code = btn.closest('.code-block')?.querySelector('code');
  if (!code) return;

  navigator.clipboard.writeText(code.textContent).then(() => {
    const i = btn.querySelector('.material-symbols-outlined');
    if (!i) return;
    i.textContent = 'check';
    btn.style.color = '#86EFAC';
    setTimeout(() => {
      i.textContent = 'content_copy';
      btn.style.color = '';
    }, 2000);
  });
}

window.copyInstall = copyInstall;

// ── Animate cards on scroll ───────────────────────────────────────────────────
if ('IntersectionObserver' in window) {
  const cards = document.querySelectorAll('.feature-card');
  cards.forEach((c, i) => {
    c.style.opacity    = '0';
    c.style.transform  = 'translateY(20px)';
    c.style.transition = `opacity 400ms ${i * 40}ms, transform 400ms ${i * 40}ms cubic-bezier(0.2,0,0,1)`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(c => observer.observe(c));
}

// ── Custom cursor follower ────────────────────────────────────────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    #cur-dot, #cur-ring {
      position: fixed; top: 0; left: 0;
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      will-change: transform;
    }
    #cur-dot {
      width: 8px; height: 8px;
      background: #CFBCFF;
      transform: translate(-50%,-50%);
      transition: width 200ms cubic-bezier(.2,0,0,1),
                  height 200ms cubic-bezier(.2,0,0,1),
                  opacity 300ms;
    }
    #cur-ring {
      width: 36px; height: 36px;
      border: 2px solid #CFBCFF;
      opacity: .45;
      transform: translate(-50%,-50%);
      transition: width 350ms cubic-bezier(.2,0,0,1),
                  height 350ms cubic-bezier(.2,0,0,1),
                  opacity 300ms;
    }
    [data-theme="light"] #cur-dot  { background: #7965D9; }
    [data-theme="light"] #cur-ring { border-color: #7965D9; }
    body.cur-hover #cur-dot  { width: 5px; height: 5px; opacity: .6; }
    body.cur-hover #cur-ring { width: 56px; height: 56px; opacity: .25; }
    body.cur-click #cur-dot  { width: 12px; height: 12px; }
    body.cur-click #cur-ring { width: 26px; height: 26px; opacity: .7; }
    body { cursor: none !important; }
    a, button, [role="button"] { cursor: none !important; }
  `;
  document.head.appendChild(styleEl);

  const dot  = Object.assign(document.createElement('div'), { id: 'cur-dot'  });
  const ring = Object.assign(document.createElement('div'), { id: 'cur-ring' });
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
  });

  (function tick() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
    requestAnimationFrame(tick);
  })();

  const hov = 'a,button,.btn,.feature-card,.nav-brand,[role="button"]';
  document.addEventListener('mouseover', e => { if (e.target.closest(hov)) document.body.classList.add('cur-hover'); });
  document.addEventListener('mouseout',  e => { if (e.target.closest(hov)) document.body.classList.remove('cur-hover'); });
  document.addEventListener('mousedown', () => document.body.classList.add('cur-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cur-click'));
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = ''; ring.style.opacity = ''; });
}
