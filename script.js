const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('show');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

document.querySelector('.contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Gracias por tu mensaje. En breve te contactaremos.');
});
