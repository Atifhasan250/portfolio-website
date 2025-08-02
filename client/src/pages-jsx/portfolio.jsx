import HeroSection from '../components-jsx/hero-section';
import AboutSection from '../components-jsx/about-section';
import WorksSection from '../components-jsx/works-section';
import { TechStackSection } from '../components-jsx/tech-stack-section';
import ContactSection from '../components-jsx/contact-section';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <HeroSection />
      <AboutSection />
      <WorksSection />
      <TechStackSection />
      <ContactSection />
    </div>
  );
}