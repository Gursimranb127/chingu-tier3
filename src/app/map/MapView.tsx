'use client';

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ChinguCountryStats } from '@/features/chingu/chingu.type';
import Marker from './Marker';
import { useSelectedCountry } from '@/stores/useSelectedCountry';
import { getCountryCoords } from '@/lib/geo';
import countries from 'world-countries';

interface MapViewType {
  countryStats?: ChinguCountryStats[];
}

const calculateZoom = (area: number): number => {
  if (area > 5000000) return 2.5;
  if (area > 1000000) return 3.5;
  if (area > 500000) return 4;
  if (area > 100000) return 5;
  if (area > 50000) return 6;
  return 7;
};

export default function MapView({ countryStats }: MapViewType) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const { selectedCountry } = useSelectedCountry();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
    const m = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      center: [-71.1252, 42.4756],
      zoom: 5,
    });
    setMap(m);

    return () => {
      m.remove();
    };
  }, []);

  useEffect(() => {
    if (!map || !selectedCountry) return;

    const coords = getCountryCoords(selectedCountry.countryCode);

    if (!coords) return;

    const countryData = countries.find(
      (c) =>
        c.cca2 === selectedCountry.countryCode ||
        c.cca3 === selectedCountry.countryCode
    );

    const zoom = countryData ? calculateZoom(countryData.area) : 3;

    map.flyTo({
      center: [coords.lng, coords.lat],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      zoom,
    });
  }, [map, selectedCountry]);

  return (
    <div className="relative h-full w-full">
      <div id="map-container" className="h-full w-full" ref={mapContainerRef} />
      {countryStats?.map((country) => (
        <Marker key={country.countryCode} map={map} country={country} />
      ))}
    </div>
  );
}
