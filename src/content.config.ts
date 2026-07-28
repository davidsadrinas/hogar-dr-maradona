import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const eventos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/eventos' }),
  schema: z.object({
    titulo: z.string(),
    etiqueta: z.string(),
    fecha: z.coerce.date().optional(),
    imagen: z.string().optional(),
    orden: z.number().default(0),
    activo: z.boolean().default(true),
  }),
});

export const collections = { eventos };
