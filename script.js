const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const contactForm = document.querySelector('.contact-form');
const reveals = document.querySelectorAll('.reveal');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('show');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Gracias por tu mensaje. En breve te contactaremos.');
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.classList.remove('is-hidden');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => {
    el.classList.add('is-hidden');
    observer.observe(el);
  });
} else {
  reveals.forEach(el => {
    el.classList.add('is-visible');
  });
}
