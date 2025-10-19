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

if (downloadBtn && platformModal) {
  downloadBtn.addEventListener('click', () => {
    platformModal.style.display = 'block';
  });
}

closes.forEach((close) => {
  close.addEventListener('click', () => {
    if (platformModal) platformModal.style.display = 'none';
    if (imageModal) imageModal.style.display = 'none';
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
let currentSlide = 0;

const showSlide = (index) => {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
};

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
