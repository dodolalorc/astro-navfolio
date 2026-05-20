import { getEntry } from 'astro:content';

export async function getSiteConfig() {
  const entry = await getEntry('siteConfig', 'config');

  if (!entry) {
    throw new Error('Missing site config entry in src/config/site.toml');
  }

  return entry.data;
}

export type SiteConfig = Awaited<ReturnType<typeof getSiteConfig>>;
export type SiteProfile = SiteConfig['profile'];
export type SiteLink = SiteConfig['topNav']['links'][number];
export type SiteVibe = SiteConfig['vibe'];
export type HomeNavigationItem = SiteConfig['home']['navigation'][number];
export type HomeConnectItem = SiteConfig['home']['connect'][number];
export type HomeDoingItem = SiteConfig['home']['doing'][number];
export type HomeIntro = SiteConfig['home']['intro'];
export type HomeQuote = SiteConfig['home']['quote'];
