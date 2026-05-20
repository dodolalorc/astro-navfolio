import type { SiteConfig } from '../data/site';

export type CommentProvider = SiteConfig['comments']['provider'];
export type CommentsConfig = SiteConfig['comments'];

const giscusRequiredFields = ['repo', 'repo_id', 'category', 'category_id'] as const;

export function warnMissingCommentConfig(provider: CommentProvider, fields: string[]) {
  if (!import.meta.env.DEV || fields.length === 0) {
    return;
  }

  console.warn(
    `[navfolio comments] ${provider} comments are enabled but missing required config: ${fields.join(
      ', ',
    )}. The comment block will not render for this page.`,
  );
}

export function getCommentProvider(config: CommentsConfig): CommentProvider | null {
  if (!config.enabled || !config.show_on_posts || config.provider === 'none') {
    return null;
  }

  return config.provider;
}

export function getMissingProviderFields(config: CommentsConfig, provider: CommentProvider) {
  if (provider === 'giscus') {
    return giscusRequiredFields.filter((field) => !config.giscus[field]?.trim());
  }

  if (provider === 'utterances') {
    return config.utterances.repo.trim() ? [] : ['repo'];
  }

  if (provider === 'waline') {
    return config.waline.server_url.trim() ? [] : ['server_url'];
  }

  return [];
}

export function canRenderProvider(config: CommentsConfig, provider: CommentProvider) {
  const missingFields = getMissingProviderFields(config, provider);
  warnMissingCommentConfig(provider, missingFields);

  return missingFields.length === 0;
}

export function shouldRenderWalinePageView(config: CommentsConfig) {
  if (
    !config.enabled ||
    !config.show_on_posts ||
    config.provider !== 'waline' ||
    !config.waline.pageview
  ) {
    return false;
  }

  const missingFields = getMissingProviderFields(config, 'waline');
  warnMissingCommentConfig('waline', missingFields);

  return missingFields.length === 0;
}
