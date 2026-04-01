
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Win2000 bevel press effect on .btn elements
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.borderTopColor = 'var(--win-shadow)';
      btn.style.borderLeftColor = 'var(--win-shadow)';
      btn.style.borderRightColor = 'var(--win-hilight)';
      btn.style.borderBottomColor = 'var(--win-hilight)';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.borderTopColor = '';
      btn.style.borderLeftColor = '';
      btn.style.borderRightColor = '';
      btn.style.borderBottomColor = '';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.borderTopColor = '';
      btn.style.borderLeftColor = '';
      btn.style.borderRightColor = '';
      btn.style.borderBottomColor = '';
    });
  });

  // Win2000 window-close buttons (cosmetic — scroll to top)
  document.querySelectorAll('.win-btn').forEach(btn => {
    if (btn.textContent.trim() === '×') {
      btn.style.cursor = 'pointer';
    }
  });
});
