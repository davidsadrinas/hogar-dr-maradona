# Hogar Esteban Maradona — Plan de build del sitio institucional

Spec de implementación para ejecutar en Claude Code. La home ya está prototipada en
`home.html` (fuente de verdad de diseño y copy). El objetivo de este proyecto es
convertir ese prototipo en un sitio **Astro** estático, editable por la comisión
directiva sin tocar código, y deployado en el VPS Hetzner vía Dokploy.

**Objetivo de negocio #1:** captar empresas (auspicio/padrinazgo). Todo lo demás es soporte.

---

## 1. Decisión de stack

| Capa | Elección | Por qué |
|---|---|---|
| Framework | **Astro 4** (output: static) | Cero JS por defecto, ideal para sitio de contenido. Islands solo si hacen falta. |
| Estilos | CSS plano con custom properties (ya definidas en el prototipo) | No sumar Tailwind: el prototipo ya resuelve el design system con tokens. Menos build, menos ruido. |
| Contenido | **Content Collections** (eventos) + archivos de datos en `src/data/*.json` (stats, tiers, datos bancarios) | La comisión edita Markdown/JSON, no componentes. |
| Imágenes | `astro:assets` (`<Image>`) con lazy + formatos modernos | Optimización automática; clave con fotos reales que subirán después. |
| Deploy | **Dokploy** en Hetzner (CX32, ya provisto) como sitio estático / Nginx | Reusás infra existente. Alternativa 1-click: Cloudflare Pages (ver §8). |
| Dominio | `.org.ar` en NIC.ar | Señal de credibilidad institucional para donantes. |

> Nota: el sitio es 100% estático. No hay backend ni base de datos. Los pagos salen a
> Mercado Pago / Donaronline por link externo. No guardamos datos de donantes en el sitio.

---

## 2. Estructura del proyecto

```
hogar-maradona/
├── astro.config.mjs
├── package.json
├── public/
│   ├── favicon.svg
│   └── og-image.jpg            # placeholder hasta tener foto real
├── src/
│   ├── layouts/
│   │   └── Base.astro          # <head>, fuentes, meta/OG, header, footer
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro          # incluye la "ventana iluminada" (CSS, sin img)
│   │   ├── Nosotros.astro
│   │   ├── Servicios.astro     # cards Qué hacemos
│   │   ├── Stats.astro         # lee src/data/stats.json
│   │   ├── Empresas.astro      # cuadro fiscal + tiers (lee src/data/tiers.json)
│   │   ├── Galeria.astro
│   │   ├── Eventos.astro       # lee content collection "eventos"
│   │   ├── Transparencia.astro
│   │   ├── Donar.astro         # lee src/data/donacion.json
│   │   └── Reveal.astro        # wrapper de scroll-reveal (IntersectionObserver)
│   ├── content/
│   │   ├── config.ts           # schema zod de la collection eventos
│   │   └── eventos/
│   │       ├── cena-beneficio.md
│   │       ├── padrina-habitacion.md
│   │       └── voluntariado.md
│   ├── data/
│   │   ├── stats.json          # números del hero y la band
│   │   ├── tiers.json          # niveles de auspicio + montos
│   │   ├── donacion.json       # CUIT, CBU, alias, links MP
│   │   └── site.json           # nombre, email, dirección, redes
│   ├── styles/
│   │   └── tokens.css          # :root con toda la paleta y tipografía del prototipo
│   └── pages/
│       └── index.astro         # ensambla los componentes en orden
└── README.md                   # cómo editar contenido (para la comisión, en criollo)
```

---

## 3. Design tokens (portar tal cual desde el prototipo)

Copiar el bloque `:root` de `home.html` a `src/styles/tokens.css`. Referencia:

```css
:root{
  --paper:#FBF8F2;  --paper-2:#F3EEE3;  --ink:#1E2B26;
  --pine:#1C3F32;   --pine-2:#2E5B49;
  --tint:#E4ECE4;   --tint-2:#D6E2D8;
  --honey:#E0A24E;  --honey-deep:#B9762A;
  --line:rgba(28,63,50,.14);
  --shadow:0 1px 2px rgba(28,63,50,.06),0 8px 30px rgba(28,63,50,.08);
}
```

Tipografía: Fraunces (display) + Inter (body), vía Google Fonts en el `<head>` del layout.
La ventana iluminada del hero (`.window-card` / `.win` / `.pane`) va tal cual: es la firma
visual, en CSS puro, sin imagen. Respetar `prefers-reduced-motion` (ya está en el prototipo).

---

## 4. Modelo de contenido editable

**`src/content/config.ts`** — schema de eventos:

```ts
import { defineCollection, z } from 'astro:content';
const eventos = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    titulo: z.string(),
    etiqueta: z.string(),           // "Próximo evento", "Campaña abierta", etc.
    fecha: z.date().optional(),
    imagen: image().optional(),     // si falta -> placeholder
    orden: z.number().default(0),
    activo: z.boolean().default(true),
  }),
});
export const collections = { eventos };
```

**`src/data/tiers.json`** — para que se editen montos sin tocar componentes:

```json
[
  { "nombre":"Colaborador", "nights":"5 noches / mes", "monto":"$ ____", "feat":false,
    "beneficios":["Logo en la sección Empresas","Mención en la memoria anual","Comprobante deducible al 100%"] },
  { "nombre":"Padrino de habitación", "nights":"Una habitación entera", "monto":"$ ____", "feat":true,
    "beneficios":["Placa con el nombre de tu empresa","Informe fotográfico trimestral","Logo en cartelería y newsletter","Comprobante deducible al 100%"] },
  { "nombre":"Socio principal", "nights":"Un programa o área", "monto":"A convenir", "feat":false,
    "beneficios":["Todo lo anterior","Presencia en el evento anual","Acuerdo de comunicación conjunta"] }
]
```

