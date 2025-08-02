import { Download } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">About Me</h2>
          <div className="w-24 h-1 bg-portfolio-blue mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Professional developer workspace" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
          
          <div className="space-y-6">
            <p className="text-lg text-slate-600 leading-relaxed">
              I'm a passionate full stack developer with 5+ years of experience building scalable web applications. 
              I love turning complex problems into simple, beautiful designs that provide exceptional user experiences.
            </p>
            
            <p className="text-lg text-slate-600 leading-relaxed">
              My expertise spans both frontend and backend development, with a strong focus on React, Node.js, 
              and modern cloud technologies. I'm always eager to learn new technologies and take on challenging projects.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <div className="text-3xl font-bold text-portfolio-blue mb-2">25+</div>
                <div className="text-slate-600 font-medium">Projects Completed</div>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <div className="text-3xl font-bold text-portfolio-blue mb-2">5+</div>
                <div className="text-slate-600 font-medium">Years Experience</div>
              </div>
            </div>

            <div className="pt-6">
              <a 
                href="#" 
                className="inline-flex items-center px-6 py-3 bg-portfolio-amber text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors duration-200"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
