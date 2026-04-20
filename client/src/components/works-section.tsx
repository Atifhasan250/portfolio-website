import { useEffect, useMemo, useRef, useState } from 'react';

export default function WorksSection() {
  const allProjects = [
    {
      title: "Stitch Drive",
      description: "A Google Drive file organizing app that helps you manage files of multiple Google Drive accounts.",
      image: "/stitchdrive.png",
      link: "https://stitchdrive.vercel.app/",
      technologies: ["Next.js", "MongoDB", "Google Drive API", "Clerk", "Tailwind CSS"]
    },
    {
      title: "IntelliPlan",
      description: "Your all-in-one study planner with task management, goal setting, and timer to focus. (For students)",
      image: "/intelliplan.png",
      link: "https://intelliplan.vercel.app/",
      technologies: ["Next.js", "Firebase", "Clerk"]
    },
    {
      title: "Monthly Todo Planner",
      description: "A monthly goal planner that helps you keep track of your progress and tracks daily habit. (Android App)",
      image: "/monthly-todo-planner.png",
      link: "https://monthly-todo-planner.netlify.app/",
      technologies: ["React.js", "MongoDB", "Expo", "Tailwind CSS"]
    },
    {
      title: "Shad Jatra",
      description: "Explore the rich flavors of Bangladeshi cuisine. Step-by-step guides in a user-friendly web app.",
      image: "/shad-jatra.png",
      link: "https://shad-jatra.vercel.app/",
      technologies: ["Next.js", "Recipe API", "Clerk", "MongoDB"]
    },
    {
      title: "Classnote Sorter",
      description: "Optimize your classnote PDFs with Classnote Sorter, a web app for changing layouts and reducing costs of printing PDF class notes.",
      image: "/classnote-sorter.png",
      link: "https://classnote-sorter.vercel.app/",
      technologies: ["Next.js", "MongoDB", "Firebase", "Tailwind CSS"]
    },
    {
      title: "Capital Balance",
      description: "Track and manage your personal capital with ease. This project is a finance dashboard built with Next.js, React, TypeScript, Tailwind CSS, and Recharts for data visualization.",
      image: "/capital-balance.png",
      link: "https://capital-balance.vercel.app/",
      technologies: ["Next.js", "MongoDB", "Clerk", "Recharts"]
    },
    {
      title: "Shortened Link",
      description: "A powerful, easy-to-use URL shortener with custom links, instant redirects, and link previews.",
      image: "/shortened-link.png",
      link: "https://shortened-link.vercel.app/",
      technologies: ["Next.js", "MongoDB", "Tailwind CSS"]
    }
  ];

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const firstCardRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [stepSize, setStepSize] = useState(0);
  const [selectedProjectImage, setSelectedProjectImage] = useState<{ src: string; title: string } | null>(null);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const visibleProjects = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, allProjects.length - visibleProjects);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    const updateStepSize = () => {
      if (!viewportRef.current || !firstCardRef.current) return;

      const viewportWidth = viewportRef.current.offsetWidth;
      const cardWidth = firstCardRef.current.offsetWidth;
      const visibleCount = isMobile ? 1 : 3;
      const gapCount = visibleCount - 1;
      const totalGap = Math.max(0, viewportWidth - (cardWidth * visibleCount));
      const gap = gapCount > 0 ? totalGap / gapCount : 0;

      setStepSize(cardWidth + gap);
    };

    updateStepSize();

    const resizeObserver = new ResizeObserver(updateStepSize);
    if (viewportRef.current) resizeObserver.observe(viewportRef.current);
    if (firstCardRef.current) resizeObserver.observe(firstCardRef.current);

    window.addEventListener('resize', updateStepSize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateStepSize);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!selectedProjectImage) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProjectImage(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProjectImage]);

  const translateX = useMemo(() => -(currentIndex * stepSize), [currentIndex, stepSize]);

  const nextPage = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevPage = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section id="works" className="py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-bold">Featured Projects</h2>
          <div className="flex space-x-2">
            <button
              onClick={prevPage}
              className="carousel-control p-2 rounded-full transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous projects"
              disabled={currentIndex === 0}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextPage}
              className="carousel-control p-2 rounded-full transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next projects"
              disabled={currentIndex === maxIndex}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={viewportRef} className="overflow-hidden">
          <div
            className="works-track flex gap-0 md:gap-8"
            style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
          >
            {allProjects.map((project, index) => (
              <div
                key={project.title}
                ref={index === 0 ? firstCardRef : null}
                className="project-card section-card-no-hover group flex min-w-0 flex-shrink-0 flex-col works-card"
              >
                <button
                  type="button"
                  className="project-card-image project-image-trigger overflow-hidden mb-5"
                  onClick={() => setSelectedProjectImage({ src: project.image, title: project.title })}
                  aria-label={`Open full image for ${project.title}`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-card-media w-full h-64 md:h-72 object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
                <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="tech-chip px-2 py-1 text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-auto">
                  <a
                    href={project.link}
                    className="btn-primary inline-block px-6 py-3 text-sm sm:text-base"
                  >
                    View Project
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`project-dot ${currentIndex === index ? 'active' : ''}`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {selectedProjectImage && (
        <div
          className="project-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProjectImage.title} full image preview`}
          onClick={() => setSelectedProjectImage(null)}
        >
          <div
            className="project-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
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
            <img
              src={selectedProjectImage.src}
              alt={selectedProjectImage.title}
              className="project-lightbox-image"
            />
          </div>
        </div>
      )}
    </section>
  );
}
