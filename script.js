// Utilities
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Year in footer
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Modal controls
const downloadBtn = $('#downloadBtn');
const platformModal = $('#platformModal');
const imageModal = $('#imageModal');
const modalImg = $('#modalImg');
const closes = $$('.close');
const menuToggle = $('#menuToggle');
const mobileNav = $('#mobileNav');

if (downloadBtn && platformModal) {
  downloadBtn.addEventListener('click', () => {
    platformModal.style.display = 'block';
  });
}

closes.forEach((close) => {
  close.addEventListener('click', () => {
    if (platformModal) platformModal.style.display = 'none';
    if (imageModal) imageModal.style.display = 'none';
    if (mobileNav) mobileNav.classList.remove('open');
  });
});

// Progress bar (59%)
const progressWrap = $('#progress .progress-wrap');
const progressValue = $('#progressValue');
if (progressWrap) {
  const target = Number(progressWrap.getAttribute('data-progress') || '59');
  const fill = $('.progress-fill', progressWrap);
  let current = 0;
  const step = () => {
    current = Math.min(target, current + 1);
    if (fill) fill.style.setProperty('--progress', String(current));
    if (progressValue) progressValue.textContent = `${current}%`;
    if (current < target) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Team data
const team = [
  { name: "Дмитро Бидлов", role: "Керівник «Солов'їної команди»" },
  { name: "Катерина «Kandod» Філіппова", role: "Перекладачка" },
  { name: "Рустам «Рустя» Ткаченко", role: "Перекладач з японської мови" },
  { name: "Марія «minnimals» Серебрякова", role: "Перекладачка" },
  { name: "Микита «Funfy» Захаров", role: "Художник україномовних текстур" },
  { name: "Марія «Mimotw» Єфіменко", role: "Художниця україномовних шрифтів та текстур" },
  { name: "Кирило «twentysixz»", role: "Перекладач" },
  { name: "Назарій «V_Orbit_V» Васильковський", role: "Перекладач" },
  { name: "Михайло «Eeyeyy1»", role: "Перекладач" },
  { name: "ralphfinchi", role: "Перекладач та художник текстур" },
  { name: "та інші", role: "Ще дуже багато причетних" }
];

// Render team
const teamGrid = $('#teamGrid');
if (teamGrid) {
  const frag = document.createDocumentFragment();
  team.forEach(({ name, role }) => {
    const card = document.createElement('article');
    card.className = 'team-card';
    card.innerHTML = `
      <div class="team-name">${name}</div>
      <div class="team-role">${role}</div>
    `;
    frag.appendChild(card);
  });
  teamGrid.appendChild(frag);
}

// Slider
const slides = $$('.slide');
const prev = $('.prev');
const next = $('.next');
const dotsContainer = $('.slider .slider-dots');
let dots = [];
let currentSlide = 0;

const showSlide = (index) => {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  if (dots.length) {
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }
};

// Build slider dots
if (dotsContainer) {
  dotsContainer.innerHTML = '';
  dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Слайд ${i + 1}`);
    dot.addEventListener('click', () => { currentSlide = i; showSlide(currentSlide); });
    dotsContainer.appendChild(dot);
    return dot;
  });
}

if (prev) prev.addEventListener('click', () => { currentSlide = (currentSlide - 1 + slides.length) % slides.length; showSlide(currentSlide); });
if (next) next.addEventListener('click', () => { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); });
showSlide(currentSlide);

// Click to open image modal
slides.forEach((slide) => {
  slide.addEventListener('click', () => {
    if (!imageModal || !modalImg) return;
    modalImg.src = slide.src;
    imageModal.style.display = 'block';
  });
});

// Close image modal
if (imageModal) {
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal || e.target.classList.contains('close')) {
      imageModal.style.display = 'none';
    }
  });
}

// Subtle parallax for background layers
const parallaxLayers = $$('.bg-layer');
let lastX = 0, lastY = 0;
const applyParallax = (x, y) => {
  parallaxLayers.forEach((layer) => {
    const depth = Number(layer.getAttribute('data-parallax') || 0);
    const tx = (x / 100) * depth;
    const ty = (y / 100) * depth;
    layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
  });
};
window.addEventListener('pointermove', (e) => {
  lastX = e.clientX - window.innerWidth / 2;
  lastY = e.clientY - window.innerHeight / 2;
  applyParallax(lastX, lastY);
});
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  applyParallax(lastX, lastY + sy * 0.1);
});

// Mobile menu toggle
if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
  });
  $$('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}
