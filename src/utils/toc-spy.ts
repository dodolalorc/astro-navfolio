type TocLink = HTMLAnchorElement;
type TocRoot = HTMLElement;

type TocWindow = Window & {
  __navfolioTocSpyCleanup?: () => void;
  __navfolioTocSpyEvents?: boolean;
  __navfolioTocSpyPageKey?: string;
};

import { buildHashIdCandidates, normalizeHash, normalizeIdValue } from './toc-hash';

const getTocRoots = (): TocRoot[] =>
  Array.from(document.querySelectorAll<TocRoot>('[data-toc-root]'));

const getTocLinks = (root?: ParentNode): TocLink[] => {
  const scope = root ?? document;

  return Array.from(scope.querySelectorAll<TocLink>('[data-toc-link]')).filter((link) =>
    getNormalizedLinkHash(link).startsWith('#'),
  );
};

const getNormalizedLinkHash = (link: TocLink): string =>
  normalizeHash(link.dataset.tocHash || link.getAttribute('href') || link.hash || '');

const getSectionFromHash = (hash: string): HTMLElement | null => {
  const normalizedHash = normalizeHash(hash);
  if (!normalizedHash) {
    return null;
  }

  const idCandidates = buildHashIdCandidates(normalizedHash);

  for (const id of idCandidates) {
    const section = document.getElementById(id);
    if (section) {
      return section;
    }
  }

  const normalizedId = normalizedHash.slice(1);
  const articleHeadings = Array.from(
    document.querySelectorAll<HTMLElement>(
      '.article-content h1[id], .article-content h2[id], .article-content h3[id]',
    ),
  );

  return articleHeadings.find((heading) => normalizeIdValue(heading.id) === normalizedId) ?? null;
};

const getSections = (): HTMLElement[] => {
  const normalizedIds = new Set<string>();
  const uniqueHashes = new Set(
    getTocLinks()
      .map((link) => getNormalizedLinkHash(link))
      .filter(Boolean),
  );

  return Array.from(uniqueHashes)
    .map((hash) => getSectionFromHash(hash))
    .filter((section): section is HTMLElement => {
      if (!section) {
        return false;
      }

      const normalizedId = normalizeIdValue(section.id);
      if (normalizedIds.has(normalizedId)) {
        return false;
      }

      normalizedIds.add(normalizedId);
      return true;
    });
};

