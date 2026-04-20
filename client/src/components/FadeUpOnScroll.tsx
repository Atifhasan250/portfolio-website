import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface FadeUpOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export default function FadeUpOnScroll({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
}: FadeUpOnScrollProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
