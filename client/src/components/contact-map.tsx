import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const BOGURA: [number, number] = [89.37108, 24.85098];

export default function ContactMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: BOGURA,
      zoom: 11,
      attributionControl: false,
      cooperativeGestures: true,
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'top-right',
    );

    const markerElement = document.createElement('div');
    markerElement.className = 'contact-map-marker';
    markerElement.setAttribute('aria-label', 'Bogura, Bangladesh');
    markerElement.appendChild(document.createElement('span'));

    new maplibregl.Marker({ element: markerElement, anchor: 'bottom' })
      .setLngLat(BOGURA)
      .addTo(map);

    const resizeMap = () => map.resize();
    map.once('load', resizeMap);
    const animationFrame = window.requestAnimationFrame(resizeMap);
    mapRef.current = map;

    return () => {
      window.cancelAnimationFrame(animationFrame);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="contact-map h-[250px] w-full overflow-hidden rounded-2xl border sm:h-[280px]"
      style={{ borderColor: 'var(--color-border-default)', backgroundColor: '#0e0e0e' }}
      role="region"
      aria-label="Map showing Bogura, Bangladesh"
    />
  );
}
