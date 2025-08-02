import { useState } from 'react';

export function TechStackSection() {
  const [activeTab, setActiveTab] = useState(0);
  
  const techStacks = [
    {
      category: "Frontend",
      technologies: [
        { name: "TypeScript", icon: "TS", color: "bg-blue-600", description: "Type-safe JavaScript" },
        { name: "React", icon: "⚛️", color: "bg-cyan-500", description: "UI Library" },
        { name: "Tailwind CSS", icon: "🎨", color: "bg-teal-500", description: "Utility-first CSS" },
        { name: "Next.js", icon: "▲", color: "bg-black", description: "React Framework" }
      ]
    },
    {
      category: "Backend",
      technologies: [
        { name: "Python", icon: "🐍", color: "bg-green-600", description: "Versatile Programming" },
        { name: "PHP", icon: "🐘", color: "bg-purple-600", description: "Server-side Scripting" },
        { name: "Node.js", icon: "💚", color: "bg-green-500", description: "JavaScript Runtime" }
      ]
    },
    {
      category: "Design",
      technologies: [
        { name: "Figma", icon: "🎨", color: "bg-purple-500", description: "UI/UX Design" },
        { name: "Framer", icon: "🔥", color: "bg-pink-500", description: "Prototyping Tool" },
        { name: "Illustrator", icon: "Ai", color: "bg-orange-500", description: "Vector Graphics" },
        { name: "Photoshop", icon: "Ps", color: "bg-blue-500", description: "Image Editing" }
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
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {stack.category}
              </button>
            ))}
          </div>
        </div>

        {/* Active Technology Stack Display */}
        <div className="space-y-8">
          <h3 className="text-2xl font-semibold text-center text-gray-300">
            {techStacks[activeTab].category} Technologies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {techStacks[activeTab].technologies.map((tech, index) => (
              <div
                key={tech.name}
                className="group relative bg-gray-800/50 rounded-xl p-6 border border-gray-700 
                         transition-all duration-500 hover:scale-105 hover:shadow-2xl 
                         hover:border-gray-500 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`w-16 h-16 ${tech.color} rounded-lg flex items-center 
                               justify-center mx-auto mb-4 transition-transform duration-300 
                               group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                  <span className="text-white text-xl font-bold">
                    {tech.icon}
                  </span>
                </div>
                
                {/* Technology Name */}
                <h4 className="text-center font-semibold text-gray-200 group-hover:text-white 
                             transition-colors duration-300 mb-2">
                  {tech.name}
                </h4>
                
                {/* Description */}
                <p className="text-center text-sm text-gray-400 group-hover:text-gray-300 
                             transition-colors duration-300">
                  {tech.description}
                </p>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 
                              transition-opacity duration-300 bg-gradient-to-r from-blue-400 
                              to-purple-500 blur-sm -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}