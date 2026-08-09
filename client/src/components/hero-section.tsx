import { useLocation } from 'wouter';

export default function HeroSection() {
  const [, setLocation] = useLocation();

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
    <section id="hero" className="flex flex-col h-[calc(100dvh-4rem)] overflow-hidden px-4 pb-6 md:h-auto md:overflow-visible md:flex-row md:items-center md:min-h-[calc(100vh-4rem)] md:px-8 md:py-20">
      <div className="flex-1 container mx-auto max-w-6xl flex flex-col items-center justify-center gap-4 sm:gap-8 text-center md:flex-row md:gap-12 md:text-left">
        <div className="flex w-full justify-center md:w-1/2 md:justify-end">
          <img
            src="/profile-image.png"
            alt="Atif Hasan Profile Picture"
            className="hero-image h-auto w-full max-w-[230px] rounded-2xl sm:max-w-[240px] md:max-w-sm"
          />
        </div>
        <div className="w-full text-center md:w-1/2 md:text-left">
          <p
            className="mb-2 text-lg sm:mb-4 sm:text-xl md:text-2xl"
            style={{ fontFamily: "'Caveat', cursive", color: 'var(--color-text-body)' }}
          >
            Hi, I'm
          </p>
          <h1 className="mb-2 text-4xl font-bold sm:mb-4 sm:text-5xl md:text-6xl">
            Atif Hasan
          </h1>
          <p
            className="mb-5 mx-auto max-w-xl text-base sm:mb-10 sm:text-lg md:mb-12 md:mx-0 md:text-xl"
            style={{ color: 'var(--color-text-body)' }}
          >
            I build AI powered Full-Stack applications.
          </p>
          <div className="flex flex-row justify-center gap-3 sm:gap-4 md:justify-start">
            <button onClick={handleViewWorks} className="cta-button text-sm px-6 py-2.5 sm:text-base sm:px-8 sm:py-3">
              View Works
            </button>
            <button onClick={scrollToContact} className="outline-button text-sm px-6 py-2.5 sm:text-base sm:px-8 sm:py-3">
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
