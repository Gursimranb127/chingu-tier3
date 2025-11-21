'use client';

import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCountryStats } from '@/hooks/useCountryStats';
// @ts-ignore
import geo from 'countries-cities-geo';
import { ChinguCountryStats } from '@/features/chingu/chingu.type';

export function getCountryCoords(countryCode: string | null) {
  const countries = geo.getCountries();

  const country = countries.find(
    (c: any) => c.cca2.toUpperCase() === countryCode?.toUpperCase()
  );

  if (!country || !country.latlng) {
    return null;
  }

  const [lat, lng] = country.latlng;

  return { lat, lng };
}

export default function Map() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const {
    isLoading: areCountryStatsLoading,
    error: countryStatsError,
    data: countryStats,
  } = useCountryStats();

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!countryStats) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      center: [-71.1252, 42.4756],
      zoom: 1,
    });

    countryStats.forEach((stat: ChinguCountryStats) => {
      const el = document.createElement('div');

      // --- 1. Logarithmic size scaling ---
      const baseSize = 20; // minimum size
      const scale = Math.log(stat.count + 1); // log scale
      const size = baseSize + scale * 10; // adjust multiplier to taste

      // --- 2. Dynamic sizing based on size ---
      el.style.minWidth = `${size}px`;
      el.style.minHeight = `${size}px`;
      el.style.padding = '4px'; // let text push outward if needed

      // --- 3. Random background color ---
      el.style.backgroundColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;

      // --- 4. Visual styling ---
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.borderRadius = '50%';
      el.style.color = '#fff';
      el.style.fontSize = '12px';
      el.style.fontWeight = 'bold';

      el.textContent = String(stat.count);

      // @ts-ignore
      const { lat, lng } = getCountryCoords(stat.countryCode);
      if (lat && lng) {
        new mapboxgl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(mapRef.current!);
      }
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [countryStats]);

  return (
    <div className="relative h-full w-full">
      {areCountryStatsLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          Country Stats Loading...
        </div>
      )}
      {countryStatsError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 z-10">
          Error Loading Country Stats
        </div>
      )}
      <div id="map-container" className="h-full w-full" ref={mapContainerRef} />
    </div>
  );
}
