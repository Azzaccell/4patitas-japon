# Seguridad de Cuatro Patitas

Qué protege la app, qué falta configurar fuera del código y en qué orden.
Revisión del 13 de noviembre de 2026 (versión 2.2).

## 1. Ya hecho en el código

| Tema | Qué se hizo | Dónde |
|---|---|---|
| Scripts inyectados | El HTML de un solo archivo trae una política de seguridad (CSP): solo corren sus propios scripts, identificados por su huella sha256, y la app solo se conecta a su Supabase. Un `<script>` o un `onerror=` inyectado no se ejecuta. | `build.js` |
| Fotos y enlaces de la base | Una foto solo se muestra si es `https`, una imagen incrustada o un archivo de la app. El WhatsApp de un aviso se limpia a solo dígitos antes de armar el enlace. | `src/js/api.js`, `src/js/app.js` |
| Ubicación | El punto del aviso se guarda redondeado a unos 150 m, nunca la casa exacta. «Cerca de mí» no sale del teléfono. | `src/js/api.js` |
| Datos ocultos de las fotos | Las fotos se vuelven a dibujar antes de subirlas, así que pierden el GPS y los demás datos del archivo. | `readImage` en `src/js/app.js` |
| Invitados | Sin cuenta solo se mira y se ayuda con avisos. Publicar o comentar fotos, dar corazón, seguir y guardar piden cuenta, y las tablas de fotos lo exigen también en la base. | `src/js/app.js`, `supabase/publicaciones.sql` |
| Contraseñas | Las cuentas nuevas piden 8 caracteres o más. | `src/js/app.js` |
| Firma, fecha y álbumes | La base pone el autor, la fecha y el estado de cada foto y comentario: no se puede firmar como otra persona, poner una fecha futura para quedar primero ni esquivar el límite por hora. Una foto solo entra al álbum de una mascota propia. | `supabase/publicaciones.sql` |
| Corazones | Uno por persona y por foto (tabla `post_likes`): ya no se pueden inflar ni vaciar llamando a la API. | `supabase/publicaciones.sql` |
| Denunciar | Fotos, avisos y comentarios tienen «Denunciar», con motivo. Lo denunciado deja de verse en ese teléfono, y una foto o comentario de foto con 3 denuncias de personas con cuenta se oculta para todos. | `src/js/app.js`, `supabase/seguridad.sql` |
| Bloquear | Al denunciar se puede bloquear a quien publicó: no se ve nada más suyo. Se deshace en Mi cuenta. | `src/js/app.js` |
| Estafas | Los avisos muestran un consejo: no pagar por adelantado, no compartir códigos y encontrarse en un lugar público. | `src/js/app.js` |
| Spam | Límites por persona y por hora: 10 fotos, 30 comentarios de fotos, 20 denuncias, 6 avisos y 30 comentarios de avisos. | `supabase/seguridad.sql` |
| Borrar la cuenta | «Borrar mi cuenta» borra las fotos subidas, las publicaciones, los avisos, las mascotas, los comentarios y la cuenta. «Borrar los datos de este teléfono» limpia la app y cierra la sesión. | `src/js/api.js`, `supabase/seguridad.sql` |
| Reglas y privacidad | Dentro de la app (desde la entrada y desde Mi cuenta) y como página pública para Google Play. | `src/js/app.js`, `privacidad.html` |
| Largo de los textos | Todos los campos tienen un máximo, y la base lo vuelve a comprobar en fotos, comentarios y denuncias. | `src/js/app.js`, `supabase/*.sql` |
| APK: visor interno | Solo abre la propia app (comparación exacta de la dirección). No puede leer otros archivos del teléfono y bloquea el contenido sin cifrar. Afuera solo abre enlaces `https`, WhatsApp, correo, teléfono y mapas, nunca `intent:`, `file:` ni `javascript:`. | `MainActivity.java` |
| APK: copias de seguridad | Desactivadas, para que la sesión no viaje en los respaldos de Android. | `AndroidManifest.xml` |
| APK: llave de firma | La contraseña ya no está escrita en el script: se toma de `PATITAS_KS_PASS` o se pide al firmar. | `android/build-apk.ps1` |

## 2. Lo que tienes que hacer en Supabase (en este orden)

1. **SQL Editor → correr `supabase/publicaciones.sql`** (tablas de fotos con sus reglas).
2. **SQL Editor → correr `supabase/seguridad.sql`** (denuncias, límites y borrado de cuenta).
   Los dos se pueden volver a correr sin romper nada. Se probaron en un Postgres que imita Supabase. En tu proyecto
   real, prueba una vez «Borrar mi cuenta» con una cuenta de prueba: si 4 Patitas web tiene otra tabla que apunte a
   los usuarios sin `on delete cascade`, el borrado da error y hay que sumar esa tabla a la función `borrar_mi_cuenta`.
3. **SQL Editor → correr `supabase/revisar-seguridad.sql`** (solo lee) y revisar:
   - La consulta 1 tiene que salir vacía: toda tabla de `public` necesita RLS.
   - La consulta 3 tiene que salir vacía: nadie debe poder cambiar ni borrar filas ajenas.
   - En la consulta 5, el bucket `fotos` debería tener límite de tamaño y aceptar solo imágenes. Si 4 Patitas web
     solo sube fotos, ponlo en *Storage → fotos → Edit bucket*: 2 MB, `image/jpeg`.
