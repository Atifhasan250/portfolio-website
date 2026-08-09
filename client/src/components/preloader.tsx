import { useState, useEffect } from 'react';

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const minTime = 500; // 0.5 seconds minimum

    const finishLoading = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minTime - elapsedTime);

      setTimeout(() => {
        setIsVisible(false);
        // Dispatch event after fade out (CSS transition is 0.5s)
        setTimeout(() => {
          setIsMounted(false);
          window.dispatchEvent(new CustomEvent('appLoaded'));
        }, 500); 
      }, remainingTime);
    };

    if (document.readyState === 'complete') {
      finishLoading();
    } else {
      window.addEventListener('load', finishLoading);
      return () => window.removeEventListener('load', finishLoading);
    }
  }, []);

  if (!isMounted) return null;

  return (
    <div className={`preloader ${!isVisible ? 'hidden' : ''}`}>
      <div className="spinner"></div>
    </div>
  );
}
