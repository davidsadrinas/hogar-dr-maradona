# Hogar Esteban Maradona — Plan del CMS (edición sin código para Vicky)

Complemento del `PLAN.md` principal. Este documento cubre **solo** la capa de edición de
contenido: cómo Vicky edita textos, títulos, fotos, eventos, números y datos de la cuenta
desde un panel visual en `/admin`, sin tocar código y sin que ninguna contraseña viva en el repo.

Decisiones ya tomadas (no re-evaluar salvo que se indique):
- **Hosting:** Netlify.
- **CMS:** Decap CMS (ex Netlify CMS), open source, gratis, contenido versionado en Git.
- **Login:** invitación por email vía **Netlify Identity** (Vicky pone su propia contraseña).
- **Puente Git:** **Git Gateway** (Decap escribe en el repo en nombre del usuario logueado).
- **Editores:** 1 (Vicky). Rol único de administrador por ahora.

> Nota sobre Vercel: se evaluó, pero el login por email out-of-the-box (Netlify Identity)
> es nativo de Netlify. En Vercel habría que montar un proveedor de identidad externo
> (Auth0/Clerk/GitHub OAuth), más complejo para el objetivo "solo Vicky, email". Por eso Netlify.

---

## 1. Cómo funciona (para que quede claro antes de codear)

```
Vicky abre  hogarmaradona.org/admin
        │
        ▼
Netlify Identity  ← login con su email + su propia contraseña (widget de Netlify)
        │  (token)
        ▼
Decap CMS (UI visual)  ← Vicky edita textos, sube fotos, crea eventos
        │
        ▼
Git Gateway  ← hace commit al repo de GitHub en nombre de Vicky
        │
        ▼
Netlify detecta el commit → rebuild de Astro → sitio actualizado en ~1 min
```

Puntos clave de seguridad:
- **Ninguna credencial en el código.** La contraseña de Vicky la guarda Netlify Identity, cifrada.
- El acceso a `/admin` es solo por invitación: nadie se registra solo.
- Git Gateway usa un token de corta duración; Vicky nunca ve ni toca el repo directamente.
- Descartar por completo la contraseña `Vicky2026!`: Vicky define una nueva y fuerte al aceptar la invitación.

---

## 2. Estructura que agrega el CMS al proyecto Astro

Sobre la estructura del `PLAN.md` principal, se suma:

```
public/
└── admin/
    ├── index.html          # carga el bundle de Decap CMS
    └── config.yml          # define TODO lo que Vicky puede editar (el corazón del CMS)
src/
├── content/                # (ya existe) eventos como collection
├── data/                   # (ya existe) stats.json, tiers.json, donacion.json, site.json
└── ...
netlify.toml                # build command, publish dir, plugin de Identity si hace falta
```

El truco de arquitectura: **Decap edita los mismos JSON y Markdown que ya consume Astro**
(definidos en el PLAN principal). No se duplica contenido. Vicky edita `site.json` desde una
UI linda; Astro lo lee en build. Una sola fuente de verdad.

---

## 3. `public/admin/config.yml` — el mapa de lo editable

Este archivo es lo más importante del CMS: define exactamente qué campos ve Vicky. Borrador:

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "public/uploads"     # dónde se guardan las fotos que sube
public_folder: "/uploads"
publish_mode: simple               # 1 sola editora → sin flujo de aprobación

collections:
  # ---- TEXTOS DE LA HOME (archivo único, campos fijos) ----
  - name: "home"
    label: "Página principal"
    files:
      - name: "hero"
        label: "Portada (hero)"
        file: "src/data/home/hero.json"
        fields:
          - { label: "Título", name: "titulo", widget: "string" }
          - { label: "Palabra destacada (en color)", name: "destacado", widget: "string" }
          - { label: "Bajada", name: "bajada", widget: "text" }
          - { label: "Foto de portada", name: "foto", widget: "image", required: false }

      - name: "nosotros"
        label: "Quiénes somos"
        file: "src/data/home/nosotros.json"
        fields:
          - { label: "Título", name: "titulo", widget: "string" }
          - { label: "Texto", name: "cuerpo", widget: "markdown" }
          - { label: "Foto", name: "foto", widget: "image", required: false }
          - { label: "Firma", name: "firma", widget: "string" }

      - name: "maradona"
        label: "Dr. Maradona"
        file: "src/data/home/maradona.json"
        fields:
          - { label: "Texto", name: "cuerpo", widget: "markdown" }
          - { label: "Frase destacada", name: "frase", widget: "text" }
          - { label: "Retrato", name: "foto", widget: "image", required: false }

  # ---- NÚMEROS DE IMPACTO ----
  - name: "impacto"
    label: "Números del año"
    files:
      - name: "stats"
        label: "Estadísticas"
        file: "src/data/stats.json"
        fields:
          - label: "Números"
            name: "items"
            widget: "list"
            fields:
              - { label: "Número", name: "valor", widget: "string" }
              - { label: "Descripción", name: "detalle", widget: "string" }
              - { label: "¿Es dato de ejemplo?", name: "ejemplo", widget: "boolean", default: true }

  # ---- EVENTOS / NOVEDADES (varios, se crean y borran) ----
  - name: "eventos"
    label: "Novedades y eventos"
    folder: "src/content/eventos"
    create: true
    delete: true
    slug: "{{slug}}"
    fields:
      - { label: "Título", name: "titulo", widget: "string" }
      - { label: "Etiqueta", name: "etiqueta", widget: "string", hint: "Ej: Próximo evento, Campaña abierta" }
      - { label: "Fecha", name: "fecha", widget: "datetime", required: false }
      - { label: "Imagen", name: "imagen", widget: "image", required: false }
      - { label: "Descripción", name: "body", widget: "markdown" }
      - { label: "¿Mostrar en el sitio?", name: "activo", widget: "boolean", default: true }

  # ---- EMPRESAS: niveles de auspicio ----
  - name: "empresas"
    label: "Auspicios (empresas)"
    files:
      - name: "tiers"
        label: "Niveles de auspicio"
        file: "src/data/tiers.json"
        fields:
          - label: "Niveles"
            name: "items"
            widget: "list"
            fields:
              - { label: "Nombre", name: "nombre", widget: "string" }
              - { label: "Equivale a", name: "nights", widget: "string" }
              - { label: "Monto", name: "monto", widget: "string" }
              - { label: "Destacado", name: "feat", widget: "boolean", default: false }
              - { label: "Beneficios", name: "beneficios", widget: "list" }

  # ---- DATOS DE CONTACTO Y CUENTA ----
  - name: "config"
    label: "Datos de la casa"
    files:
      - name: "site"
        label: "Contacto y cuenta"
        file: "src/data/site.json"
        fields:
          - { label: "Email", name: "email", widget: "string" }
          - { label: "WhatsApp", name: "whatsapp", widget: "string" }
          - { label: "Dirección", name: "direccion", widget: "string" }
          - { label: "Instagram", name: "instagram", widget: "string", required: false }
          - { label: "Alias para transferencias", name: "alias", widget: "string" }
          - { label: "CBU", name: "cbu", widget: "string", required: false }
          - { label: "CUIT", name: "cuit", widget: "string", required: false }
          - { label: "Titular de la cuenta", name: "titular", widget: "string" }
