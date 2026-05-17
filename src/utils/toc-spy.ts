type TocLink = HTMLAnchorElement;
type TocRoot = HTMLElement;

type TocWindow = Window & {
  __navfolioTocSpy?: boolean;
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

const initNavfolioToc = (): void => {
  if (getTocLinks().length === 0) {
    return;
  }

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
    link.addEventListener('click', (event: MouseEvent) => {
      const normalizedHash = getNormalizedLinkHash(link);
      if (!normalizedHash) {
        return;
      }

      event.preventDefault();
      history.pushState(null, '', normalizedHash);
      freezeActiveFromScroll = true;
      scrollToHeading(normalizedHash);
    });
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

  window.addEventListener('scroll', scheduleUpdateActiveSection, { passive: true });
  window.addEventListener('resize', scheduleUpdateActiveSection, { passive: true });
  window.addEventListener('wheel', unlockActiveFromScroll, { passive: true });
  window.addEventListener('touchstart', unlockActiveFromScroll, { passive: true });
  window.addEventListener('keydown', onKeydownUnlock);
  window.addEventListener('popstate', () => {
    freezeActiveFromScroll = false;

    if (!setActiveByHash(window.location.hash)) {
      scheduleUpdateActiveSection();
    }
  });
  window.addEventListener('hashchange', () => {
    freezeActiveFromScroll = false;

    if (!setActiveByHash(window.location.hash)) {
      scheduleUpdateActiveSection();
    }
  });
  window.addEventListener(
    'pagehide',
    () => {
      observer?.disconnect();
      window.removeEventListener('keydown', onKeydownUnlock);
    },
    { once: true },
  );

  if (!setActiveByHash(window.location.hash)) {
    scheduleUpdateActiveSection();
  }
};

export const mountNavfolioTocSpy = (): void => {
  const tocWindow = window as TocWindow;
  if (tocWindow.__navfolioTocSpy) {
    return;
  }

  tocWindow.__navfolioTocSpy = true;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavfolioToc, { once: true });
  } else {
    initNavfolioToc();
  }
};
