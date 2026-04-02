
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const revealEls = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('.counter');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.14 });
  revealEls.forEach(el => revealObserver.observe(el));
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target || '0', 10);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 42));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
        else { el.textContent = current + '+'; }
      }, 30);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countObserver.observe(el));
  window.addEventListener('scroll', () => { if (window.scrollY > 20) nav.classList.add('scrolled'); else nav.classList.remove('scrolled'); });
});
