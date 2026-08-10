import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FadeUpOnScroll from './FadeUpOnScroll';
import { timelineItems } from '@/data/timeline';

gsap.registerPlugin(ScrollTrigger);

export default function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!section || !track || !progress) return;

    const entries = Array.from(section.querySelectorAll<HTMLElement>('[data-timeline-entry]'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobileTimeline = window.matchMedia('(max-width: 767px)').matches;

    const setActiveEntry = (entry: HTMLElement) => {
      const activeIndex = entries.indexOf(entry);

      entries.forEach((item, index) => {
        item.classList.toggle('is-active', index === activeIndex);
        item.classList.toggle('is-past', index < activeIndex);
      });
    };

    const syncActiveEntry = () => {
      const activationAnchor = mobileTimeline
        ? progress.getBoundingClientRect().bottom
        : window.innerHeight * 0.52;
      let reachedEntry = entries[0];

      entries.forEach((entry) => {
        const dot = entry.querySelector<HTMLElement>('.timeline-dot');
        const dotRect = dot?.getBoundingClientRect();
        const entryAnchor = dotRect
          ? dotRect.top + dotRect.height / 2
          : entry.getBoundingClientRect().top;

        if (entryAnchor <= activationAnchor + 1) reachedEntry = entry;
      });

      if (reachedEntry) setActiveEntry(reachedEntry);
    };

    entries[0]?.classList.add('is-active');

    if (reduceMotion) {
      gsap.set(progress, { scaleY: 1 });
      gsap.set(entries, { autoAlpha: 1, y: 0 });
      return;
    }

    const context = gsap.context(() => {
      gsap.set(progress, { scaleY: 0, transformOrigin: 'top center' });
      gsap.to(progress, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: track,
          start: 'top 52%',
          end: 'bottom 52%',
          scrub: true,
          onUpdate: syncActiveEntry,
          onRefresh: syncActiveEntry,
        },
      });

      entries.forEach((entry) => {
        const content = entry.querySelector<HTMLElement>('.timeline-entry-content');
        const date = entry.querySelector<HTMLElement>('.timeline-entry-date');
        const dot = entry.querySelector<HTMLElement>('.timeline-dot');
        if (!content || !date || !dot) return;

        gsap.fromTo(
          [date, content],
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.05,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: entry,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          },
        );

        gsap.fromTo(
          dot,
          { scale: 0.82 },
          {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: entry,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
          },
        );

      });
    }, section);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, []);

  return (
    <section id="timeline" ref={sectionRef} className="timeline-section py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <FadeUpOnScroll>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">My Timeline</h2>
        </FadeUpOnScroll>

        <div className="timeline-layout">
          <div ref={trackRef} className="timeline-track">
            <span className="timeline-line" aria-hidden="true">
              <span ref={progressRef} className="timeline-line-progress" />
            </span>

            <ol className="timeline-list">
              {timelineItems.map((item, index) => (
                <li
                  key={`${item.year}-${index}`}
                  data-timeline-entry
                  data-year={item.year}
                  className="timeline-entry"
                >
                  <div className="timeline-entry-date">
                    <time className={`timeline-entry-year ${item.year.length > 4 ? 'is-range' : ''}`}>
                      {item.year}
                    </time>
                    <span className="timeline-entry-type">{item.type}</span>
                  </div>
                  <span className="timeline-dot" aria-hidden="true" />
                  <article className="timeline-entry-content">
                    <div className="timeline-entry-meta">
                      <span>Chapter {String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="timeline-entry-title">{item.title}</h3>
                    <p className="timeline-entry-description">{item.description}</p>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
