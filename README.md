# Hogar Esteban Maradona — sitio institucional

Sitio estático hecho con [Astro](https://astro.build), deployado en Vercel.
**Producción:** https://hogar-dr-maradona.vercel.app

## Cómo editar el contenido (sin tocar código)

### Opción A — Panel de administración en /admin (recomendado)

Entrar a **https://hogar-dr-maradona.vercel.app/admin** (o `/login`, que redirige ahí)
e iniciar sesión con GitHub. Desde el panel se puede:

- Crear, editar y despublicar **novedades y eventos** (con imagen y fecha).
- Subir y cambiar **todas las fotos del sitio** (portada, la mesa, el retrato del
  doctor, la historia y el álbum) con sus leyendas.
- Editar **contacto y cuenta** (alias, CBU, CUIT, email, WhatsApp, Instagram…).
- Editar los **números del año** y los **niveles de auspicio**.

Cada guardado hace un commit al repo y el sitio se republica solo.

**Acceso:** la persona necesita una cuenta de GitHub invitada como colaboradora del
repo (GitHub → Settings → Collaborators). El panel usa Decap CMS
(`public/admin/config.yml` define qué se puede editar) con un login OAuth propio
(`src/pages/api/auth.ts` y `callback.ts`). Requiere dos variables de entorno en
Vercel: `OAUTH_GITHUB_CLIENT_ID` y `OAUTH_GITHUB_CLIENT_SECRET` (de una GitHub
OAuth App con callback `https://hogar-dr-maradona.vercel.app/api/callback`).

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
