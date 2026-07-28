# Hogar Esteban Maradona — sitio institucional

Sitio estático hecho con [Astro](https://astro.build), deployado en Vercel.
**Producción:** https://hogar-dr-maradona.vercel.app

## Cómo editar el contenido (sin tocar código)

### Opción A — Panel de administración en /admin (recomendado)

Entrar a **https://hogar-dr-maradona.vercel.app/admin** (o `/login`, que redirige ahí)
e iniciar sesión con **email y contraseña** (cuenta de TinaCloud — no hace falta
GitHub). Desde el panel se puede editar TODO:

- **Textos y títulos** de cada sección. Convención: lo que va entre `*asteriscos*`
  sale en cursiva color sol; entre `**doble asterisco**`, en negrita.
- **Fotos del sitio** (portada, la mesa, el retrato del doctor, la historia, el
  álbum) con sus leyendas, subiendo imágenes desde el Media Manager.
- **Novedades y eventos**: crear, editar, borrar, despublicar.
- **Contacto y cuenta** (alias, CBU, CUIT, email, WhatsApp, Instagram…).
- **Números del año** y **niveles de auspicio**.

Cada guardado hace un commit al repo y el sitio se republica solo.

**Cómo funciona:** el panel es TinaCMS (`tina/config.ts` define qué se puede editar).
El login y los commits van vía TinaCloud (app.tina.io — plan gratis, 2 usuarios).
Requiere en Vercel las variables `TINA_PUBLIC_CLIENT_ID` y `TINA_TOKEN` del proyecto
de TinaCloud (que debe estar conectado a este repo). Para invitar a alguien:
app.tina.io → proyecto → Users → invitar por email.

**Edición local (para desarrolladores):** `npm run dev` levanta el sitio + el panel
en `http://localhost:4321/admin/index.html` sin login; los cambios se guardan
directo en los archivos.

### Opción B — Editar los archivos directo

Todo lo que cambia seguido vive en archivos de datos. Editás el archivo, hacés commit
a `main`, y Vercel publica el sitio actualizado solo (tarda ~1 minuto).

| Qué querés cambiar | Archivo |
|---|---|
| Alias, CBU, CUIT, titular de la cuenta | `src/data/site.json` |
| Email, WhatsApp, dirección, Instagram | `src/data/site.json` |
| Números de impacto (familias, provincias…) | `src/data/stats.json` |
| Montos y beneficios de los auspicios | `src/data/tiers.json` |
| Novedades y eventos | `src/content/eventos/*.md` |

### Ejemplos

**Cambiar el alias de transferencia:** abrir `src/data/site.json` y editar el campo
`"alias"`. Lo mismo con `"cbu"` y `"cuit"` cuando estén.

**Poner los números reales:** en `src/data/stats.json`, cambiar cada `"valor"` y poner
`"ejemplo": false`. Cuando ningún ítem quede como ejemplo, la nota al pie desaparece sola.

**Crear un evento:** copiar cualquier archivo de `src/content/eventos/`, renombrarlo
(ej. `festival-2026.md`) y editar el título, la etiqueta y el texto. Para sacarlo del
sitio sin borrarlo, poner `activo: false`.

## Desarrollo local

```sh
npm install
npm run dev       # servidor local en http://localhost:4321
npm run build     # genera el sitio estático en dist/
```

## Deploy

El proyecto vive en Vercel (`davidsadrinas-projects/hogar-dr-maradona`). Para publicar
cambios:

```sh
vercel deploy --prod
```

**Recomendado (una sola vez):** conectar el repo de GitHub en el dashboard de Vercel
(Project → Settings → Git → Connect) para que cada push a `main` en
[davidsadrinas/hogar-dr-maradona](https://github.com/davidsadrinas/hogar-dr-maradona)
publique solo, sin correr comandos.

Cuando esté el dominio `.org.ar`, cambiar `site` en `astro.config.mjs` y la URL del
sitemap en `public/robots.txt`, y agregar el dominio en el panel de Vercel.

## Datos pendientes de la comisión

Hoy hay placeholders en: CUIT, CBU, montos de los tiers, números de impacto y todas las
fotos. Se completan editando los archivos de la tabla de arriba — el diseño ya los
contempla.
