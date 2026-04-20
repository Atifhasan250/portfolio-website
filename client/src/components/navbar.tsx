import { useState, type MouseEvent } from 'react';

interface NavbarProps {
  onToggleTheme?: (event?: MouseEvent<HTMLButtonElement>) => void;
  currentTheme?: string;
}

export default function Navbar({ onToggleTheme, currentTheme = 'dark' }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="navbar-custom p-4 w-full fixed top-0 left-0 z-20">
      <div className="container mx-auto flex max-w-6xl items-center gap-3">
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center text-2xl tracking-wide transition-colors duration-300 logomark-link"
        >
          <svg className="h-8 w-8 mr-2 logomark" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0L0 12L12 24L24 12L12 0ZM12 4.2L4.2 12L12 19.8L19.8 12L12 4.2Z" />
          </svg>
          ATIF
        </button>

        <div className="hidden md:flex items-center space-x-8 font-medium ml-auto mr-6">
          <button onClick={() => scrollToSection('hero')} className="nav-link">Home</button>
          <button onClick={() => scrollToSection('about')} className="nav-link">About</button>
          <button onClick={() => scrollToSection('works')} className="nav-link">Works</button>
          <button onClick={() => scrollToSection('contact')} className="nav-link">Contact</button>
        </div>

        <div className="ml-auto flex items-center gap-3 md:gap-4">
          {onToggleTheme && (
            <button
              onClick={(event) => onToggleTheme(event)}
              aria-label="Toggle theme"
              className="theme-toggle flex items-center justify-center transition-transform duration-300"
            >
              <span className="theme-toggle-emoji" aria-hidden="true">
                {currentTheme === 'dark' ? '☀️' : '🌙'}
              </span>
            </button>
          )}

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-3 rounded-xl border border-[var(--color-border-default)] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`mobile-menu-container md:hidden ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mt-4 flex flex-col items-stretch space-y-2 py-2 navbar-custom">
          <button onClick={() => scrollToSection('hero')} className="mobile-nav-link">Home</button>
          <button onClick={() => scrollToSection('about')} className="mobile-nav-link">About</button>
          <button onClick={() => scrollToSection('works')} className="mobile-nav-link">Works</button>
          <button onClick={() => scrollToSection('contact')} className="mobile-nav-link">Contact</button>
        </div>
      </div>
    </nav>
  );
}
