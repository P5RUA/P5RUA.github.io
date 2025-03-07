// Модальне вікно для завантаження
const downloadBtn = document.getElementById('downloadBtn');
const platformModal = document.getElementById('platformModal');
const imageModal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const closes = document.querySelectorAll('.close');

// Кнопка "Завантажити"
downloadBtn.addEventListener('click', () => {
  platformModal.style.display = 'block';
});

// Закриття модальних вікон (платформи та зображення)
closes.forEach(close => {
  close.addEventListener('click', () => {
    platformModal.style.display = 'none';
    imageModal.style.display = 'none';
  });
});

// Слайдер
const slides = document.querySelectorAll('.slide');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
let currentSlide = 0;

// Показати слайд за індексом
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

// Клік на кнопки "←" та "→"
prev.addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
});

next.addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
});

// Ініціалізація першого слайду
showSlide(currentSlide);

// Клік на слайд (відкриття в модальному вікні)
slides.forEach(slide => {
  slide.addEventListener('click', () => {
    modalImg.src = slide.src;
    imageModal.style.display = 'block';
  });
});

// Закриття модального вікна при кліку на зовнішню область або хрестик
imageModal.addEventListener('click', (e) => {
  if (e.target === imageModal || e.target.classList.contains('close')) {
    imageModal.style.display = 'none';
  }
});

// Додаткове закриття при кліку безпосередньо на зображення
modalImg.addEventListener('click', () => {
  imageModal.style.display = 'none';
});
