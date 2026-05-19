import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { getSiteConfig } from '../data/site';
import { sortByLastmodDesc } from '../utils/content-dates';

export async function GET(context) {
  const { site } = await getSiteConfig();
  const posts = sortByLastmodDesc(await getCollection('blog'));
  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
  });
}
