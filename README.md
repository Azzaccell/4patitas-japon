# 4 Patitas · Japón

Variante de **4 Patitas** con estilo editorial japonés (tinta, lápiz y tono pastel), pensada para **celular**.
Mascotas perdidas, vistas y encontradas en Santa Cruz de la Sierra, más un cuaderno de barrio.

**En vivo:** https://azzaccell.github.io/4patitas-japon/

- `index.html`: la app completa en **un solo archivo**, con estilos, código, ilustraciones y fotos incrustadas. Se puede mandar por WhatsApp o abrir sin servidor.
- **Mapa:** usa las teselas de Esri. Si no cargan, pasa a OpenStreetMap. Sin internet, dibuja Santa Cruz con anillos, radiales y el río Piraí.
- **Base de datos:** usa la misma de Supabase que 4 Patitas (avisos, mascotas y comentarios en vivo). La cuenta es por correo.

## Desarrollo

```bash
node server.js     # http://localhost:5220/dev.html  (archivos separados)
node build.js      # regenera index.html
```

| Carpeta | Contenido |
|---|---|
| `src/js` | `config.js` (Supabase), `data.js` (datos y estado), `api.js` (base de datos), `app.js` (pantallas Vue) |
| `src/css/app.css` | Estilo móvil: sellos hanko, globos, subrayados a mano |
| `assets/` | Ilustraciones y fotos en WebP |
| `vendor/` | Vue 3, Leaflet 1.9, supabase-js 2 |

Para cambiar el título por el lettering hecho a mano, guárdalo como `assets/titulo.webp`. La barra superior lo usa automáticamente; si no existe, muestra el logo.
