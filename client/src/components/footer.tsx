import type { MouseEvent } from 'react';

export default function Footer() {
  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    event.preventDefault();
    section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer-bg w-full py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
        {/* Main Footer content */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {/* Atif Hasan / Bio */}
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Atif Hasan</h2>
            <p className="text-sm" style={{ color: 'var(--color-text-body)' }}>
              A full-stack and AI developer from Bogura, Bangladesh, building practical web, mobile, automation, and IoT products.
            </p>
          </div>

          {/* Important Links */}
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Important Links</h2>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-body)' }}>
              <li><a href="/#hero" onClick={(event) => scrollToSection(event, 'hero')} className="footer-link transition duration-300">Home</a></li>
              <li><a href="/#about" onClick={(event) => scrollToSection(event, 'about')} className="footer-link transition duration-300">About</a></li>
              <li><a href="/projects" className="footer-link transition duration-300">Projects</a></li>
              <li><a href="/#timeline" onClick={(event) => scrollToSection(event, 'timeline')} className="footer-link transition duration-300">Timeline</a></li>
              <li><a href="/#services" onClick={(event) => scrollToSection(event, 'services')} className="footer-link transition duration-300">Capabilities</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Contact Info</h2>
            <ul className="space-y-2 text-sm break-all sm:break-normal" style={{ color: 'var(--color-text-body)' }}>
              <li><a href="mailto:atifhasan000000@gmail.com" className="footer-link transition duration-300">atifhasan000000@gmail.com</a></li>
              <li>Bogura, Bangladesh</li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Social Links</h2>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-body)' }}>
              <li><a href="https://www.facebook.com/atifhasan250" target="_blank" rel="noopener noreferrer" className="footer-link transition duration-300">Facebook</a></li>
              <li><a href="https://www.linkedin.com/in/atifhasan250/" target="_blank" rel="noopener noreferrer" className="footer-link transition duration-300">LinkedIn</a></li>
              <li><a href="https://www.instagram.com/_atif_hasan_/" target="_blank" rel="noopener noreferrer" className="footer-link transition duration-300">Instagram</a></li>
              <li><a href="https://github.com/Atifhasan250" target="_blank" rel="noopener noreferrer" className="footer-link transition duration-300">GitHub</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright section */}
        <div className="border-t pt-4 mt-8 text-center text-sm" style={{ borderColor: 'var(--color-border-default)', color: 'var(--color-text-muted)' }}>
          &copy; 2026 - Made with ❤️ by Atif Hasan
        </div>
      </div>
    </footer>
  );
}
