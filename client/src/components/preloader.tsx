import { useState, useEffect, useRef } from 'react';

const config = {
  name: "Rose Orbit",
  tag: "r = cos(kθ)",
  rotate: true,
  particleCount: 140,
  trailSpan: 0.54,
  durationMs: 3600,
  rotationDurationMs: 28000,
  pulseDurationMs: 4500,
  strokeWidth: 5.2,
  orbitRadius: 7,
  detailAmplitude: 2.7,
  petalCount: 7,
  curveScale: 3.9,
  point(progress: number, detailScale: number) {
    const t = progress * Math.PI * 2;
    const k = Math.round(config.petalCount);
    const r = config.orbitRadius - config.detailAmplitude * detailScale * Math.cos(k * t);
    return {
      x: 50 + Math.cos(t) * r * config.curveScale,
      y: 50 + Math.sin(t) * r * config.curveScale,
    };
  },
};

function normalizeProgress(progress: number) {
  return ((progress % 1) + 1) % 1;
}

function getDetailScale(time: number) {
  const pulseProgress = (time % config.pulseDurationMs) / config.pulseDurationMs;
  const pulseAngle = pulseProgress * Math.PI * 2;
  return 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48;
}

function getRotation(time: number) {
  if (!config.rotate) return 0;
  return -((time % config.rotationDurationMs) / config.rotationDurationMs) * 360;
}

function buildPath(detailScale: number, steps = 480) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const point = config.point(index / steps, detailScale);
    return `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }).join(' ');
}

function getParticle(index: number, progress: number, detailScale: number) {
  const tailOffset = index / (config.particleCount - 1);
  const point = config.point(normalizeProgress(progress - tailOffset * config.trailSpan), detailScale);
  const fade = Math.pow(1 - tailOffset, 0.56);
  return {
    x: point.x,
    y: point.y,
    radius: 0.9 + fade * 2.7,
    opacity: 0.04 + fade * 0.96,
  };
}

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(() => {
    return !sessionStorage.getItem('preloader_shown');
  });
  const groupRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const particlesRef = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    if (!isVisible) return;
    
    let minTimeElapsed = false;
    let pageLoaded = document.readyState === 'complete';

    const hideLoader = () => {
      if (minTimeElapsed && pageLoaded) {
        sessionStorage.setItem('preloader_shown', 'true');
        setIsVisible(false);
      }
    };

    const timer = setTimeout(() => {
      minTimeElapsed = true;
      hideLoader();
    }, 1200); // Wait at least 1.2s to show the cool animation

    const handleLoad = () => {
      pageLoaded = true;
      hideLoader();
    };

    if (!pageLoaded) {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    const startedAt = performance.now();
    let req: number;

    const render = (now: number) => {
      const time = now - startedAt;
      const progress = (time % config.durationMs) / config.durationMs;
      const detailScale = getDetailScale(time);

      if (groupRef.current) {
        groupRef.current.setAttribute('transform', `rotate(${getRotation(time)} 50 50)`);
      }
      if (pathRef.current) {
        pathRef.current.setAttribute('d', buildPath(detailScale));
      }
      
      particlesRef.current.forEach((node, index) => {
        if (!node) return;
        const particle = getParticle(index, progress, detailScale);
        node.setAttribute('cx', particle.x.toFixed(2));
        node.setAttribute('cy', particle.y.toFixed(2));
        node.setAttribute('r', particle.radius.toFixed(2));
        node.setAttribute('opacity', particle.opacity.toFixed(3));
      });

      req = requestAnimationFrame(render);
    };
    
    req = requestAnimationFrame(render);
    return () => cancelAnimationFrame(req);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      className="preloader fixed inset-0 z-[9999] flex flex-col gap-6 items-center justify-center bg-[var(--color-bg-page)]"
      style={{ transition: 'opacity 0.5s ease', opacity: isVisible ? 1 : 0, color: 'var(--color-text-heading)' }}
    >
      <div className="w-[min(50vmin,240px)] aspect-square flex items-center justify-center">
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className="w-full h-full overflow-visible">
          <g id="group" ref={groupRef}>
            <path 
              id="path" 
              ref={pathRef}
              stroke="currentColor" 
              strokeWidth={config.strokeWidth}
              strokeLinecap="round" 
              strokeLinejoin="round" 
              opacity="0.1" 
            />
            {Array.from({ length: config.particleCount }).map((_, i) => (
              <circle
                key={i}
                ref={(el) => { particlesRef.current[i] = el; }}
                fill="currentColor"
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
