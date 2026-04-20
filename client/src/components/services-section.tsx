import SpotlightCard from './SpotlightCard';
import FadeUpOnScroll from './FadeUpOnScroll';
import ScrollFloat from './ScrollFloat';

export default function ServicesSection() {
  const services = [
    {
      title: "Web Development",
      description: "Building responsive, fast, and scalable websites and web applications using modern technologies like React, Vue.js, and Node.js."
    },
    {
      title: "UI/UX Design",
      description: "Crafting intuitive and visually stunning user interfaces that provide an exceptional user experience on all devices."
    },
    {
      title: "API Integration",
      description: "Seamlessly integrating third-party APIs and building custom back-end solutions to power dynamic web applications."
    }
  ];

  return (
    <section id="services" className="py-20 px-4 md:px-8">
      <FadeUpOnScroll>
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-center w-full">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="top bottom"
              scrollEnd="bottom center"
              stagger={0.03}
              containerClassName="text-3xl font-bold mb-8 text-center"
            >
              My Services
            </ScrollFloat>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <SpotlightCard
                key={index}
                className="section-card-no-hover"
                spotlightColor="rgba(255, 255, 255, 0.06)"
              >
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p style={{ color: 'var(--color-text-body)' }}>
                  {service.description}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </FadeUpOnScroll>
    </section>
  );
}
