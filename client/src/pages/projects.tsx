import { useState, MouseEvent, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import type { Project } from '@shared/schema';
import SpotlightCard from '@/components/SpotlightCard';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import FadeUpOnScroll from '@/components/FadeUpOnScroll';

function getOptimizedImageUrl(url: string, width: number = 800) {
  if (!url || !url.includes('ik.imagekit.io')) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}tr=w-${width},q-80,f-auto`;
}

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
  onImageClick,
}: {
  project: Project;
  onImageClick: () => void;
}) {
  const hasImage = !!project.imageUrl;

  return (
    <SpotlightCard className="project-card section-card-no-hover flex flex-col h-full w-full">
      <div className="project-card-image project-image-trigger overflow-hidden mb-5">
        {hasImage ? (
          <button
            type="button"
            className="project-image-trigger overflow-hidden cursor-zoom-in w-full p-0 border-0 bg-transparent"
            onClick={onImageClick}
            aria-label={`Open full image for ${project.title}`}
          >
            <img
              src={getOptimizedImageUrl(project.imageUrl, 800)}
              alt={project.title}
              className="project-card-media w-full h-64 md:h-72 object-cover object-top select-none"
              draggable={false}
            />
          </button>
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
  );
}

function SkeletonCard() {
  return (
    <div className="project-card section-card-no-hover flex flex-col h-full w-full">
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
  );
}

interface ProjectsPageProps {
  onToggleTheme?: (event?: MouseEvent<HTMLButtonElement>) => void;
  currentTheme?: string;
}

export default function ProjectsPage({ onToggleTheme, currentTheme = 'dark' }: ProjectsPageProps) {
  const { data: projects = [], isLoading, isError } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const [selectedProjectImage, setSelectedProjectImage] = useState<{ src: string; title: string } | null>(null);

  const [, setLocation] = useLocation();

  useEffect(() => {
    // Slight delay ensures it overrides the browser's native scroll restoration
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 10);
  }, []);

  // Sort projects: order first, then fallback to something else if needed
  const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onToggleTheme={onToggleTheme} currentTheme={currentTheme} />
      
      <main className="flex-grow pt-24 pb-20 px-4 md:pt-32 md:px-8">
        <FadeUpOnScroll>
          <div className="container mx-auto max-w-6xl">
            <div className="mb-8 md:mb-12">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    if (window.history.length > 2) {
                      window.history.back();
                    } else {
                      setLocation('/');
                    }
                  }}
                  className="flex items-center justify-center w-12 h-12 rounded-full border border-[var(--color-border-default)] hover:border-[var(--color-text-heading)] transition-colors duration-300 group"
                  aria-label="Back to home"
                >
                  <svg className="w-5 h-5 text-[var(--color-text-body)] group-hover:text-[var(--color-text-heading)] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                </button>
                <h1 className="text-4xl md:text-5xl font-bold">All Projects</h1>
              </div>
            </div>

            {isError && (
              <div className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
                Failed to load projects. Please try again later.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : sortedProjects.map((project) => (
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
        </FadeUpOnScroll>
      </main>

      <Footer />

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
    </div>
  );
}
