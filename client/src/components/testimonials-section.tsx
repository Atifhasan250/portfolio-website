import { useState } from 'react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      text: "Atif is a true professional. His attention to detail and ability to understand our vision was incredible. The website he built exceeded all our expectations and delivered beyond what we imagined.",
      name: "Sarah Johnson",
      position: "CEO, TechVision",
      avatar: "https://placehold.co/60x60/1a1a1a/e2e8f0?text=SJ&font=montserrat",
      rating: 5
    },
    {
      text: "Working with Atif was a seamless experience. He delivered a high-quality product on time and was an excellent communicator throughout the entire process. Highly recommended!",
      name: "Michael Chen",
      position: "Founder, StartupHub",
      avatar: "https://placehold.co/60x60/1a1a1a/3b82f6?text=MC&font=montserrat",
      rating: 5
    },
    {
      text: "The mobile app Atif developed for us increased our user engagement by 40%. His expertise in both frontend and backend development is impressive. Truly exceptional work!",
      name: "Emily Rodriguez",
      position: "Product Manager, InnovateLab",
      avatar: "https://placehold.co/60x60/1a1a1a/ec4899?text=ER&font=montserrat",
      rating: 5
    },
    {
      text: "Atif transformed our outdated website into a modern, responsive platform that perfectly represents our brand. The results speak for themselves - our online conversions doubled.",
      name: "David Thompson",
      position: "Marketing Director, GrowthCorp",
      avatar: "https://placehold.co/60x60/1a1a1a/4ade80?text=DT&font=montserrat",
      rating: 5
    },
    {
      text: "I was impressed by Atif's ability to turn complex requirements into elegant solutions. His code quality is excellent and the final product was delivered ahead of schedule.",
      name: "Lisa Park",
      position: "CTO, DataFlow Systems",
      avatar: "https://placehold.co/60x60/1a1a1a/8b5cf6?text=LP&font=montserrat",
      rating: 5
    },
    {
      text: "Atif's creativity and technical skills are outstanding. He developed a custom e-commerce solution that streamlined our entire business process. Couldn't be happier with the results!",
      name: "James Wilson",
      position: "Owner, EliteCommerce",
      avatar: "https://placehold.co/60x60/1a1a1a/fbbf24?text=JW&font=montserrat",
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialsPerPage = 2;

  const getCurrentTestimonials = () => {
    const testimonialsList = [];
    for (let i = 0; i < testimonialsPerPage; i++) {
      const index = (currentIndex + i) % testimonials.length;
      testimonialsList.push(testimonials[index]);
    }
    return testimonialsList;
  };

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevPage = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400' : 'text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section id="testimonials" className="py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">What Clients Say</h2>
          <div className="flex space-x-2">
            <button 
              onClick={prevPage}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-300"
              aria-label="Previous testimonials"
            >
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextPage}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-300"
              aria-label="Next testimonials"
            >
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-500 ease-in-out">
            {getCurrentTestimonials().map((testimonial, index) => (
              <div 
                key={`${currentIndex}-${index}`}
                className="section-card opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-400 text-lg mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="rounded-full mr-4 border-2 border-gray-700" 
                  />
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                currentIndex === index ? 'bg-white' : 'bg-gray-600'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}