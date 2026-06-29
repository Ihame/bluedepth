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
      setTimeout(() => el.target.classList.add('aos-animate'), parseFloat(delay) * 1000);
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

/* ========== TESTIMONIAL SLIDER ========== */
const track = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('sliderDots');
if (track) {
  const cards = track.querySelectorAll('.testimonial-card');
  let perView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  let current = 0;
  const total = cards.length;
  const maxIndex = Math.max(0, total - perView);

  // Create dots
  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIndex));
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  document.getElementById('sliderPrev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('sliderNext').addEventListener('click', () => goTo(current + 1));

  // Auto slide
  let autoplay = setInterval(() => goTo(current < maxIndex ? current + 1 : 0), 4000);
  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', () => { autoplay = setInterval(() => goTo(current < maxIndex ? current + 1 : 0), 4000); });

  window.addEventListener('resize', () => {
    perView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    goTo(0);
  });
}

/* ========== CONTACT FORM ========== */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      form.reset();
    }, 3500);
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
