const state = {
  config: null,
};

function $(sel, parent = document){ return parent.querySelector(sel); }
function el(tag, cls){ const e = document.createElement(tag); if(cls) e.className = cls; return e; }

async function loadConfig(){
  const res = await fetch('data/config.json', { cache: 'no-cache' });
  if(!res.ok) throw new Error('Не вдалось завантажити конфіг.');
  state.config = await res.json();
}

function hydrateCTA(){
  const cta = $('#cta-download');
  const note = $('[data-cta-note]');
  if(!cta || !state.config) return;
  cta.href = state.config.download.url;
  // Replace file size text with requested static label
  note.textContent = 'Версія від 11 грудня 2025 року';
}

function setYear(){ $('#year').textContent = new Date().getFullYear(); }

function hydrateProgress(){
  const { progress } = state.config;
  const overall = Math.max(0, Math.min(100, progress.overall || 0));
  const overallBar = $('#overall-bar');
  const overallLabel = $('#overall-label');
  const segmentsWrap = $('#segments');
  overallBar.style.width = overall + '%';
  overallBar.parentElement.setAttribute('aria-valuenow', String(overall));
  if (overallLabel) {
    overallLabel.textContent = `Загальний прогрес - ${overall}%`;
  }

  // Hide and clear any per-segment details as requested
  if (segmentsWrap) segmentsWrap.innerHTML = '';
}

function hydrateDemo(){
  // Add requested YouTube demos
  const videosWrap = $('#videos');
  if (videosWrap) {
    const urls = [
      'https://www.youtube.com/embed/-x3nNYnsQBw',
      'https://www.youtube.com/embed/XpYJWmeEf1Y',
      'https://www.youtube.com/embed/Jsgk-KOZWv4'
    ];
    urls.forEach(src => {
      const card = el('div', 'video-card');
      const frame = el('div', 'video-frame');
      const iframe = el('iframe', 'yt-embed');
      iframe.title = 'Демонстраційне відео YouTube';
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.src = `${src}?rel=0&modestbranding=1&color=white`;
      frame.append(iframe);
      card.append(frame);
      videosWrap.append(card);
    });
  }

  const gallery = $('#gallery');
  const images = state.config.demo.images || [];
  gallery.innerHTML = '';
  images.forEach(src => {
    const item = el('figure', 'gallery__item');
    const img = new Image();
    img.loading = 'lazy';
    img.src = src;
    img.alt = 'Скріншот локалізації Persona 5 Royal';
    item.append(img);
    gallery.append(item);
  });
}

function hydrateTeam(){
  const wrap = $('#team-roles');
  wrap.innerHTML = '';
  const roles = state.config.team || [];
  roles.forEach(role => {
    const card = el('section', 'role');
    const title = el('h3', 'role__title');
    title.textContent = role.role;
    const list = el('div', 'member-list');
    (role.members || []).forEach(m => {
      const chip = el('span', 'member');
      chip.textContent = m;
      list.append(chip);
    });
    card.append(title, list);
    wrap.append(card);
  });
}

async function main(){
  try {
    await loadConfig();
    setYear();
    hydrateCTA();
    hydrateProgress();
    hydrateDemo();
    hydrateTeam();
  } catch (e) {
    console.error(e);
  }
}

// Prefers-reduced-motion: tone down sparkles
const mediaReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mediaReduce.matches) {
  document.documentElement.style.setProperty('--anim-speed', '0');
}

window.addEventListener('DOMContentLoaded', main);
