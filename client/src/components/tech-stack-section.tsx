import { useState } from 'react';

export function TechStackSection() {
  const [activeTab, setActiveTab] = useState(0);
  
  const techStacks = [
    {
      category: "Frontend",
      technologies: [
        { 
          name: "TypeScript", 
          svg: (
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <rect width="24" height="24" rx="3" fill="#3178C6"/>
              <path d="M15.5 17.5h1.8v-1.2h-1.8v-2.1h2.4v-1.2h-3.6v5.7h1.2v-1.2zm-4.8-4.5v1.2h1.8v3.3h1.2v-3.3h1.8v-1.2h-4.8z" fill="white"/>
            </svg>
          ),
          description: "Type-safe JavaScript"
        },
        { 
          name: "React", 
          svg: (
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <circle cx="12" cy="12" r="2" fill="#61DAFB"/>
              <path d="M12,21.35C17.5,17.6 21,14.4 21,10.5C21,6.6 17.5,3.4 12,7.15C6.5,3.4 3,6.6 3,10.5C3,14.4 6.5,17.6 12,21.35Z" fill="none" stroke="#61DAFB" strokeWidth="1.5"/>
              <path d="M12,2.65C6.5,6.4 3,9.6 3,13.5C3,17.4 6.5,20.6 12,16.85C17.5,20.6 21,17.4 21,13.5C21,9.6 17.5,6.4 12,2.65Z" fill="none" stroke="#61DAFB" strokeWidth="1.5"/>
              <ellipse cx="12" cy="12" rx="11" ry="4" fill="none" stroke="#61DAFB" strokeWidth="1.5"/>
            </svg>
          ),
          description: "UI Library"
        },
        { 
          name: "Tailwind CSS", 
          svg: (
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.47 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C8.39 16.85 9.53 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.47 12 7 12z" fill="#38BDF8"/>
            </svg>
          ),
          description: "Utility-first CSS"
        },
        { 
          name: "Next.js", 
          svg: (
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <circle cx="12" cy="12" r="10" fill="black"/>
              <path d="M19.05 12.87L9.87 3.69c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41L17.64 14.28c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41z" fill="white"/>
              <path d="M9.64 14.28L18.82 5.1c.39-.39.39-1.02 0-1.41s-1.02-.39-1.41 0L8.23 12.87c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0z" fill="white"/>
            </svg>
          ),
          description: "React Framework"
        }
      ]
    },
    {
      category: "Backend",
      technologies: [
        { 
          name: "Python", 
          svg: (
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <path d="M11.9 2.5c-2.15 0-4 .3-5.35 1.65C5.2 5.5 5.2 7.35 5.2 8.5v1.5h6.8v.5H5.2c-1.5 0-2.8 1.3-2.8 2.8v4.2c0 1.5 1.3 2.8 2.8 2.8h2.3v-2.3c0-1.5 1.3-2.8 2.8-2.8h6.8c1.5 0 2.8-1.3 2.8-2.8V8.5c0-1.5-1.3-2.8-2.8-2.8h-6.8c-1.5 0-2.8-1.3-2.8-2.8V2.5z" fill="#3776AB"/>
              <path d="M16.8 21.5c2.15 0 4-.3 5.35-1.65 1.35-1.35 1.35-3.2 1.35-4.35v-1.5h-6.8v-.5h6.8c1.5 0 2.8-1.3 2.8-2.8V6.5c0-1.5-1.3-2.8-2.8-2.8h-2.3v2.3c0 1.5-1.3 2.8-2.8 2.8H11.2c-1.5 0-2.8 1.3-2.8 2.8v6.2c0 1.5 1.3 2.8 2.8 2.8h6.8c1.5 0 2.8 1.3 2.8 2.8v.1z" fill="#FFD43B"/>
              <circle cx="9" cy="7" r="1" fill="white"/>
              <circle cx="19" cy="17" r="1" fill="white"/>
            </svg>
          ),
          description: "Versatile Programming"
        },
        { 
          name: "PHP", 
          svg: (
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <ellipse cx="12" cy="12" rx="11" ry="7" fill="#777BB4"/>
              <path d="M6.6 10.8c.4 0 .7.1.9.3.2.2.3.5.3.8 0 .3-.1.6-.3.8-.2.2-.5.3-.9.3H5.9v1.4H5v-3.6h1.6zm-.1 1.5c.2 0 .4-.1.5-.2.1-.1.2-.3.2-.5s-.1-.4-.2-.5c-.1-.1-.3-.2-.5-.2H5.9v1.4h.6z" fill="white"/>
              <path d="M12.6 10.8c.4 0 .7.1.9.3.2.2.3.5.3.8 0 .3-.1.6-.3.8-.2.2-.5.3-.9.3h-.7v1.4h-.9v-3.6h1.6zm-.1 1.5c.2 0 .4-.1.5-.2.1-.1.2-.3.2-.5s-.1-.4-.2-.5c-.1-.1-.3-.2-.5-.2h-.6v1.4h.6z" fill="white"/>
              <path d="M18.6 10.8c.4 0 .7.1.9.3.2.2.3.5.3.8 0 .3-.1.6-.3.8-.2.2-.5.3-.9.3h-.7v1.4h-.9v-3.6h1.6zm-.1 1.5c.2 0 .4-.1.5-.2.1-.1.2-.3.2-.5s-.1-.4-.2-.5c-.1-.1-.3-.2-.5-.2h-.6v1.4h.6z" fill="white"/>
            </svg>
          ),
          description: "Server-side Scripting"
        },
        { 
          name: "Node.js", 
          svg: (
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <path d="M12 1.85l9.64 5.56v11.18L12 24.15 2.36 18.59V7.41L12 1.85z" fill="#339933"/>
              <path d="M12 22.35l8.2-4.73V8.38L12 3.65v18.7z" fill="#66CC33"/>
              <path d="M12 3.65l-8.2 4.73v9.24L12 22.35V3.65z" fill="#339933"/>
              <path d="M8.9 12.5l1.4.8 1.7-1v2l-1.7 1-1.4-.8v-2z" fill="white"/>
              <path d="M13.1 12.5l1.4.8 1.7-1v2l-1.7 1-1.4-.8v-2z" fill="white"/>
            </svg>
          ),
          description: "JavaScript Runtime"
        }
      ]
    },
    {
      category: "Database",
      technologies: [
        { 
          name: "MySQL", 
          svg: (
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.274.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.154z" fill="#00758F"/>
              <path d="M19.1 12.44c-.2-2.99-2.26-5.58-5.11-6.42-.47-.14-.97-.21-1.49-.21-3.09 0-5.76 1.97-6.77 4.73-.14.38-.22.78-.25 1.19-.03.41-.01.82.07 1.22.14.71.44 1.38.87 1.96.43.58.99 1.06 1.64 1.4.32.17.66.31 1.02.41.36.1.73.15 1.11.15.38 0 .75-.05 1.11-.15.36-.1.7-.24 1.02-.41.65-.34 1.21-.82 1.64-1.4.43-.58.73-1.25.87-1.96.08-.4.1-.81.07-1.22-.03-.41-.11-.81-.25-1.19-.01-.03-.02-.06-.03-.09z" fill="#00758F"/>
              <path d="M5.07 13.77c.43.58.99 1.06 1.64 1.4.32.17.66.31 1.02.41.36.1.73.15 1.11.15.38 0 .75-.05 1.11-.15.36-.1.7-.24 1.02-.41.65-.34 1.21-.82 1.64-1.4-.43-.58-.99-1.06-1.64-1.4-.32-.17-.66-.31-1.02-.41-.36-.1-.73-.15-1.11-.15-.38 0-.75.05-1.11.15-.36.1-.7.24-1.02.41-.65.34-1.21.82-1.64 1.4z" fill="#F29111"/>
            </svg>
          ),
          description: "Relational Database"
        },
        { 
          name: "MongoDB", 
          svg: (
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218z" fill="#47A248"/>
              <path d="M12.5 22.118c.305-.398.509-.745.509-.745s.157-.31.157-.69c0-.38-.157-.69-.157-.69s-.204-.347-.509-.745c-.305.398-.509.745-.509.745s-.157.31-.157.69c0 .38.157.69.157.69s.204.347.509.745z" fill="#47A248"/>
            </svg>
          ),
          description: "NoSQL Database"
        }
      ]
    },
    {
      category: "Design",
      technologies: [
        { 
          name: "Figma", 
          svg: (
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <path d="M15.5 12a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" fill="#1ABCFE"/>
              <path d="M8.5 20.5a3.5 3.5 0 003.5-3.5v-3.5a3.5 3.5 0 10-3.5 7z" fill="#0ACF83"/>
              <path d="M12 8.5a3.5 3.5 0 000-7 3.5 3.5 0 000 7z" fill="#FF7262"/>
              <path d="M8.5 8.5a3.5 3.5 0 000-7 3.5 3.5 0 000 7z" fill="#F24E1E"/>
              <path d="M8.5 16a3.5 3.5 0 000-7 3.5 3.5 0 000 7z" fill="#A259FF"/>
            </svg>
          ),
          description: "UI/UX Design"
        },
        { 
          name: "Framer", 
          svg: (
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <path d="M4 0h16v8H12L4 16V0z" fill="#0055FF"/>
              <path d="M4 8h8l8 8H12l-8-8z" fill="#00AAFF"/>
              <path d="M4 16h8v8l-8-8z" fill="#88DDFF"/>
            </svg>
          ),
          description: "Prototyping Tool"
        },
        { 
          name: "Illustrator", 
          svg: (
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <rect width="24" height="24" rx="5" fill="#FF9A00"/>
              <path d="M7 17h2l1-3h4l1 3h2l-4-10h-2L7 17zm3.5-5L12 9l1.5 3h-3z" fill="white"/>
              <path d="M17 7h-2v10h2V7z" fill="white"/>
            </svg>
          ),
          description: "Vector Graphics"
        },
        { 
          name: "Photoshop", 
          svg: (
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <rect width="24" height="24" rx="5" fill="#001E36"/>
              <path d="M7 7h3c2 0 3 1 3 2.5S12 12 10 12H9v5H7V7zm2 3h1c.5 0 1-.5 1-1s-.5-1-1-1H9v2z" fill="#31A8FF"/>
              <path d="M15 12c-1 0-2 .5-2 1.5s1 1.5 2 1.5 1.5-.5 1.5-1.5-.5-1.5-1.5-1.5zm0 2c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5z" fill="#31A8FF"/>
            </svg>
          ),
          description: "Image Editing"
        }
      ]
    }
  ];

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <div className="section-card">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Technology Stack</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            I continuously utilize cutting-edge technologies in my projects to maintain 
            professionalism and innovation.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-gray-800 rounded-full p-1">
            {techStacks.map((stack, index) => (
              <button
                key={stack.category}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
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

        {/* Active Technology Stack Display - Nav Style Cards */}
        <div className="space-y-8">
          <h3 className="text-2xl font-semibold text-center text-gray-300">
            {techStacks[activeTab].category} Technologies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {techStacks[activeTab].technologies.map((tech, index) => (
              <div
                key={tech.name}
                className="group relative bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50
                         transition-all duration-300 hover:bg-gray-700/40 hover:border-gray-500/70 
                         cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon and Name - Horizontal Layout */}
                <div className="flex items-center space-x-3">
                  {/* SVG Icon */}
                  <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                    {tech.svg}
                  </div>
                  
                  {/* Technology Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-200 group-hover:text-white 
                                 transition-colors duration-300 truncate">
                      {tech.name}
                    </h4>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 
                                 transition-colors duration-300 truncate">
                      {tech.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}