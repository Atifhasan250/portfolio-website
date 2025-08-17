import Preloader from '@/components/preloader';
import Navbar from '@/components/navbar';
import HeroSection from '@/components/hero-section';
import AboutSection from '@/components/about-section';
import WorksSection from '@/components/works-section';
import { TechStackSection } from '@/components/tech-stack-section';
import ServicesSection from '@/components/services-section';
import TestimonialsSection from '@/components/testimonials-section';
import ContactSection from '@/components/contact-section';
import Footer from '@/components/footer';

export default function Portfolio() {
  return (
    <div className="min-h-screen">
      <Preloader />
      <Navbar />
      
      {/* Main content area */}
      <div className="flex flex-col pt-16">
        <HeroSection />
        <AboutSection />
        <WorksSection />
        <ServicesSection />
        <TechStackSection />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        <ContactSection />
      </div>
      
      <Footer />
    </div>
  );
}