`stats.json`, `donacion.json` y `site.json` siguen el mismo criterio: **todo dato que
cambie vive en JSON o Markdown, nunca hardcodeado en un `.astro`.**

---

## 5. Mapeo prototipo → componentes

Cada `<section>` del `home.html` se extrae a un componente homónimo del §2. El copy ya está
escrito en el prototipo; migrarlo textual. Puntos de atención al portar:

- Los números con `*` (hero-meta y stats) leen de `stats.json`. Mantener el asterisco y la
  nota "Datos de ejemplo" hasta cargar cifras reales.
- El cuadro fiscal de Empresas (tags HOY / PRONTO) es **contenido sensible**: no tocar la
  redacción sin pasar por el criterio fiscal ya acordado (auspicio deducible hoy; donación
  deducible al obtener certificado ARCA). Dejar comentario en el componente advirtiéndolo.
- Placeholders de foto (`.ph`): dejarlos como fallback cuando `imagen` no existe, así el
  sitio se ve completo desde el día uno y se llena incrementalmente.

---

## 6. Calidad (quality floor, no negociable)

- [ ] Responsive hasta 360px (ya resuelto en el prototipo; verificar al componentizar).
- [ ] Focus visible en todos los interactivos; navegación por teclado en el menú.
- [ ] `prefers-reduced-motion` respetado (glow + reveal).
- [ ] Lighthouse: apuntar a 100/100/100/100. Fraunces/Inter con `display=swap` y preconnect.
- [ ] Meta + Open Graph + Twitter card en `Base.astro` (título, descripción, `og-image`).
- [ ] `sitemap` (@astrojs/sitemap) y `robots.txt`.
- [ ] Favicon = la marca de la ventana en SVG.
- [ ] Alt text real en todas las imágenes cuando se carguen.

---

## 7. SEO / captación

- Title: `Hogar Esteban Maradona — Casa de tránsito para familias del interior`
- Description orientada a la doble búsqueda: familias que necesitan alojamiento + empresas
  que buscan dónde donar con beneficio fiscal.
- Schema.org `NGO` en JSON-LD (nombre legal, dirección Av. Córdoba 6500, email, área de acción).
- Una landing secundaria opcional `/empresas` (mismo contenido de la sección, pero como
  página propia) para mandar en frío por mail y en LinkedIn. Baja prioridad, post-MVP.

---

## 8. Deploy

**Opción A — Dokploy en Hetzner (reusar infra):**
1. `npm run build` genera `dist/` estático.
2. En Dokploy: nuevo proyecto tipo *Static* (o Nginx sirviendo `dist/`).
3. Conectar repo Git; build command `npm run build`, output `dist`.
4. Dominio `.org.ar` apuntando al VPS; SSL vía Let's Encrypt (Traefik ya en el stack).

**Opción B — Cloudflare Pages (cero-mantenimiento):**
- Conectar repo, preset Astro, listo. CDN global y previews por PR gratis.
- Recomendada si la comisión va a editar seguido: cada push publica solo.

> Sugerencia: **Opción B para producción** (menos superficie que mantener para una ONG),
> y el VPS lo dejás para el CRM y los otros proyectos. Pero si querés todo bajo el mismo
> techo, A funciona perfecto.

---

## 9. Roadmap de tareas (orden de ejecución en Code)

**Fase 1 — Scaffold**
- [ ] `npm create astro@latest hogar-maradona -- --template minimal --typescript`
- [ ] Agregar integraciones: `@astrojs/sitemap`. Config `output: 'static'`.
- [ ] Crear `tokens.css` + fuentes en `Base.astro`. Portar reset y utilidades del prototipo.

**Fase 2 — Componentizar la home**
- [ ] Extraer las 10 secciones a componentes (§2/§5), migrando copy textual del prototipo.
- [ ] `Reveal.astro` con IntersectionObserver (portar el `<script>` del final del prototipo).
- [ ] Cablear `stats.json`, `tiers.json`, `donacion.json`, `site.json`.

**Fase 3 — Contenido dinámico**
- [ ] Content collection `eventos` + los 3 .md de ejemplo.
- [ ] `Eventos.astro` iterando la collection, ordenada por `orden`, filtrando `activo`.
- [ ] Sistema de placeholder de imagen reutilizable (`<Foto>` con fallback `.ph`).

**Fase 4 — Pulido y lanzamiento**
- [ ] Meta/OG/JSON-LD, sitemap, robots, favicon SVG.
- [ ] Pasada de accesibilidad + Lighthouse.
- [ ] `README.md` para la comisión: cómo cambiar un monto, subir un evento, reemplazar una foto.
- [ ] Deploy (§8) + dominio + SSL.

**Post-MVP (backlog)**
- [ ] Reemplazar datos de ejemplo por cifras reales (requiere números de la comisión).
- [ ] Cargar fotos reales optimizadas.
- [ ] Botón "Copiar alias" funcional y links reales de Mercado Pago / Donaronline.
- [ ] Landing `/empresas` para outreach en frío.
- [ ] Integrar Instagram feed cuando exista la cuenta.

---

## 10. Datos que hay que pedirle a la comisión (bloquean el go-live real)

Estos campos hoy están en blanco/ejemplo en el prototipo y hay que completarlos:
`CUIT` · `CBU` · `alias` · `link Mercado Pago` · montos de cada tier · costo real por noche
(del cual salen los montos) · números de impacto reales (familias, noches, provincias) ·
Instagram · fotos. Nada de esto bloquea el desarrollo: se codea con placeholders y se
reemplaza vía JSON/Markdown al final.

---

**Fuente de verdad de diseño:** `home.html` (adjunto). No re-diseñar: portar.
