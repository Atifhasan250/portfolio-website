import { useState } from 'react';
import { 
  SiReact, 
  SiTypescript, 
  SiNextdotjs, 
  SiTailwindcss,
  SiNodedotjs,
  SiPython,
  SiPhp,
  SiMysql,
  SiMongodb,
  SiFigma,
  SiFramer,
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiVuedotjs
} from 'react-icons/si';

export function TechStackSection() {
  const [activeTab, setActiveTab] = useState(0);
  
  const techStacks = [
    {
      category: "Frontend",
      technologies: [
        { 
          name: "TypeScript", 
          icon: SiTypescript,
          color: "text-blue-600",
          description: "Type-safe JavaScript"
        },
        { 
          name: "React", 
          icon: SiReact,
          color: "text-cyan-400",
          description: "UI Library"
        },
        { 
          name: "Next.js", 
          icon: SiNextdotjs,
          color: "text-black dark:text-white",
          description: "React Framework"
        },
        { 
          name: "Tailwind CSS", 
          icon: SiTailwindcss,
          color: "text-teal-400",
          description: "Utility-first CSS"
        },
        { 
          name: "Vue.js", 
          icon: SiVuedotjs,
          color: "text-green-500",
          description: "Progressive Framework"
        },
        { 
          name: "JavaScript", 
          icon: SiJavascript,
          color: "text-yellow-400",
          description: "Dynamic Language"
        }
      ]
    },
    {
      category: "Backend",
      technologies: [
        { 
          name: "Node.js", 
          icon: SiNodedotjs,
          color: "text-green-600",
          description: "JavaScript Runtime"
        },
        { 
          name: "Python", 
          icon: SiPython,
          color: "text-yellow-500",
          description: "Versatile Programming"
        },
        { 
          name: "PHP", 
          icon: SiPhp,
          color: "text-indigo-400",
          description: "Server-side Scripting"
        }
      ]
    },
    {
      category: "Database",
      technologies: [
        { 
          name: "MongoDB", 
          icon: SiMongodb,
          color: "text-green-500",
          description: "NoSQL Database"
        },
        { 
          name: "MySQL", 
          icon: SiMysql,
          color: "text-orange-500",
          description: "Relational Database"
        }
      ]
    },
    {
      category: "Design",
      technologies: [
        { 
          name: "Figma", 
          icon: SiFigma,
          color: "text-purple-500",
          description: "UI/UX Design"
        },
        { 
          name: "Framer", 
          icon: SiFramer,
          color: "text-blue-500",
          description: "Prototyping Tool"
        },
        { 
          name: "Illustrator", 
          icon: SiAdobeillustrator,
          color: "text-orange-600",
          description: "Vector Graphics"
        },
        { 
          name: "Photoshop", 
          icon: SiAdobephotoshop,
          color: "text-blue-700",
          description: "Image Editing"
        }
      ]
    }
  ];

  return (
    <section id="tech-stack" className="py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="section-card">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Technology Stack</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              I continuously utilize cutting-edge technologies in my projects to maintain 
              professionalism and innovation.
            </p>
          </div>

          {/* Category Tabs - Responsive */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap justify-center bg-gray-800 rounded-full p-1 gap-1 sm:gap-0">
              {techStacks.map((stack, index) => (
                <button
                  key={stack.category}
                  onClick={() => setActiveTab(index)}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 text-sm sm:text-base ${
                    index === activeTab 
                      ? 'bg-white text-black shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {stack.category}
                </button>
              ))}
            </div>
          </div>

          {/* Active Technology Stack Display - Square Cards */}
          <div className="space-y-8">
            <h3 className="text-xl md:text-2xl font-semibold text-center text-gray-300">
              {techStacks[activeTab].category} Technologies
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {techStacks[activeTab].technologies.map((tech, index) => {
                const IconComponent = tech.icon;
                return (
                  <div
                    key={tech.name}
                    className="group relative bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-gray-700/50
                             transition-all duration-300 hover:bg-gray-700/40 hover:border-gray-500/70 
                             cursor-pointer animate-fade-in aspect-square flex flex-col items-center justify-center text-center"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110 mb-3">
                      <IconComponent className={`w-8 h-8 md:w-12 md:h-12 ${tech.color}`} />
                    </div>
                    
                    {/* Technology Info */}
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-medium text-gray-200 group-hover:text-white 
                                   transition-colors duration-300 text-sm md:text-base mb-1">
                        {tech.name}
                      </h4>
                      <p className="text-xs text-gray-400 group-hover:text-gray-300 
                                   transition-colors duration-300 line-clamp-2">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}