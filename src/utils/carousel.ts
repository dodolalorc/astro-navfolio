type CarouselListener = [
  target: EventTarget,
  eventName: string,
  handler: EventListener,
  options?: AddEventListenerOptions | boolean,
];

type GoToOptions = {
  smooth?: boolean;
};

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const getElement = <T extends Element>(
  root: ParentNode,
  selector: string,
  type: { new (...args: never[]): T },
) => {
  const element = root.querySelector(selector);
  return element instanceof type ? element : undefined;
};

class AstroCarouselElement extends HTMLElement {
  private track?: HTMLDivElement;
  private slides: HTMLElement[] = [];
  private prevButton?: HTMLButtonElement;
  private nextButton?: HTMLButtonElement;
  private dotsContainer?: HTMLDivElement;
  private controls?: HTMLDivElement;
  private toggleButton?: HTMLButtonElement;
  private bar?: HTMLDivElement;
  private dots: HTMLButtonElement[] = [];
  private loop = true;
  private autoplay = false;
  private interval = 5000;
  private startIndex = 0;
  private showDots = true;
  private slideRoleDescription = '幻灯片';
  private currentIndex = 0;
  private isPlaying = false;
  private timerId?: number;
  private frameId?: number;
  private listeners: CarouselListener[] = [];

  connectedCallback() {
    this.track = getElement(this, '[data-carousel-track]', HTMLDivElement);
    this.slides = Array.from(this.querySelectorAll<HTMLElement>('[data-carousel-slide]'));
    this.prevButton = getElement(this, '[data-carousel-prev]', HTMLButtonElement);
    this.nextButton = getElement(this, '[data-carousel-next]', HTMLButtonElement);
    this.dotsContainer = getElement(this, '[data-carousel-dots]', HTMLDivElement);
    this.controls = getElement(this, '[data-carousel-controls]', HTMLDivElement);
    this.toggleButton = getElement(this, '[data-carousel-toggle]', HTMLButtonElement);
    this.bar = getElement(this, '[data-carousel-bar]', HTMLDivElement);
    this.loop = this.dataset.loop === 'true';
    this.autoplay = this.dataset.autoplay === 'true';
    this.interval = Number(this.dataset.interval || 5000);
    this.startIndex = Number(this.dataset.startIndex || 0);
    this.showDots = this.dataset.showDots === 'true';
    this.slideRoleDescription = this.dataset.slideRoleDescription || '幻灯片';
    this.currentIndex = 0;
    this.isPlaying = false;
    this.timerId = undefined;
    this.frameId = undefined;
    this.listeners = [];
    this.dots = [];

    if (!this.track || this.slides.length === 0) {
      this.hideChrome();
      return;
    }

    this.setupSlides();
    this.setupDots();
    this.bindEvents();
    this.goTo(this.startIndex, { smooth: false });

    if (this.slides.length <= 1) {
      this.hideChrome();
      return;
    }

    if (this.autoplay && !reducedMotionQuery.matches) {
      this.startAutoplay();
    }
  }

  disconnectedCallback() {
    this.stopAutoplay();
    if (this.frameId) {
      window.cancelAnimationFrame(this.frameId);
    }

    for (const [target, eventName, handler, options] of this.listeners) {
      target.removeEventListener(eventName, handler, options);
    }

    this.listeners = [];
  }

  private addListener(
    target: EventTarget,
    eventName: string,
    handler: EventListener,
    options?: AddEventListenerOptions | boolean,
  ) {
    target.addEventListener(eventName, handler, options);
    this.listeners.push([target, eventName, handler, options]);
  }

  private hideChrome() {
    if (this.controls) this.controls.hidden = true;
    if (this.dotsContainer) this.dotsContainer.hidden = true;
    if (this.toggleButton) this.toggleButton.hidden = true;
    if (this.bar && this.slides.length <= 1) this.bar.hidden = true;
  }

  private setupSlides() {
    this.slides.forEach((slide, index) => {
      slide.setAttribute('role', slide.getAttribute('role') || 'group');
      slide.setAttribute('aria-roledescription', this.slideRoleDescription);

      if (!slide.hasAttribute('aria-label') && !slide.hasAttribute('aria-labelledby')) {
        slide.setAttribute('aria-label', `${index + 1} / ${this.slides.length}`);
      }
    });
  }

