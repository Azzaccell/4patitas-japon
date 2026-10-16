/* 4 PATITAS JAPÓN — app para celular (Vue 3 + Leaflet, todo en un solo HTML) */
const { createApp, ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick, markRaw } = Vue;
const { state, TYPES, SPECIES, ACCENTS, accentOf, ZONES, CENTER, matches, timeAgo, km, M, actions, status, canEdit, auth } = window.HUELLAS;
const BRAND = 'Cuatro Patitas';

/* ---------- íconos de línea ---------- */
const ICONS = {
  home: '<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z"/>',
  pin: '<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  paw: '<path d="M7 15c2-5 8-5 10 0 6 8-4 6-5 6s-11 2-5-6Z"/><ellipse cx="4" cy="10" rx="2" ry="3"/><ellipse cx="9" cy="5" rx="2" ry="3"/><ellipse cx="15" cy="5" rx="2" ry="3"/><ellipse cx="20" cy="10" rx="2" ry="3"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4Z"/>',
  heart: '<path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-6 6 8 15 8 15S26 11 20 5Z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  chat: '<path d="M21 11a9 9 0 0 1-9 9c-2 0-4-.5-5-1L3 21l1-5a9 9 0 1 1 17-5Z"/><path d="M8 11h8"/>',
  share: '<path d="M12 16V3m-5 5 5-5 5 5M5 13v8h14v-8"/>',
  camera: '<path d="M3 7h5l2-3h4l2 3h5v14H3Z"/><circle cx="12" cy="13" r="4"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  map: '<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  locate: '<circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>',
  megaphone: '<path d="M4 9.5v5h3l8 4.5v-14L7 9.5z"/><path d="M18 9.5c1.3.7 1.3 4.3 0 5"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/><path d="M4 4l16 16"/>',
  whatsapp: '<path d="M5.3 18.7 6.4 15A7.6 7.6 0 1 1 9.3 17.9z"/><path d="M9.4 8.8c.2 2.4 2.4 4.8 5.2 5.4l1-1.3-1.7-.9-.8.8c-1-.4-2-1.4-2.4-2.4l.8-.8-.9-1.7z"/>',
  trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  spark: '<path d="M12 3.5c.6 4.3 2.2 6 6.5 6.5-4.3.6-5.9 2.2-6.5 6.5-.6-4.3-2.2-5.9-6.5-6.5 4.3-.5 5.9-2.2 6.5-6.5z"/>',
  user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.2-3.8 4-5.6 7.5-5.6s6.3 1.8 7.5 5.6"/>',
  book: '<path d="M4 5c3-1.5 6-1.5 8 .5 2-2 5-2 8-.5v14c-3-1.5-6-1.5-8 .5-2-2-5-2-8-.5Z"/><path d="M12 5.5v14"/>',
  logout: '<path d="M14 4.5H6.5v15H14M10 12h10M16.5 8.5 20 12l-3.5 3.5"/>',
  dog: '<path d="M8.2 6.6C5.6 6 4 7.6 4 10.6c0 2 .9 3.3 2.3 3.4"/><path d="M15.8 6.6c2.6-.6 4.2 1 4.2 4 0 2-.9 3.3-2.3 3.4"/><path d="M7.5 9.2C7.5 6.6 9.5 5 12 5s4.5 1.6 4.5 4.2v5.3c0 2.7-2 4.5-4.5 4.5s-4.5-1.8-4.5-4.5z"/><path d="M10.7 15.2h2.6L12 16.6z"/><path d="M10 11.2v.01M14 11.2v.01"/>',
  cat: '<path d="M5 13.5V4.6l4 3.1h6l4-3.1v8.9c0 3.7-3.1 6-7 6s-7-2.3-7-6z"/><path d="M11 14.6h2l-1 1z"/><path d="M9.3 11.6v.01M14.7 11.6v.01"/>',
  bird: '<path d="M5 14.8c0-5 3.5-8.8 8-8.8 2.2 0 4 1.3 4.6 3.2L20.5 10l-2.8 1.3C17.4 16 14 19 9.5 19 7 19 5 17.3 5 14.8z"/><path d="M14.5 9.6v.01"/>',
  rabbit: '<path d="M9.6 9C8.6 6 8.4 3 9.7 2.8c1.4-.2 1.7 3.2 1.6 5.9M14.4 9c1-3 1.2-6-.1-6.2-1.4-.2-1.7 3.2-1.6 5.9"/><path d="M6.5 14.5c0-3.4 2.5-6 5.5-6s5.5 2.6 5.5 6-2.5 5.5-5.5 5.5-5.5-2.1-5.5-5.5z"/>',
};
const svg = (name, cls = 'icon') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.paw}</svg>`;
const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

/* ---------- navegación en memoria (funciona en GitHub Pages, en un iframe y abierto desde WhatsApp) ---------- */
const TABS = ['inicio', 'avisos', 'publicar', 'cuaderno', 'guardados'];
const parse = (h = location.hash) => {
  const [path, qs = ''] = h.replace(/^#\/?/, '').split('?');
  const [tab, id] = path.split('/');
  return { tab: TABS.includes(tab) ? tab : (tab === 'aviso' || tab === 'mascota' ? 'inicio' : 'inicio'), open: tab === 'aviso' || tab === 'mascota' ? { kind: tab, id } : null, query: Object.fromEntries(new URLSearchParams(qs)) };
};
const route = ref(parse());
const go = (path) => {
  route.value = parse('#/' + path);
  try { history.replaceState(null, '', '#/' + path); } catch (e) {}
  window.scrollTo({ top: 0 });
};
addEventListener('hashchange', () => { route.value = parse(); });

/* ---------- estado de interfaz ---------- */
const ui = reactive({ sheet: null, toast: '', welcome: !state.user.welcomed });
let toastT;
const toast = msg => { ui.toast = msg; clearTimeout(toastT); toastT = setTimeout(() => (ui.toast = ''), 3200); };
window.HUELLAS.onError = toast;
const openSheet = (kind, id) => { ui.sheet = { kind, id }; document.body.style.overflow = 'hidden'; };
const closeSheet = () => { ui.sheet = null; document.body.style.overflow = ''; };
// botón "atrás" de Android (lo llama el APK): cierra la hoja abierta o vuelve a Inicio; false = salir
window.__patitasBack = () => {
  if (ui.welcome) return false;
  if (ui.sheet) { closeSheet(); return true; }
  if (route.value.tab !== 'inicio') { go('inicio'); return true; }
  return false;
};
if (route.value.open) openSheet(route.value.open.kind === 'aviso' ? 'report' : 'pet', route.value.open.id);

/* guardados: solo en este teléfono */
if (!Array.isArray(state.user.saved)) state.user.saved = [];
const isSaved = (kind, id) => state.user.saved.includes(kind + ':' + id);
const toggleSave = (kind, id) => {
  const k = kind + ':' + id, i = state.user.saved.indexOf(k);
  if (i > -1) state.user.saved.splice(i, 1); else { state.user.saved.unshift(k); toast('Guardado en tu cuaderno'); }
};

// en el APK o abierto como archivo, el enlace compartido apunta a la web publicada
const shareBase = () => location.protocol === 'file:' ? (window.HUELLAS_CONFIG || {}).siteUrl || '' : location.origin + location.pathname;
const share = async (title, hash) => {
  const url = shareBase() + hash;
  if (window.AndroidApp) { window.AndroidApp.share(title, url); return; }
  try { if (navigator.share) { await navigator.share({ title, url }); return; } } catch (e) { if (e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(url); toast('Enlace copiado'); } catch (e) { toast('Copia este enlace: ' + url); }
};
const waLink = r => `https://wa.me/${r.contact}?text=${encodeURIComponent(`Hola, te escribo por "${r.name}" en ${BRAND}`)}`;
const statusStyle = t => ({ '--bg': TYPES[t].color, '--fg': TYPES[t].fg });

