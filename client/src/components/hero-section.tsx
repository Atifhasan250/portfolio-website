import { useLocation } from 'wouter';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: gsap.Context;

    const playAnimation = () => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
          '.hero-image',
          { opacity: 0, scale: 0.95, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2 }
        )
        .fromTo(
          ['.hero-hi', '.hero-name', '.hero-desc'],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15 },
          "-=0.9"
        )
        .fromTo(
          '.hero-btn',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
          "-=0.6"
        );
      }, heroRef);
    };

    const preloader = document.querySelector('.preloader');
    if (!preloader) {
      playAnimation();
    } else {
      window.addEventListener('appLoaded', playAnimation);
    }

    return () => {
      window.removeEventListener('appLoaded', playAnimation);
      if (ctx) ctx.revert();
    };
  }, []);

  const handleViewWorks = () => {
    setLocation('/projects');
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={heroRef} id="hero" className="flex flex-col h-[calc(100dvh-4rem)] overflow-hidden px-4 pb-6 md:h-auto md:overflow-visible md:flex-row md:items-center md:min-h-[calc(100vh-4rem)] md:px-8 md:py-20">
      <div className="flex-1 container mx-auto max-w-6xl flex flex-col items-center justify-center gap-4 sm:gap-8 text-center md:flex-row md:gap-12 md:text-left">
        <div className="flex w-full justify-center md:w-1/2 md:justify-end">
          <img
            src="/profile-image.png"
            alt="Atif Hasan Profile Picture"
            className="hero-image opacity-0 h-auto w-full max-w-[230px] rounded-2xl sm:max-w-[240px] md:max-w-sm"
          />
        </div>
        <div className="w-full text-center md:w-1/2 md:text-left">
          <p
            className="hero-hi opacity-0 mb-2 text-lg sm:mb-4 sm:text-xl md:text-2xl"
            style={{ fontFamily: "'Caveat', cursive", color: 'var(--color-text-body)' }}
          >
            Hi, I'm
          </p>
          <h1 className="hero-name opacity-0 mb-2 text-4xl font-bold sm:mb-4 sm:text-5xl md:text-6xl">
            Atif Hasan
          </h1>
          <p
            className="hero-desc opacity-0 mb-5 mx-auto max-w-xl text-base sm:mb-10 sm:text-lg md:mb-12 md:mx-0 md:text-xl"
            style={{ color: 'var(--color-text-body)' }}
          >
            I build AI powered Full-Stack applications.
          </p>
          <div className="flex flex-row justify-center gap-3 sm:gap-4 md:justify-start">
            <div className="hero-btn opacity-0">
              <button onClick={handleViewWorks} className="cta-button text-sm px-6 py-2.5 sm:text-base sm:px-8 sm:py-3">
                View Works
              </button>
            </div>
            <div className="hero-btn opacity-0">
              <button onClick={scrollToContact} className="outline-button text-sm px-6 py-2.5 sm:text-base sm:px-8 sm:py-3">
                Contact Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
