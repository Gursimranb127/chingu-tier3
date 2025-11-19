"use client"

import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Map() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      center: [-71.3, 42.3],
      zoom: 9
    });

    return () => {
      mapRef.current?.remove();
    }
  }, []);

  return (
    <>
      <div
        id='map-container'
        className='h-full w-full bg-gray-100'
        ref={mapContainerRef}
      />
    </>
  );
};
