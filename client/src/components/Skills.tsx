import { Monitor, Server, Cloud, Settings } from "lucide-react";

interface SkillProgress {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  icon: any;
  skills: SkillProgress[];
}

export default function Skills() {
  const skillCategories: SkillCategory[] = [
    {
      title: "Frontend",
      icon: Monitor,
      skills: [
        { name: "React", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "Tailwind CSS", level: 95 }
      ]
    },
    {
      title: "Backend",
      icon: Server,
      skills: [
        { name: "Node.js", level: 88 },
        { name: "Express.js", level: 85 },
        { name: "MongoDB", level: 80 }
      ]
    },
    {
      title: "Cloud & DevOps",
      icon: Cloud,
      skills: [
        { name: "AWS", level: 75 },
        { name: "Docker", level: 70 },
        { name: "CI/CD", level: 78 }
      ]
    },
    {
      title: "Tools & Other",
      icon: Settings,
      skills: [
        { name: "Git", level: 92 },
        { name: "Figma", level: 75 },
        { name: "Agile", level: 88 }
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Skills & Technologies</h2>
          <div className="w-24 h-1 bg-portfolio-blue mx-auto rounded-full"></div>
          <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
            Here are the technologies I work with to bring ideas to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="text-center mb-4">
                  <IconComponent className="h-10 w-10 text-portfolio-blue mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900">{category.title}</h3>
                </div>
                <div className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">{skill.name}</span>
                        <span className="text-portfolio-blue font-semibold">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-portfolio-blue h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
