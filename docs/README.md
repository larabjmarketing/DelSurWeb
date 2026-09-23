# Del Sur Studio — sitio web

Sitio estático (HTML, CSS y JavaScript, sin dependencias ni compilación) para publicar en GitHub Pages, siguiendo el mismo flujo que ya usas con GitHub Desktop. Es responsive: se adapta a móvil, tablet y escritorio.

## Contenido

- `index.html` — portada (pack de lanzamiento, servicios, publicidad, casos, sobre mí, contacto y preguntas frecuentes)
- `publicidad-estepona.html`, `seo-local-estepona.html`, `marca-web-estepona.html` — páginas de servicio
- `calculadora.html` — calculadora de estrategia
- `legal.html` — aviso legal, privacidad y cookies
- `css/style.css` — todos los estilos (colores y tipografías en `:root`, al principio del archivo)
- `js/main.js` — menú móvil, animaciones, filtro de casos y formulario de contacto
- `js/calculadora.js` — precios y lógica de la calculadora (edita `DATA` y `REDES` para cambiar precios)
- `img/`, `favicon.svg`, `robots.txt`, `sitemap.xml`

## Antes de publicar

1. **Sustituye el dominio.** Todos los archivos usan el marcador `TU-DOMINIO-AQUI.es` en las etiquetas canónicas, Open Graph, JSON-LD, `robots.txt` y `sitemap.xml`. Si usas GitHub Pages sin dominio propio, tu URL real será algo como `https://larabjmarketing.github.io/DelSurStudio/`; sustituye el marcador por esa URL (o por tu dominio si compras uno) con un buscar-y-reemplazar en todos los archivos.
2. **Revisa el contenido pendiente**, marcado como "[XX]" o "Foto pendiente" en el propio texto: las cifras y fotos de los tres casos, las cifras de clientes y campañas de la portada, el retrato (revisa si es una foto real tuya) y la foto de la ficha de Google.
3. **Revisa `legal.html`** con tu gestoría (ya lleva tu NIF y Supabase como encargado del tratamiento).

## Publicar con GitHub Desktop (como en tu web personal)

1. Crea un repositorio nuevo en GitHub, por ejemplo `DelSurStudio`.
2. En GitHub Desktop, clona el repositorio y copia dentro todo el contenido de esta carpeta (manteniendo la estructura de `css/`, `js/` e `img/`). La carpeta `.claude/` no hace falta subirla.
3. Haz commit y publica (push) los cambios.
4. En GitHub, ve a Settings → Pages, y en "Branch" elige `main` (o `master`) con la carpeta `/ (root)`.
5. En unos minutos tu web estará en `https://<tu-usuario>.github.io/DelSurStudio/`.

## Cómo funciona el formulario de contacto

El formulario de la portada tiene 4 pasos y **guarda cada solicitud en Supabase**, en el proyecto `web-lara-borrego`, tabla `delsur_leads` (separada de la tabla `contactos` de tu web personal). Si la persona ha usado antes la calculadora, puede adjuntar su estrategia.

- **Ver las solicitudes:** en Supabase → Table Editor → `delsur_leads`. La columna `estado` sirve para marcar cada una como `nuevo`, `contactado`, `cliente` o `descartado`.
- **Seguridad:** la web solo puede *insertar* filas; nadie puede leerlas con la clave pública que va en `js/main.js` (está protegido con RLS). Hay además un campo oculto antispam.
- **Si falla el envío**, el formulario ofrece mandar el mensaje por WhatsApp.

## Al cambiar el CSS o el JS

Las páginas cargan `css/style.css?v=2`, `js/main.js?v=3` y `js/calculadora.js?v=2`. Si cambias esos archivos, sube el número en todas las páginas para que los navegadores no muestren la versión antigua guardada en caché.

## Tareas pendientes

- Casos reales: sustituir los "[XX]" y las fotos pendientes por cifras y fotos reales (o quitar la sección hasta tenerlos).
- Enlaces a Instagram, LinkedIn y Facebook: se quitaron de la barra superior porque no llevaban a ningún sitio; añádelos cuando tengas las URLs.
- Selector ES | EN: se quitó porque todavía no hay versión en inglés; vuelve a añadirlo cuando exista `/en/`.
- Si añades Google Analytics o Meta Pixel, instala un banner de cookies y actualiza `legal.html`.
