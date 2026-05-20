import type { CollectionEntry } from 'astro:content';
import { sortByDateDesc } from './content-dates';

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
  startDate: string;
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
type HeatmapStartDate = Date | string | null | undefined;

const DAYS_IN_WEEK = 7;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

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
  return sortByDateDesc(posts)
    .slice(0, Math.max(1, count))
    .map((post) => ({
      title: post.data.title,
      href: `/blog/${post.id}/`,
      date: post.data.date,
    }));
}

function getStartOfWeek(date: Date) {
  const start = new Date(date);
  const dayOffset = (start.getDay() + 6) % 7;
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - dayOffset);

  return start;
}

function getConfiguredStartDate(startDate: HeatmapStartDate) {
  if (!startDate) return null;

  const date = startDate instanceof Date ? new Date(startDate) : new Date(startDate);

  if (Number.isNaN(date.valueOf())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);
  return date;
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
  startDate?: HeatmapStartDate,
): HeatmapWindow {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentWeekStart = getStartOfWeek(today);
  const configuredStartDate = getConfiguredStartDate(startDate);
  const start = configuredStartDate
    ? getStartOfWeek(configuredStartDate > today ? today : configuredStartDate)
    : new Date(currentWeekStart);
  const safeWeeks = configuredStartDate
    ? Math.max(
        1,
        Math.floor((currentWeekStart.valueOf() - start.valueOf()) / (DAYS_IN_WEEK * DAY_IN_MS)) + 1,
      )
    : Math.max(1, Math.floor(weeks));

  if (!configuredStartDate) {
    start.setDate(start.getDate() - (safeWeeks - 1) * DAYS_IN_WEEK);
  }

  const postsByDate = getPostsByDate(posts);
  const days: HeatmapDay[] = [];

  for (let index = 0; index < safeWeeks * DAYS_IN_WEEK; index += 1) {
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
    startDate: getDateKey(start),
    totalPosts: days.reduce((total, day) => total + day.count, 0),
    activeDays: days.filter((day) => day.count > 0).length,
    currentStreak,
    latestPosts: getLatestPosts(posts, latestCount),
  };
}
