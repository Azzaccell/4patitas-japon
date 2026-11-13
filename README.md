# 4 Patitas · Japón

Variante de **4 Patitas** con estilo editorial japonés (tinta, lápiz y tono pastel), pensada para **celular**.
Mascotas perdidas, vistas y encontradas en Santa Cruz de la Sierra, más una red social del barrio para compartir fotos.

| Pestaña | Qué hay |
|---|---|
| **Inicio** | Cuadrícula de fotos de las mascotas del barrio (Todo · Para ti · Siguiendo), búsqueda por #etiquetas, las mascotas que se buscan y un espacio de patrocinios |
| **Avisos** | Cuaderno de avisos con sus categorías (perdidos, vistos, encontrados, en casa) y una pestaña de mapa con la categoría elegida |
| **Agregar** | Elige entre **Aviso** (mascota perdida o vista, va al mapa) o **Publicación** (foto para Inicio y el álbum de tu mascota) |
| **Perfil** | Tu foto, los álbumes de tus mascotas, tus fotos, tus guardados y tus avisos |

Al abrir la app hay una **pantalla de entrada**: entrar o crear cuenta con correo, o **continuar como invitado**.
El invitado puede todo lo que ayuda a que una mascota vuelva a casa (mirar fotos, avisos y mapa, buscar,
escribir por WhatsApp, compartir, publicar avisos y comentar en ellos). Publicar o comentar fotos, dar corazón,
seguir, guardar y tener perfil con álbumes piden cuenta.

**En vivo:** https://azzaccell.github.io/4patitas-japon/

- `index.html`: la app completa en **un solo archivo**, con estilos, código, ilustraciones y fotos incrustadas. Se puede mandar por WhatsApp o abrir sin servidor.
- **Mapa:** usa las teselas de Esri. Si no cargan, pasa a OpenStreetMap. Sin internet, dibuja Santa Cruz con anillos, radiales y el río Piraí.
- **Base de datos:** usa la misma de Supabase que 4 Patitas (avisos, mascotas y comentarios en vivo). La cuenta es por correo.
- **Publicaciones de Inicio:** necesitan las tablas de `supabase/publicaciones.sql` (correrlo una vez en Supabase → SQL Editor). Mientras no existan, cada teléfono guarda sus publicaciones solo para sí. Esas tablas solo aceptan fotos, comentarios y corazones de personas con cuenta.
- **Seguridad:** ver [`SEGURIDAD.md`](SEGURIDAD.md). Después de `publicaciones.sql`, correr `supabase/seguridad.sql` (denuncias, límites contra spam y borrado de cuenta). `supabase/revisar-seguridad.sql` solo lee y muestra cómo están protegidas las tablas. La página pública de privacidad es `privacidad.html`. El enlace del correo de confirmación abre `confirmado.html` (solo el logo y «¡Gracias!»).
- **Patrocinios:** se cargan en `src/js/config.js` (`sponsors` y `adsWhatsApp`). Con la lista vacía, Inicio muestra espacios disponibles.

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
