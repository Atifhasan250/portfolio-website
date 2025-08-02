import { SiGithub, SiLinkedin, SiX } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Alex Chen</h3>
            <p className="text-slate-400 mb-4">
              Full Stack Developer passionate about creating exceptional digital experiences.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
                <SiGithub className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
                <SiLinkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
                <SiX className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection("home")}
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("about")}
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("projects")}
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  Projects
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("skills")}
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  Skills
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("contact")}
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Web Development</li>
              <li>Frontend Development</li>
              <li>Backend Development</li>
              <li>UI/UX Design</li>
              <li>Consulting</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © {currentYear} Alex Chen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