  private setupDots() {
    if (!this.showDots || !this.dotsContainer || this.slides.length <= 1) return;

    this.dotsContainer.textContent = '';
    this.dots = this.slides.map((slide, index) => {
      const label = slide.getAttribute('data-carousel-label') || `第 ${index + 1} 张`;
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'mdx-carousel__dot';
      dot.setAttribute('aria-label', `显示${label}`);
      dot.addEventListener('click', () => {
        this.stopAutoplay();
        this.goTo(index);
      });
      this.dotsContainer?.append(dot);
      return dot;
    });
  }

  private bindEvents() {
    if (this.prevButton) {
      this.addListener(this.prevButton, 'click', () => {
        this.stopAutoplay();
        this.prev();
      });
    }

    if (this.nextButton) {
      this.addListener(this.nextButton, 'click', () => {
        this.stopAutoplay();
        this.next();
      });
    }

    if (this.toggleButton) {
      this.addListener(this.toggleButton, 'click', () => {
        if (this.isPlaying) {
          this.stopAutoplay();
        } else {
          this.startAutoplay();
        }
      });
    }

    if (this.track) {
      this.addListener(this.track, 'scroll', () => this.scheduleScrollSync(), { passive: true });
    }

    this.addListener(this, 'keydown', (event) => this.handleKeydown(event as KeyboardEvent));
    this.addListener(this, 'mouseenter', () => this.stopAutoplay());
    this.addListener(this, 'focusin', () => this.stopAutoplay());
    this.addListener(window, 'resize', () => this.goTo(this.currentIndex, { smooth: false }));
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.stopAutoplay();
      this.prev();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.stopAutoplay();
      this.next();
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.stopAutoplay();
      this.goTo(0);
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.stopAutoplay();
      this.goTo(this.slides.length - 1);
    }
  }

  private normalizeIndex(index: number) {
    if (this.loop) {
      return (index + this.slides.length) % this.slides.length;
    }

    return Math.max(0, Math.min(index, this.slides.length - 1));
  }

  private goTo(index: number, options: GoToOptions = {}) {
    if (!this.track || this.slides.length === 0) return;

    const nextIndex = this.normalizeIndex(index);
    const slide = this.slides[nextIndex];
    const smooth = options.smooth !== false && !reducedMotionQuery.matches;

    this.track.scrollTo({
      left: slide.offsetLeft - this.track.offsetLeft,
      behavior: smooth ? 'smooth' : 'auto',
    });
    this.currentIndex = nextIndex;
    this.updateUI();
  }

  private next() {
    this.goTo(this.currentIndex + 1);
  }

  private prev() {
    this.goTo(this.currentIndex - 1);
  }

  private startAutoplay() {
    if (!this.autoplay || this.slides.length <= 1 || reducedMotionQuery.matches) return;

    this.stopAutoplay();
    this.isPlaying = true;
    this.timerId = window.setInterval(() => this.next(), this.interval);
    this.updateUI();
  }

  private stopAutoplay() {
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = undefined;
    }

    this.isPlaying = false;
    this.updateUI();
  }

  private scheduleScrollSync() {
    if (this.frameId) return;

    this.frameId = window.requestAnimationFrame(() => {
      this.frameId = undefined;
      const nextIndex = this.getClosestSlideIndex();

      if (nextIndex !== this.currentIndex) {
        this.currentIndex = nextIndex;
        this.updateUI();
      }
    });
  }

  private getClosestSlideIndex() {
    if (!this.track) return this.currentIndex;

    const scrollLeft = this.track.scrollLeft;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    this.slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - this.track!.offsetLeft - scrollLeft);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  private updateUI() {
    this.dots.forEach((dot, index) => {
      dot.setAttribute('aria-current', index === this.currentIndex ? 'true' : 'false');
    });

    if (!this.loop) {
      if (this.prevButton) this.prevButton.disabled = this.currentIndex === 0;
      if (this.nextButton) {
        this.nextButton.disabled = this.currentIndex === this.slides.length - 1;
      }
    }

    if (this.track) {
      this.track.setAttribute('aria-live', this.isPlaying ? 'off' : 'polite');
    }

    if (this.toggleButton) {
      this.toggleButton.setAttribute(
        'aria-label',
        this.isPlaying ? '暂停自动播放' : '开始自动播放',
      );
      this.toggleButton.dataset.playing = this.isPlaying ? 'true' : 'false';
    }
  }
}

export const defineAstroCarousel = () => {
  if (!customElements.get('astro-carousel')) {
    customElements.define('astro-carousel', AstroCarouselElement);
  }
};
