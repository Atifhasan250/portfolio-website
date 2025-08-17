import { useState } from 'react';

export default function WorksSection() {
  const allProjects = [
    {
      title: "Shortened Link",
      description: "A powerful, easy-to-use URL shortener with custom links, instant redirects, and link previews.",
      image: "/shortened-link.png",
      link: "https://shortened-link.vercel.app/",
      technologies: ["Next.js", "Stripe", "PostgreSQL"]
    },
    {
      title: "IntelliPlan",
      description: "Your all-in-one Next.js study planner with task management, goal setting, and timer to focus. (For students)",
      image: "/intelliplan.png",
      link: "https://intelliplan.vercel.app/",
      technologies: ["Next.js", "Socket.io", "MySQL"]
    },
    {
      title: "Shad Jatra",
      description: "Explore the rich flavors of Bangladeshi cuisine. Step-by-step guides in a user-friendly web app.",
      image: "/shad-jatra.png",
      link: "https://shad-jatra.vercel.app/",
      technologies: ["React Native", "Recipe API"]
    },
    {
      title: "classnote Sorter",
      description: "Optimize your learning with Classnote Sorter, an AI-powered web app for effortless organization and management of PDF class notes.",
      image: "/classnote-sorter.png",
      link: "https://classnote-sorter.vercel.app/",
      technologies: ["Next.js", "MDX", "Prisma"]
    },
    {
      title: "Capital Balance",
      description: "Track and manage your personal capital with ease. This project is a finance dashboard built with Next.js, React, TypeScript, Tailwind CSS, and Recharts for data visualization.",
      image: "/capital-balance.png",
      link: "https://capital-balance.vercel.app/",
      technologies: ["Next.js", "Firebase"]
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const projectsPerPage = 3;

  const getCurrentProjects = () => {
    const projects = [];
    for (let i = 0; i < projectsPerPage; i++) {
      const index = (currentIndex + i) % allProjects.length;
      projects.push(allProjects[index]);
    }
    return projects;
  };

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + 1) % allProjects.length);
  };

  const prevPage = () => {
    setCurrentIndex((prev) => (prev - 1 + allProjects.length) % allProjects.length);
  };

  return (
    <section id="works" className="py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Projects</h2>
          <div className="flex space-x-2">
            <button 
              onClick={prevPage}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-300"
              aria-label="Previous projects"
            >
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextPage}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-300"
              aria-label="Next projects"
            >
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500 ease-in-out">
            {getCurrentProjects().map((project, index) => (
              <div 
                key={`${currentIndex}-${index}`} 
                className="section-card group opacity-0 animate-fade-in flex flex-col"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className="overflow-hidden rounded-md mb-4">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-auto">
                  <a 
                    href={project.link} 
                    className="inline-block bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition-all duration-300 hover:shadow-lg"
                  >
                    View Project
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {allProjects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                currentIndex === index ? 'bg-white' : 'bg-gray-600'
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
