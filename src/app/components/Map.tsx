'use client';
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Marker } from './Marker';
import { useSelectedCountry } from '@/stores/useSelectedCountry';
import { getCountryData } from '@/lib/geo';
import { useChinguStats } from '@/hooks/useChinguStats';
import { useUIView } from '@/stores/useUIViewStore';

const calculateZoom = (area: number): number => {
  if (area > 5000000) return 2.5;
  if (area > 1000000) return 3.5;
  if (area > 500000) return 4;
  if (area > 100000) return 5;
  if (area > 50000) return 6;
  return 7;
};

export const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const { selectedCountry } = useSelectedCountry();
  const { currentView } = useUIView();

  const spinningRef = useRef(true);
  const animationFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
    const m = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      center: [0, 90],
      pitch: 70,
      bearing: 0,
      zoom: 1.5,
    });

    m.on('load', () => {
      m.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
        promoteId: 'mapbox_id',
      });
    });

    setMap(m);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      m.remove();
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    const rotationSpeed = 0.05;

    const rotateGlobe = (timestamp: number) => {
      if (!spinningRef.current) {
        animationFrameIdRef.current = null;
        return;
      }

      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed > 16) {
        const c = map.getCenter();
        map.setCenter([c.lng + rotationSpeed, c.lat]);
        lastTimeRef.current = timestamp;
      }

      animationFrameIdRef.current = requestAnimationFrame(rotateGlobe);
    };

    if (currentView === 'home') {
      spinningRef.current = true;
      lastTimeRef.current = 0;

      map.flyTo({
        center: [0, 90],
        pitch: 70,
        bearing: 0,
        zoom: 1.5,
        duration: 2000,
      });

      setTimeout(() => {
        if (spinningRef.current) {
          rotateGlobe(0);
        }
      }, 2100);
    } else {
      spinningRef.current = false;
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }

      setTimeout(() => {
        map.flyTo({
          center: [0, 0],
          pitch: 0,
          bearing: 0,
          zoom: 1.5,
          duration: 2000,
        });
      }, 100);
    }
  }, [map, currentView]);

  useEffect(() => {
    if (!map || !selectedCountry) return;

    const countryData = getCountryData(selectedCountry);

    if (!countryData) return;

    const { area, latlng } = countryData;

    if (!latlng) return;

    const [lat, lng] = latlng;

    const zoom = countryData ? calculateZoom(area) : 3;

    map.flyTo({
      center: [lng, lat],
      essential: true,
      zoom,
    });
  }, [map, selectedCountry]);

  const { countries } = useChinguStats();
  const showMarkers = currentView !== 'home';

  return (
    <div className="relative h-full w-full">
      <div id="map-container" className="h-full w-full" ref={mapContainerRef} />
      {showMarkers &&
        Object.entries(countries).map(([country, count]) => (
          <Marker key={country} map={map} country={country} count={count} />
        ))}
    </div>
  );
};
