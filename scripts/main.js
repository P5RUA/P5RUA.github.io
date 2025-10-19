const state = {
  config: null,
};

function $(sel, parent = document){ return parent.querySelector(sel); }
function el(tag, cls){ const e = document.createElement(tag); if(cls) e.className = cls; return e; }

async function loadConfig(){
  const res = await fetch('/data/config.json', { cache: 'no-cache' });
  if(!res.ok) throw new Error('Не вдалось завантажити конфіг.');
  state.config = await res.json();
}

function hydrateCTA(){
  const cta = $('#cta-download');
  const note = $('[data-cta-note]');
  if(!cta || !state.config) return;
  cta.href = state.config.download.url;
  if(state.config.download.fileSize){
    note.textContent = `ZIP ~ ${state.config.download.fileSize}`;
  }
}

function setYear(){ $('#year').textContent = new Date().getFullYear(); }

function hydrateProgress(){
  const { progress } = state.config;
  const overall = Math.max(0, Math.min(100, progress.overall || 0));
  const overallBar = $('#overall-bar');
  const overallText = $('#overall-percent');
  const segmentsWrap = $('#segments');
  overallBar.style.width = overall + '%';
  overallBar.parentElement.setAttribute('aria-valuenow', String(overall));
  overallText.textContent = overall + '%';

  segmentsWrap.innerHTML = '';
  (progress.segments || []).forEach(seg => {
    const item = el('div', 'segment');
    const head = el('div', 'segment__head');
    const name = el('span');
    name.textContent = seg.name;
    const pct = el('strong');
    const percent = Math.max(0, Math.min(100, seg.percent || 0));
    pct.textContent = percent + '%';
    head.append(name, pct);

    const prog = el('div', 'progress');
    prog.setAttribute('role', 'progressbar');
    prog.setAttribute('aria-valuemin', '0');
    prog.setAttribute('aria-valuemax', '100');
    prog.setAttribute('aria-valuenow', String(percent));
    const bar = el('div', 'progress__bar');
    bar.style.width = percent + '%';
    const spark = el('span', 'progress__sparkles');
    bar.append(spark);
    prog.append(bar);

    item.append(head, prog);
    segmentsWrap.append(item);
  });
}

function hydrateDemo(){
  const yt = $('#yt-embed');
  const id = state.config.demo.youtubeId;
  yt.src = `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&color=white`;

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
