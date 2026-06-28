const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── LENIS SMOOTH SCROLL
const nav = document.getElementById('nav');
if (!reducedMotion && typeof Lenis !== 'undefined') {
  const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
  function lenisRaf(time) {
    lenis.raf(time);
    requestAnimationFrame(lenisRaf);
  }
  requestAnimationFrame(lenisRaf);

  if (nav) {
    lenis.on('scroll', ({ scroll }) => nav.classList.toggle('scrolled', scroll > 40));
  }
} else if (nav) {
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));
}

// ── HAMBURGER
const hbg = document.getElementById('hamburger');
const mob = document.getElementById('mobileNav');
if (hbg && mob) {
  hbg.addEventListener('click', () => {
    hbg.classList.toggle('open');
    mob.classList.toggle('open');
    document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
  });
}
function closeMob() {
  if (hbg) hbg.classList.remove('open');
  if (mob) mob.classList.remove('open');
  document.body.style.overflow = '';
}

// ── SCROLL REVEAL
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── ACTIVE NAV
const path = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === path) a.classList.add('active');
});

// ── CARD MOUSE GLOW
if (!reducedMotion) {
  document.querySelectorAll('.feat, .plan, .svc, .uc').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });
}

// ── MAGNETIC BUTTONS
if (!reducedMotion) {
  const MAX_PULL = 15;
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const dist = Math.hypot(x, y);
      const pull = Math.min(dist / 4, MAX_PULL);
      const angle = Math.atan2(y, x);
      btn.style.transition = 'background 0.18s, border-color 0.18s, color 0.18s, box-shadow 0.18s, transform 0s';
      btn.style.transform = `translate(${Math.cos(angle) * pull}px, ${Math.sin(angle) * pull}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = '';
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}
