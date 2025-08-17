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
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold mb-8 text-center">My Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="section-card">
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-400">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
