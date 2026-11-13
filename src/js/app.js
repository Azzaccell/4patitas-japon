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
  vet: '<path d="M9.5 4h5v5.5H20v5h-5.5V20h-5v-5.5H4v-5h5.5z"/>',
  store: '<path d="M4 9.5 5.5 4h13L20 9.5M4 9.5h16V20H4zM9.5 20v-5h5v5"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  photos: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m4 17 5-4.5 4 3.5 2.5-2 4.5 3.5"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
};
const svg = (name, cls = 'icon') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.paw}</svg>`;
const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

/* ---------- navegación en memoria (funciona en GitHub Pages, en un iframe y abierto desde WhatsApp) ---------- */
const TABS = ['inicio', 'avisos', 'agregar', 'perfil'];
// enlaces de versiones anteriores (Publicar, Cuaderno, Guardados) y de hojas compartidas (#/aviso/id, #/mascota/id, #/post/id)
const ALIAS = { publicar: 'agregar', cuaderno: 'avisos', guardados: 'perfil', cuenta: 'perfil' };
const SHEETS = { aviso: 'report', mascota: 'pet', post: 'post' };
const parse = (h = location.hash) => {
  const [path, qs = ''] = h.replace(/^#\/?/, '').split('?');
  const [raw, id] = path.split('/');
  const tab = ALIAS[raw] || raw;
  const query = Object.fromEntries(new URLSearchParams(qs));
  if (raw === 'publicar' && query.pet) query.aviso = query.pet;
  const open = SHEETS[raw] ? { kind: SHEETS[raw], id } : raw === 'cuenta' ? { kind: 'cuenta' } : null;
  return { tab: TABS.includes(tab) ? tab : 'inicio', open, query };
};
const route = ref(parse());
const go = (path) => {
  route.value = parse('#/' + path);
  try { history.replaceState(null, '', '#/' + path); } catch (e) {}
  window.scrollTo({ top: 0 });
};
addEventListener('hashchange', () => { route.value = parse(); if (route.value.open) openSheet(route.value.open.kind, route.value.open.id); else closeSheet(); });

/* ---------- estado de interfaz ---------- */
const ui = reactive({ sheet: null, toast: '', welcome: !state.user.welcomed });
let toastT;
const toast = msg => { ui.toast = msg; clearTimeout(toastT); toastT = setTimeout(() => (ui.toast = ''), 3200); };
window.HUELLAS.onError = toast;
const openSheet = (kind, id) => { ui.sheet = { kind, id }; document.body.style.overflow = 'hidden'; };
const closeSheet = () => { ui.sheet = null; document.body.style.overflow = ''; };
// botón "atrás" de Android (lo llama el APK): cierra la hoja abierta o vuelve a Inicio; false = salir
window.__patitasBack = () => {
  if (ui.welcome || gate.value) return false;
  if (ui.sheet) { closeSheet(); return true; }
  if (route.value.tab !== 'inicio') { go('inicio'); return true; }
  return false;
};
if (route.value.open) openSheet(route.value.open.kind, route.value.open.id);

/* guardados: solo en este teléfono (avisos, mascotas y publicaciones) */
if (!Array.isArray(state.user.saved)) state.user.saved = [];
const isSaved = (kind, id) => state.user.saved.includes(kind + ':' + id);
const toggleSave = (kind, id) => {
  const k = kind + ':' + id, i = state.user.saved.indexOf(k);
  if (i > -1) state.user.saved.splice(i, 1); else { state.user.saved.unshift(k); toast('Guardado en tu perfil'); }
};

/* ---------- cuenta o invitado ----------
   Sin cuenta se puede todo lo que ayuda a que una mascota vuelva a casa: mirar, buscar, abrir el mapa,
   escribir por WhatsApp, compartir, publicar avisos y comentar en avisos. Lo social y lo personal
   (publicar fotos, comentarlas, corazones, seguir, guardar, álbumes y perfil) pide cuenta. */
const gate = computed(() => !ui.welcome && status.ready && !status.user && !state.user.guest);
const askAccount = (why, start = 'crear') => openSheet('cuenta', { why, start, back: ui.sheet && ui.sheet.kind !== 'cuenta' ? { ...ui.sheet } : null });
const member = why => { if (status.user) return true; askAccount(why); return false; };
// al cerrar sesión vuelve la pantalla de entrada
watch(() => !!status.user, (now, before) => { if (before && !now) state.user.guest = false; });

/* ---------- Inicio: la red social del barrio ---------- */
const feed = reactive({ tab: 'todo', q: '', searching: false });
const HASHTAG = /(#[\p{L}\p{N}_]+)/u;
const tagsOf = text => (String(text || '').match(/#[\p{L}\p{N}_]+/gu) || []).map(t => t.toLowerCase());
// el texto de una publicación en trozos, para que cada #etiqueta sea un botón (sin v-html)
const pieces = text => String(text || '').split(HASHTAG).filter(Boolean).map(t => ({ t, tag: HASHTAG.test(t) }));
const searchTag = tag => { Object.assign(feed, { q: tag, searching: true, tab: 'todo' }); closeSheet(); go('inicio'); };
const petOf = post => (post && post.petId ? state.pets.find(p => p.id === post.petId) : null);
const petAvatar = post => { const pet = petOf(post); return (pet && pet.photo) || post.petPhoto || post.photo; };
// fotos del álbum de una mascota: sus publicaciones (la más nueva primero) y su foto de perfil
const albumOf = pet => {
  const shots = state.posts.filter(x => x.petId === pet.id).sort((a, b) => b.date - a.date).map(x => x.photo);
  return [...new Set(pet.photo ? [...shots, pet.photo] : shots)];
};
const me = {
  name: () => state.user.name || (status.user && status.user.name) || '',
  avatar: () => state.user.avatar || (status.user && status.user.avatar) || '',
};

/* patrocinios: los de config.js o, si no hay, espacios disponibles */
const CFG = window.HUELLAS_CONFIG || {};
const SPONSOR_SLOTS = [
  { kind: 'Veterinaria', name: 'Tu veterinaria aquí', text: 'Consultas, vacunas y emergencias para las mascotas del barrio.', icon: 'vet', slot: true },
  { kind: 'Alimento y accesorios', name: 'Tu tienda aquí', text: 'Alimento, arena, juguetes y envíos a domicilio.', icon: 'store', slot: true },
  { kind: 'Servicios', name: 'Tu negocio aquí', text: 'Peluquería, guardería, paseos o adiestramiento.', icon: 'spark', slot: true },
];
const SPONSORS = (CFG.sponsors && CFG.sponsors.length) ? CFG.sponsors : SPONSOR_SLOTS;
const sponsorHref = s => {
  if (s.slot) return CFG.adsWhatsApp ? `https://wa.me/${CFG.adsWhatsApp}?text=${encodeURIComponent(`Hola, quiero anunciar mi negocio en ${BRAND}`)}` : null;
  if (s.whatsapp) return `https://wa.me/${s.whatsapp}?text=${encodeURIComponent(`Hola, los vi en ${BRAND}`)}`;
  return s.url || null;
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
    return { route, ui, gate, closeSheet, finishWelcome };
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
      <s-post v-else-if="ui.sheet.kind==='post'" :id="ui.sheet.id" />
      <s-newpet v-else-if="ui.sheet.kind==='newpet'" />
      <s-cuenta v-else-if="ui.sheet.kind==='cuenta'" :opts="ui.sheet.id || {}" />
    </template>
    <welcome v-if="ui.welcome" @done="finishWelcome" />
    <v-gate v-else-if="gate" />
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
    const avatar = computed(me.avatar), initial = computed(() => me.name().charAt(0).toUpperCase());
    return { M, status, avatar, initial, go };
  },
  template: `
    <header class="top">
      <a href="#/inicio" class="brand" @click.prevent="go('inicio')" aria-label="${BRAND}, inicio">
        <span class="wordmark" aria-hidden="true">Cuatro pat<span class="wordmark__i">ı</span>tas</span>
      </a>
      <div class="top__end">
        <div class="place"><ico name="pin" /><div>Santa Cruz<small><span v-if="status.online" class="live"></span>{{ status.online ? 'en vivo' : 'este teléfono' }}</small></div></div>
        <button class="avatar-btn" @click="go('perfil')" aria-label="Mi perfil">
          <img v-if="avatar" :src="M(avatar)" alt=""><template v-else-if="initial">{{ initial }}</template><ico v-else name="user" />
        </button>
      </div>
    </header>`,
});
app.component('bottom-nav', {
  setup: () => ({ route, go, M, avatar: computed(me.avatar) }),
  template: `
    <nav class="nav" aria-label="Secciones">
      <a href="#/inicio" :class="{on:route.tab==='inicio'}" @click.prevent="go('inicio')"><ico name="home" />Inicio</a>
      <a href="#/avisos" :class="{on:route.tab==='avisos'}" @click.prevent="go('avisos')"><ico name="pin" />Avisos</a>
      <a href="#/agregar" class="plus" :class="{on:route.tab==='agregar'}" @click.prevent="go('agregar')"><span class="plus"><ico name="plus" /></span>Agregar</a>
      <a href="#/perfil" :class="{on:route.tab==='perfil'}" @click.prevent="go('perfil')"><img v-if="avatar" class="nav__me" :src="M(avatar)" alt=""><ico v-else name="user" />Perfil</a>
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

/* ===================== INICIO: la red social del barrio ===================== */
app.component('sponsor-row', {
  setup: () => ({ SPONSORS, sponsorHref, adClick: () => toast('Muy pronto podrás anunciar tu negocio aquí') }),
  template: `
    <section class="ads" aria-label="Patrocinado">
      <div class="ads__head"><span class="eyebrow">Patrocinado · Aliados del barrio</span></div>
      <div class="ads__row">
        <component v-for="s in SPONSORS" :key="s.name" :is="sponsorHref(s) ? 'a' : 'button'" class="ad" :class="{'ad--slot': s.slot}"
          v-bind="sponsorHref(s) ? { href: sponsorHref(s), target: '_blank', rel: 'noopener sponsored' } : { type: 'button' }"
          @click="!sponsorHref(s) && adClick()">
          <span class="ad__img"><img v-if="s.photo" :src="s.photo" alt=""><ico v-else :name="s.icon || 'store'" /></span>
          <span class="ad__kind">{{ s.kind }}</span>
          <strong>{{ s.name }}</strong>
          <span class="ad__text">{{ s.text }}</span>
          <span class="ad__cta">{{ s.slot ? 'Anunciar aquí' : (s.whatsapp ? 'Escribir' : 'Ver más') }}<ico name="arrow" /></span>
        </component>
      </div>
    </section>`,
});

app.component('v-inicio', {
  setup() {
    const followed = computed(() => state.user.followed || []);
    const posts = computed(() => {
      const q = feed.q.trim().toLowerCase();
      let list = state.posts.filter(p => !q || (q.startsWith('#')
        ? tagsOf(p.text).includes(q)
        : `${p.text} ${p.petName} ${p.author} ${p.zone}`.toLowerCase().includes(q)));
      if (feed.tab === 'siguiendo') list = list.filter(p => p.petId && followed.value.includes(p.petId));
      // "Para ti": lo que más gusta, lo reciente y lo de tu barrio primero
      const score = p => (p.likes + 1) / Math.pow((Date.now() - p.date) / 3600e3 + 2, 0.6) * (state.user.zone && p.zone === state.user.zone ? 1.5 : 1);
      return feed.tab === 'parati' ? list.sort((a, b) => score(b) - score(a)) : list.sort((a, b) => b.date - a.date);
    });
    // cuadrícula: cada seis fotos una grande, una vez a la izquierda y otra a la derecha; los patrocinios después de las primeras seis
    const tiles = computed(() => {
      const out = posts.value.map((p, i) => ({ key: p.id, p, cls: i % 6 ? '' : (Math.floor(i / 6) % 2 ? 'tile--big tile--r' : 'tile--big') }));
      if (out.length && !feed.q && feed.tab !== 'siguiendo') out.splice(Math.min(6, out.length), 0, { key: 'ads' });
      return out;
    });
    const lost = computed(() => state.reports.filter(r => r.type === 'perdido').sort((a, b) => b.date - a.date).slice(0, 12));
    const search = ref(null);
    const toggleSearch = () => {
      feed.searching = !feed.searching;
      if (feed.searching) nextTick(() => search.value && search.value.focus()); else feed.q = '';
    };
    const tabs = [['todo', 'Todo'], ['parati', 'Para ti'], ['siguiendo', 'Siguiendo']];
    return { feed, posts, tiles, lost, tabs, search, toggleSearch, go, M, openSheet, status, askAccount };
  },
  template: `
    <main class="view view--feed">
      <div class="feedbar">
        <div class="feedtabs" role="tablist" aria-label="Publicaciones">
          <button v-for="t in tabs" :key="t[0]" role="tab" :aria-selected="feed.tab===t[0]" :class="{on:feed.tab===t[0]}" @click="feed.tab=t[0]">{{ t[1] }}</button>
        </div>
        <button class="feedbar__search" :class="{on:feed.searching}" @click="toggleSearch" :aria-label="feed.searching ? 'Cerrar búsqueda' : 'Buscar'"><ico :name="feed.searching ? 'close' : 'search'" /></button>
      </div>
      <label v-if="feed.searching" class="search"><ico name="search" /><input ref="search" v-model="feed.q" placeholder="#etiqueta, mascota o barrio" aria-label="Buscar publicaciones"></label>

      <section v-if="lost.length && !feed.q" class="lostrow" aria-label="Se buscan en el barrio">
        <div class="lostrow__head"><span class="eyebrow">Se buscan en el barrio</span><a class="link" href="#/avisos" @click.prevent="go('avisos')">Ver avisos</a></div>
        <div class="lostrow__list">
          <button v-for="r in lost" :key="r.id" class="lost" @click="openSheet('report', r.id)"><span class="lost__ring"><media :item="r" /></span><span class="lost__name">{{ r.name }}</span></button>
        </div>
      </section>

      <div v-if="tiles.length" class="square">
        <template v-for="t in tiles" :key="t.key">
          <sponsor-row v-if="t.key==='ads'" class="square__ads" />
          <button v-else class="tile" :class="t.cls" @click="openSheet('post', t.p.id)" :aria-label="'Foto de ' + (t.p.petName || 'una mascota') + (t.p.author ? ', de ' + t.p.author : '')">
            <img :src="M(t.p.photo)" alt="" loading="lazy" decoding="async">
            <span v-if="t.p.likes" class="tile__likes"><ico name="heart" />{{ t.p.likes }}</span>
          </button>
        </template>
      </div>
      <div v-else class="empty">
        <img class="empty__wide" :src="M('assets/mascota-banner.webp')" alt="" width="320" height="223">
        <template v-if="feed.q"><h2>Nada con «{{ feed.q }}»</h2><p>Prueba con otra etiqueta o el nombre de un barrio.</p></template>
        <template v-else-if="feed.tab==='siguiendo' && !status.user"><h2>Sigue a tus mascotas favoritas</h2><p>Con una cuenta, las fotos de las mascotas que sigues aparecen aquí.</p><button class="btn" @click="askAccount('seguir mascotas')"><ico name="user" />Crear cuenta</button></template>
        <template v-else-if="feed.tab==='siguiendo'"><h2>Todavía no sigues a nadie</h2><p>Toca «Seguir» en el álbum de una mascota y sus fotos aparecerán aquí.</p><button class="btn" @click="feed.tab='todo'">Ver todas las fotos</button></template>
        <template v-else><h2>El barrio está tranquilo</h2><p>Comparte la primera foto de tu mascota.</p><button class="btn" @click="go('agregar?tipo=post')"><ico name="camera" />Agregar publicación</button></template>
      </div>
      <sponsor-row v-if="!tiles.length && !feed.q" />
      <p class="hand feed__end" v-if="posts.length">Las cosas pequeñas también cuentan.</p>
    </main>`,
});

/* ===================== AVISOS: cuaderno de avisos y mapa ===================== */
app.component('v-avisos', {
  name: 'v-avisos',
  setup() {
    const el = ref(null), sel = ref(null);
    const f = reactive({ type: 'todos', q: '', view: 'cuaderno' });
    const list = computed(() => state.reports
      .filter(r => f.type === 'todos' || r.type === f.type)
      .filter(r => !f.q || `${r.name} ${r.breed} ${r.zone} ${r.color}`.toLowerCase().includes(f.q.toLowerCase()))
      .sort((a, b) => b.date - a.date));
    const count = t => t === 'todos' ? state.reports.length : state.reports.filter(r => r.type === t).length;
    const selected = computed(() => state.reports.find(r => r.id === sel.value));
    let map, layer, ready = false;
    const draw = () => {
      if (!layer) return;
      layer.clearLayers();
      list.value.forEach(r => layer.addLayer(L.marker([r.lat, r.lng], { icon: pinIcon(r) }).on('click', () => { sel.value = r.id; })));
    };
    // el mapa se arma la primera vez que se abre su pestaña (Leaflet necesita ver el tamaño de la caja)
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
    watch(list, draw);
    watch(() => f.view, v => { if (v === 'mapa') nextTick(() => { init(); map && map.invalidateSize(); }); else sel.value = null; });
    onBeforeUnmount(() => map && map.remove());
    const filters = [['todos', 'Todos', '#3a2418'], ...Object.entries(TYPES).map(([k, t]) => [k, t.short, t.dot])];
    // al abrir el perfil completo se cierra la tarjetita del mapa
    const openFromPeek = () => { const id = sel.value; sel.value = null; openSheet('report', id); };
    const like = r => actions.toggleLike(r);
    return { el, f, list, count, sel, selected, filters, locate, openSheet, openFromPeek, like, member, isSaved, toggleSave, share, waLink, timeAgo, TYPES, BRAND, M };
  },
  template: `
    <main class="view">
      <header class="view-head view-head--art">
        <img class="view-head__art" :src="M('assets/head-avisos.webp')" alt="" width="108" height="118">
        <span class="badge"><span class="badge__ico"><ico name="pin" /></span>01 · EL BARRIO</span>
        <h1>Avisos del <span class="sketch">barrio.</span></h1>
        <p>Perdidos, vistos, encontrados y los que ya volvieron a casa en Santa Cruz.</p>
      </header>
      <div class="filters" role="tablist" aria-label="Categoría">
        <button v-for="x in filters" :key="x[0]" class="chip" :class="{on:f.type===x[0]}" @click="f.type=x[0]" role="tab" :aria-selected="f.type===x[0]"><i class="dot" :style="{'--c':x[2]}"></i>{{ x[1] }}<span class="chip__n">{{ count(x[0]) }}</span></button>
      </div>
      <label class="search"><ico name="search" /><input v-model="f.q" placeholder="Nombre, detalle o barrio" aria-label="Buscar avisos"></label>
      <div class="seg">
        <button :class="{on:f.view==='cuaderno'}" @click="f.view='cuaderno'" :aria-pressed="f.view==='cuaderno'"><ico name="book" />Cuaderno ({{ list.length }})</button>
        <button :class="{on:f.view==='mapa'}" @click="f.view='mapa'" :aria-pressed="f.view==='mapa'"><ico name="map" />Mapa</button>
      </div>

      <div v-show="f.view==='cuaderno'" class="notebook">
        <article v-for="r in list" :key="r.id" class="post">
          <div class="post__head">
            <span class="report__img"><media :item="r" /></span>
            <div><strong>{{ r.name }}</strong><small>{{ r.zone }} · {{ timeAgo(r.date) }}</small></div>
            <status-pill :type="r.type" />
          </div>
          <button class="post__photo" @click="openSheet('report', r.id)" :aria-label="'Abrir el aviso de ' + r.name"><media :item="r" /></button>
          <div class="post__bar">
            <button :class="{on:r.liked}" @click="member('dar corazón') && like(r)" :aria-pressed="r.liked" aria-label="Me gusta"><ico name="heart" />{{ r.likes }}</button>
            <button @click="openSheet('report', r.id)"><ico name="chat" />{{ r.comments.length ? r.comments.length : 'Comentar' }}</button>
            <a v-if="r.type!=='reunido' && r.contact" :href="waLink(r)" target="_blank" rel="noopener"><ico name="whatsapp" />Escribir</a>
            <button @click="share(r.name + ' en ' + BRAND, '#/aviso/' + r.id)" aria-label="Compartir"><ico name="share" /></button>
            <button :class="{on:isSaved('report', r.id)}" @click="member('guardar avisos') && toggleSave('report', r.id)" :aria-label="isSaved('report', r.id) ? 'Quitar de guardados' : 'Guardar'"><ico name="bookmark" /></button>
          </div>
          <p>{{ r.desc }}</p>
          <p v-if="r.reward && r.type==='perdido'" class="post__reward">Recompensa <b>{{ r.reward }}</b></p>
        </article>
        <div v-if="!list.length" class="empty"><h2>Nada por aquí</h2><p>No hay avisos con ese filtro.</p></div>
      </div>

      <div class="mapbox" v-show="f.view==='mapa'">
        <div class="map" ref="el"></div>
        <span class="map__tag">{{ f.type==='todos' ? 'SANTA CRUZ DE LA SIERRA' : TYPES[f.type].short.toUpperCase() + ' · ' + list.length }}</span>
        <button class="btn btn--light btn--sm map__me" @click="locate"><ico name="locate" />Cerca de mí</button>
        <button v-if="selected" class="peek" @click="openFromPeek">
          <span class="report__img"><media :item="selected" /></span>
          <div><status-pill :type="selected.type" /><strong>{{ selected.name }}</strong><p>{{ selected.zone }} · {{ timeAgo(selected.date) }}</p></div>
          <ico name="arrow" />
        </button>
      </div>
      <p v-show="f.view==='mapa'" class="map-note">Elige arriba qué ver: perdidos, vistos o todos. Toca un pin para abrir el aviso. Las ubicaciones son aproximadas por privacidad.</p>
    </main>`,
});

/* ===================== AGREGAR: aviso o publicación ===================== */
app.component('v-agregar', {
  setup() {
    const q = route.value.query;
    // ?tipo=aviso|post · ?aviso=<mascota> (avisar que se perdió) · ?post=<mascota> (foto para su álbum)
    const kind = ref(q.aviso || q.tipo === 'aviso' ? 'aviso' : q.post || q.tipo === 'post' ? 'post' : null);
    const choices = [
      ['aviso', 'megaphone', 'Aviso', 'Una mascota perdida o vista. Aparece en el mapa.'],
      ['post', 'camera', 'Publicación', 'Una foto de tu mascota para Inicio y su álbum.'],
    ];
    return { kind, choices, q, M, status, askAccount };
  },
  template: `
    <main class="view">
      <header class="view-head view-head--art">
        <img class="view-head__art view-head__art--wag" :src="M('assets/head-publicar.webp')" alt="" width="108" height="120">
        <span class="badge"><span class="badge__ico"><ico name="plus" /></span>02 · AGREGAR</span>
        <h1>¿Qué quieres <span class="sketch">compartir?</span></h1>
        <p>Un aviso para que el barrio ayude, o una foto para alegrar Inicio.</p>
      </header>
      <div class="choice" role="radiogroup" aria-label="Qué agregar">
        <button v-for="c in choices" :key="c[0]" type="button" role="radio" :aria-checked="kind===c[0]" :class="{on:kind===c[0]}" @click="kind=c[0]">
          <span class="choice__ico"><ico :name="c[1]" /></span><strong>{{ c[2] }}</strong><span class="choice__text">{{ c[3] }}</span>
          <span v-if="c[0]==='post' && !status.user" class="choice__lock"><ico name="lock" />Con cuenta</span>
        </button>
      </div>
      <f-aviso v-if="kind==='aviso'" :pet-id="q.aviso" />
      <f-post v-else-if="kind==='post' && status.user" :pet-id="q.post" />
      <div v-else-if="kind==='post'" class="locked">
        <span class="locked__ico"><ico name="lock" /></span>
        <h2>Las fotos son para vecinos con cuenta</h2>
        <p>Así cada foto de Inicio tiene a alguien detrás y queda en el álbum de su mascota. Crear la cuenta es gratis y toma un minuto.</p>
        <button class="btn btn--green btn--full" @click="askAccount('publicar fotos')">Crear cuenta</button>
        <button class="btn btn--light btn--full" @click="askAccount('publicar fotos', 'entrar')">Ya tengo cuenta</button>
        <button class="textlink" @click="kind='aviso'">Mejor publico un aviso</button>
      </div>
      <p v-else class="hand choice__hint">Elige una opción para empezar.</p>
    </main>`,
});

app.component('f-aviso', {
  props: ['petId'],
  setup(props) {
    const pick = ref(null), err = ref(''), sending = ref(false);
    const form = reactive({ type: 'perdido', species: 'perro', name: '', breed: '', color: '', zone: 'Centro', desc: '', reward: '', contact: '', photo: null, lat: CENTER[0], lng: CENTER[1] });
    if (props.petId) {
      const p = state.pets.find(x => x.id === props.petId);
      if (p) Object.assign(form, { name: p.name, species: p.species, breed: p.breed, zone: ZONES[p.zone] ? p.zone : 'Centro', desc: p.bio, photo: p.photo || null, petId: p.id });
      form.lat = ZONES[form.zone][0]; form.lng = ZONES[form.zone][1];
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
    return { pick, form, types, onFile, submit, err, sending, SPECIES, ZONES, statusStyle, M };
  },
  template: `
    <form class="form" @submit.prevent="submit" novalidate>
      <div class="field"><span>¿Qué pasó?</span>
        <div class="types">
          <button v-for="t in types" :key="t[0]" type="button" :class="{on:form.type===t[0]}" :style="statusStyle(t[0])" @click="form.type=t[0]"><ico :name="t[1]" />{{ t[2] }}</button>
        </div>
      </div>
      <label class="photo-drop">
        <img v-if="form.photo" :src="M(form.photo)" alt="Foto elegida">
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
      <button class="btn btn--green btn--full" :disabled="sending">{{ sending ? 'Publicando…' : 'Publicar aviso en el mapa' }}<ico name="arrow" /></button>
      <p class="hand" style="text-align:center">Gracias por mirar a tu alrededor.</p>
    </form>`,
});

app.component('f-post', {
  props: ['petId'],
  setup(props) {
    const err = ref(''), sending = ref(false);
    const mine = computed(() => state.pets.filter(p => p.mine));
    const first = props.petId && state.pets.some(p => p.id === props.petId) ? props.petId : (mine.value[0] ? mine.value[0].id : '');
    const form = reactive({ photo: null, petId: first, petName: '', text: '', author: me.name() });
    const needsName = !me.name();
    const onFile = async e => { const file = e.target.files[0]; if (file) form.photo = await readImage(file); };
    const submit = async () => {
      err.value = '';
      const pet = state.pets.find(p => p.id === form.petId);
      const petName = pet ? pet.name : form.petName.trim();
      if (!form.photo) return (err.value = 'Elige una foto.');
      if (!petName) return (err.value = 'Escribe cómo se llama tu mascota.');
      if (needsName && !form.author.trim()) return (err.value = 'Escribe tu nombre para que el barrio sepa quién publica.');
      if (needsName) state.user.name = form.author.trim();
      sending.value = true;
      try {
        const id = await actions.addPost({
          photo: form.photo, text: form.text.trim(), petId: pet ? pet.id : null, petName,
          petPhoto: (pet && pet.photo) || null, zone: (pet && pet.zone) || state.user.zone || '',
        });
        toast('Publicado en Inicio');
        Object.assign(feed, { tab: 'todo', q: '', searching: false });
        go('inicio'); setTimeout(() => openSheet('post', id), 400);
      } catch (e) { err.value = 'No se pudo publicar: ' + (e.message || 'revisa tu conexión'); }
      finally { sending.value = false; }
    };
    return { form, mine, needsName, onFile, submit, err, sending, M, SPECIES, openSheet };
  },
  template: `
    <form class="form" @submit.prevent="submit" novalidate>
      <label class="photo-drop photo-drop--square">
        <img v-if="form.photo" :src="form.photo" alt="Foto elegida">
        <template v-else><ico name="camera" /><strong>Elige una foto</strong><span>Se verá en Inicio y en el álbum de tu mascota</span></template>
        <input type="file" accept="image/*" @change="onFile" aria-label="Elegir foto">
      </label>
      <div class="field"><span>¿Quién sale en la foto?</span>
        <div class="petpick">
          <button v-for="p in mine" :key="p.id" type="button" class="chip" :class="{on:form.petId===p.id}" @click="form.petId=p.id">
            <span class="chip__av"><media :item="p" /></span>{{ p.name }}
          </button>
          <button type="button" class="chip" :class="{on:!form.petId}" @click="form.petId=''"><ico name="paw" />{{ mine.length ? 'Otra' : 'Escribir su nombre' }}</button>
        </div>
        <input v-if="!form.petId" class="input" v-model="form.petName" placeholder="Nombre de la mascota" aria-label="Nombre de la mascota">
        <small v-if="!mine.length">Agrega tus mascotas en tu <a href="#/perfil" class="textlink" @click.prevent="openSheet('newpet')">perfil</a> y cada foto quedará en su álbum.</small>
      </div>
      <div class="field"><label for="po-text">Cuéntanos algo</label><textarea id="po-text" class="input" v-model="form.text" maxlength="1000" placeholder="Paseo de domingo por el Parque Urbano #perros"></textarea><small>Usa #etiquetas para que otros encuentren tu foto.</small></div>
      <div class="field" v-if="needsName"><label for="po-author">Tu nombre</label><input id="po-author" class="input" v-model="form.author" autocomplete="name" placeholder="Así te verán en Inicio"></div>
      <p v-if="err" class="error" role="alert">{{ err }}</p>
      <button class="btn btn--green btn--full" :disabled="sending">{{ sending ? 'Publicando…' : 'Publicar en Inicio' }}<ico name="arrow" /></button>
    </form>`,
});

/* ===================== PERFIL: foto, álbumes de mis mascotas y guardados ===================== */
app.component('v-perfil', {
  setup() {
    const editing = ref(!me.name()), tab = ref('fotos');
    const name = computed(me.name), avatar = computed(me.avatar);
    const myPets = computed(() => state.pets.filter(p => p.mine));
    const myPosts = computed(() => state.posts.filter(p => p.mine).sort((a, b) => b.date - a.date));
    const myReports = computed(() => state.reports.filter(r => r.mine).sort((a, b) => b.date - a.date));
    const albums = computed(() => myPets.value.map(p => { const shots = albumOf(p); return { p, cover: shots[0], count: shots.length }; }));
    const following = computed(() => (state.user.followed || []).length);
    const saved = computed(() => state.user.saved.map(k => {
      const [kind, id] = k.split(':');
      const list = { report: state.reports, pet: state.pets, post: state.posts }[kind] || [];
      const item = list.find(x => x.id === id);
      return item ? { kind, id, item } : null;
    }).filter(Boolean));
    const onAvatar = async e => { const file = e.target.files[0]; if (file) { state.user.avatar = await readImage(file, 360); toast('Foto de perfil lista'); } };
    const tabs = [['fotos', 'Mis fotos'], ['guardados', 'Guardados'], ['avisos', 'Mis avisos']];
    const perks = [['camera', 'Publicar fotos de tu mascota en Inicio'], ['photos', 'Armar sus álbumes y poner tu foto de perfil'], ['heart', 'Dar corazón, comentar fotos y seguir mascotas'], ['bookmark', 'Guardar avisos y fotos'], ['user', 'Ver tus avisos desde cualquier teléfono']];
    return { state, status, editing, tab, tabs, name, avatar, myPets, myPosts, myReports, albums, following, saved, perks, onAvatar, ZONES, SPECIES, M, go, openSheet };
  },
  template: `
    <main class="view">
      <span class="badge"><span class="badge__ico"><ico name="user" /></span>03 · MI PERFIL</span>
      <template v-if="!status.user">
        <header class="me">
          <span class="me__avatar me__avatar--guest" aria-hidden="true"><ico name="user" /></span>
          <div class="me__id"><h1>Estás como invitado</h1><p class="meta">Puedes mirar el barrio, buscar y publicar avisos.</p></div>
        </header>
        <section class="perks">
          <span class="eyebrow">Con una cuenta también puedes</span>
          <ul><li v-for="x in perks" :key="x[1]"><span class="perks__ico"><ico :name="x[0]" /></span>{{ x[1] }}</li></ul>
          <button class="btn btn--green btn--full" @click="openSheet('cuenta', { start: 'crear' })">Crear cuenta gratis</button>
          <button class="btn btn--light btn--full" @click="openSheet('cuenta', { start: 'entrar' })">Ya tengo cuenta</button>
        </section>
        <div class="heading"><div><span class="eyebrow">En este teléfono</span><h2>Mis avisos</h2></div></div>
        <report-row v-for="r in myReports" :key="r.id" :r="r" />
        <div v-if="!myReports.length" class="empty"><h2>Sin avisos</h2><p>Si tu mascota se pierde, publícalo en Agregar y el barrio te ayuda a buscarla.</p><button class="btn" @click="go('agregar?tipo=aviso')"><ico name="megaphone" />Publicar un aviso</button></div>
      </template>
      <template v-else>
      <header class="me">
        <label class="me__avatar">
          <img v-if="avatar" :src="M(avatar)" alt="Tu foto de perfil">
          <span v-else-if="name" aria-hidden="true">{{ name.charAt(0).toUpperCase() }}</span>
          <ico v-else name="user" />
          <span class="me__cam" aria-hidden="true"><ico name="camera" /></span>
          <input type="file" accept="image/*" @change="onAvatar" aria-label="Cambiar foto de perfil">
        </label>
        <div class="me__id">
          <h1>{{ name || 'Tu perfil' }}</h1>
          <p class="meta">{{ state.user.zone || 'Santa Cruz de la Sierra' }}<template v-if="status.user"> · {{ status.user.email }}</template></p>
          <div class="me__stats"><span><b>{{ myPosts.length }}</b> fotos</span><span><b>{{ myPets.length }}</b> mascotas</span><span><b>{{ following }}</b> siguiendo</span></div>
        </div>
      </header>
      <div class="me__actions">
        <button class="btn btn--light btn--sm" @click="editing=!editing" :aria-expanded="editing"><ico name="edit" />Editar perfil</button>
        <button class="btn btn--light btn--sm" @click="openSheet('cuenta')"><ico name="user" />{{ status.user ? 'Mi cuenta' : 'Entrar o crear cuenta' }}</button>
      </div>
      <form v-if="editing" class="form me__edit" @submit.prevent="editing=false">
        <div class="grid2">
          <div class="field"><label for="me-name">Tu nombre</label><input id="me-name" class="input" v-model.trim="state.user.name" autocomplete="name" placeholder="Ej. Valeria"></div>
          <div class="field"><label for="me-zone">Tu barrio</label><select id="me-zone" class="input" v-model="state.user.zone"><option value="">Elegir</option><option v-for="(_,z) in ZONES" :key="z">{{ z }}</option></select></div>
        </div>
        <button class="btn btn--sm">Listo</button>
      </form>

      <div class="heading"><div><span class="eyebrow">Sus pequeños días</span><h2>Álbumes de mis mascotas</h2></div></div>
      <div class="albums">
        <button v-for="a in albums" :key="a.p.id" class="album" @click="openSheet('pet', a.p.id)">
          <span class="album__cover"><img v-if="a.cover" :src="M(a.cover)" alt="" loading="lazy"><span v-else class="blank"><ico :name="SPECIES[a.p.species] || 'paw'" /></span></span>
          <strong>{{ a.p.name }}</strong><small>{{ a.count }} {{ a.count === 1 ? 'foto' : 'fotos' }}<template v-if="a.p.lost"> · perdida</template></small>
        </button>
        <button class="album album--add" @click="openSheet('newpet')">
          <span class="album__cover"><img v-if="!albums.length" :src="M('assets/head-cuaderno.webp')" alt="" class="album__art"><ico v-else name="plus" /></span>
          <strong>Agregar mascota</strong><small>{{ albums.length ? 'Otro álbum' : 'Crea su primer álbum' }}</small>
        </button>
      </div>

      <div class="tabs" role="tablist" aria-label="Mi contenido">
        <button v-for="t in tabs" :key="t[0]" role="tab" :aria-selected="tab===t[0]" :class="{on:tab===t[0]}" @click="tab=t[0]">{{ t[1] }}</button>
      </div>
      <template v-if="tab==='fotos'">
        <div v-if="myPosts.length" class="minigrid">
          <button v-for="x in myPosts" :key="x.id" @click="openSheet('post', x.id)" :aria-label="'Foto de ' + x.petName"><img :src="M(x.photo)" alt="" loading="lazy"></button>
        </div>
        <div v-else class="empty"><h2>Todavía no publicaste fotos</h2><p>Tus publicaciones aparecen en Inicio y en el álbum de tu mascota.</p><button class="btn" @click="go('agregar?tipo=post')"><ico name="camera" />Agregar publicación</button></div>
      </template>
      <template v-else-if="tab==='guardados'">
        <div v-if="saved.length">
          <template v-for="x in saved" :key="x.kind + x.id">
            <report-row v-if="x.kind==='report'" :r="x.item" />
            <button v-else class="report" @click="openSheet(x.kind, x.id)">
              <span class="report__img"><img v-if="x.kind==='post'" :src="M(x.item.photo)" alt=""><media v-else :item="x.item" /></span>
              <div><span class="eyebrow">{{ x.kind === 'post' ? 'Publicación' : 'Mascota' }}</span><strong>{{ x.kind === 'post' ? x.item.petName : x.item.name }}</strong><p>{{ x.kind === 'post' ? (x.item.author || 'Un vecino') : x.item.breed + ' · ' + x.item.zone }}</p></div>
              <ico name="arrow" />
            </button>
          </template>
        </div>
        <div v-else class="empty">
          <img class="empty__art" :src="M('assets/head-guardados.webp')" alt="" width="170" height="180">
          <h2>Todavía no guardaste nada</h2>
          <p>Toca el marcador en un aviso o en una foto para volver a encontrarlo aquí.</p>
        </div>
      </template>
      <template v-else>
        <report-row v-for="r in myReports" :key="r.id" :r="r" />
        <div v-if="!myReports.length" class="empty"><h2>Sin avisos</h2><p>Si tu mascota se pierde, publícalo en Agregar y el barrio te ayuda a buscarla.</p><button class="btn" @click="go('agregar?tipo=aviso')"><ico name="megaphone" />Publicar un aviso</button></div>
      </template>
      </template>
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
    return { r, m, comment, send, reunite, remove, confirmDel, onMap, closeSheet, canEdit, member, isSaved, toggleSave, share, waLink, timeAgo, TYPES, M, BRAND, openSheet, like: x => actions.toggleLike(x) };
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
            <button class="iconbtn" :class="{on:r.liked}" @click="member('dar corazón') && like(r)" :aria-pressed="r.liked"><ico name="heart" />{{ r.likes }}</button>
            <button class="iconbtn" :class="{on:isSaved('report', r.id)}" @click="member('guardar avisos') && toggleSave('report', r.id)" aria-label="Guardar"><ico name="bookmark" /></button>
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

/* ===================== HOJA: MASCOTA (su álbum) ===================== */
app.component('s-pet', {
  props: ['id'],
  setup(props) {
    const p = computed(() => state.pets.find(x => x.id === props.id));
    const posts = computed(() => state.posts.filter(x => x.petId === props.id).sort((a, b) => b.date - a.date));
    const following = computed(() => (state.user.followed || []).includes(props.id));
    const follow = () => actions.toggleFollow(p.value);
    const reportLost = () => { closeSheet(); go('agregar?aviso=' + props.id); };
    const addPhoto = () => { closeSheet(); go('agregar?post=' + props.id); };
    return { p, posts, following, follow, reportLost, addPhoto, closeSheet, canEdit, member, isSaved, toggleSave, share, openSheet, M, BRAND, accentOf };
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
          <div class="traits" v-if="p.traits && p.traits.length"><span v-for="t in p.traits" :key="t">{{ t }}</span></div>
          <div class="actions">
            <button v-if="!p.mine" class="btn btn--sm" :class="following ? 'btn--light' : ''" @click="member('seguir mascotas') && follow()"><ico :name="following ? 'check' : 'heart'" />{{ following ? 'Siguiendo' : 'Seguir' }} · {{ p.followers }}</button>
            <button v-else class="btn btn--sm" @click="addPhoto"><ico name="camera" />Agregar foto</button>
            <button class="iconbtn" :class="{on:isSaved('pet', p.id)}" @click="member('guardar mascotas') && toggleSave('pet', p.id)" aria-label="Guardar"><ico name="bookmark" /></button>
            <button class="iconbtn" @click="share(p.name + ' en ' + BRAND, '#/mascota/' + p.id)" aria-label="Compartir"><ico name="share" /></button>
            <button v-if="!p.lost && canEdit(p)" class="iconbtn" @click="reportLost"><ico name="megaphone" />Avisar que se perdió</button>
          </div>
          <div class="heading"><div><span class="eyebrow">Álbum</span><h2 style="font-size:21px">Los días de {{ p.name }}</h2></div><span class="meta">{{ posts.length }} {{ posts.length === 1 ? 'foto' : 'fotos' }}</span></div>
          <div v-if="posts.length" class="minigrid">
            <button v-for="x in posts" :key="x.id" @click="openSheet('post', x.id)" :aria-label="'Foto de ' + p.name"><img :src="M(x.photo)" alt="" loading="lazy"></button>
          </div>
          <p v-else class="meta">{{ p.mine ? 'Agrega su primera foto y aparecerá aquí y en Inicio.' : 'Todavía no hay fotos en su álbum.' }}</p>
        </div>
      </template>
    </section>`,
});

/* ===================== HOJA: PUBLICACIÓN ===================== */
app.component('s-post', {
  props: ['id'],
  setup(props) {
    const p = computed(() => state.posts.find(x => x.id === props.id));
    const pet = computed(() => petOf(p.value));
    const comment = ref(''), confirmDel = ref(false), box = ref(null);
    const like = () => actions.likePost(p.value);
    const send = async () => {
      const text = comment.value.trim(); if (!text) return;
      try { await actions.commentPost(p.value, text); comment.value = ''; } catch (e) { toast('No se pudo enviar: ' + e.message); }
    };
    const remove = async () => {
      if (!confirmDel.value) { confirmDel.value = true; return; }
      try { await actions.removePost(props.id); closeSheet(); toast('Publicación borrada'); } catch (e) { toast(e.message); }
    };
    const openPet = () => pet.value && openSheet('pet', pet.value.id);
    return { p, pet, comment, confirmDel, box, like, send, remove, openPet, pieces, searchTag, petAvatar, closeSheet, member, askAccount, status, isSaved, toggleSave, share, timeAgo, M, BRAND, focus: () => member('comentar fotos') && box.value && box.value.focus() };
  },
  template: `
    <section class="sheet" role="dialog" aria-modal="true" :aria-label="p ? 'Foto de ' + (p.petName || 'una mascota') : 'Publicación'">
      <div class="sheet__grab"><i></i></div>
      <button class="sheet__x" @click="closeSheet" aria-label="Cerrar"><ico name="close" /></button>
      <template v-if="p">
        <component :is="pet ? 'button' : 'div'" class="postsheet__pet" @click="openPet">
          <span class="report__img"><img :src="M(petAvatar(p))" alt=""></span>
          <span><strong>{{ p.petName || 'Una mascota del barrio' }}</strong><small v-if="pet">Ver su álbum</small></span>
        </component>
        <img class="postsheet__photo" :src="M(p.photo)" :alt="'Foto de ' + (p.petName || 'una mascota')">
        <div class="sheet__body">
          <div class="postsheet__row">
            <div class="postsheet__who">
              <b>{{ p.author || 'Un vecino' }}</b>
              <span class="meta">{{ timeAgo(p.date) }}<template v-if="p.zone"> · {{ p.zone }}</template></span>
              <span class="meta"><ico name="heart" />{{ p.likes }}</span>
            </div>
            <div class="postsheet__btns">
              <button class="roundbtn" :class="{on:p.liked}" @click="member('dar corazón') && like()" :aria-pressed="p.liked" aria-label="Me gusta"><ico name="heart" /></button>
              <button class="roundbtn" @click="focus" aria-label="Comentar"><ico name="chat" /></button>
              <button class="roundbtn" :class="{on:isSaved('post', p.id)}" @click="member('guardar fotos') && toggleSave('post', p.id)" :aria-label="isSaved('post', p.id) ? 'Quitar de guardados' : 'Guardar'"><ico name="bookmark" /></button>
              <button class="roundbtn" @click="share((p.petName || 'Una foto') + ' en ' + BRAND, '#/post/' + p.id)" aria-label="Compartir"><ico name="share" /></button>
            </div>
          </div>
          <p class="caption" v-if="p.text"><b>{{ p.author || 'Un vecino' }}</b>&nbsp;<template v-for="(s,i) in pieces(p.text)" :key="i"><button v-if="s.tag" class="tag" @click="searchTag(s.t)">{{ s.t }}</button><template v-else>{{ s.t }}</template></template></p>
          <button v-if="p.mine" class="textlink postsheet__del" @click="remove"><ico name="trash" />{{ confirmDel ? '¿Seguro? Toca otra vez para borrar' : 'Borrar publicación' }}</button>
          <div class="comments">
            <h3>Comentarios</h3>
            <div v-for="(c,i) in p.comments" :key="c.id || i" class="comment"><b v-if="c.author" style="display:block;font-size:11.5px">{{ c.author }}</b>{{ c.text }} <span class="meta">· {{ timeAgo(c.date) }}</span></div>
            <p v-if="!p.comments.length" class="meta">Sé el primero en comentar.</p>
            <button v-if="!status.user" class="btn btn--light btn--full comment-lock" @click="askAccount('comentar fotos')"><ico name="lock" />Entra o crea tu cuenta para comentar</button>
            <form v-else class="comment-form" @submit.prevent="send"><input ref="box" class="input" v-model="comment" maxlength="500" placeholder="Escribe algo bonito" aria-label="Comentario"><button class="btn btn--sm" aria-label="Enviar"><ico name="arrow" /></button></form>
          </div>
        </div>
      </template>
      <div v-else class="sheet__body"><div class="empty"><h2>Esta publicación ya no está</h2></div></div>
    </section>`,
});

/* ===================== HOJA: NUEVA MASCOTA (crea su álbum) ===================== */
app.component('s-newpet', {
  setup() {
    const err = ref(''), sending = ref(false);
    const form = reactive({ photo: null, name: '', species: 'perro', breed: '', age: '', zone: ZONES[state.user.zone] ? state.user.zone : 'Centro', bio: '' });
    const onFile = async e => { const file = e.target.files[0]; if (file) form.photo = await readImage(file); };
    const submit = async () => {
      err.value = '';
      if (!form.name.trim()) return (err.value = 'Escribe cómo se llama.');
      sending.value = true;
      try {
        const id = await actions.addPet({ ...form, name: form.name.trim(), owner: me.name(), traits: [], accent: ACCENTS[Math.floor(Math.random() * ACCENTS.length)] });
        toast('Álbum de ' + form.name.trim() + ' creado');
        openSheet('pet', id);
      } catch (e) { err.value = 'No se pudo guardar: ' + (e.message || 'revisa tu conexión'); }
      finally { sending.value = false; }
    };
    return { form, err, sending, onFile, submit, closeSheet, SPECIES, ZONES };
  },
  template: `
    <section class="sheet" role="dialog" aria-modal="true" aria-label="Agregar mascota">
      <div class="sheet__grab"><i></i></div>
      <button class="sheet__x" @click="closeSheet" aria-label="Cerrar"><ico name="close" /></button>
      <div class="sheet__body">
        <span class="badge" style="margin-top:8px"><span class="badge__ico"><ico name="paw" /></span>NUEVO ÁLBUM</span>
        <h2 style="font-size:26px;margin:14px 0 4px">Presenta a tu mascota.</h2>
        <p class="meta">Tendrá su propio álbum y el barrio podrá seguirla.</p>
        <form class="form" @submit.prevent="submit" novalidate>
          <label class="photo-drop">
            <img v-if="form.photo" :src="form.photo" alt="Foto elegida">
            <template v-else><ico name="camera" /><strong>Su foto de perfil</strong><span>Una donde se le vea bien la carita</span></template>
            <input type="file" accept="image/*" @change="onFile" aria-label="Elegir foto">
          </label>
          <div class="field"><label for="np-name">Nombre</label><input id="np-name" class="input" v-model="form.name" placeholder="Ej. Canela"></div>
          <div class="field"><span>Especie</span>
            <div class="species"><button v-for="(icon,k) in SPECIES" :key="k" type="button" class="chip" :class="{on:form.species===k}" @click="form.species=k"><ico :name="icon" />{{ k }}</button></div>
          </div>
          <div class="grid2">
            <div class="field"><label for="np-breed">Raza</label><input id="np-breed" class="input" v-model="form.breed" placeholder="Mestizo"></div>
            <div class="field"><label for="np-age">Edad</label><input id="np-age" class="input" v-model="form.age" placeholder="2 años"></div>
          </div>
          <div class="field"><label for="np-zone">Barrio</label><select id="np-zone" class="input" v-model="form.zone"><option v-for="(_,z) in ZONES" :key="z">{{ z }}</option></select></div>
          <div class="field"><label for="np-bio">Cuéntanos de su carácter</label><textarea id="np-bio" class="input" v-model="form.bio" placeholder="Dormilona, glotona y experta en pedir comida"></textarea></div>
          <p v-if="err" class="error" role="alert">{{ err }}</p>
          <button class="btn btn--green btn--full" :disabled="sending">{{ sending ? 'Guardando…' : 'Crear su álbum' }}<ico name="arrow" /></button>
        </form>
      </div>
    </section>`,
});

/* ===================== FORMULARIO DE CUENTA (pantalla de entrada y hoja de cuenta) ===================== */
app.component('auth-form', {
  props: { start: { type: String, default: 'entrar' } },
  setup(props) {
    const mode = ref(props.start === 'crear' ? 'crear' : 'entrar'); // crear | entrar | olvido
    const f = reactive({ name: state.user.name || '', email: '', password: '' });
    const show = ref(false), msg = ref(''), ok = ref('');
    const offline = computed(() => !status.online && !status.connecting);
    watch(mode, () => { msg.value = ''; ok.value = ''; });
    const submit = async () => {
      msg.value = ''; ok.value = '';
      try {
        if (mode.value === 'crear') {
          if (f.name.trim().length < 2 || !/^\S+@\S+\.\S{2,}$/.test(f.email) || f.password.length < 6) return (msg.value = 'Escribe tu nombre, un correo válido y una contraseña de 6 caracteres o más.');
          const r = await auth.signUp(f); if (r.pending) ok.value = 'Te enviamos un enlace a tu correo para activar la cuenta. Mientras tanto puedes seguir como invitado.'; else toast('Cuenta creada. Ya eres parte del barrio');
        } else if (mode.value === 'entrar') { await auth.signIn(f); toast('Qué bueno verte de nuevo'); }
        else { await auth.resetPassword(f.email); ok.value = 'Si ese correo tiene cuenta, te llegará un enlace.'; }
        f.password = '';
      } catch (e) { msg.value = e.message; }
    };
    const label = computed(() => offline.value ? 'Sin conexión' : status.authBusy ? 'Un momento…' : status.connecting ? 'Conectando…' : ({ crear: 'Crear cuenta', entrar: 'Entrar', olvido: 'Enviar enlace' })[mode.value]);
    return { mode, f, show, msg, ok, offline, label, submit, status };
  },
  template: `
    <form class="eauth" @submit.prevent="submit" novalidate>
      <div v-if="mode!=='olvido'" class="eauth__tabs" role="tablist" aria-label="Cuenta">
        <button type="button" role="tab" :aria-selected="mode==='entrar'" :class="{on:mode==='entrar'}" @click="mode='entrar'">Entrar</button>
        <button type="button" role="tab" :aria-selected="mode==='crear'" :class="{on:mode==='crear'}" @click="mode='crear'">Crear cuenta</button>
      </div>
      <p v-else class="meta">Escribe tu correo y te mandamos un enlace para elegir una contraseña nueva.</p>
      <p v-if="offline" class="eauth__offline" role="status">Sin conexión con la comunidad. Por ahora puedes seguir como invitado y entrar cuando vuelva internet.</p>
      <input v-if="mode==='crear'" class="input" v-model="f.name" autocomplete="name" placeholder="Tu nombre" aria-label="Tu nombre">
      <input class="input" v-model="f.email" type="email" inputmode="email" autocomplete="email" placeholder="tucorreo@gmail.com" aria-label="Correo">
      <div class="eauth__pass" v-if="mode!=='olvido'">
        <input class="input" v-model="f.password" :type="show ? 'text' : 'password'" :autocomplete="mode==='entrar' ? 'current-password' : 'new-password'" placeholder="Contraseña" aria-label="Contraseña">
        <button type="button" class="eauth__eye" @click="show=!show" :aria-label="show ? 'Ocultar contraseña' : 'Mostrar contraseña'"><ico :name="show ? 'eyeOff' : 'eye'" /></button>
      </div>
      <p v-if="msg" class="error" role="alert">{{ msg }}</p>
      <p v-if="ok" class="ok" role="status">{{ ok }}</p>
      <button class="btn btn--green btn--full" :disabled="status.authBusy || status.connecting || offline">{{ label }}</button>
      <button v-if="mode==='entrar'" type="button" class="textlink" @click="mode='olvido'">¿Olvidaste tu contraseña?</button>
      <button v-if="mode==='olvido'" type="button" class="textlink" @click="mode='entrar'">Volver</button>
    </form>`,
});

/* ===================== PANTALLA DE ENTRADA: cuenta o invitado ===================== */
app.component('v-gate', {
  setup() {
    const asGuest = () => { state.user.guest = true; toast('Entraste como invitado'); };
    return { asGuest, M };
  },
  template: `
    <div class="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div class="gate__poster">
        <p class="wordmark gate__brand" aria-hidden="true">Cuatro pat<span class="wordmark__i">ı</span>tas</p>
        <img :src="M('assets/mascota.webp')" alt="Una gata calicó y un perro blanco con sombreros de paja" width="480" height="364">
      </div>
      <section class="gate__card">
        <span class="jp-tag">入口 · LA ENTRADA</span>
        <h1 id="gate-title">Entra al barrio.</h1>
        <p class="meta">Con tu cuenta publicas fotos de tu mascota, armas sus álbumes y llevas tus avisos a cualquier teléfono.</p>
        <auth-form start="entrar" />
        <div class="gate__or"><span>o</span></div>
        <button class="btn btn--light btn--full" @click="asGuest">Continuar como invitado<ico name="arrow" /></button>
        <ul class="gate__guest" aria-label="Qué puedes hacer como invitado">
          <li class="yes"><ico name="check" />Mirar fotos, avisos y el mapa</li>
          <li class="yes"><ico name="check" />Publicar y comentar avisos, escribir por WhatsApp</li>
          <li class="no"><ico name="lock" />Publicar o comentar fotos, dar corazón, seguir, guardar y tener perfil</li>
        </ul>
      </section>
    </div>`,
});

/* ===================== HOJA: CUENTA ===================== */
app.component('s-cuenta', {
  // opts: { why: 'publicar fotos', start: 'crear' | 'entrar', back: hoja a la que volver al entrar }
  props: { opts: { type: Object, default: () => ({}) } },
  setup(props) {
    const mine = computed(() => state.reports.filter(r => r.mine));
    // al entrar desde un candado se vuelve a lo que la persona estaba mirando
    watch(() => status.user, u => { if (u && props.opts.back) openSheet(props.opts.back.kind, props.opts.back.id); });
    const again = () => { closeSheet(); ui.welcome = true; };
    return { status, auth, mine, closeSheet, again };
  },
  template: `
    <section class="sheet" role="dialog" aria-modal="true" aria-label="Mi cuenta">
      <div class="sheet__grab"><i></i></div>
      <button class="sheet__x" @click="closeSheet" aria-label="Cerrar"><ico name="close" /></button>
      <div class="sheet__body">
        <span class="badge" style="margin-top:8px"><span class="badge__ico"><ico name="user" /></span>04 · MI CUENTA</span>
        <template v-if="status.user">
          <h2 style="font-size:28px;margin:14px 0 2px">Hola, {{ status.user.name }}.</h2>
          <p class="meta">{{ status.user.email }}</p>
          <div class="heading"><h2 style="font-size:20px">Mis avisos</h2></div>
          <report-row v-for="r in mine" :key="r.id" :r="r" />
          <p v-if="!mine.length" class="meta">Todavía no publicaste avisos.</p>
          <button class="btn btn--light btn--full" style="margin-top:18px" :disabled="status.authBusy" @click="auth.logout()"><ico name="logout" />Cerrar sesión</button>
        </template>
        <template v-else>
          <div v-if="opts.why" class="needs"><ico name="lock" /><p>Para <b>{{ opts.why }}</b> necesitas una cuenta. Es gratis y toma un minuto.</p></div>
          <h2 style="font-size:26px;margin:14px 0 6px">Únete al barrio.</h2>
          <p class="meta">Como invitado puedes mirar, buscar y publicar avisos. Con una cuenta también publicas fotos, comentas, sigues mascotas y guardas lo que te gusta.</p>
          <auth-form :start="opts.start || 'crear'" />
          <button v-if="opts.why" class="textlink" style="display:block;margin:4px auto 0" @click="closeSheet">Ahora no</button>
        </template>

        <hr class="rule">
        <span class="eyebrow">Sobre 4 Patitas</span>
        <div class="faq">
          <details><summary>¿Es gratis?</summary><p>Sí. Ver el mapa, publicar avisos y compartir fotos de tu mascota es gratis.</p></details>
          <details><summary>¿Qué puedo hacer sin cuenta?</summary><p>Mirar las fotos, los avisos y el mapa, escribir por WhatsApp, compartir, publicar avisos y comentar en ellos. Para publicar o comentar fotos, dar corazón, seguir mascotas, guardar y tener perfil con álbumes necesitas una cuenta.</p></details>
          <details><summary>¿Qué hago si encuentro una mascota?</summary><p>Toca Agregar, elige Aviso y luego "Lo encontré". Marca el lugar en el mapa y sube una foto. Si coincide con un aviso, te lo mostramos. No necesitas cuenta.</p></details>
          <details><summary>¿Mi WhatsApp es público?</summary><p>Solo aparece un botón para escribirte en los avisos que tú publicas. Puedes borrarlos cuando quieras.</p></details>
          <details><summary>¿Dónde funciona?</summary><p>En Santa Cruz de la Sierra y alrededores: Urubó, Warnes y La Guardia.</p></details>
        </div>
        <button class="textlink" style="margin-top:12px" @click="again">Ver la bienvenida otra vez</button>
      </div>
    </section>`,
});

app.mount('#app');
