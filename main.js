/* ── PAGE TRANSITIONS ── */
document.addEventListener('DOMContentLoaded', () => {
  // Exit transition on link clicks
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('#') && href.endsWith('.html')) {
      link.addEventListener('click', e => {
        e.preventDefault();
        const trans = document.querySelector('.page-transition');
        if (trans) {
          trans.classList.remove('exit');
          trans.classList.add('enter');
          setTimeout(() => { window.location.href = href; }, 440);
        } else {
          window.location.href = href;
        }
      });
    }
  });

  // Enter transition on load
  const trans = document.querySelector('.page-transition');
  if (trans) {
    trans.classList.remove('enter');
    trans.classList.add('exit');
  }
});

/* ── CURSOR ── */
const cursor = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
});

(function animRing() {
  rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
  if (cursorRing) { cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px'; }
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) { cursor.style.width = '12px'; cursor.style.height = '12px'; }
    if (cursorRing) { cursorRing.style.width = '52px'; cursorRing.style.height = '52px'; cursorRing.style.borderColor = 'rgba(231,76,60,0.7)'; }
  });
  el.addEventListener('mouseleave', () => {
    if (cursor) { cursor.style.width = '6px'; cursor.style.height = '6px'; }
    if (cursorRing) { cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; cursorRing.style.borderColor = 'rgba(192,57,43,0.4)'; }
  });
});

/* ── NAV SCROLL ── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── HAMBURGER ── */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

/* ── SCROLL ANIMATIONS ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* ── COUNTER ANIMATION ── */
function animCounter(el, target, suffix = '', prefix = '') {
  let start = null;
  const dur = 2200;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    const val = Math.floor(eased * target);
    el.textContent = prefix + val.toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animCounter(el, parseInt(el.dataset.target), el.dataset.suffix || '', el.dataset.prefix || '');
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

/* ── TYPING ANIMATION ── */
const typingEl = document.querySelector('.typing-cycle');
if (typingEl) {
  const words = JSON.parse(typingEl.dataset.words || '[]');
  let wi = 0, ci = 0, deleting = false;
  function typeStep() {
    const word = words[wi];
    if (!deleting) {
      typingEl.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(typeStep, 1800); return; }
    } else {
      typingEl.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(typeStep, 300); return; }
    }
    setTimeout(typeStep, deleting ? 40 : 70);
  }
  setTimeout(typeStep, 1000);
}

/* ── SKILL BARS ── */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.width; }, 100);
      });
      skillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skills-bars').forEach(el => skillObs.observe(el));

/* ── PARTICLES (hero only) ── */
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -Math.random() * 0.4 - 0.1;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;
    }
    update() {
      this.x += this.speedX; this.y += this.speedY;
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
      const t = this.life / this.maxLife;
      this.currentOpacity = t < 0.1 ? (t / 0.1) * this.opacity : t > 0.8 ? ((1 - t) / 0.2) * this.opacity : this.opacity;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.currentOpacity;
      ctx.fillStyle = '#c0392b';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  function animParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animParticles);
  }
  animParticles();
}
