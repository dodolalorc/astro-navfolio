type PagefindResult = {
  id: string;
  data: () => Promise<{
    url: string;
    meta?: {
      title?: string;
    };
    excerpt: string;
  }>;
};

type PagefindModule = {
  init?: () => Promise<void>;
  options?: (options: { baseUrl?: string }) => Promise<void> | void;
  search: (query: string) => Promise<{ results: PagefindResult[] }>;
};

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const baseUrl = import.meta.env.BASE_URL || '/';
const pagefindPath = `${baseUrl.replace(/\/$/, '')}/pagefind/pagefind.js`.replace(
  /^\/pagefind/,
  '/pagefind',
);

let pagefindPromise: Promise<PagefindModule> | null = null;
let lastFocusedElement: HTMLElement | null = null;
const searchLayers = new WeakMap<HTMLElement, HTMLElement>();

function getSearchSurface(root: HTMLElement) {
  return searchLayers.get(root) ?? root;
}

function querySearchSurface<T extends Element>(root: HTMLElement, selector: string) {
  return getSearchSurface(root).querySelector<T>(selector) ?? root.querySelector<T>(selector);
}

function normalizeResultUrl(url: string) {
  if (/^https?:\/\//.test(url)) return url;
  const normalizedBase = baseUrl.replace(/\/$/, '');

  if (!normalizedBase || normalizedBase === '/') return url;
  if (url.startsWith(`${normalizedBase}/`)) return url;
  if (url.startsWith('/')) return `${normalizedBase}${url}`;

  return `${normalizedBase}/${url}`;
}

function getResultPath(url: string) {
  try {
    const path = new URL(normalizeResultUrl(url), window.location.origin).pathname;
    const normalizedBase = baseUrl.replace(/\/$/, '');

    if (normalizedBase && normalizedBase !== '/' && path.startsWith(`${normalizedBase}/`)) {
      return path.slice(normalizedBase.length) || '/';
    }

    return path;
  } catch {
    return normalizeResultUrl(url);
  }
}

function getResultKind(url: string) {
  const path = getResultPath(url);

  if (/^\/blog\/[^/]+\/?$/.test(path)) return 'Blog note';
  if (path.startsWith('/blog')) return 'Blog index';
  if (path.startsWith('/vibe')) return 'Vibe';
  if (path.startsWith('/projects')) return 'Project';

  return 'Page';
}

function getResultTitle(result: Awaited<ReturnType<PagefindResult['data']>>) {
  return result.meta?.title?.trim() || getResultPath(result.url);
}

async function loadPagefind() {
  if (!pagefindPromise) {
    pagefindPromise = import(/* @vite-ignore */ pagefindPath)
      .then(async (module: PagefindModule) => {
        await module.options?.({ baseUrl });
        await module.init?.();
        return module;
      })
      .catch((error) => {
        pagefindPromise = null;
        throw error;
      });
  }

  return pagefindPromise;
}

function setStatus(root: HTMLElement, status: string) {
  const statusNode = querySearchSurface<HTMLElement>(root, '[data-site-search-status]');
  if (statusNode) statusNode.textContent = status;
}

function setExpanded(root: HTMLElement, expanded: boolean) {
  root.dataset.searchOpen = expanded ? 'true' : 'false';
  const layer =
    searchLayers.get(root) ?? root.querySelector<HTMLElement>('[data-site-search-layer]');

  layer?.setAttribute('data-search-open', String(expanded));
  root
    .querySelector<HTMLButtonElement>('[data-site-search-trigger]')
    ?.setAttribute('aria-expanded', String(expanded));
}

function getFocusable(dialog: HTMLElement) {
  return Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => element.offsetParent !== null,
  );
}

function trapFocus(event: KeyboardEvent, dialog: HTMLElement) {
  if (event.key !== 'Tab') return;

  const focusable = getFocusable(dialog);
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function renderResults(root: HTMLElement, results: Awaited<ReturnType<PagefindResult['data']>>[]) {
  const list = querySearchSurface<HTMLElement>(root, '[data-site-search-results]');
  if (!list) return;

  list.replaceChildren();

  for (const result of results) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const title = document.createElement('span');
    const meta = document.createElement('span');
    const match = document.createElement('span');
    const matchLabel = document.createElement('span');
    const excerpt = document.createElement('span');

    link.href = normalizeResultUrl(result.url);
    title.className = 'site-search-result-title';
    title.textContent = getResultTitle(result);
    meta.className = 'site-search-result-meta';
    meta.textContent = `${getResultKind(result.url)} - ${getResultPath(result.url)}`;
    match.className = 'site-search-result-match';
    matchLabel.className = 'site-search-result-match-label';
    matchLabel.textContent = 'Matched passage';
    excerpt.className = 'site-search-result-excerpt';
    excerpt.innerHTML = result.excerpt;

    match.append(matchLabel, excerpt);
    link.append(title, meta, match);
    item.append(link);
    list.append(item);
  }
}

function debounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
  let timeout: number | undefined;

  return (...args: Parameters<T>) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => callback(...args), delay);
  };
}

export function initSiteSearch() {
  for (const root of document.querySelectorAll<HTMLElement>('[data-site-search-root]')) {
    if (root.dataset.siteSearchReady === 'true') continue;
    root.dataset.siteSearchReady = 'true';

    const trigger = root.querySelector<HTMLButtonElement>('[data-site-search-trigger]');
    const dialog = root.querySelector<HTMLElement>('[data-site-search-dialog]');
    const input = root.querySelector<HTMLInputElement>('[data-site-search-input]');
    const layer = root.querySelector<HTMLElement>('[data-site-search-layer]');
    const closeButtons = root.querySelectorAll<HTMLButtonElement>('[data-site-search-close]');
    const maxResults = Number(root.dataset.searchMaxResults || 6);

    if (!trigger || !dialog || !input || !layer) continue;

    for (const orphanedLayer of document.body.querySelectorAll<HTMLElement>(
      '[data-site-search-layer]',
    )) {
      if (orphanedLayer !== layer) orphanedLayer.remove();
    }

    searchLayers.set(root, layer);
    document.body.append(layer);

    const close = () => {
      setExpanded(root, false);
      input.value = '';
      renderResults(root, []);
      setStatus(root, root.dataset.searchIdleLabel || 'Start typing to search.');
      lastFocusedElement?.focus?.();
    };

    const open = () => {
      lastFocusedElement =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setExpanded(root, true);
      window.setTimeout(() => input.focus(), 30);
      void loadPagefind().catch(() => {
        setStatus(
          root,
          root.dataset.searchUnavailableLabel || 'Search index is not available yet.',
        );
      });
    };

    const runSearchNow = async () => {
      const query = input.value.trim();

      if (!query) {
        renderResults(root, []);
        setStatus(root, root.dataset.searchIdleLabel || 'Start typing to search.');
        return;
      }

      setStatus(root, root.dataset.searchLoadingLabel || 'Searching...');

      try {
        const pagefind = await loadPagefind();
        const search = await pagefind.search(query);
        const resultData = await Promise.all(
          search.results.slice(0, maxResults).map((result) => result.data()),
        );

        renderResults(root, resultData);
        setStatus(
          root,
          resultData.length > 0
            ? `${resultData.length} result${resultData.length === 1 ? '' : 's'}`
            : root.dataset.searchEmptyLabel || 'No notes found.',
        );
      } catch {
        renderResults(root, []);
        setStatus(
          root,
          root.dataset.searchUnavailableLabel || 'Search index is not available yet.',
        );
      }
    };
    const runSearch = debounce(runSearchNow, 120);

    trigger.addEventListener('click', open);
    root.addEventListener('site-search:open', open);
    input.addEventListener('input', runSearch);
    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;

      event.preventDefault();
      void runSearchNow();
    });

    for (const button of closeButtons) {
      button.addEventListener('click', close);
    }

    layer.addEventListener('click', (event) => {
      if ((event.target as Element).matches('[data-site-search-backdrop]')) close();
      if ((event.target as Element).closest('[data-site-search-results] a')) close();
    });

    document.addEventListener('keydown', (event) => {
      if (root.dataset.searchOpen !== 'true') return;
      if (event.key === 'Escape') close();
      trapFocus(event, dialog);
    });
  }
}

document.addEventListener('keydown', (event) => {
  const isModK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
  if (!isModK) return;

  const root = document.querySelector<HTMLElement>('[data-site-search-root]');
  if (!root) return;

  event.preventDefault();

  if (root.dataset.searchOpen === 'true') {
    querySearchSurface<HTMLInputElement>(root, '[data-site-search-input]')?.focus();
    return;
  }

  root.dispatchEvent(new CustomEvent('site-search:open'));
});

initSiteSearch();
document.addEventListener('astro:page-load', initSiteSearch);
