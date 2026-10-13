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
    // Stable cross-reference key. Slugs and titles carry week/part numbers that may be
    // renumbered; `label` never changes and is what <Ref>, <Bridge>, <Prereq> resolve.
    label: z.string().optional(),
    // Labels (or slugs) of foundation notes this note reuses; rendered by <Prereq>
    // and reverse-indexed by <UsedBy> on the target note.
    prereqs: z.array(z.string()).default([]),
    lang: z.enum(['en', 'zh']),
    title: z.string(),
    category: z.enum(['research-areas', 'courses', 'academic-skills']),
    group: z.string(),
    status: z.enum(['available', 'draft', 'missing', 'coming-soon']),
    updated: z.coerce.date(),
    summary: z.string(),
    demos: z.array(z.string()).default([]),
    references: z.array(referenceSchema).default([]),
  }),
});

const handbook = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/handbook',
    generateId: ({ data }) => `${data.lang}/${data.slug}`,
  }),
  schema: z.object({
    slug: z.string(),
    lang: z.enum(['en', 'zh']),
    title: z.string(),
    section: z.enum(['joining', 'practice', 'getting-started', 'craft']),
    order: z.number(),
    status: z.enum(['available', 'draft']),
    updated: z.coerce.date(),
    summary: z.string(),
  }),
});

/**
 * Knowledge Realms (知識秘境) — dialogue scripts that walk a reader through one note's
 * questions one step at a time. Each script points at the note it was carved
 * from via `note` (the note's stable `label`), so the index can group scripts
 * under the matching "skill manual" (the note's group) and the note page can
 * link back. See docs/dojo-design.md.
 */
const dojo = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/dojo',
    generateId: ({ data }) => `${data.lang}/${data.slug}`,
  }),
  schema: z.object({
    slug: z.string(),
    lang: z.enum(['en', 'zh']),
    title: z.string(),
    /** `label` of the source note; resolved with resolveNoteRef at build. */
    note: z.string(),
    /** One line shown on the index card: the question this dialogue chases. */
    summary: z.string(),
    status: z.enum(['available', 'draft']).default('available'),
    updated: z.coerce.date(),
    /** Rough walk-through time in minutes, shown on the card. */
    minutes: z.number().optional(),
    /** Increment when the dialogue's main-line steps change. */
    progressVersion: z.string().default('1'),
    /** A sequence of related question chains, ordered independently of updates. */
    series: z.string().optional(),
    order: z.number().int().nonnegative().optional(),
    /**
     * Visual theme of the walk. `board` (任務告示板) is the default; `plates`
     * (道場掛牌) and `scroll` (秘笈卷軸) exist so another course can look
     * different. The theme only changes CSS — the node contract is the same.
     */
    theme: z.enum(['board', 'plates', 'scroll']).default('board'),
  }),
});

export const collections = { notes, handbook, dojo };