```

> Al portar la home a componentes (PLAN principal §5), leer estos JSON en lugar de texto
> hardcodeado. Ej.: `Hero.astro` importa `src/data/home/hero.json`. Así lo que Vicky escribe
> en `/admin` se ve en el sitio tras el rebuild.

---

## 4. `public/admin/index.html`

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Panel de edición — Hogar Esteban Maradona</title>
  </head>
  <body>
    <!-- Widget de identidad de Netlify (login por email) -->
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
    <!-- Decap CMS -->
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </body>
</html>
```

Y en el `<head>` del sitio público (layout Base.astro), agregar el widget para que el
enlace de invitación por email redirija bien:

```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", (user) => {
      if (!user) {
        window.netlifyIdentity.on("login", () => { document.location.href = "/admin/"; });
      }
    });
  }
</script>
```

---

## 5. Pasos de puesta en marcha (orden exacto)

**En el repo (Code hace esto):**
- [ ] Crear `public/admin/index.html` y `public/admin/config.yml` (§3, §4).
- [ ] Crear los JSON en `src/data/` y `src/data/home/` con el contenido actual del prototipo.
- [ ] Refactor de los componentes Astro para leer de esos JSON/collections.
- [ ] Agregar el snippet de Identity al `Base.astro`.
- [ ] `netlify.toml` con `command = "npm run build"` y `publish = "dist"`.

**En Netlify (David hace esto, una vez, por UI — son clicks, no código):**
- [ ] Conectar el repo de GitHub a un sitio nuevo de Netlify (deploy automático).
- [ ] **Identity → Enable Identity.**
- [ ] Identity → Registration = **Invite only** (nadie se registra solo).
- [ ] Identity → Services → **Enable Git Gateway.**
- [ ] Identity → **Invite users** → invitar el email de Vicky.
- [ ] (Recomendado) Identity → habilitar 2FA / confirmación por email.

**Vicky (una vez):**
- [ ] Recibe el mail de invitación → hace click → **define su propia contraseña** (fuerte, nueva).
- [ ] Entra a `hogarmaradona.org/admin` y ya puede editar todo.

---

## 6. Prueba de aceptación (antes de dársela a Vicky)

- [ ] Login por email funciona desde un mail de prueba.
- [ ] Editar el título del hero en `/admin` → commit automático → sitio actualizado tras rebuild.
- [ ] Subir una foto y verla en el sitio.
- [ ] Crear un evento nuevo y despublicarlo.
- [ ] Cambiar el alias en "Datos de la casa" y verificar que se refleje en la sección Donar.
- [ ] Confirmar que `/admin` pide login (no es público) y que no hay credenciales en el repo.

---

## 7. Manual de una carilla para Vicky (Code lo genera como PDF/MD al final)

Redactar en criollo, sin jerga: cómo entrar a `/admin`, cómo cambiar un texto, cómo subir
una foto respetando el cuidado de los chicos (no caras de menores sin permiso), cómo crear
un evento, y a quién escribir si algo se rompe. Una sola hoja.

---

## 8. Seguridad — no negociable

- La contraseña `Vicky2026!` compartida en el chat queda **descartada**. Vicky define una nueva.
- Nunca poner usuarios/contraseñas en `config.yml`, en el repo, ni en variables del cliente.
- `Invite only` siempre activo: sin registro abierto.
- Si en el futuro entran más editores (voluntarios), sumarlos por invitación con su propio
  usuario — nunca compartir un login. Ahí recién evaluar roles/permisos.
- Recomendado: activar confirmación en dos pasos en las cuentas con acceso.
