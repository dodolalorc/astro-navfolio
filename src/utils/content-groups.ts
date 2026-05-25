import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

export interface ContentGroup {
  name: string;
  slug: string;
  count: number;
}

export interface SeriesGroup extends ContentGroup {
  posts: BlogPost[];
}

export interface SeriesContext {
  name: string;
  slug: string;
  prev?: BlogPost;
  next?: BlogPost;
  current: number;
  total: number;
  posts: BlogPost[];
}

function isPublished(post: BlogPost) {
  return !post.data.draft;
}

function getComparableName(name: string) {
  return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

function getGroupItems(post: BlogPost, field: 'categories' | 'series') {
  const seen = new Set<string>();

  return (post.data[field] ?? [])
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => {
      const slug = slugifyGroupName(item);

      if (seen.has(slug)) {
        return false;
      }

      seen.add(slug);
      return true;
    });
}

function sortByName(a: ContentGroup, b: ContentGroup) {
  return a.name.localeCompare(b.name, 'zh-Hans-CN', { sensitivity: 'base' });
}

function sortBySeriesDateAsc(a: BlogPost, b: BlogPost) {
  const dateDelta = a.data.date.valueOf() - b.data.date.valueOf();

  if (dateDelta !== 0) {
    return dateDelta;
  }

  return a.id.localeCompare(b.id);
}

export function slugifyGroupName(name: string) {
  const normalized = getComparableName(name)
    .normalize('NFKC')
    .replace(/['"]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'untitled';
}

function createGroupMap(posts: BlogPost[], field: 'categories' | 'series') {
  const groups = new Map<string, { name: string; slug: string; posts: BlogPost[] }>();

  posts.filter(isPublished).forEach((post) => {
    getGroupItems(post, field).forEach((name) => {
      const slug = slugifyGroupName(name);
      const group = groups.get(slug);

      if (group) {
        group.posts.push(post);
        return;
      }

      groups.set(slug, { name, slug, posts: [post] });
    });
  });

  return groups;
}

export function getAllCategories(posts: BlogPost[]): ContentGroup[] {
  return [...createGroupMap(posts, 'categories').values()]
    .map(({ name, slug, posts: groupPosts }) => ({
      name,
      slug,
      count: groupPosts.length,
    }))
    .sort((a, b) => b.count - a.count || sortByName(a, b));
}

export function getPostsByCategory(posts: BlogPost[], categorySlug: string) {
  return posts.filter(
    (post) =>
      isPublished(post) &&
      getGroupItems(post, 'categories').some((name) => slugifyGroupName(name) === categorySlug),
  );
}

export function getAllSeries(posts: BlogPost[]): SeriesGroup[] {
  return [...createGroupMap(posts, 'series').values()]
    .map(({ name, slug, posts: groupPosts }) => ({
      name,
      slug,
      posts: groupPosts.sort(sortBySeriesDateAsc),
      count: groupPosts.length,
    }))
    .sort((a, b) => {
      const latestA = Math.max(...a.posts.map((post) => post.data.date.valueOf()));
      const latestB = Math.max(...b.posts.map((post) => post.data.date.valueOf()));

      return latestB - latestA || sortByName(a, b);
    });
}

export function getPostsBySeries(posts: BlogPost[], seriesSlug: string) {
  return posts
    .filter(
      (post) =>
        isPublished(post) &&
        getGroupItems(post, 'series').some((name) => slugifyGroupName(name) === seriesSlug),
    )
    .sort(sortBySeriesDateAsc);
}

export function getSeriesContext(
  post: BlogPost,
  allPosts: BlogPost[],
  seriesName = getGroupItems(post, 'series')[0],
): SeriesContext | undefined {
  if (!seriesName) {
    return undefined;
  }

  const slug = slugifyGroupName(seriesName);
  const posts = getPostsBySeries(allPosts, slug);
  const index = posts.findIndex((seriesPost) => seriesPost.id === post.id);

  if (index < 0) {
    return undefined;
  }

  return {
    name: seriesName,
    slug,
    prev: posts[index - 1],
    next: posts[index + 1],
    current: index + 1,
    total: posts.length,
    posts,
  };
}
