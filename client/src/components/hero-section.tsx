import { useLocation } from 'wouter';
import RotatingText from './RotatingText';

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
    <section id="hero" className="flex h-[100dvh] min-h-[100dvh] items-center justify-center px-4 pt-16 pb-10 md:h-auto md:min-h-screen md:px-8 md:py-20">
      <div className="-mt-12 container mx-auto max-w-6xl flex flex-col items-center justify-center gap-6 sm:gap-10 text-center md:mt-0 md:flex-row md:gap-12 md:text-left">
        <div className="flex w-full justify-center md:w-1/2 md:justify-end">
          <img
            src="/profile-image.png"
            alt="Atif Hasan Profile Picture"
            className="hero-image h-auto w-full max-w-[250px] rounded-2xl sm:max-w-[280px] md:max-w-sm"
          />
        </div>
        <div className="mt-2 w-full text-center md:mt-0 md:w-1/2 md:text-left">
          <h1 className="mb-3 text-4xl font-bold sm:mb-4 sm:text-5xl md:text-6xl">
            Atif Hasan
          </h1>
          <div
            className="mb-6 mx-auto max-w-xl text-base sm:mb-10 sm:text-lg md:mb-12 md:mx-0 md:text-xl"
            style={{ color: 'var(--color-text-body)' }}
          >
            <span>Building digital products that are </span>
            <RotatingText
              texts={['Fast.', 'Clean.', 'Scalable.', 'production-ready.']}
              mainClassName="rotating-text overflow-hidden"
              splitLevelClassName="overflow-hidden"
              splitBy="characters"
              staggerFrom="last"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-120%' }}
              staggerDuration={0.09}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              rotationInterval={3200}
            />
          </div>
          <div className="flex flex-row justify-center gap-3 sm:gap-4 md:justify-start">
            <button onClick={handleViewWorks} className="cta-button text-sm px-4 py-2 sm:text-base sm:px-6 sm:py-3">
              View My Work
            </button>
            <button onClick={scrollToContact} className="outline-button text-sm px-4 py-2 sm:text-base sm:px-6 sm:py-3">
              Contact With Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
