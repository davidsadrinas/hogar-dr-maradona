import { defineConfig } from 'tinacms';

// Convención de destacados en títulos y textos:
// *palabras* → cursiva en color (sol) · **palabras** → negrita.
const HINT_DESTACADO = 'Lo que pongas entre *asteriscos* sale en cursiva color sol; entre **doble asterisco**, en negrita.';

const branch =
  process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || 'main';

export default defineConfig({
  branch,
  clientId: process.env.TINA_PUBLIC_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      // ---- EVENTOS / NOVEDADES ----
      {
        name: 'eventos',
        label: 'Novedades y eventos',
        path: 'src/content/eventos',
        format: 'md',
        ui: {
          filename: {
            readonly: false,
            slugify: (values) =>
              (values?.titulo || 'evento')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[̀-ͯ]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, ''),
          },
        },
        fields: [
          { type: 'string', name: 'titulo', label: 'Título', isTitle: true, required: true },
          {
            type: 'string',
            name: 'etiqueta',
            label: 'Etiqueta',
            description: 'Ej: próximo evento, campaña abierta, voluntariado',
            required: true,
          },
          { type: 'datetime', name: 'fecha', label: 'Fecha' },
          { type: 'image', name: 'imagen', label: 'Imagen' },
          { type: 'number', name: 'orden', label: 'Orden (menor sale primero)' },
          { type: 'boolean', name: 'activo', label: '¿Mostrar en el sitio?' },
          { type: 'rich-text', name: 'body', label: 'Descripción', isBody: true },
        ],
      },

      // ---- TEXTOS Y TÍTULOS DE LA HOME ----
      {
        name: 'textos',
        label: 'Textos y títulos',
        path: 'src/data',
        format: 'json',
        match: { include: 'textos' },
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: 'object',
            name: 'hero',
            label: 'Portada',
            fields: [
              { type: 'string', name: 'issue', label: 'Línea superior' },
              { type: 'string', name: 'issueDestacado', label: 'Línea superior — destacado (ej. Desde 2018)' },
              { type: 'string', name: 'titulo', label: 'Título principal', description: HINT_DESTACADO, ui: { component: 'textarea' } },
              { type: 'string', name: 'bajada', label: 'Bajada', ui: { component: 'textarea' } },
              { type: 'string', name: 'ctaPrimario', label: 'Botón principal' },
              { type: 'string', name: 'ctaSecundario', label: 'Botón secundario' },
              { type: 'string', name: 'sello', label: 'Sello (ej. Casa abierta)' },
            ],
          },
          {
            type: 'object',
            name: 'nosotros',
            label: 'Quiénes somos',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Antetítulo' },
              { type: 'string', name: 'titulo', label: 'Título', description: HINT_DESTACADO, ui: { component: 'textarea' } },
              { type: 'string', name: 'parrafos', label: 'Párrafos', list: true, ui: { component: 'textarea' } },
              { type: 'string', name: 'cita', label: 'Cita destacada', ui: { component: 'textarea' } },
              { type: 'string', name: 'firma', label: 'Firma' },
              { type: 'string', name: 'cargo', label: 'Cargo' },
              { type: 'string', name: 'notaManuscrita', label: 'Nota manuscrita' },
            ],
          },
          {
            type: 'object',
            name: 'maradona',
            label: 'Dr. Maradona',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Antetítulo' },
              { type: 'string', name: 'notaMargen', label: 'Nota al margen' },
              { type: 'string', name: 'parrafos', label: 'Párrafos', list: true, description: HINT_DESTACADO, ui: { component: 'textarea' } },
              { type: 'string', name: 'cita', label: 'Cita destacada', ui: { component: 'textarea' } },
              { type: 'string', name: 'cierre', label: 'Párrafo de cierre', description: HINT_DESTACADO, ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'hacemos',
            label: 'Qué hacemos',
            fields: [
              { type: 'string', name: 'titulo', label: 'Título', description: HINT_DESTACADO, ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'cards',
                label: 'Tarjetas',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.titulo || 'Tarjeta' }) },
                fields: [
                  { type: 'string', name: 'tab', label: 'Etiqueta (ej. Techo)' },
                  { type: 'string', name: 'titulo', label: 'Título' },
                  { type: 'string', name: 'texto', label: 'Texto', ui: { component: 'textarea' } },
                  { type: 'string', name: 'nota', label: 'Nota manuscrita' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'historia',
            label: 'Una historia de la casa',
            fields: [
              { type: 'string', name: 'etiqueta', label: 'Etiqueta' },
              { type: 'string', name: 'titulo', label: 'Título', description: HINT_DESTACADO, ui: { component: 'textarea' } },
              { type: 'string', name: 'parrafos', label: 'Párrafos', list: true, ui: { component: 'textarea' } },
              { type: 'string', name: 'aviso', label: 'Aviso al pie', ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'sostener',
            label: 'Sostener la casa',
            fields: [
              { type: 'string', name: 'titulo', label: 'Título', description: HINT_DESTACADO, ui: { component: 'textarea' } },
              { type: 'string', name: 'lead', label: 'Texto principal', description: HINT_DESTACADO, ui: { component: 'textarea' } },
              { type: 'string', name: 'items', label: 'Puntos (1, 2, 3…)', list: true, description: HINT_DESTACADO, ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'card',
                label: 'Tarjeta «Hacete padrino»',
                fields: [
                  { type: 'string', name: 'titulo', label: 'Título' },
                  { type: 'string', name: 'monto', label: 'Monto (ej. $ 25.000)' },
                  { type: 'string', name: 'periodo', label: 'Período (ej. / mes)' },
                  { type: 'string', name: 'texto', label: 'Texto', ui: { component: 'textarea' } },
                  { type: 'string', name: 'boton', label: 'Botón' },
                  { type: 'string', name: 'notaManuscrita', label: 'Nota manuscrita' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'empresas',
            label: 'Empresas',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Antetítulo' },
              { type: 'string', name: 'titulo', label: 'Título', description: HINT_DESTACADO, ui: { component: 'textarea' } },
              { type: 'string', name: 'lead', label: 'Bajada', ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'fiscal',
                label: 'Cuadro fiscal (¡ojo! redacción sensible, consultar antes de cambiar)',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.titulo || 'Fila' }) },
                fields: [
                  {
                    type: 'string',
                    name: 'tag',
                    label: 'Tag',
                    options: ['HOY', 'PRONTO'],
                  },
                  { type: 'string', name: 'titulo', label: 'Título' },
                  { type: 'string', name: 'texto', label: 'Texto', ui: { component: 'textarea' } },
                ],
              },
              { type: 'string', name: 'notaGrandes', label: 'Nota para empresas grandes', description: HINT_DESTACADO, ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'album',
            label: 'Álbum',
            fields: [
              { type: 'string', name: 'titulo', label: 'Título', description: HINT_DESTACADO },
              { type: 'string', name: 'notaMargen', label: 'Nota al margen (si no hay fotos)' },
            ],
          },
          {
            type: 'object',
            name: 'eventos',
            label: 'Sección novedades',
            fields: [{ type: 'string', name: 'titulo', label: 'Título' }],
          },
          {
            type: 'object',
            name: 'transparencia',
            label: 'Transparencia',
            fields: [
              { type: 'string', name: 'titulo', label: 'Título', description: HINT_DESTACADO },
              {
                type: 'object',
                name: 'items',
                label: 'Ítems',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.titulo || 'Ítem' }) },
                fields: [
                  { type: 'string', name: 'titulo', label: 'Título' },
                  { type: 'string', name: 'texto', label: 'Texto', ui: { component: 'textarea' } },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'donar',
            label: 'Donar',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Antetítulo' },
              { type: 'string', name: 'titulo', label: 'Título', description: HINT_DESTACADO, ui: { component: 'textarea' } },
              { type: 'string', name: 'lead', label: 'Bajada', ui: { component: 'textarea' } },
              { type: 'string', name: 'agradecimiento', label: 'Nota manuscrita' },
              { type: 'string', name: 'aliasLabel', label: 'Etiqueta del alias' },
              { type: 'string', name: 'tip', label: 'Aclaración al pie', description: HINT_DESTACADO, ui: { component: 'textarea' } },
              { type: 'string', name: 'gracias', label: 'Cierre manuscrito' },
            ],
          },
        ],
      },

      // ---- FOTOS DEL SITIO ----
      {
        name: 'fotos',
        label: 'Fotos del sitio',
        path: 'src/data',
        format: 'json',
        match: { include: 'fotos' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: 'object',
            name: 'hero',
            label: 'Portada (la casa)',
            fields: [
              { type: 'image', name: 'src', label: 'Foto (vertical, ideal 4:5)' },
              { type: 'string', name: 'caption', label: 'Leyenda' },
            ],
          },
          {
            type: 'object',
            name: 'nosotros',
            label: 'Quiénes somos (la mesa)',
            fields: [
              { type: 'image', name: 'src', label: 'Foto (horizontal, ideal 5:4)' },
              { type: 'string', name: 'caption', label: 'Leyenda' },
            ],
          },
          {
            type: 'object',
            name: 'maradona',
            label: 'Retrato del Dr. Maradona',
            fields: [
              { type: 'image', name: 'src', label: 'Foto (vertical, ideal 4:5)' },
              { type: 'string', name: 'caption', label: 'Leyenda' },
            ],
          },
          {
            type: 'object',
            name: 'historia',
            label: 'Una historia de la casa',
            fields: [
              { type: 'image', name: 'src', label: 'Foto (solo con permiso de la familia)' },
              { type: 'string', name: 'caption', label: 'Leyenda' },
            ],
          },
          {
            type: 'object',
            name: 'album',
            label: 'Álbum — la casa por dentro',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.caption || 'Foto' }) },
            fields: [
              { type: 'image', name: 'src', label: 'Foto (cuadrada, ideal 1:1)' },
              { type: 'string', name: 'caption', label: 'Leyenda' },
            ],
          },
        ],
      },

      // ---- CONTACTO Y CUENTA ----
      {
        name: 'site',
        label: 'Contacto y cuenta',
        path: 'src/data',
        format: 'json',
        match: { include: 'site' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'nombre', label: 'Nombre de la casa' },
          { type: 'string', name: 'nombreLegal', label: 'Nombre legal' },
          { type: 'string', name: 'tagline', label: 'Bajada (header)' },
          { type: 'string', name: 'email', label: 'Email' },
          { type: 'string', name: 'whatsapp', label: 'WhatsApp (solo números, empieza con 549)' },
          { type: 'string', name: 'whatsappDisplay', label: 'WhatsApp (como se muestra)' },
          { type: 'string', name: 'direccion', label: 'Dirección' },
          { type: 'string', name: 'instagram', label: 'Instagram (URL completa; vacío = «pronto»)' },
          { type: 'string', name: 'alias', label: 'Alias para transferencias' },
          { type: 'string', name: 'titular', label: 'Titular de la cuenta' },
          { type: 'string', name: 'cbu', label: 'CBU' },
          { type: 'string', name: 'cuit', label: 'CUIT' },
        ],
      },

      // ---- NÚMEROS DEL AÑO ----
      {
        name: 'stats',
        label: 'Números del año',
        path: 'src/data',
        format: 'json',
        match: { include: 'stats' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'titulo', label: 'Sello (ej. Nuestro año)' },
          {
            type: 'object',
            name: 'items',
            label: 'Números',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.detalle || 'Número' }) },
            fields: [
              { type: 'string', name: 'valor', label: 'Número (ej. +120)' },
              { type: 'string', name: 'detalle', label: 'Descripción' },
              { type: 'boolean', name: 'ejemplo', label: '¿Es dato de ejemplo?' },
            ],
          },
          { type: 'string', name: 'nota', label: 'Nota al pie (aparece si hay datos de ejemplo)' },
        ],
      },

      // ---- AUSPICIOS ----
      {
        name: 'tiers',
        label: 'Auspicios (empresas)',
        path: 'src/data',
        format: 'json',
        match: { include: 'tiers' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: 'object',
            name: 'items',
            label: 'Niveles de auspicio',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.nombre || 'Nivel' }) },
            fields: [
              { type: 'string', name: 'nombre', label: 'Nombre' },
              { type: 'string', name: 'nights', label: 'Equivale a' },
              { type: 'string', name: 'monto', label: 'Monto (ej. $ 250.000 o «A convenir»)' },
              { type: 'string', name: 'periodo', label: 'Período (ej. / mes; vacío si no aplica)' },
              { type: 'boolean', name: 'feat', label: '¿Destacado?' },
              { type: 'string', name: 'destacado', label: 'Etiqueta del destacado' },
              { type: 'string', name: 'cta', label: 'Texto del botón' },
              { type: 'string', name: 'beneficios', label: 'Beneficios', list: true },
            ],
          },
        ],
      },
    ],
  },
});
