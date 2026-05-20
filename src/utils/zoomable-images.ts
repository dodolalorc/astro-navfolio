declare global {
  interface Window {
    __navfolioZoomableImagesReady?: boolean;
  }
}

type LightboxElements = {
  root: HTMLDivElement;
  image: HTMLImageElement;
  closeButton: HTMLButtonElement;
};

let lightboxElements: LightboxElements | undefined;
let previousBodyOverflow = '';

const isPlainMarkdownImage = (target: HTMLImageElement) =>
  Boolean(target.closest('.article-content')) &&
  !target.closest('[data-zoomable-image]') &&
  !target.closest('a[href]') &&
  (target.parentElement?.matches('.article-content > p, .article-content figure') ?? false);

const getZoomTarget = (target: EventTarget | null): HTMLImageElement | undefined => {
  if (!(target instanceof Element)) {
    return undefined;
  }

  const wrappedImage = target
    .closest('[data-zoomable-image]')
    ?.querySelector('[data-zoomable-image-target]');

  if (wrappedImage instanceof HTMLImageElement && !wrappedImage.closest('a[href]')) {
    return wrappedImage;
  }

  if (target instanceof HTMLImageElement && isPlainMarkdownImage(target)) {
    return target;
  }

  return undefined;
};

const closePreview = () => {
  if (!lightboxElements) {
    return;
  }

  lightboxElements.root.classList.remove('is-open');
  lightboxElements.root.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = previousBodyOverflow;
  lightboxElements.image.removeAttribute('src');
  lightboxElements.image.alt = '';
  lightboxElements.image.removeAttribute('title');
};

const createLightbox = (): LightboxElements => {
  const root = document.createElement('div');
  root.className = 'zoomable-image-lightbox';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `
    <button class="zoomable-image-lightbox__close" type="button" aria-label="Close image preview">
      <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
        <path d="M18 6 6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"></path>
      </svg>
    </button>
    <img class="zoomable-image-lightbox__image" alt="" />
  `;
  document.body.append(root);

  const image = root.querySelector('.zoomable-image-lightbox__image');
  const closeButton = root.querySelector('.zoomable-image-lightbox__close');

  if (!(image instanceof HTMLImageElement) || !(closeButton instanceof HTMLButtonElement)) {
    throw new Error('Failed to initialize zoomable image lightbox.');
  }

  root.addEventListener('click', (event) => {
    if (event.target === root) {
      closePreview();
    }
  });

  closeButton.addEventListener('click', closePreview);

  return { root, image, closeButton };
};

const getLightbox = (): LightboxElements => {
  lightboxElements ??= createLightbox();
  return lightboxElements;
};

const openPreview = (sourceImage: HTMLImageElement) => {
  const { root, image, closeButton } = getLightbox();

  previousBodyOverflow = document.body.style.overflow;
  image.src = sourceImage.currentSrc || sourceImage.src;
  image.alt = sourceImage.alt || '';

  if (sourceImage.title) {
    image.title = sourceImage.title;
  } else {
    image.removeAttribute('title');
  }

  document.body.style.overflow = 'hidden';
  root.classList.add('is-open');
  root.setAttribute('aria-hidden', 'false');
  closeButton.focus({ preventScroll: true });
};

export const initZoomableImages = () => {
  if (window.__navfolioZoomableImagesReady) {
    return;
  }

  window.__navfolioZoomableImagesReady = true;

  document.addEventListener('click', (event) => {
    const image = getZoomTarget(event.target);

    if (image) {
      openPreview(image);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightboxElements?.root.classList.contains('is-open')) {
      closePreview();
      return;
    }

    const image = getZoomTarget(event.target);

    if (!image || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    openPreview(image);
  });
};

export {};
