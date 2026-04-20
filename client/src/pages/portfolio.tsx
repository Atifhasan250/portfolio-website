import type { MouseEvent } from 'react';
import Preloader from '@/components/preloader';
import Navbar from '@/components/navbar';
import HeroSection from '@/components/hero-section';
import AboutSection from '@/components/about-section';
import WorksSection from '@/components/works-section';
import { TechStackSection } from '@/components/tech-stack-section';
import ServicesSection from '@/components/services-section';
import ContactSection from '@/components/contact-section';
import Footer from '@/components/footer';

interface PortfolioProps {
  onToggleTheme?: (event?: MouseEvent<HTMLButtonElement>) => void;
  currentTheme?: string;
}

export default function Portfolio({ onToggleTheme, currentTheme = 'dark' }: PortfolioProps) {
  return (
    <div className="min-h-screen">
      <Preloader />
      <Navbar onToggleTheme={onToggleTheme} currentTheme={currentTheme} />
      
      {/* Main content area */}
      <div className="flex flex-col pt-16">
        <HeroSection />
        <AboutSection />
        <WorksSection />
        <ServicesSection />
        <TechStackSection />
        <ContactSection />
      </div>
      
      <Footer />
    </div>
  );
}
