import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FadeUpOnScroll from './FadeUpOnScroll';

gsap.registerPlugin(ScrollTrigger);

const timelineItems = [
  {
    year: '2018–2020',
    type: 'Problem solving',
    title: 'It started with mathematics',
    description: 'My interest in mathematics led me to several math olympiads and contests, where I picked up a few wins along the way.',
  },
  {
    year: '2020–21',
    type: 'First code',
    title: 'Math led me to programming',
    description: 'I came across code in a book that used Python to solve math problems with surprising ease. That curiosity pushed me to start learning programming.',
  },
  {
    year: '2022',
    type: 'Exploration',
    title: 'Learning beyond one field',
    description: 'I explored web development and graphic design, while joining competitive programming contests to build stronger problem-solving habits.',
  },
  {
    year: '2023',
    type: 'Foundations',
    title: 'DSA, C++, and deeper web development',
    description: 'I discovered data structures and algorithms, began learning them with C++, and moved further into web development with the MERN stack.',
  },
  {
    year: '2024',
    type: 'Client work',
    title: 'Turning skills into real projects',
    description: 'I built several personal projects of my own and also started developing real products for clients, learning how to turn real requirements into working software.',
  },
  {
    year: '2025',
    type: 'GenAI',
    title: 'Adding AI to what I build',
    description: 'After completing my HSC exams, I began learning generative AI and using it to add practical AI features to my personal projects.',
  },
  {
    year: '2026',
    type: 'Current chapter',
    title: 'IUT and my first hackathons',
    description: 'I joined IUT as a Civil Engineering student and entered several national hackathons, placing well even though the format was completely new to me.',
  },
];

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

    const setActiveEntry = (entry: HTMLElement) => {
      const activeIndex = entries.indexOf(entry);

      entries.forEach((item, index) => {
        item.classList.toggle('is-active', index === activeIndex);
        item.classList.toggle('is-past', index < activeIndex);
      });
    };

    const syncActiveEntry = () => {
      const viewportAnchor = window.innerHeight * 0.52;
      let reachedEntry = entries[0];

      entries.forEach((entry) => {
        const dot = entry.querySelector<HTMLElement>('.timeline-dot');
        const dotRect = dot?.getBoundingClientRect();
        const entryAnchor = dotRect
          ? dotRect.top + dotRect.height / 2
          : entry.getBoundingClientRect().top;

        if (entryAnchor <= viewportAnchor + 1) reachedEntry = entry;
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
        },
      });

      ScrollTrigger.create({
        trigger: track,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: syncActiveEntry,
        onRefresh: syncActiveEntry,
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