4. **Authentication → Sign In / Providers → Email**
   - *Confirm email*: **activado**. Sin esto, cualquiera crea cuentas con correos ajenos.
   - *Minimum password length*: **8**.
   - *Secure email change*: activado.
   - *Anonymous sign-ins*: activado (los invitados lo usan).
5. **Authentication → URL Configuration**
   - *Site URL*: `https://azzaccell.github.io/4patitas-japon/`.
   - *Redirect URLs*: solo esa dirección. Así los enlaces de correo no pueden mandar a otro sitio.
6. **Authentication → Rate Limits**: baja *anonymous sign-ins* a unas 30 por hora. Mira la consulta 6 de la revisión:
   muchos invitados nuevos de golpe son bots.
7. **Authentication → Attack Protection**: activa *leaked password protection* si tu plan lo tiene. El CAPTCHA
   (Cloudflare Turnstile) es el siguiente paso contra bots, pero la app todavía no lo trae: no lo actives hasta
   sumarlo al código, o nadie podrá entrar.
8. **Database → Backups**: revisa si tu plan guarda copias que puedas recuperar. Si no, haz una copia periódica.
9. **Claves**: la clave *publishable* de `config.js` es pública a propósito. La *secret / service_role* nunca va en la app
   ni en GitHub. Si alguna vez se publicó, rótala en *Project Settings → API Keys*.
10. **Cuentas**: activa la verificación en dos pasos en Supabase y en GitHub. Quien entra ahí controla todos los datos.

## 3. Android y Google Play

1. **Cambia la contraseña de la llave**, que estuvo escrita en el repositorio:
   `keytool -storepasswd -keystore android\4patitas.jks`. Guarda `4patitas.jks` y su contraseña en dos lugares
   seguros: sin ellos no se pueden publicar actualizaciones. Mejor aún, activa *Play App Signing* al subir la app.
2. **targetSdk**: Google Play exige un nivel reciente (hoy está en 34). Antes de subirla, súbelo al que pida la Play Console
   y prueba en un teléfono: desde el nivel 35 la app ocupa toda la pantalla y hay que revisar la barra de arriba.
3. **Play Console**:
   - *Política de privacidad* y *URL para borrar la cuenta*: `https://azzaccell.github.io/4patitas-japon/privacidad.html`
     (funciona cuando estos cambios lleguen a `main`).
   - *Seguridad de los datos*: correo y nombre (cuenta), fotos, ubicación aproximada, número de teléfono (en avisos) y
     contenido publicado. Todo se cifra en tránsito y el usuario puede pedir que se borre.
   - *Contenido generado por usuarios*: la app tiene reglas, denuncias, bloqueo y moderación por denuncias.
   - Pon un correo de contacto en la ficha y en `supportEmail` de `src/js/config.js`.

## 4. Moderación (tu parte de todos los días)

- Revisa *Table Editor → denuncias* (las que tienen `revisada = false`). Borra lo que incumpla las reglas y marca la
  denuncia como revisada.
- Para volver a mostrar una foto ocultada por error: `update posts set oculto = false where id = '...';`
- Los avisos denunciados no se ocultan solos: los avisos ayudan a encontrar mascotas y no conviene que tres personas
  puedan esconder uno. Revísalos a mano.

## 5. Revisión con ECC (13 de noviembre de 2026)

Se siguió la lista de `security-review` y el agente `security-reviewer` de ECC. Cuatro abusos se reprodujeron en un
Postgres que imita Supabase y quedaron corregidos: fotos metidas en el álbum de una mascota ajena, firmas falsas,
fechas futuras y corazones sin límite. Sin hallazgos en: claves en el código (la publishable es pública a propósito),
inyección SQL (las funciones usan parámetros y `format(%I)`), XSS (Vue escapa el texto, solo hay `v-html` con íconos
fijos y la CSP bloquea scripts ajenos) y CSRF (no aplica: la sesión viaja en un encabezado, no en cookies).
Librerías: Vue 3.5.13, Leaflet 1.9.4 y supabase-js 2.45, sin fallas graves conocidas.

Riesgos que quedan aceptados:
- La sesión de Supabase vive en `localStorage`, como en toda app estática sin servidor propio. La CSP es la defensa.
- Tres cuentas de acuerdo pueden ocultar una foto con denuncias. Para eso necesitan tres correos confirmados, y el
  autor la sigue viendo; revisa las denuncias para devolverla si fue un abuso.
- La contraseña vieja de la llave de firma sigue en el historial de git: cámbiala (sección 3).

## 6. Lo que queda pendiente

- **CAPTCHA** al crear cuentas y al entrar como invitado (Cloudflare Turnstile): es lo que más frena a los bots.
- **Panel de moderación** dentro de la app para no depender del Table Editor.
- **Reglas de las tablas compartidas** (`reports`, `pets`, `comments`, Storage): viven en el repositorio de
  4 Patitas web y no se revisaron desde aquí. Usa `supabase/revisar-seguridad.sql` para comprobarlas.
- **Números de WhatsApp**: hoy cualquiera puede leer todos los números de los avisos a través de la API. Para
  protegerlos habría que mostrarlos solo al tocar «Escribir» y servirlos desde una función, un cambio que también
  afecta a 4 Patitas web.
- **Clickjacking en la web**: GitHub Pages no deja poner la cabecera que impide meter la app dentro de otra página.
  Si la app se muda a un hosting propio, agrega `frame-ancestors 'none'`.
