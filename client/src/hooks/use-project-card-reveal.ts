import { RefObject, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useProjectCardReveal(
  containerRef: RefObject<HTMLElement>,
  revealKey: string,
) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll<HTMLElement>('[data-project-reveal]'));
    if (!cards.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(cards, { autoAlpha: 1, y: 0, scale: 1 });
      return;
    }

    const context = gsap.context(() => {
      gsap.set(cards, { willChange: 'transform, opacity' });

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 44, scale: 0.985 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.72,
            delay: (index % 2) * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });
    }, container);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [containerRef, revealKey]);
}
