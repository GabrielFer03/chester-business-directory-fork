let businesses = [];
let activeCategory = 'Todos';

async function init() {
  const resp = await fetch('data/businesses.json');
  businesses = await resp.json();
  const cats = ['Todos', ...new Set(businesses.map(b => b.category))];
  const catEl = document.getElementById('categories');
  cats.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (c === 'Todos' ? ' active' : '');
    btn.textContent = c;
    btn.onclick = () => filterCategory(c);
    catEl.appendChild(btn);
  });
  renderList();
}

function filterCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.textContent === cat));
  renderList();
}

function renderList() {
  const q = document.getElementById('search').value.toLowerCase();
  const filtered = businesses.filter(b => {
    const matchCat = activeCategory === 'Todos' || b.category === activeCategory;
    const matchSearch = b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
  const grid = document.getElementById('grid');
  document.getElementById('resultCount').textContent =
    `${filtered.length} ${filtered.length === 1 ? 'negócio encontrado' : 'negócios encontrados'}`;
  grid.innerHTML = filtered.length
    ? filtered.map(b => `
    <div class="card" role="button" tabindex="0" onclick="showDetail(${businesses.indexOf(b)})"
      onkeydown="if (event.key === 'Enter' || event.key === ' ') showDetail(${businesses.indexOf(b)})">
      <h3>${b.name}</h3>
      <div class="cat">${b.category}</div>
      <p>${b.description}</p>
    </div>
  `).join('')
    : '<p class="empty-state">Nenhum negócio corresponde à sua pesquisa.</p>';
}

function showDetail(i) {
  const b = businesses[i];
  document.getElementById('modalBody').innerHTML = `
    <button class="close-btn" onclick="closeModal()">×</button>
    <h2>${b.name}</h2>
    <div class="cat">${b.category}</div>
    <p>${b.description}</p>
    <div class="detail">📍 ${b.address}</div>
    <div class="detail">📞 ${b.phone}</div>
    <div class="detail">🌐 <a href="${b.website}" target="_blank">${b.website}</a></div>
    <div class="map-placeholder">📍 Mapa — integre o Google Maps ou Leaflet aqui</div>
  `;
  document.getElementById('modal').classList.add('active');
}

function closeModal() { document.getElementById('modal').classList.remove('active'); }

document.getElementById('search').addEventListener('input', renderList);
document.getElementById('modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
init();
