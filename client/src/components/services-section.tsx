import FadeUpOnScroll from './FadeUpOnScroll';
import ScrollFloat from './ScrollFloat';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

const springConfig = { damping: 20, stiffness: 100, mass: 1 };

function ServiceCard({ service }: { service: { title: string; description: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);
  const scale = useSpring(1, springConfig);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -6);
    rotateY.set((offsetX / (rect.width / 2)) * 6);
  }

  function handleMouseEnter() { scale.set(1.02); }
  function handleMouseLeave() { rotateX.set(0); rotateY.set(0); scale.set(1); }

  return (
    <div style={{ perspective: '800px' }} className="h-full flex">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
        className="section-card-no-hover flex flex-col h-full w-full"
      >
        <h3 className="text-xl font-bold mb-2">{service.title}</h3>
        <p style={{ color: 'var(--color-text-body)' }}>
          {service.description}
        </p>
      </motion.div>
    </div>
  );
}

export default function ServicesSection() {
  const services = [
    {
      title: "Premium Web Development",
      description: "Fast, clean, responsive websites built to look sharp and grow with your business."
    },
    {
      title: "Conversion-Focused UI/UX",
      description: "Simple, modern interfaces that guide visitors clearly and turn attention into action."
    },
    {
      title: "AI Integration",
      description: "Smart chatbots, content tools, summaries, and AI workflows built into real products."
    },
    {
      title: "SaaS & Dashboard Development",
      description: "Clean dashboards with user accounts, admin panels, charts, roles, and useful controls."
    },
    {
      title: "API & Backend Systems",
      description: "APIs, databases, auth, payments, forms, and third-party services that work smoothly."
    },
    {
      title: "Performance & SEO Optimization",
      description: "Faster load times, better structure, stronger SEO, and smoother mobile experience."
    }
  ];

  return (
    <section id="services" className="py-20 px-4 md:px-8">
      <FadeUpOnScroll>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="top bottom"
              scrollEnd="bottom center"
              stagger={0.03}
              containerClassName="text-3xl md:text-4xl font-bold mb-4"
            >
              My Services
            </ScrollFloat>
            <p className="max-w-2xl mx-auto text-sm md:text-base">
              Not just pretty pages. I build practical web experiences that look sharp,
              work smoothly, and solve real problems.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>
      </FadeUpOnScroll>
    </section>
  );
}
