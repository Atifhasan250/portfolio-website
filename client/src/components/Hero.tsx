import { User, ArrowDown } from "lucide-react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { Mail } from "lucide-react";

export default function Hero() {
  const scrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-portfolio-blue to-blue-600 flex items-center justify-center shadow-xl">
              <User className="text-white text-4xl h-16 w-16" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            <span>Hi, I'm </span>
            <span className="text-portfolio-blue">Alex Chen</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            <span>Full Stack Developer</span> passionate about creating 
            <span className="text-portfolio-amber font-semibold"> beautiful</span> and 
            <span className="text-portfolio-blue font-semibold"> functional</span> web applications
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={scrollToProjects}
              className="bg-portfolio-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View My Work
            </button>
            <button 
              onClick={scrollToContact}
              className="border-2 border-portfolio-blue text-portfolio-blue px-8 py-3 rounded-lg font-semibold hover:bg-portfolio-blue hover:text-white transition-all duration-200"
            >
              Get In Touch
            </button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mt-12">
            <a href="https://github.com" className="text-slate-600 hover:text-portfolio-blue transition-colors duration-200 text-2xl">
              <SiGithub />
            </a>
            <a href="https://linkedin.com" className="text-slate-600 hover:text-portfolio-blue transition-colors duration-200 text-2xl">
              <SiLinkedin />
            </a>
            <a href="https://twitter.com" className="text-slate-600 hover:text-portfolio-blue transition-colors duration-200 text-2xl">
              <SiX />
            </a>
            <a href="mailto:alex@example.com" className="text-slate-600 hover:text-portfolio-blue transition-colors duration-200 text-2xl">
              <Mail />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
