'use client';

import * as React from 'react';
import { loadGsap, prefersReducedMotion } from '@/lib/gsap';
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
  /** autoplay interval in milliseconds; 0 or undefined to disable */
  autoplay?: number;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = 'horizontal',
      opts,
      setApi,
      plugins,
      autoplay,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      // trigger optional GSAP crossfade on selection (handled in effect)
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    // GSAP crossfade on select + autoplay
    React.useEffect(() => {
      if (!api) return;

      let mounted = true;
      let gsap: any = null;
      let tl: any = null;
      let autoplayId: any = null;
      const prevIndexRef = { current: api.selectedScrollSnap() };

      const runAnimation = async (index: number, prevIndex: number) => {
        if (prefersReducedMotion()) return;
        try {
          const mod = await loadGsap();
          if (!mounted || !mod) return;
          gsap = (mod as any).gsap ?? mod;

          const slides: HTMLElement[] = api.slideNodes?.() ?? [];
          const prevSlide = slides[prevIndex];
          const nextSlide = slides[index];

          // find media elements inside slides
          const prevMedia = prevSlide?.querySelectorAll('img, picture, video') ?? [];
          const nextMedia = nextSlide?.querySelectorAll('img, picture, video') ?? [];

          // kill previous timeline
          tl?.kill?.();
          tl = gsap.timeline();

          // fade out previous media
          if (prevMedia && prevMedia.length) {
            tl.to(prevMedia, {
              autoAlpha: 0,
              x: -20,
              duration: 0.45,
              ease: 'power4.out',
              stagger: 0.02,
            });
          }

          // fade in next media
          if (nextMedia && nextMedia.length) {
            tl.fromTo(
              nextMedia,
              { autoAlpha: 0, x: 20 },
              { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power4.out', stagger: 0.02 },
              '<'
            );
          }
        } catch (e) {
          // ignore
        }
      };

      const handleSelect = () => {
        const idx = api.selectedScrollSnap();
        const prev = prevIndexRef.current ?? idx;
        if (idx === prev) return;
        prevIndexRef.current = idx;
        runAnimation(idx, prev);
      };

      api.on('select', handleSelect);

      // initial reveal: ensure current slide media visible
      (async () => {
        if (prefersReducedMotion()) return;
        try {
          const mod = await loadGsap();
          if (!mounted || !mod) return;
          gsap = (mod as any).gsap ?? mod;
          const slides: HTMLElement[] = api.slideNodes?.() ?? [];
          const idx = api.selectedScrollSnap();
          const media = slides[idx]?.querySelectorAll('img, picture, video') ?? [];
          gsap.set(media, { autoAlpha: 1, x: 0 });
        } catch (e) {}
      })();

      // autoplay handling
      const startAutoplay = () => {
        if (!autoplay || autoplay <= 0 || prefersReducedMotion()) return;
        stopAutoplay();
        autoplayId = setInterval(() => {
          api?.scrollNext();
        }, autoplay);
      };

      const stopAutoplay = () => {
        if (autoplayId) {
          clearInterval(autoplayId);
          autoplayId = null;
        }
      };

      startAutoplay();

      const pauseHandlers = () => ({
        onMouseEnter: () => stopAutoplay(),
        onMouseLeave: () => startAutoplay(),
        onTouchStart: () => stopAutoplay(),
        onTouchEnd: () => startAutoplay(),
      });

      // attach pause/resume to root container via props handlers
      // we cannot mutate props, so return handlers for the caller; instead set listeners on document for hover within this carousel region
      // find root element from embla root slides
      const rootEl = (api as any).rootNode?.() ?? null;
      if (rootEl && rootEl.addEventListener) {
        rootEl.addEventListener('mouseenter', stopAutoplay);
        rootEl.addEventListener('mouseleave', startAutoplay);
        rootEl.addEventListener('touchstart', stopAutoplay, { passive: true });
        rootEl.addEventListener('touchend', startAutoplay);
      }

      return () => {
        mounted = false;
        api.off('select', handleSelect);
        stopAutoplay();
        if (rootEl && rootEl.removeEventListener) {
          rootEl.removeEventListener('mouseenter', stopAutoplay);
          rootEl.removeEventListener('mouseleave', startAutoplay);
          rootEl.removeEventListener('touchstart', stopAutoplay as any);
          rootEl.removeEventListener('touchend', startAutoplay as any);
        }
        try {
          tl?.kill?.();
        } catch (e) {}
      };
    }, [api, autoplay]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on('reInit', onSelect);
      api.on('select', onSelect);

      return () => {
        api?.off('select', onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute  h-8 w-8 rounded-full',
        orientation === 'horizontal'
          ? '-left-12 top-1/2 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute h-8 w-8 rounded-full',
        orientation === 'horizontal'
          ? '-right-12 top-1/2 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = 'CarouselNext';

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
