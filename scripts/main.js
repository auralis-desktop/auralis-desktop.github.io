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
