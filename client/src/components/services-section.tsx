import {
  Bot,
  Code2,
  Cpu,
  LayoutDashboard,
  Smartphone,
  Workflow,
} from 'lucide-react';
import FadeUpOnScroll from './FadeUpOnScroll';

const capabilities = [
  {
    title: 'Web Development',
    description: 'Websites and web apps, built end to end.',
    icon: Code2,
  },
  {
    title: 'AI Integration',
    description: 'Useful AI features added to new or existing products.',
    icon: Bot,
  },
  {
    title: 'AI Automation',
    description: 'Repetitive work connected and automated across tools.',
    icon: Workflow,
  },
  {
    title: 'IoT Systems',
    description: 'Connected devices, sensors, and real-time data flows.',
    icon: Cpu,
  },
  {
    title: 'SaaS & Dashboard Development',
    description: 'Admin panels, analytics, user roles, and product workflows.',
    icon: LayoutDashboard,
  },
  {
    title: 'Mobile App Development',
    description: 'Cross-platform mobile apps for iOS and Android.',
    icon: Smartphone,
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 px-4 md:px-8">
      <FadeUpOnScroll>
        <div className="container mx-auto max-w-6xl">
          <div className="capabilities-header">
            <h2 className="text-3xl md:text-4xl font-bold">My Capabilities</h2>
          </div>

          <div className="capabilities-list">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;

              return (
                <article className="capability-row" key={capability.title}>
                  <span className="capability-index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="capability-icon" aria-hidden="true">
                    <Icon strokeWidth={1.7} />
                  </span>
                  <h3 className="capability-title">{capability.title}</h3>
                  <p className="capability-description">{capability.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </FadeUpOnScroll>
    </section>
  );
}
