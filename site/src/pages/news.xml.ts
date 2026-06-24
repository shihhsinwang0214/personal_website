import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { news } from '../data/content';
import { withBase } from '../lib/url';

const months = new Map([
  ['Jan', 0],
  ['Feb', 1],
  ['Mar', 2],
  ['Apr', 3],
  ['May', 4],
  ['Jun', 5],
  ['June', 5],
  ['Jul', 6],
  ['Aug', 7],
  ['Sep', 8],
  ['Oct', 9],
  ['Nov', 10],
  ['Dec', 11],
]);

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function parseMonthDate(value: string): Date {
  const [month, year] = value.split(/\s+/);
  return new Date(Date.UTC(Number(year), months.get(month) ?? 0, 1));
}

function linkList(item: (typeof news)[number]): string {
  if (!item.links?.length) return '';
  return item.links
    .map((link) => `<p><a href="${withBase(link.href)}">${link.label}</a></p>`)
    .join('');
}

export const GET: APIRoute = async (context) => {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');

  return rss({
    title: 'Shih-Hsin Wang News',
    description: 'Recent updates from Shih-Hsin Wang.',
    site: context.site,
    items: news.map((item) => {
      const text = stripHtml(item.html);
      return {
        title: text,
        description: text,
        content: `${item.html}${linkList(item)}`,
        pubDate: parseMonthDate(item.date),
        link: base,
      };
    }),
  });
};
