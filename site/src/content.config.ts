import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const referenceSchema = z.union([
  z.string(),
  z.object({
    label: z.string(),
    href: z.string().optional(),
  }),
]);

const notes = defineCollection({
  loader: glob({
    // Notes are organized by category/group under this base, while routes remain
    // stable because collection IDs come from frontmatter lang + slug.
    pattern: '**/*.{md,mdx}',
    base: './src/content/notes',
    generateId: ({ data }) => `${data.lang}/${data.slug}`,
  }),
  schema: z.object({
    slug: z.string(),
    lang: z.enum(['en', 'zh']),
    title: z.string(),
    category: z.enum(['research-areas', 'academic-skills']),
    group: z.string(),
    status: z.enum(['available', 'draft', 'missing', 'coming-soon']),
    updated: z.coerce.date(),
    summary: z.string(),
    demos: z.array(z.string()).default([]),
    references: z.array(referenceSchema).default([]),
  }),
});

export const collections = { notes };
