import { ExternalLink, Github, ArrowRight } from "lucide-react";

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
}

export default function Projects() {
  const projects: Project[] = [
    {
      title: "E-commerce Platform",
      description: "A full-stack e-commerce platform built with React and Node.js, featuring user authentication, payment processing, and admin dashboard.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      technologies: ["React", "Node.js", "MongoDB"],
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      technologies: ["React", "Socket.io", "Express"],
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Weather Dashboard",
      description: "A responsive weather dashboard with interactive charts, location search, and 7-day forecast using real-time weather APIs.",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      technologies: ["Vue.js", "Chart.js", "API"],
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Social Media Platform",
      description: "A modern social media platform with real-time messaging, post sharing, and user profiles built with React and Firebase.",
      image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      technologies: ["React", "Firebase", "Tailwind"],
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Crypto Tracker",
      description: "A cryptocurrency tracking application with real-time price updates, portfolio management, and interactive charts.",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      technologies: ["Next.js", "TypeScript", "API"],
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Blog Platform",
      description: "A full-featured blog platform with markdown support, comment system, and content management built with modern web technologies.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      technologies: ["Gatsby", "GraphQL", "CMS"],
      liveUrl: "#",
      githubUrl: "#"
    }
  ];

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Featured Projects</h2>
          <div className="w-24 h-1 bg-portfolio-blue mx-auto rounded-full"></div>
          <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
                <p className="text-slate-600 mb-4">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="px-3 py-1 bg-blue-100 text-portfolio-blue rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <a 
                    href={project.liveUrl} 
                    className="text-portfolio-blue hover:text-blue-700 font-semibold flex items-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                  <a 
                    href={project.githubUrl} 
                    className="text-slate-600 hover:text-slate-800 flex items-center"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="#" 
            className="inline-flex items-center px-6 py-3 border-2 border-portfolio-blue text-portfolio-blue rounded-lg font-semibold hover:bg-portfolio-blue hover:text-white transition-all duration-200"
          >
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
