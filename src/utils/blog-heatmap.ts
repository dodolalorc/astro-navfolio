import type { CollectionEntry } from 'astro:content';
import { getContentLastmod, sortByLastmodDesc } from './content-dates';

export interface HeatmapPost {
  title: string;
  href: string;
}

export interface HeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  posts: HeatmapPost[];
  isFuture?: boolean;
}

export interface HeatmapWindow {
  days: HeatmapDay[];
  weeks: number;
  totalPosts: number;
  activeDays: number;
  currentStreak: number;
  latestPosts: LatestPost[];
}

export interface LatestPost {
  title: string;
  href: string;
  date: Date;
}

type BlogPost = CollectionEntry<'blog'>;

export function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

export function getLatestPosts(posts: BlogPost[], count = 1): LatestPost[] {
  return sortByLastmodDesc(posts)
    .slice(0, Math.max(1, count))
    .map((post) => ({
      title: post.data.title,
      href: `/blog/${post.id}/`,
      date: getContentLastmod(post),
    }));
}

function getStartOfWeek(date: Date) {
  const start = new Date(date);
  const dayOffset = (start.getDay() + 6) % 7;
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - dayOffset);

  return start;
}

function getPostsByDate(posts: BlogPost[]) {
  const postsByDate = new Map<string, HeatmapPost[]>();

  for (const post of posts) {
    const key = getDateKey(post.data.date);
    const existingPosts = postsByDate.get(key) ?? [];
    existingPosts.push({
      title: post.data.title,
      href: `/blog/${post.id}/`,
    });
    postsByDate.set(key, existingPosts);
  }

  return postsByDate;
}

export function createRecentBlogHeatmap(
  posts: BlogPost[],
  weeks = 12,
  latestCount = 1,
): HeatmapWindow {
  const safeWeeks = weeks === 24 ? 24 : 12;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentWeekStart = getStartOfWeek(today);
  const start = new Date(currentWeekStart);
  start.setDate(start.getDate() - (safeWeeks - 1) * 7);

  const postsByDate = getPostsByDate(posts);
  const days: HeatmapDay[] = [];

  for (let index = 0; index < safeWeeks * 7; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = getDateKey(date);
    const isFuture = date > today;
    const dayPosts = isFuture ? [] : (postsByDate.get(key) ?? []);

    days.push({
      date: key,
      count: dayPosts.length,
      level: getLevel(dayPosts.length),
      posts: dayPosts,
      isFuture,
    });
  }

  let currentStreak = 0;
  for (const day of [...days].reverse()) {
    const date = new Date(day.date);
    if (date > today) continue;
    if (day.count === 0) break;

    currentStreak += 1;
  }

  return {
    days,
    weeks: safeWeeks,
    totalPosts: days.reduce((total, day) => total + day.count, 0),
    activeDays: days.filter((day) => day.count > 0).length,
    currentStreak,
    latestPosts: getLatestPosts(posts, latestCount),
  };
}
