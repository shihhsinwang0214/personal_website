import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isListedNote, noteResearchArea, noteRoute, sortNotes } from '../lib/notes';

export const GET: APIRoute = async (context) => {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const notes = sortNotes(await getCollection('notes')).filter(
    (note) => note.data.status === 'available' && isListedNote(note),
  );

  return rss({
    title: 'Shih-Hsin Wang Notes & Guides',
    description: 'Research notes, technical guides, and academic skill resources.',
    site: context.site,
    items: notes.map((note) => ({
      title: note.data.title,
      description: note.data.summary,
      pubDate: note.data.updated,
      link: `${base}${noteRoute(note.data.slug, note.data.lang)}`,
      categories: [note.data.category, noteResearchArea(note), note.data.group, note.data.lang].filter(
        (category): category is string => Boolean(category),
      ),
    })),
  });
};