const setActiveLink = (activeHash: string): void => {
  const normalizedActiveHash = normalizeHash(activeHash);

  for (const root of getTocRoots()) {
    const links = getTocLinks(root);
    const activeIndex = links.findIndex(
      (link) => getNormalizedLinkHash(link) === normalizedActiveHash,
    );

    for (const [index, link] of links.entries()) {
      const state =
        activeIndex < 0
          ? 'future'
          : index < activeIndex
            ? 'past'
            : index > activeIndex
              ? 'future'
              : 'active';
      const isActive = state === 'active';

      link.dataset.state = state;
      link.classList.toggle('active', isActive);
      link.classList.toggle('past', state === 'past');
      link.classList.toggle('future', state === 'future');

      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  }
};

const initNavfolioToc = (): (() => void) | null => {
  if (getTocLinks().length === 0) {
    return null;
  }

  const controller = new AbortController();
  const { signal } = controller;
  const sections = getSections();
  let activeHash = '';
  let ticking = false;
  let freezeActiveFromScroll = false;
  let observer: IntersectionObserver | null = null;

  const setActiveByHash = (hash: string): boolean => {
    const section = getSectionFromHash(hash);
    if (!section) {
      return false;
    }

    const sectionHash = normalizeHash(`#${section.id}`);
    if (!sectionHash) {
      return false;
    }

    activeHash = sectionHash;
    setActiveLink(activeHash);
    return true;
  };

  const computeActiveHash = (): string => {
    if (sections.length === 0) {
      return '';
    }

    const activationOffset = 120;
    const current =
      sections
        .filter((section) => section.getBoundingClientRect().top <= activationOffset)
        .at(-1) ?? sections[0];
    if (!current) {
      return '';
    }

    return normalizeHash(`#${current.id}`);
  };

  const updateActiveSection = () => {
    ticking = false;

    const nextActiveHash = computeActiveHash();
    if (!nextActiveHash || nextActiveHash === activeHash) {
      return;
    }

    activeHash = nextActiveHash;
    setActiveLink(activeHash);
  };

  const scheduleUpdateActiveSection = () => {
    if (freezeActiveFromScroll) {
      return;
    }

    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateActiveSection);
  };

  const scrollToHeading = (hash: string): void => {
    const section = getSectionFromHash(hash);
    if (!section) {
      return;
    }

    const headerOffset = 80;
    const top = section.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top,
      behavior: 'smooth',
    });

    activeHash = normalizeHash(`#${section.id}`);
    setActiveLink(activeHash);
  };

  const unlockActiveFromScroll = () => {
    if (!freezeActiveFromScroll) {
      return;
    }

    freezeActiveFromScroll = false;
    scheduleUpdateActiveSection();
  };

  const onKeydownUnlock = (event: KeyboardEvent) => {
    const scrollKeys = new Set([
      'ArrowDown',
      'ArrowUp',
      'PageDown',
      'PageUp',
      'Home',
      'End',
      'Space',
    ]);

    if (scrollKeys.has(event.code) || scrollKeys.has(event.key)) {
      unlockActiveFromScroll();
    }
  };

  for (const link of getTocLinks()) {
    link.addEventListener(
      'click',
      (event: MouseEvent) => {
        const normalizedHash = getNormalizedLinkHash(link);
        if (!normalizedHash) {
          return;
        }

        event.preventDefault();
        history.pushState(null, '', normalizedHash);
        freezeActiveFromScroll = true;
        scrollToHeading(normalizedHash);
      },
      { signal },
    );
  }

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      () => {
        scheduleUpdateActiveSection();
      },
      {
        root: null,
        rootMargin: '-120px 0px -70% 0px',
        threshold: 0,
      },
    );

    for (const section of sections) {
      observer.observe(section);
    }
  }

  const onPopstate = () => {
    freezeActiveFromScroll = false;

    if (!setActiveByHash(window.location.hash)) {
      scheduleUpdateActiveSection();
    }
  };
  const onHashchange = () => {
    freezeActiveFromScroll = false;

    if (!setActiveByHash(window.location.hash)) {
      scheduleUpdateActiveSection();
    }
  };

  window.addEventListener('scroll', scheduleUpdateActiveSection, { passive: true, signal });
  window.addEventListener('resize', scheduleUpdateActiveSection, { passive: true, signal });
  window.addEventListener('wheel', unlockActiveFromScroll, { passive: true, signal });
  window.addEventListener('touchstart', unlockActiveFromScroll, { passive: true, signal });
  window.addEventListener('keydown', onKeydownUnlock, { signal });
  window.addEventListener('popstate', onPopstate, { signal });
  window.addEventListener('hashchange', onHashchange, { signal });

  if (!setActiveByHash(window.location.hash)) {
    scheduleUpdateActiveSection();
  }

  return () => {
    observer?.disconnect();
    controller.abort();
  };
};

export const mountNavfolioTocSpy = (): void => {
  const tocWindow = window as TocWindow;
  const cleanupCurrent = () => {
    tocWindow.__navfolioTocSpyCleanup?.();
    tocWindow.__navfolioTocSpyCleanup = undefined;
    tocWindow.__navfolioTocSpyPageKey = undefined;
  };

  const mountCurrentPage = () => {
    const pageKey = `${window.location.pathname}${window.location.search}`;
    if (tocWindow.__navfolioTocSpyPageKey === pageKey) {
      return;
    }

    cleanupCurrent();

    const cleanup = initNavfolioToc();
    if (cleanup) {
      tocWindow.__navfolioTocSpyCleanup = cleanup;
      tocWindow.__navfolioTocSpyPageKey = pageKey;
    }
  };

  if (!tocWindow.__navfolioTocSpyEvents) {
    tocWindow.__navfolioTocSpyEvents = true;
    document.addEventListener('astro:page-load', mountCurrentPage);
    document.addEventListener('astro:before-swap', cleanupCurrent);
    window.addEventListener('pagehide', cleanupCurrent);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountCurrentPage, { once: true });
  } else {
    mountCurrentPage();
  }
};
