import { useState, useCallback, useEffect, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import FadeUpOnScroll from './FadeUpOnScroll';
import ScrollFloat from './ScrollFloat';
import SpotlightCard from './SpotlightCard';

function getOptimizedImageUrl(url: string, width: number = 800) {
  if (!url || !url.includes('ik.imagekit.io')) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}tr=w-${width},q-80,f-auto`;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  technologies: string[];
  featured: boolean;
  order: number;
}

const springConfig = { damping: 20, stiffness: 120, mass: 1.5 };

// ── Placeholder shown when a project has no image ─────────────────────────────
function ImagePlaceholder({ title }: { title: string }) {
  const initials = title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="project-img-placeholder">
      <div className="project-img-placeholder-inner">
        <div className="project-img-placeholder-initials">{initials}</div>
        <div className="project-img-placeholder-label">No image yet</div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  cardRef,
  onImageClick,
}: {
  project: Project;
  cardRef?: React.Ref<HTMLDivElement>;
  onImageClick: () => void;
}) {
  const hasImage = !!project.imageUrl;

  return (
    <div ref={cardRef} className="works-card min-w-0 flex-shrink-0">
      <SpotlightCard className="project-card section-card-no-hover flex flex-col h-full">
        <div className="project-card-image project-image-trigger overflow-hidden mb-5">
          {hasImage ? (
            <div
              role="button"
              tabIndex={0}
              className="project-image-trigger overflow-hidden cursor-zoom-in w-full p-0 border-0 bg-transparent block"
              onClick={(e) => {
                if (e.defaultPrevented) return;
                onImageClick();
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') onImageClick(); }}
              aria-label={`Open full image for ${project.title}`}
            >
              <img
                src={getOptimizedImageUrl(project.imageUrl, 800)}
                alt={project.title}
                className="project-card-media w-full h-64 md:h-72 object-cover object-top select-none pointer-events-none"
                draggable={false}
              />
            </div>
          ) : (
            <ImagePlaceholder title={project.title} />
          )}
        </div>

        <h3 className="text-2xl font-bold mb-3 select-none">{project.title}</h3>
        <p className="mb-4 text-sm leading-relaxed select-none" style={{ color: 'var(--color-text-body)' }}>
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6 select-none">
          {project.technologies.map((tech, i) => (
            <span key={i} className="tech-chip px-2 py-1 text-xs rounded-full">{tech}</span>
          ))}
        </div>
        <div className="mt-auto">
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block px-6 py-3 text-sm sm:text-base">
            View Project
          </a>
        </div>
      </SpotlightCard>
    </div>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="works-card min-w-0 flex-shrink-0">
      <div className="project-card section-card-no-hover flex flex-col h-full">
        <div className="project-card-image mb-5 overflow-hidden">
          <div className="works-skeleton-img" />
        </div>
        <div className="works-skeleton-line w-3/4 mb-3" />
        <div className="works-skeleton-line w-full mb-1" />
        <div className="works-skeleton-line w-5/6 mb-6" />
        <div className="flex gap-2 mb-6">
          <div className="works-skeleton-chip" />
          <div className="works-skeleton-chip" />
          <div className="works-skeleton-chip" />
        </div>
        <div className="mt-auto">
          <div className="works-skeleton-btn" />
        </div>
      </div>
    </div>
  );
}

export default function WorksSection() {
  const [, setLocation] = useLocation();
  const { data: allProjects = [], isLoading, isError } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const projects = useMemo(() => allProjects.filter(p => p.featured), [allProjects]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedProjectImage, setSelectedProjectImage] = useState<{ src: string; title: string } | null>(null);

  const scrollPrev = useCallback(() => { if (emblaApi) emblaApi.scrollPrev(); }, [emblaApi]);
  const scrollNext = useCallback(() => { if (emblaApi) emblaApi.scrollNext(); }, [emblaApi]);
  const scrollTo = useCallback((index: number) => { if (emblaApi) emblaApi.scrollTo(index); }, [emblaApi]);

  const onInit = useCallback((api: any) => { setScrollSnaps(api.scrollSnapList()); }, []);
  const onSelect = useCallback((api: any) => {
    setCurrentIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect, projects]);

  useEffect(() => {
    if (!selectedProjectImage) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedProjectImage(null); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKeyDown); };
  }, [selectedProjectImage]);

  // Re-init carousel when projects load
  useEffect(() => { if (emblaApi) emblaApi.reInit(); }, [emblaApi, projects]);

  return (
    <section id="works" className="py-20 px-4 md:px-8">
      <FadeUpOnScroll>
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="top bottom"
              scrollEnd="bottom center"
              stagger={0.03}
              containerClassName="text-3xl font-bold"
            >
              Featured Projects
            </ScrollFloat>
            <div className="flex space-x-2">
              <button
                onClick={scrollPrev}
                className="carousel-control p-2 rounded-full transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous projects"
                disabled={!canScrollPrev}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollNext}
                className="carousel-control p-2 rounded-full transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next projects"
                disabled={!canScrollNext}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {isError && (
            <div className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
              Failed to load projects. Please try again later.
            </div>
          )}

          <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
            <div className="flex gap-0 md:gap-8">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                : projects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      onImageClick={() =>
                        project.imageUrl &&
                        setSelectedProjectImage({ src: project.imageUrl, title: project.title })
                      }
                    />
                  ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`project-dot ${currentIndex === index ? 'active' : ''}`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="flex justify-center mt-16">
            <button 
              onClick={() => setLocation('/projects')} 
              className="cta-button"
            >
              See All Projects &rarr;
            </button>
          </div>
        </div>
      </FadeUpOnScroll>

      {selectedProjectImage && (
        <div
          className="project-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProjectImage.title} full image preview`}
          onClick={() => setSelectedProjectImage(null)}
        >
          <div className="project-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="project-lightbox-close"
              aria-label="Close image preview"
              onClick={() => setSelectedProjectImage(null)}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </button>
            <img src={getOptimizedImageUrl(selectedProjectImage.src, 1600)} alt={selectedProjectImage.title} className="project-lightbox-image" />
          </div>
        </div>
      )}
    </section>
  );
}
