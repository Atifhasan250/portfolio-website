import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed w-full top-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200" 
          : "bg-white/90 backdrop-blur-md border-b border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-portfolio-blue">Alex Chen</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => scrollToSection("home")}
                className="text-slate-600 hover:text-portfolio-blue transition-colors duration-200 font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection("about")}
                className="text-slate-600 hover:text-portfolio-blue transition-colors duration-200 font-medium"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection("projects")}
                className="text-slate-600 hover:text-portfolio-blue transition-colors duration-200 font-medium"
              >
                Projects
              </button>
              <button 
                onClick={() => scrollToSection("skills")}
                className="text-slate-600 hover:text-portfolio-blue transition-colors duration-200 font-medium"
              >
                Skills
              </button>
              <button 
                onClick={() => scrollToSection("contact")}
                className="text-slate-600 hover:text-portfolio-blue transition-colors duration-200 font-medium"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-portfolio-blue focus:outline-none focus:text-portfolio-blue"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-slate-200">
            <button 
              onClick={() => scrollToSection("home")}
              className="block px-3 py-2 text-slate-600 hover:text-portfolio-blue transition-colors duration-200 w-full text-left"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection("about")}
              className="block px-3 py-2 text-slate-600 hover:text-portfolio-blue transition-colors duration-200 w-full text-left"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection("projects")}
              className="block px-3 py-2 text-slate-600 hover:text-portfolio-blue transition-colors duration-200 w-full text-left"
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection("skills")}
              className="block px-3 py-2 text-slate-600 hover:text-portfolio-blue transition-colors duration-200 w-full text-left"
            >
              Skills
            </button>
            <button 
              onClick={() => scrollToSection("contact")}
              className="block px-3 py-2 text-slate-600 hover:text-portfolio-blue transition-colors duration-200 w-full text-left"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
