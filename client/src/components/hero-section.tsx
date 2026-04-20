import RotatingText from './RotatingText';

export default function HeroSection() {
  const scrollToWorks = () => {
    const element = document.getElementById('works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="flex items-center justify-center px-4 py-16 md:px-8 md:py-20">
      <div className="container mx-auto max-w-6xl flex flex-col items-center justify-center gap-10 text-center md:flex-row md:gap-12 md:text-left">
        <div className="flex w-full justify-center md:w-1/2 md:justify-end">
          <img
            src="/profile-image.png"
            alt="Atif Hasan Profile Picture"
            className="hero-image h-auto w-full max-w-[280px] rounded-2xl sm:max-w-sm"
          />
        </div>
        <div className="mt-2 w-full text-center md:mt-0 md:w-1/2 md:text-left">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
            Atif Hasan
          </h1>
          <div
            className="mb-8 sm:mb-10 md:mb-12 mx-auto max-w-xl text-base sm:text-lg md:mx-0 md:text-xl"
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
              staggerDuration={0.045}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              rotationInterval={2200}
            />
          </div>
          <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
            <button onClick={scrollToWorks} className="cta-button">
              View My Work
            </button>
            <button className="outline-button">
              <a href="https://github.com/Atifhasan250" target="_blank" rel="noopener noreferrer">View My GitHub</a>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
