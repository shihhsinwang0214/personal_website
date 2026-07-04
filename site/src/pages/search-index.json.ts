import { getCollection } from 'astro:content';
import { categoryLabels, isPublishedNote, noteRoute, researchAreaLabelForNote, sortNotes, statusLabels } from '../lib/notes';
import { withBase } from '../lib/url';

export async function GET() {
  // Missing translations have no standalone page; keep them out of search.
  const notes = sortNotes(await getCollection('notes')).filter(
    (note) => isPublishedNote(note) && note.data.status !== 'missing',
  );
  const entries = notes.map((note) => {
    const lang = note.data.lang;
    const category = categoryLabels[note.data.category][lang];
    const researchArea = researchAreaLabelForNote(note, lang) || '';
    const status = statusLabels[note.data.status][lang];
    const summary = note.data.summary || '';
    const text = [
      note.data.title,
      summary,
      category,
      researchArea,
      note.data.group,
      status,
      lang,
      note.data.slug,
    ].join(' ');

    return {
      url: withBase(noteRoute(note.data.slug, lang)),
      title: note.data.title,
      excerpt: summary || [category, researchArea, note.data.group].filter(Boolean).join(' / '),
      text,
    };
  });

  return new Response(JSON.stringify(entries), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}
