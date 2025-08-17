export default function HeroSection() {
  const scrollToWorks = () => {
    const element = document.getElementById('works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="flex items-center justify-center py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-center gap-12 text-center md:text-left">
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <img 
            src="/profile-image.png" 
            alt="Atif Hasan Profile Picture" 
            className="w-full max-w-sm h-auto rounded-2xl shadow-2xl" 
          />
        </div>
        <div className="md:w-1/2 text-center md:text-left mt-8 md:mt-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Atif Hasan
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8">
            Crafting elegant and performant web experiences.
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
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
