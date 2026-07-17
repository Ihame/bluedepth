/* ========== NAVBAR SCROLL ========== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

/* ========== HAMBURGER ========== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ========== BACK TO TOP ========== */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========== AOS (Animate On Scroll) ========== */
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      const delay = el.target.dataset.delay || '0';
      setTimeout(() => el.target.classList.add('aos-animate'), parseFloat(delay));
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

/* ========== COUNTER ANIMATION ========== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 16);
}
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(animateCounter);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ========== PROJECT FILTER ========== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
      if (match) {
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
      }
    });
  });
});

/* ========== SCROLL PROGRESS BAR ========== */
const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
  });
}

/* ========== TILT ON HOVER ========== */
document.querySelectorAll('.tilt').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

/* ========== LIGHTBOX ========== */
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxItems = Array.from(document.querySelectorAll('.project-card'));
  let lightboxIndex = 0;

  function openLightbox(idx) {
    lightboxIndex = idx;
    const card = lightboxItems[idx];
    const img = card.querySelector('.project-img img');
    const title = card.querySelector('.project-info h3');
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = title ? title.textContent : '';
    lightbox.classList.add('open');
  }
  function closeLightbox() { lightbox.classList.remove('open'); }
  function showRelative(delta) {
    let idx = lightboxIndex;
    const visible = lightboxItems.filter(c => c.style.display !== 'none');
    let pos = visible.indexOf(lightboxItems[idx]);
    pos = (pos + delta + visible.length) % visible.length;
    openLightbox(lightboxItems.indexOf(visible[pos]));
  }

  lightboxItems.forEach((card, idx) => {
    card.querySelector('.project-img').addEventListener('click', () => openLightbox(idx));
  });
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', () => showRelative(-1));
  document.getElementById('lightboxNext').addEventListener('click', () => showRelative(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showRelative(-1);
    if (e.key === 'ArrowRight') showRelative(1);
  });
}

/* ========== CONTACT FORM ========== */
const form = document.getElementById('contactForm');
if (form) {
  const statusNote = document.getElementById('formStatus');
  const statusDefault = statusNote.innerHTML;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error('Request failed');
      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      form.reset();
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    } catch (err) {
      btn.textContent = orig;
      btn.disabled = false;
      statusNote.innerHTML = 'Could not send right now. Please message us on <a href="https://wa.me/250788228943" target="_blank" rel="noopener" style="color:var(--blue);font-weight:600">WhatsApp</a> or email info@bluedepthmarine.com directly.';
      setTimeout(() => { statusNote.innerHTML = statusDefault; }, 6000);
    }
  });
}

/* ========== SMOOTH ACTIVE NAV HIGHLIGHT ========== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.fontWeight = a.getAttribute('href') === '#' + entry.target.id ? '700' : '';
        a.style.color = a.getAttribute('href') === '#' + entry.target.id ? 'white' : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObserver.observe(s));
