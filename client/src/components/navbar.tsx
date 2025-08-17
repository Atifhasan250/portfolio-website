import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="navbar-custom text-white p-4 w-full fixed top-0 left-0 z-20">
      <div className="container mx-auto flex justify-between items-center max-w-6xl">
        {/* Logo / Brand */}
        <button 
          onClick={() => scrollToSection('hero')} 
          className="flex items-center text-2xl tracking-wide text-white transition-colors duration-300 logomark-link"
        >
          <svg className="h-8 w-8 mr-2 text-white logomark" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0L0 12L12 24L24 12L12 0ZM12 4.2L4.2 12L12 19.8L19.8 12L12 4.2Z"/>
          </svg>
          ATIF
        </button>

        {/* Desktop Menu Links */}
        <div className="hidden md:flex items-center space-x-8 font-medium">
          <button onClick={() => scrollToSection('hero')} className="text-white nav-link">Home</button>
          <button onClick={() => scrollToSection('about')} className="text-white nav-link">About</button>
          <button onClick={() => scrollToSection('works')} className="text-white nav-link">Works</button>
          <button onClick={() => scrollToSection('contact')} className="text-white nav-link">Contact</button>
        </div>

        {/* Hamburger Menu Button (Mobile) */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden focus:outline-none p-2 rounded-md"
        >
          <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu-container md:hidden ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="flex flex-col items-center mt-4 space-y-4 font-medium py-2 navbar-custom">
          <button onClick={() => scrollToSection('hero')} className="block text-white py-2 nav-link">Home</button>
          <button onClick={() => scrollToSection('about')} className="block text-white py-2 nav-link">About</button>
          <button onClick={() => scrollToSection('works')} className="block text-white py-2 nav-link">Works</button>
          <button onClick={() => scrollToSection('contact')} className="block text-white py-2 nav-link">Contact</button>
        </div>
      </div>
    </nav>
  );
}
