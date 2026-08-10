import { useState } from 'react';
import FadeUpOnScroll from './FadeUpOnScroll';

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
  SiVuedotjs,
  SiAstro,
  SiShadcnui,
  SiReactquery,
  SiGreensock,
  SiThreedotjs,
  SiExpress,
  SiSocketdotio,
  SiZod,
  SiOpenapiinitiative,
  SiPostgresql,
  SiSqlite,
  SiFirebase,
  SiSupabase,
  SiRedis,
  SiLangchain,
  SiExpo,
  SiEspressif,
  SiArduino,
  SiCanva,
  SiAdobepremierepro
} from 'react-icons/si';
import { BrainCircuit, GitBranch, Layers3 } from 'lucide-react';

export function TechStackSection() {
  const [activeTab, setActiveTab] = useState(0);

  const techStacks = [
    {
      category: "Frontend",
      comfortable: [
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
          description: "JS Framework"
        },
        {
          name: "Next.js",
          icon: SiNextdotjs,
          color: "nextjs-icon",
          description: "React Framework"
        },
        {
          name: "Tailwind CSS",
          icon: SiTailwindcss,
          color: "text-teal-400",
          description: "Utility-first CSS"
        },
        {
          name: "JavaScript",
          icon: SiJavascript,
          color: "text-yellow-400",
          description: "Dynamic Language"
        },
        {
          name: "shadcn/ui",
          icon: SiShadcnui,
          color: "nextjs-icon",
          description: "UI Component System"
        },
        {
          name: "Zustand",
          icon: Layers3,
          color: "text-amber-500",
          description: "State Management"
        },
        {
          name: "GSAP",
          icon: SiGreensock,
          color: "text-lime-400",
          description: "Web Animation"
        }
      ],
      alsoUsed: [
        {
          name: "Vue.js",
          icon: SiVuedotjs,
          color: "text-green-500",
          description: "Progressive Framework"
        },
        {
          name: "Astro",
          icon: SiAstro,
          color: "text-orange-500",
          description: "Content-driven Framework"
        },
        {
          name: "TanStack Query",
          icon: SiReactquery,
          color: "text-red-500",
          description: "Async State Management"
        },
        {
          name: "Three.js",
          icon: SiThreedotjs,
          color: "nextjs-icon",
          description: "3D Web Graphics"
        }
      ]
    },
    {
      category: "Backend",
      comfortable: [
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
          name: "Express.js",
          icon: SiExpress,
          color: "nextjs-icon",
          description: "Node.js Framework"
        },
        {
          name: "Zod",
          icon: SiZod,
          color: "text-blue-500",
          description: "Schema Validation"
        },
        {
          name: "REST API",
          icon: SiOpenapiinitiative,
          color: "text-green-500",
          description: "API Architecture"
        }
      ],
      alsoUsed: [
        {
          name: "PHP",
          icon: SiPhp,
          color: "text-indigo-400",
          description: "Server-side Scripting"
        },
        {
          name: "Socket.IO / WebSocket",
          icon: SiSocketdotio,
          color: "nextjs-icon",
          description: "Real-time Communication"
        }
      ]
    },
    {
      category: "Database",
      comfortable: [
        {
          name: "MongoDB",
          icon: SiMongodb,
          color: "text-green-500",
          description: "NoSQL Database"
        },
        {
          name: "PostgreSQL",
          icon: SiPostgresql,
          color: "text-blue-500",
          description: "Relational Database"
        },
        {
          name: "SQLite",
          icon: SiSqlite,
          color: "text-cyan-500",
          description: "Embedded Database"
        },
        {
          name: "Supabase",
          icon: SiSupabase,
          color: "text-emerald-500",
          description: "Backend Platform"
        },
        {
          name: "Redis",
          icon: SiRedis,
          color: "text-red-500",
          description: "In-memory Data Store"
        }
      ],
      alsoUsed: [
        {
          name: "MySQL",
          icon: SiMysql,
          color: "text-orange-500",
          description: "Relational Database"
        },
        {
          name: "Firebase / Firestore",
          icon: SiFirebase,
          color: "text-amber-500",
          description: "Cloud Database"
        }
      ]
    },
    {
      category: "AI",
      comfortable: [
        {
          name: "LangChain",
          icon: SiLangchain,
          color: "text-emerald-500",
          description: "AI Application Framework"
        },
        {
          name: "LangGraph",
          icon: GitBranch,
          color: "text-teal-500",
          description: "Agent Workflow Framework"
        },
        {
          name: "RAG (Pinecone)",
          icon: BrainCircuit,
          color: "text-purple-500",
          description: "Retrieval-augmented Generation"
        }
      ],
      alsoUsed: []
    },
    {
      category: "Mobile & IoT",
      comfortable: [
        {
          name: "React Native",
          icon: SiReact,
          color: "text-cyan-400",
          description: "Cross-platform Mobile"
        },
        {
          name: "Expo",
          icon: SiExpo,
          color: "nextjs-icon",
          description: "React Native Platform"
        },
        {
          name: "ESP32",
          icon: SiEspressif,
          color: "text-red-500",
          description: "IoT Microcontroller"
        },
        {
          name: "Arduino",
          icon: SiArduino,
          color: "text-teal-500",
          description: "Electronics Platform"
        }
      ],
      alsoUsed: []
    },
    {
      category: "Design",
      comfortable: [
        {
          name: "Figma",
          icon: SiFigma,
          color: "text-purple-500",
          description: "UI/UX Design"
        },
        {
          name: "Photoshop",
          icon: SiAdobephotoshop,
          color: "text-blue-700",
          description: "Image Editing"
        },
        {
          name: "Canva",
          icon: SiCanva,
          color: "text-cyan-500",
          description: "Visual Design"
        },
        {
          name: "Premiere Pro",
          icon: SiAdobepremierepro,
          color: "text-violet-500",
          description: "Video Editing"
        }
      ],
      alsoUsed: [
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
        }
      ]
    }
  ];

  const activeStack = techStacks[activeTab];
  const showExperienceLabels = activeStack.alsoUsed.length > 0;

  return (
    <section id="tech-stack" className="py-20 px-4 md:px-8">
      <FadeUpOnScroll>
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Technology Stack
          </h2>

          <div className="section-card-no-hover">
          {/* Category Tabs - Mobile and Desktop Optimized */}
          <div className="flex justify-center mb-12">
            <div role="tablist" aria-label="Technology categories" className="grid w-full max-w-md grid-cols-2 gap-1.5 rounded-2xl p-1.5 sm:flex sm:max-w-fit sm:flex-wrap sm:justify-center sm:rounded-[50px]" style={{ backgroundColor: 'var(--color-accent-bg)' }}>
              {techStacks.map((stack, index) => (
                <button
                  key={stack.category}
                  id={`tech-tab-${index}`}
                  role="tab"
                  aria-selected={index === activeTab}
                  aria-controls="tech-stack-panel"
                  onClick={() => setActiveTab(index)}
                  className={`tech-tab px-4 py-3 text-sm font-medium transition-all duration-300 rounded-xl sm:rounded-full sm:px-6 sm:text-base ${index === activeTab
                      ? 'is-active'
                      : ''
                    }`}
                  style={{
                    backgroundColor: index === activeTab ? 'var(--color-btn-primary-bg)' : 'transparent',
                    color: index === activeTab ? 'var(--color-btn-primary-text)' : 'var(--color-text-muted)',
                  }}
                >
                  {stack.category}
                </button>
              ))}
            </div>
          </div>

          {/* Active Technology Stack Display - grouped by experience */}
          <div
            id="tech-stack-panel"
            className="space-y-10"
            role="tabpanel"
            aria-labelledby={`tech-tab-${activeTab}`}
            aria-live="polite"
          >
            {[
              { label: showExperienceLabels ? 'Comfortable with' : null, technologies: activeStack.comfortable },
              { label: 'Also used', technologies: activeStack.alsoUsed }
            ].filter(group => group.technologies.length > 0).map((group) => (
              <div key={group.label ?? 'technologies'} className="tech-experience-group max-w-4xl mx-auto">
                {group.label && (
                  <h3 className="tech-experience-label mb-4 sm:mb-5">
                    {group.label}
                  </h3>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {group.technologies.map((tech, index) => {
                    const IconComponent = tech.icon;
                    return (
                      <div
                        key={tech.name}
                        className="tech-card group relative backdrop-blur-sm p-3 sm:p-6
                                 animate-fade-in aspect-square flex flex-col items-center justify-center text-center
                                 min-h-[120px] sm:min-h-[140px] max-w-[160px] sm:max-w-[200px] w-full mx-auto"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110 mb-2 sm:mb-3">
                          <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${tech.color}`} aria-hidden="true" />
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="font-medium transition-colors duration-300 text-xs sm:text-sm md:text-base mb-1 leading-tight"
                            style={{ color: 'var(--color-text-heading)' }}>
                            {tech.name}
                          </h4>
                          <p className="text-xs transition-colors duration-300 line-clamp-2 leading-tight hidden sm:block"
                            style={{ color: 'var(--color-text-muted)' }}>
                            {tech.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </FadeUpOnScroll>
    </section>
  );
}
