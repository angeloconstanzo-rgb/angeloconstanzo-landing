const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

function observeAll() {
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => observer.observe(el));
}

function toggleMenu() {
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!navToggle || !mobileMenu) return;
  navToggle.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

window.addEventListener('DOMContentLoaded', () => {
  observeAll();

  const pageName = document.body.dataset.page || 'home';
  document.querySelectorAll(`[data-page-link="${pageName}"]`).forEach(el => el.classList.add('active'));

  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10) || 0;
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, 25);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }
});
