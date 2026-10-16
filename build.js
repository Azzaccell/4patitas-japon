// Genera index.html: la app completa en UN solo archivo (CSS, JS, ilustraciones y fotos incrustadas).
// Uso: node build.js   ·   Desarrollo: node server.js → http://localhost:5220/dev.html
const fs = require('fs'), path = require('path');
const r = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
const MIME = { '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const uri = p => `data:${MIME[path.extname(p)]};base64,` + fs.readFileSync(path.join(__dirname, p)).toString('base64');

// solo los archivos que usa la app (mapa-ilustrado.svg y los originales quedan fuera)
const walk = d => fs.readdirSync(path.join(__dirname, d), { withFileTypes: true })
  .flatMap(e => e.isDirectory() ? walk(d + '/' + e.name) : [d + '/' + e.name]);
const files = walk('assets').filter(p => MIME[path.extname(p)] && !p.endsWith('mapa-ilustrado.svg'));
const media = Object.fromEntries(files.map(p => [p, uri(p)]));

const dev = r('dev.html');
const head = dev.slice(dev.indexOf('<meta charset'), dev.indexOf('<link rel="icon"')).trim();
// el bundle de Supabase busca un <script src> para calcular su ruta; aquí todo va en línea
const fix = s => s.replace('if(!e)throw new Error("Automatic publicPath is not supported in this browser")', 'if(!e)e=location.href');
const js = f => `<script>\n${fix(r(f)).replace(/<\/script/gi, '<\\/script')}\n</script>`;

const html = `<!doctype html>
<html lang="es">
<head>
${head}
<link rel="icon" type="image/png" href="${media['assets/icono.png']}">
<link rel="apple-touch-icon" href="${media['assets/icono.png']}">
<style>
${r('vendor/leaflet.min.css')}
${r('src/css/app.css')}
</style>
</head>
<body>
<div id="app"></div>
<script>window.HUELLAS_MEDIA = ${JSON.stringify(media)};</script>
${['vendor/vue.global.prod.min.js', 'vendor/leaflet.min.js', 'vendor/supabase.min.js', 'src/js/config.js', 'src/js/data.js', 'src/js/api.js', 'src/js/app.js'].map(js).join('\n')}
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('index.html', (Buffer.byteLength(html) / 1024).toFixed(0) + ' KB ·', files.length, 'imágenes incrustadas');