/* foto → JPEG comprimido */
const readImage = (file, max = 900) => new Promise((res, rej) => {
  const img = new Image();
  img.onload = () => {
    const s = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = img.width * s; c.height = img.height * s;
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(img.src);
    res(c.toDataURL('image/jpeg', 0.78));
  };
  img.onerror = rej;
  img.src = URL.createObjectURL(file);
});

/* ---------- mapa: Esri → OpenStreetMap → mapa dibujado de Santa Cruz ---------- */
const TILE_PROVIDERS = [
  { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Mapa &copy; Esri · datos &copy; OpenStreetMap', maxNativeZoom: 19 },
  { url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap', maxNativeZoom: 19 },
];
const VECTOR = !!window.HUELLAS_VECTOR_MAP || /[?&]mapa=dibujo/.test(location.search);
const RINGS = [['1er', 750], ['2do', 1450], ['3er', 2350], ['4to', 3350], ['5to', 4450], ['6to', 5650], ['7mo', 6900], ['8vo', 8200]];
const RADIALS = [-12, 18, 48, 82, 128, 168, 205, 240, 300, 335];
const offset = ([lat, lng], m, deg) => { const r = deg * Math.PI / 180; return [lat + (m * Math.cos(r)) / 111320, lng + (m * Math.sin(r)) / (111320 * Math.cos(lat * Math.PI / 180))]; };
function drawCity(map, labels) {
  RADIALS.forEach(d => L.polyline([offset(CENTER, 300, d), offset(CENTER, 9600, d)], { color: '#efc6a8', weight: 1.5, interactive: false }).addTo(map));
  RINGS.forEach(([n, m], i) => {
    L.circle(CENTER, { radius: m, color: '#3a2418', weight: i < 4 ? 1.6 : 1.1, opacity: .7, fill: false, interactive: false }).addTo(map);
    if (labels) L.marker(offset(CENTER, m, 0), { interactive: false, icon: L.divIcon({ className: '', iconSize: [0, 0], html: `<div class="ring-label">${n} anillo</div>` }) }).addTo(map);
  });
  L.polyline([[-17.70, -63.215], [-17.73, -63.222], [-17.76, -63.214], [-17.79, -63.221], [-17.82, -63.214], [-17.86, -63.222]], { color: '#405c6d', weight: 6, opacity: .35, lineCap: 'round', interactive: false }).addTo(map);
  L.circleMarker(CENTER, { radius: 6, color: '#3a2418', fillColor: '#efa274', fillOpacity: 1, weight: 1.6, interactive: false }).addTo(map);
  if (labels) {
    Object.entries(ZONES).forEach(([z, ll]) => L.marker(ll, { interactive: false, icon: L.divIcon({ className: '', iconSize: [0, 0], html: `<div class="zone-label">${z}</div>` }) }).addTo(map));
    L.marker([-17.775, -63.227], { interactive: false, icon: L.divIcon({ className: '', iconSize: [0, 0], html: '<div class="river-label">río Piraí</div>' }) }).addTo(map);
  }
}
function makeMap(el, opts = {}) {
  const map = L.map(el, { zoomControl: !opts.static, attributionControl: true, ...opts }).setView(opts.center || CENTER, opts.zoom || 13);
  const vector = () => { if (map._city) return; map._city = true; drawCity(map, !opts.static); };
  const tryProvider = i => {
    const p = TILE_PROVIDERS[i];
    if (!p) return vector();
    let loaded = false, done = false;
    const next = () => { if (loaded || done) return; done = true; map.removeLayer(tiles); tryProvider(i + 1); };
    const tiles = L.tileLayer(p.url, { attribution: p.attribution, maxZoom: 19, maxNativeZoom: p.maxNativeZoom, referrerPolicy: 'no-referrer', className: 'tiles' })
      .on('tileload', () => { loaded = true; }).on('tileerror', next).addTo(map);
    setTimeout(next, 6000);
  };
  if (VECTOR) vector(); else tryProvider(0);
  return markRaw(map);
}
const pinIcon = r => L.divIcon({
  className: '', iconSize: [46, 46], iconAnchor: [5, 46], popupAnchor: [18, -44],
  html: `<div class="pin ${r.type === 'perdido' ? 'lost' : ''}" style="--c:${TYPES[r.type].dot};--bg:${TYPES[r.type].color}">${r.photo
    ? `<img src="${esc(M(r.photo))}" alt="">` : `<span class="blank">${svg(SPECIES[r.species])}</span>`}</div>`,
});

/* ===================================================== */
const app = createApp({
  setup() {
    const finishWelcome = () => { ui.welcome = false; state.user.welcomed = true; };
    return { route, ui, closeSheet, finishWelcome };
  },
  template: `
    <div class="phone">
      <top-bar />
      <keep-alive include="v-avisos">
        <component :is="'v-' + route.tab" :key="route.tab" />
      </keep-alive>
      <bottom-nav />
    </div>
    <template v-if="ui.sheet">
      <div class="sheet-bg" @click="closeSheet"></div>
      <s-report v-if="ui.sheet.kind==='report'" :id="ui.sheet.id" />
      <s-pet v-else-if="ui.sheet.kind==='pet'" :id="ui.sheet.id" />
      <s-cuenta v-else-if="ui.sheet.kind==='cuenta'" />
    </template>
    <welcome v-if="ui.welcome" @done="finishWelcome" />
    <div class="toast" v-if="ui.toast" role="status">{{ ui.toast }}</div>
  `,
});

/* ---------- piezas ---------- */
app.component('ico', { props: { name: String }, setup: () => ({ ICONS }), template: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" v-html="ICONS[name] || ICONS.paw"></svg>` });
app.component('wave', { template: `<svg class="wave" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true"><path d="M2 6 Q 25 1, 50 6 T 100 6 T 150 6 T 198 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>` });
app.component('media', {
  props: ['item'],
  setup: () => ({ M, SPECIES, hide: e => (e.target.style.visibility = 'hidden') }),
  template: `<img v-if="item.photo" :src="M(item.photo)" :alt="item.name" loading="lazy" decoding="async" @error="hide"><div v-else class="blank"><ico :name="SPECIES[item.species] || 'paw'" /></div>`,
});
app.component('status-pill', {
  props: ['type'], setup: () => ({ TYPES, statusStyle }),
  template: `<span class="status" :style="statusStyle(type)">{{ TYPES[type].label }}</span>`,
});
app.component('report-row', {
  props: ['r'], setup: () => ({ timeAgo, openSheet }),
  template: `
    <button class="report" @click="openSheet('report', r.id)">
      <span class="report__img"><media :item="r" /></span>
      <div><status-pill :type="r.type" /><strong>{{ r.name }}</strong><p>{{ r.zone }} · {{ timeAgo(r.date) }}</p></div>
      <ico name="arrow" />
    </button>`,
});

/* ---------- barra superior: marca (o el título manuscrito de Gemini cuando exista) ---------- */
app.component('top-bar', {
  setup() {
    const openAccount = () => openSheet('cuenta');
    return { M, status, openAccount, go };
  },
  template: `
    <header class="top">
      <a href="#/inicio" class="brand" @click.prevent="go('inicio')" aria-label="${BRAND}, inicio">
        <span class="wordmark" aria-hidden="true">Cuatro pat<span class="wordmark__i">ı</span>tas</span>
      </a>
      <div class="top__end">
        <div class="place"><ico name="pin" /><div>Santa Cruz<small><span v-if="status.online" class="live"></span>{{ status.online ? 'en vivo' : 'este teléfono' }}</small></div></div>
        <button class="avatar-btn" @click="openAccount" :aria-label="status.user ? 'Mi cuenta' : 'Entrar'">
          <template v-if="status.user">{{ status.user.name.charAt(0).toUpperCase() }}</template><ico v-else name="user" />
        </button>
      </div>
    </header>`,
});
app.component('bottom-nav', {
  setup: () => ({ route, go }),
  template: `
    <nav class="nav" aria-label="Secciones">
      <a href="#/inicio" :class="{on:route.tab==='inicio'}" @click.prevent="go('inicio')"><ico name="home" />Inicio</a>
      <a href="#/avisos" :class="{on:route.tab==='avisos'}" @click.prevent="go('avisos')"><ico name="pin" />Avisos</a>
      <a href="#/publicar" class="plus" :class="{on:route.tab==='publicar'}" @click.prevent="go('publicar')"><span class="plus"><ico name="plus" /></span>Publicar</a>
      <a href="#/cuaderno" :class="{on:route.tab==='cuaderno'}" @click.prevent="go('cuaderno')"><ico name="paw" />Cuaderno</a>
      <a href="#/guardados" :class="{on:route.tab==='guardados'}" @click.prevent="go('guardados')"><ico name="bookmark" />Guardados</a>
    </nav>`,
});

/* ---------- bienvenida (primera vez) ---------- */
app.component('welcome', {
  emits: ['done'],
  setup(_, { emit }) {
    const box = ref(null), i = ref(0);
    const slides = [
      { img: 'assets/mascota.webp', solid: true, tag: 'CAPÍTULO 0 · EL ENCUENTRO', title: 'Cada patita tiene un lugar en nuestro barrio.', text: 'Para compartir la vida con quienes nos hacen felices. Para acompañar a quienes necesitan volver a casa.', bubble: '¡Cada patita cuenta!' },
      { img: 'assets/rastro.webp', tag: 'CAPÍTULO 1 · EL BARRIO', title: 'Una patita perdida. Un barrio entero para encontrarla.', text: 'Una foto, un lugar en el mapa de Santa Cruz y un pequeño detalle pueden hacer la diferencia.', bubble: '¿Lo has visto pasar?' },
      { img: 'assets/siesta.webp', tag: 'CAPÍTULO 2 · EL CUADERNO', title: 'Sus pequeños días. Nuestro álbum favorito.', text: 'Comparte la vida de tu mascota, guarda las páginas que te gustan y celebra cada reencuentro.', bubble: 'Las cosas pequeñas también cuentan' },
    ];
    const onScroll = () => { const el = box.value; i.value = Math.round(el.scrollLeft / el.clientWidth); };
    const next = () => { if (i.value >= slides.length - 1) return emit('done'); box.value.scrollTo({ left: (i.value + 1) * box.value.clientWidth, behavior: 'smooth' }); };
    return { box, i, slides, onScroll, next, M, emit };
  },
  template: `
    <div class="welcome" :class="{poster: slides[i].solid}" role="dialog" aria-label="Bienvenida a ${BRAND}">
      <button class="skip" @click="emit('done')">Saltar</button>
      <div class="welcome__slides" ref="box" @scroll.passive="onScroll">
        <section class="slide" :class="{'slide--poster': s.solid}" v-for="s in slides" :key="s.tag">
          <span class="jp-tag">{{ s.tag }}</span>
          <img :src="M(s.img)" alt="" width="330" height="250">
          <div class="slide__text">
            <span class="bubble bubble--tail">{{ s.bubble }}</span>
            <h1>{{ s.title }}</h1>
            <p>{{ s.text }}</p>
          </div>
        </section>
      </div>
      <div class="welcome__foot">
        <div class="dots"><i v-for="(s,k) in slides" :key="k" :class="{on:k===i}"></i></div>
        <button class="btn btn--full" @click="next">{{ i === slides.length - 1 ? 'Entrar al barrio' : 'Siguiente' }}<ico name="arrow" /></button>
      </div>
    </div>`,
});

/* ===================== INICIO ===================== */
app.component('v-inicio', {
  setup() {
    const recent = computed(() => [...state.reports].filter(r => r.type !== 'reunido').sort((a, b) => b.date - a.date).slice(0, 4));
    const story = computed(() => state.reports.find(r => r.type === 'reunido'));
    const active = computed(() => state.reports.filter(r => r.type !== 'reunido').length);
    return { recent, story, active, state, go, M, openSheet, timeAgo };
  },
  template: `
    <main class="view">
      <div class="hello stagger">
        <div>
          <span class="eyebrow">Qué bueno encontrarnos</span>
          <h1>Un barrio. Muchas pequeñas <span class="sketch">historias.</span></h1>
          <p>Mira a tu alrededor. Quizá alguien necesita volver a casa.</p>
        </div>
      </div>

      <nav class="directory stagger" aria-label="Qué puedes hacer">
        <a href="#/avisos" @click.prevent="go('avisos')"><span class="n">01</span><div><strong>Mirar en el barrio</strong><span>{{ active }} avisos activos en Santa Cruz</span></div><ico name="arrow" /></a>
        <a href="#/cuaderno" @click.prevent="go('cuaderno')"><span class="n">02</span><div><strong>Abrir el cuaderno</strong><span>Fotografías y pequeños días</span></div><ico name="arrow" /></a>
        <a href="#/guardados" @click.prevent="go('guardados')"><span class="n">03</span><div><strong>Volver a mis guardados</strong><span>{{ state.user.saved.length }} páginas guardadas</span></div><ico name="arrow" /></a>
      </nav>

      <div class="poster-card">
        <img :src="M('assets/mascota-banner.webp')" alt="Una gata calicó y un perro blanco con sombreros de paja y pañoletas verdes" width="640" height="447" loading="lazy">
        <p class="wordmark wordmark--big">Un poquito de compañía<span class="wordmark__dot">.</span></p>
      </div>

      <div class="heading"><div><span class="eyebrow">Una mano cerca</span><h2>Avisos recientes</h2></div><a class="link" href="#/avisos" @click.prevent="go('avisos')">Ver todos</a></div>
      <div class="stagger"><report-row v-for="r in recent" :key="r.id" :r="r" /></div>

      <template v-if="story">
        <div class="heading"><div><span class="eyebrow">Del cuaderno</span><h2>Una historia con final feliz</h2></div><span class="hanko" aria-hidden="true"><ico name="paw" /></span></div>
        <button class="story" @click="openSheet('report', story.id)">
          <img :src="M(story.photo || 'assets/engawa.webp')" :alt="story.name" loading="lazy">
          <h3>{{ story.name }} volvió a casa.</h3>
          <p>{{ story.desc }}</p>
        </button>
      </template>

      <hr class="rule">
      <p class="hand">Las cosas pequeñas también cuentan.</p>
    </main>`,
});

/* ===================== AVISOS ===================== */
app.component('v-avisos', {
  name: 'v-avisos',
  setup() {
    const el = ref(null), sel = ref(null);
    const f = reactive({ type: 'todos', q: '', view: 'mapa' });
    const list = computed(() => state.reports
      .filter(r => f.type === 'todos' || r.type === f.type)
      .filter(r => !f.q || `${r.name} ${r.breed} ${r.zone} ${r.color}`.toLowerCase().includes(f.q.toLowerCase()))
      .sort((a, b) => b.date - a.date));
    const selected = computed(() => state.reports.find(r => r.id === sel.value));
    let map, layer, ready = false;
    const draw = () => {
      if (!layer) return;
      layer.clearLayers();
      list.value.forEach(r => layer.addLayer(L.marker([r.lat, r.lng], { icon: pinIcon(r) }).on('click', () => { sel.value = r.id; })));
    };
    const init = () => {
      if (ready || !el.value) return; ready = true;
      map = makeMap(el.value, { zoom: 13 });
      layer = L.layerGroup().addTo(map);
      draw();
      map.on('click', e => { if (e.originalEvent.target.closest('.pin')) return; sel.value = null; });
      setTimeout(() => map.invalidateSize(), 300);
    };
    const locate = () => {
      if (!navigator.geolocation) return toast('Tu teléfono no permite ubicación');
      navigator.geolocation.getCurrentPosition(p => {
        const ll = [p.coords.latitude, p.coords.longitude];
        L.marker(ll, { icon: L.divIcon({ className: '', html: '<div class="me-dot"></div>', iconSize: [18, 18] }) }).addTo(map);
        map.flyTo(ll, 15);
        const near = state.reports.filter(r => r.type !== 'reunido' && km({ lat: ll[0], lng: ll[1] }, r) < 5).length;
        toast(`${near} avisos a menos de 5 km`);
      }, () => toast('No pudimos obtener tu ubicación'));
    };
    onMounted(() => nextTick(init));
    watch(list, draw);
    watch(() => f.view, v => { if (v === 'mapa') nextTick(() => map && map.invalidateSize()); });
    onBeforeUnmount(() => map && map.remove());
    const filters = [['todos', 'Todos', '#3a2418'], ...Object.entries(TYPES).map(([k, t]) => [k, t.short, t.dot])];
    return { el, f, list, sel, selected, filters, locate, openSheet, timeAgo, M };
  },
  template: `
    <main class="view">
      <header class="view-head view-head--art">
        <img class="view-head__art" :src="M('assets/head-avisos.webp')" alt="" width="108" height="118">
        <span class="badge"><span class="badge__ico"><ico name="pin" /></span>01 · EL BARRIO</span>
        <h1>Avisos del <span class="sketch">barrio.</span></h1>
        <p>Perdidos, vistos y encontrados en Santa Cruz. Ayudemos a reconocerlos.</p>
      </header>
      <div class="filters" role="tablist">
        <button v-for="x in filters" :key="x[0]" class="chip" :class="{on:f.type===x[0]}" @click="f.type=x[0]" role="tab" :aria-selected="f.type===x[0]"><i class="dot" :style="{'--c':x[2]}"></i>{{ x[1] }}</button>
      </div>
      <label class="search"><ico name="search" /><input v-model="f.q" placeholder="Nombre, detalle o barrio" aria-label="Buscar avisos"></label>
      <div class="seg">
        <button :class="{on:f.view==='mapa'}" @click="f.view='mapa'"><ico name="map" />Mapa</button>
        <button :class="{on:f.view==='lista'}" @click="f.view='lista'"><ico name="list" />Lista ({{ list.length }})</button>
      </div>

      <div class="mapbox" v-show="f.view==='mapa'">
        <div class="map" ref="el"></div>
        <span class="map__tag">SANTA CRUZ DE LA SIERRA</span>
        <button class="btn btn--light btn--sm map__me" @click="locate"><ico name="locate" />Cerca de mí</button>
        <button v-if="selected" class="peek" @click="openSheet('report', selected.id)">
          <span class="report__img"><media :item="selected" /></span>
          <div><status-pill :type="selected.type" /><strong>{{ selected.name }}</strong><p>{{ selected.zone }} · {{ timeAgo(selected.date) }}</p></div>
          <ico name="arrow" />
        </button>
      </div>
      <p v-show="f.view==='mapa'" class="map-note">Toca un pin para ver el aviso. Las ubicaciones son aproximadas por privacidad.</p>

      <div v-show="f.view==='lista'" class="stagger">
        <report-row v-for="r in list" :key="r.id" :r="r" />
        <div v-if="!list.length" class="empty"><h2>Nada por aquí</h2><p>No hay avisos con ese filtro.</p></div>
      </div>
    </main>`,
});

/* ===================== PUBLICAR ===================== */
app.component('v-publicar', {
  setup() {
    const pick = ref(null), err = ref(''), sending = ref(false);
    const q = route.value.query;
    const form = reactive({ type: 'perdido', species: 'perro', name: '', breed: '', color: '', zone: 'Centro', desc: '', reward: '', contact: '', photo: null, lat: CENTER[0], lng: CENTER[1] });
    if (q.pet) {
      const p = state.pets.find(x => x.id === q.pet);
      if (p) Object.assign(form, { name: p.name, species: p.species, breed: p.breed, zone: p.zone, desc: p.bio, photo: p.photo || null, petId: p.id, lat: ZONES[p.zone][0], lng: ZONES[p.zone][1] });
    }
    const types = [['perdido', 'megaphone', 'Se perdió'], ['visto', 'eye', 'Lo vi'], ['encontrado', 'home', 'Lo encontré']];
    let map, marker;
    const onFile = async e => { const file = e.target.files[0]; if (file) form.photo = await readImage(file); };
    onMounted(() => nextTick(() => {
      map = makeMap(pick.value, { center: [form.lat, form.lng], zoom: 14 });
      marker = L.marker([form.lat, form.lng], { draggable: true, icon: pinIcon(form) }).addTo(map);
      const set = ll => { form.lat = ll.lat; form.lng = ll.lng; marker.setLatLng(ll); };
      marker.on('dragend', () => set(marker.getLatLng()));
      map.on('click', e => set(e.latlng));
      setTimeout(() => map.invalidateSize(), 300);
    }));
    watch(() => form.zone, z => { if (!map) return; form.lat = ZONES[z][0]; form.lng = ZONES[z][1]; marker.setLatLng(ZONES[z]); map.flyTo(ZONES[z], 15, { duration: .6 }); });
    watch(() => [form.type, form.species, form.photo], () => marker && marker.setIcon(pinIcon(form)));
    onBeforeUnmount(() => map && map.remove());
    const submit = async () => {
      err.value = '';
      if (!form.name.trim()) return (err.value = 'Escribe un nombre o un título corto.');
      if (form.contact.replace(/\D/g, '').length < 7) return (err.value = 'Escribe un WhatsApp válido para que te puedan contactar.');
      sending.value = true;
      try {
        const id = await actions.addReport({ ...form });
        toast('Aviso publicado. Ya está en el mapa');
        go('avisos'); setTimeout(() => openSheet('report', id), 400);
      } catch (e) { err.value = 'No se pudo publicar: ' + (e.message || 'revisa tu conexión'); }
      finally { sending.value = false; }
    };
    return { pick, form, types, onFile, submit, err, sending, SPECIES, ZONES, TYPES, statusStyle, go, openSheet, M };
  },
  template: `
    <main class="view">
      <header class="view-head view-head--art">
        <img class="view-head__art view-head__art--wag" :src="M('assets/head-publicar.webp')" alt="" width="108" height="120">
        <span class="badge"><span class="badge__ico"><ico name="plus" /></span>03 · PARTICIPAR</span>
        <h1>Un gesto <span class="sketch">pequeño.</span></h1>
        <p>Puede ser el comienzo de un reencuentro. Toma menos de un minuto.</p>
      </header>
      <form class="form" @submit.prevent="submit" novalidate>
        <div class="field"><span>¿Qué pasó?</span>
          <div class="types">
            <button v-for="t in types" :key="t[0]" type="button" :class="{on:form.type===t[0]}" :style="statusStyle(t[0])" @click="form.type=t[0]"><ico :name="t[1]" />{{ t[2] }}</button>
          </div>
        </div>
        <label class="photo-drop">
          <img v-if="form.photo" :src="form.photo" alt="Foto elegida">
          <template v-else><ico name="camera" /><strong>Agrega una foto clara</strong><span>De cuerpo entero y con buena luz</span></template>
          <input type="file" accept="image/*" @change="onFile" aria-label="Elegir foto">
        </label>
        <div class="field"><span>Especie</span>
          <div class="species"><button v-for="(icon,k) in SPECIES" :key="k" type="button" class="chip" :class="{on:form.species===k}" @click="form.species=k"><ico :name="icon" />{{ k }}</button></div>
        </div>
        <div class="field"><label for="p-name">{{ form.type==='perdido' ? 'Nombre de tu mascota' : 'Título corto' }}</label><input id="p-name" class="input" v-model="form.name" :placeholder="form.type==='perdido' ? 'Ej. Toby' : 'Ej. Perrito café con collar'"></div>
        <div class="grid2">
          <div class="field"><label for="p-breed">Raza</label><input id="p-breed" class="input" v-model="form.breed" placeholder="Mestizo"></div>
          <div class="field"><label for="p-color">Color y señas</label><input id="p-color" class="input" v-model="form.color" placeholder="Collar rojo"></div>
        </div>
        <div class="field"><label for="p-desc">Cuéntanos un poco más</label><textarea id="p-desc" class="input" v-model="form.desc" placeholder="¿Cómo es su carácter? ¿Hacia dónde iba?"></textarea></div>
        <div class="field"><label for="p-zone">Barrio <small>· luego ajusta el punto en el mapa</small></label><select id="p-zone" class="input" v-model="form.zone"><option v-for="(_,z) in ZONES" :key="z">{{ z }}</option></select></div>
        <div class="pickmap" ref="pick"></div>
        <div class="grid2">
          <div class="field" v-if="form.type==='perdido'"><label for="p-reward">Recompensa <small>opcional</small></label><input id="p-reward" class="input" v-model="form.reward" placeholder="Bs 300"></div>
          <div class="field" :style="form.type!=='perdido' ? 'grid-column:1/-1' : ''"><label for="p-wa">Tu WhatsApp</label><input id="p-wa" class="input" v-model="form.contact" inputmode="tel" placeholder="7XXXXXXX"></div>
        </div>
        <p v-if="err" class="error" role="alert">{{ err }}</p>
        <button class="btn btn--green btn--full" :disabled="sending">{{ sending ? 'Publicando…' : 'Publicar en el mapa' }}<ico name="arrow" /></button>
        <p class="hand" style="text-align:center">Gracias por mirar a tu alrededor.</p>
      </form>
    </main>`,
});

/* ===================== CUADERNO ===================== */
app.component('v-cuaderno', {
  setup() {
    const tab = ref('todo');
    const entries = computed(() => {
      const pets = state.pets.map(p => ({ kind: 'pet', id: p.id, item: p, date: 0 }));
      const happy = state.reports.filter(r => r.type === 'reunido').map(r => ({ kind: 'report', id: r.id, item: r, date: r.date }));
      if (tab.value === 'mascotas') return pets;
      if (tab.value === 'reencuentros') return happy;
      const out = []; pets.forEach((p, i) => { out.push(p); if (happy[i]) out.push(happy[i]); });
      return out;
    });
    const like = async e => { if (e.kind === 'pet') await actions.toggleFollow(e.item); else await actions.toggleLike(e.item); };
    const liked = e => e.kind === 'pet' ? (state.user.followed || []).includes(e.id) : e.item.liked;
    return { tab, entries, like, liked, isSaved, toggleSave, openSheet, share, accentOf, timeAgo, BRAND, M };
  },
  template: `
    <main class="view">
      <header class="view-head view-head--art">
        <img class="view-head__art view-head__art--calm" :src="M('assets/head-cuaderno.webp')" alt="" width="108" height="100">
        <span class="badge"><span class="badge__ico"><ico name="book" /></span>02 · EL CUADERNO</span>
        <h1>Sus pequeños días. <span class="sketch">Nuestro álbum.</span></h1>
        <p>La vida de las mascotas del barrio y cada reencuentro.</p>
      </header>
      <div class="tabs" role="tablist">
        <button v-for="t in [['todo','Todo'],['mascotas','Mascotas'],['reencuentros','Reencuentros']]" :key="t[0]" :class="{on:tab===t[0]}" @click="tab=t[0]" role="tab" :aria-selected="tab===t[0]">{{ t[1] }}</button>
      </div>
      <article v-for="e in entries" :key="e.kind+e.id" class="post">
        <div class="post__head">
          <span class="report__img" :style="{background:accentOf(e.item.accent, e.id)}"><media :item="e.item" /></span>
          <div><strong>{{ e.kind==='pet' ? e.item.owner || 'Un vecino' : (e.item.author || 'La comunidad') }}</strong><small>{{ e.item.zone }}<template v-if="e.date"> · {{ timeAgo(e.date) }}</template></small></div>
        </div>
        <button class="post__photo" @click="openSheet(e.kind, e.id)"><media :item="e.item" /></button>
        <div class="post__bar">
          <button :class="{on:liked(e)}" @click="like(e)" :aria-pressed="liked(e)"><ico name="heart" />{{ e.kind==='pet' ? e.item.followers : e.item.likes }}</button>
          <button @click="openSheet(e.kind, e.id)"><ico name="chat" />Ver</button>
          <button @click="share(e.item.name + ' en ' + BRAND, '#/' + (e.kind==='pet' ? 'mascota/' : 'aviso/') + e.id)"><ico name="share" /></button>
          <button :class="{on:isSaved(e.kind, e.id)}" @click="toggleSave(e.kind, e.id)" :aria-label="isSaved(e.kind, e.id) ? 'Quitar de guardados' : 'Guardar'"><ico name="bookmark" /></button>
        </div>
        <status-pill v-if="e.kind==='report'" :type="e.item.type" />
        <h2>{{ e.item.name }}</h2>
        <p>{{ e.kind==='pet' ? e.item.bio : e.item.desc }}</p>
        <div class="traits" v-if="e.kind==='pet' && e.item.traits.length"><span v-for="t in e.item.traits" :key="t">{{ t }}</span></div>
      </article>
      <div class="letter">
        <span class="eyebrow">Carta del cuaderno</span>
        <p>Ellos hacen nuestro mundo más bonito. Hagamos el suyo un poco más seguro.</p>
        <span class="hand">Con cariño, 4 Patitas.</span>
      </div>
    </main>`,
});

/* ===================== GUARDADOS ===================== */
app.component('v-guardados', {
  setup() {
    const items = computed(() => state.user.saved.map(k => {
      const [kind, id] = k.split(':');
      const item = kind === 'report' ? state.reports.find(r => r.id === id) : state.pets.find(p => p.id === id);
      return item ? { kind, id, item } : null;
    }).filter(Boolean));
    return { items, M, go, openSheet, toggleSave };
  },
  template: `
    <main class="view">
      <header class="view-head view-head--art">
        <img v-if="items.length" class="view-head__art view-head__art--wag" :src="M('assets/head-guardados.webp')" alt="" width="108" height="120">
        <span class="badge"><span class="badge__ico"><ico name="bookmark" /></span>04 · GUARDADOS</span>
        <h1>Mis <span class="sketch">páginas.</span></h1>
        <p>Los avisos y las mascotas que guardaste en este teléfono.</p>
      </header>
      <div v-if="!items.length" class="empty">
        <img class="empty__art" :src="M('assets/head-guardados.webp')" alt="" width="170" height="180">
        <h2>Todavía no guardaste nada</h2>
        <p>Toca el marcador en un aviso o en el cuaderno para volver a encontrarlo aquí.</p>
        <button class="btn" @click="go('cuaderno')">Abrir el cuaderno</button>
      </div>
      <div v-else class="stagger" style="margin-top:12px">
        <template v-for="x in items" :key="x.kind+x.id">
          <report-row v-if="x.kind==='report'" :r="x.item" />
          <button v-else class="report" @click="openSheet('pet', x.id)">
            <span class="report__img"><media :item="x.item" /></span>
            <div><span class="eyebrow">Mascota</span><strong>{{ x.item.name }}</strong><p>{{ x.item.breed }} · {{ x.item.zone }}</p></div>
            <ico name="arrow" />
          </button>
        </template>
      </div>
    </main>`,
});

/* ===================== HOJA: AVISO ===================== */
app.component('s-report', {
  props: ['id'],
  setup(props) {
    const r = computed(() => state.reports.find(x => x.id === props.id));
    const m = computed(() => (r.value ? matches(r.value).slice(0, 3) : []));
    const comment = ref(''), confirmDel = ref(false);
    const send = async () => {
      const text = comment.value.trim(); if (!text) return;
      try { await actions.addComment(r.value, text); comment.value = ''; toast('Gracias por ayudar'); } catch (e) { toast('No se pudo enviar: ' + e.message); }
    };
    const reunite = async () => { try { await actions.setReportType(r.value, 'reunido'); toast('Qué alegría: ya está en casa'); } catch (e) { toast(e.message); } };
    const remove = async () => {
      if (!confirmDel.value) { confirmDel.value = true; return; }
      try { await actions.removeReport(props.id); closeSheet(); toast('Aviso eliminado'); } catch (e) { toast(e.message); }
    };
    const onMap = () => { closeSheet(); go('avisos'); };
    return { r, m, comment, send, reunite, remove, confirmDel, onMap, closeSheet, canEdit, isSaved, toggleSave, share, waLink, timeAgo, TYPES, M, BRAND, openSheet, like: x => actions.toggleLike(x) };
  },
  template: `
    <section class="sheet" role="dialog" aria-modal="true" :aria-label="r ? r.name : 'Aviso'">
      <div class="sheet__grab"><i></i></div>
      <button class="sheet__x" @click="closeSheet" aria-label="Cerrar"><ico name="close" /></button>
      <template v-if="r">
        <img v-if="r.photo" class="detail-photo" :src="M(r.photo)" :alt="r.name">
        <div v-else class="detail-photo blank"><ico name="paw" /></div>
        <div class="sheet__body detail">
          <div class="flex" style="display:flex;align-items:center;gap:10px;margin-top:14px"><status-pill :type="r.type" /><span class="meta">{{ timeAgo(r.date) }}</span><span class="hanko hanko--sm" style="margin-left:auto" aria-hidden="true"><ico name="paw" /></span></div>
          <h2>{{ r.name }}</h2>
          <p class="meta">{{ r.zone }} · Santa Cruz de la Sierra</p>
          <p style="margin-top:12px;font-size:14.5px">{{ r.desc }}</p>
          <dl class="kv">
            <dt>Raza</dt><dd>{{ r.breed || '—' }}</dd>
            <dt>Señas</dt><dd>{{ r.color || '—' }}</dd>
            <template v-if="r.reward"><dt>Recompensa</dt><dd><b>{{ r.reward }}</b></dd></template>
            <template v-if="r.author"><dt>Publicó</dt><dd>{{ r.author }}</dd></template>
          </dl>
          <div v-if="m.length && r.type!=='reunido'" style="margin-top:16px">
            <span class="eyebrow">Posibles coincidencias</span>
            <button v-for="x in m" :key="x.r.id" class="match" @click="openSheet('report', x.r.id)">
              <span class="report__img"><media :item="x.r" /></span>
              <div style="flex:1;font-size:13px"><b>{{ x.score }}% parecido</b> · {{ x.r.name }}<br><span class="meta">{{ TYPES[x.r.type].label }} a {{ x.d.toFixed(1) }} km</span></div>
            </button>
          </div>
          <div class="actions">
            <a v-if="r.type!=='reunido'" class="btn btn--green btn--sm" :href="waLink(r)" target="_blank" rel="noopener"><ico name="whatsapp" />Escribir</a>
            <button class="iconbtn" @click="onMap"><ico name="map" />Mapa</button>
            <button class="iconbtn" :class="{on:r.liked}" @click="like(r)" :aria-pressed="r.liked"><ico name="heart" />{{ r.likes }}</button>
            <button class="iconbtn" :class="{on:isSaved('report', r.id)}" @click="toggleSave('report', r.id)" aria-label="Guardar"><ico name="bookmark" /></button>
            <button class="iconbtn" @click="share(r.name + ' en ' + BRAND, '#/aviso/' + r.id)" aria-label="Compartir"><ico name="share" /></button>
            <button v-if="r.type!=='reunido' && canEdit(r)" class="iconbtn" @click="reunite"><ico name="heart" />Ya está en casa</button>
            <button v-if="r.mine" class="iconbtn" @click="remove"><ico name="trash" />{{ confirmDel ? '¿Seguro? Toca otra vez' : '' }}</button>
          </div>
          <div class="comments" v-if="r.type!=='reunido'">
            <h3>¿Lo viste?</h3>
            <div v-for="(c,i) in r.comments" :key="i" class="comment"><b v-if="c.author" style="display:block;font-size:11.5px">{{ c.author }}</b>{{ c.text }} <span class="meta">· {{ timeAgo(c.date) }}</span></div>
            <form class="comment-form" @submit.prevent="send"><input class="input" v-model="comment" placeholder="Ej. Lo vi por el 3er anillo" aria-label="Comentario"><button class="btn btn--sm" aria-label="Enviar"><ico name="arrow" /></button></form>
          </div>
        </div>
      </template>
      <div v-else class="sheet__body"><div class="empty"><h2>Este aviso ya no está</h2></div></div>
    </section>`,
});

/* ===================== HOJA: MASCOTA ===================== */
app.component('s-pet', {
  props: ['id'],
  setup(props) {
    const p = computed(() => state.pets.find(x => x.id === props.id));
    const following = computed(() => (state.user.followed || []).includes(props.id));
    const follow = () => actions.toggleFollow(p.value);
    const reportLost = () => { closeSheet(); go('publicar?pet=' + props.id); };
    return { p, following, follow, reportLost, closeSheet, canEdit, isSaved, toggleSave, share, M, BRAND, accentOf };
  },
  template: `
    <section class="sheet" role="dialog" aria-modal="true" :aria-label="p ? p.name : 'Mascota'">
      <div class="sheet__grab"><i></i></div>
      <button class="sheet__x" @click="closeSheet" aria-label="Cerrar"><ico name="close" /></button>
      <template v-if="p">
        <img v-if="p.photo" class="detail-photo" :src="M(p.photo)" :alt="p.name">
        <div v-else class="detail-photo blank" :style="{background:accentOf(p.accent,p.id)}"><ico name="paw" /></div>
        <div class="sheet__body detail">
          <span class="eyebrow" style="margin-top:14px">{{ p.breed }}<template v-if="p.age"> · {{ p.age }}</template></span>
          <h2>{{ p.name }}</h2>
          <p class="meta">{{ p.zone }}<template v-if="p.owner"> · familia {{ p.owner }}</template></p>
          <p v-if="p.lost" class="error" style="margin-top:10px">Esta mascota está perdida. Si la ves, avisa.</p>
          <p style="margin-top:12px;font-size:14.5px">{{ p.bio }}</p>
          <div class="traits"><span v-for="t in p.traits" :key="t">{{ t }}</span></div>
          <div class="actions">
            <button class="btn btn--sm" :class="following ? 'btn--light' : ''" @click="follow"><ico :name="following ? 'check' : 'heart'" />{{ following ? 'Siguiendo' : 'Seguir' }} · {{ p.followers }}</button>
            <button class="iconbtn" :class="{on:isSaved('pet', p.id)}" @click="toggleSave('pet', p.id)" aria-label="Guardar"><ico name="bookmark" /></button>
            <button class="iconbtn" @click="share(p.name + ' en ' + BRAND, '#/mascota/' + p.id)" aria-label="Compartir"><ico name="share" /></button>
            <button v-if="!p.lost && canEdit(p)" class="iconbtn" @click="reportLost"><ico name="megaphone" />Avisar que se perdió</button>
          </div>
        </div>
      </template>
    </section>`,
});

/* ===================== HOJA: CUENTA ===================== */
app.component('s-cuenta', {
  setup() {
    const mode = ref('crear'); // crear | entrar | olvido
    const f = reactive({ name: state.user.name || '', email: '', password: '' });
    const show = ref(false), msg = ref(''), ok = ref('');
    const mine = computed(() => state.reports.filter(r => r.mine));
    watch(mode, () => { msg.value = ''; ok.value = ''; });
    const submit = async () => {
      msg.value = ''; ok.value = '';
      try {
        if (mode.value === 'crear') {
          if (f.name.trim().length < 2 || !/^\S+@\S+\.\S{2,}$/.test(f.email) || f.password.length < 6) return (msg.value = 'Escribe tu nombre, un correo válido y una contraseña de 6 caracteres o más.');
          const r = await auth.signUp(f); if (r.pending) ok.value = 'Te enviamos un enlace para activar tu cuenta.'; else toast('Cuenta creada. Bienvenido al barrio');
        } else if (mode.value === 'entrar') { await auth.signIn(f); toast('Qué bueno verte de nuevo'); }
        else { await auth.resetPassword(f.email); ok.value = 'Si ese correo tiene cuenta, te llegará un enlace.'; }
        f.password = '';
      } catch (e) { msg.value = e.message; }
    };
    const again = () => { closeSheet(); ui.welcome = true; };
    return { mode, f, show, msg, ok, submit, status, auth, mine, closeSheet, again, openSheet, timeAgo };
  },
  template: `
    <section class="sheet" role="dialog" aria-modal="true" aria-label="Mi cuenta">
      <div class="sheet__grab"><i></i></div>
      <button class="sheet__x" @click="closeSheet" aria-label="Cerrar"><ico name="close" /></button>
      <div class="sheet__body">
        <span class="badge" style="margin-top:8px"><span class="badge__ico"><ico name="user" /></span>05 · MI CUENTA</span>
        <template v-if="status.user">
          <h2 style="font-size:28px;margin:14px 0 2px">Hola, {{ status.user.name }}.</h2>
          <p class="meta">{{ status.user.email }}</p>
          <div class="heading"><h2 style="font-size:20px">Mis avisos</h2></div>
          <report-row v-for="r in mine" :key="r.id" :r="r" />
          <p v-if="!mine.length" class="meta">Todavía no publicaste avisos.</p>
          <button class="btn btn--light btn--full" style="margin-top:18px" :disabled="status.authBusy" @click="auth.logout()"><ico name="logout" />Cerrar sesión</button>
        </template>
        <template v-else-if="status.online || status.connecting">
          <h2 style="font-size:26px;margin:14px 0 6px">Únete al barrio.</h2>
          <p class="meta">Ver y publicar no requiere cuenta. Con una cuenta, tus avisos te acompañan en cualquier teléfono.</p>
          <form class="eauth" @submit.prevent="submit" novalidate>
            <div v-if="mode!=='olvido'" class="eauth__tabs" role="tablist">
              <button type="button" :class="{on:mode==='crear'}" @click="mode='crear'">Crear cuenta</button>
              <button type="button" :class="{on:mode==='entrar'}" @click="mode='entrar'">Ya tengo cuenta</button>
            </div>
            <input v-if="mode==='crear'" class="input" v-model="f.name" autocomplete="name" placeholder="Tu nombre" aria-label="Tu nombre">
            <input class="input" v-model="f.email" type="email" inputmode="email" autocomplete="email" placeholder="tucorreo@gmail.com" aria-label="Correo">
            <div class="eauth__pass" v-if="mode!=='olvido'">
              <input class="input" v-model="f.password" :type="show ? 'text' : 'password'" :autocomplete="mode==='entrar' ? 'current-password' : 'new-password'" placeholder="Contraseña" aria-label="Contraseña">
              <button type="button" class="eauth__eye" @click="show=!show" :aria-label="show ? 'Ocultar contraseña' : 'Mostrar contraseña'"><ico :name="show ? 'eyeOff' : 'eye'" /></button>
            </div>
            <p v-if="msg" class="error" role="alert">{{ msg }}</p>
            <p v-if="ok" class="ok" role="status">{{ ok }}</p>
            <button class="btn btn--green btn--full" :disabled="status.authBusy || status.connecting">{{ status.authBusy ? 'Un momento…' : ({crear:'Crear cuenta',entrar:'Entrar',olvido:'Enviar enlace'})[mode] }}</button>
            <button v-if="mode==='entrar'" type="button" class="textlink" @click="mode='olvido'">¿Olvidaste tu contraseña?</button>
            <button v-if="mode==='olvido'" type="button" class="textlink" @click="mode='entrar'">Volver</button>
          </form>
        </template>
        <p v-else class="meta" style="margin-top:14px">Sin conexión: lo que publiques se guarda en este teléfono.</p>

        <hr class="rule">
        <span class="eyebrow">Sobre 4 Patitas</span>
        <div class="faq">
          <details><summary>¿Es gratis?</summary><p>Sí. Ver el mapa, publicar avisos y llevar el cuaderno es gratis.</p></details>
          <details><summary>¿Qué hago si encuentro una mascota?</summary><p>Toca Publicar, elige "Lo encontré", marca el lugar en el mapa y sube una foto. Si coincide con un aviso, te lo mostramos.</p></details>
          <details><summary>¿Mi WhatsApp es público?</summary><p>Solo aparece un botón para escribirte en los avisos que tú publicas. Puedes borrarlos cuando quieras.</p></details>
          <details><summary>¿Dónde funciona?</summary><p>En Santa Cruz de la Sierra y alrededores: Urubó, Warnes y La Guardia.</p></details>
        </div>
        <button class="textlink" style="margin-top:12px" @click="again">Ver la bienvenida otra vez</button>
      </div>
    </section>`,
});

app.mount('#app');
