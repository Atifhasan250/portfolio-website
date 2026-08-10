import { useLayoutEffect, type MouseEvent } from 'react';
import Navbar from '@/components/navbar';
import HeroSection from '@/components/hero-section';
import AboutSection from '@/components/about-section';
import WorksSection from '@/components/works-section';
import TimelineSection from '@/components/timeline-section';
import { TechStackSection } from '@/components/tech-stack-section';
import ServicesSection from '@/components/services-section';
import ContactSection from '@/components/contact-section';
import Footer from '@/components/footer';

interface PortfolioProps {
  onToggleTheme?: (event?: MouseEvent<HTMLButtonElement>) => void;
  currentTheme?: string;
}

export default function Portfolio({ onToggleTheme, currentTheme = 'dark' }: PortfolioProps) {
  useLayoutEffect(() => {
    if (sessionStorage.getItem('portfolio:restore-home-scroll') !== 'true') return;

    const storedScroll = Number(sessionStorage.getItem('portfolio:home-scroll-y'));
    sessionStorage.removeItem('portfolio:restore-home-scroll');
    sessionStorage.removeItem('portfolio:opened-projects-from-home');

    if (!Number.isFinite(storedScroll)) return;

    const restoreScroll = () => window.scrollTo({ top: storedScroll, behavior: 'instant' });
    restoreScroll();

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(restoreScroll);
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar onToggleTheme={onToggleTheme} currentTheme={currentTheme} />
      
      {/* Main content area */}
      <div className="flex flex-col pt-16">
        <HeroSection />
        <AboutSection />
        <WorksSection />
        <TimelineSection />
        <ServicesSection />
        <TechStackSection />
        <ContactSection />
      </div>
      
      <Footer />
    </div>
  );
}
