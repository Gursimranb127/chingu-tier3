'use client';
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Marker } from './Marker';
import { useSelectedCountry } from '@/stores/useSelectedCountry';
import { getCountryData } from '@/lib/geo';
import { useChinguStats } from '@/hooks/useChinguStats';
import { useFilterStore } from '@/stores/useFilterStore';

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
  const { setFilter } = useFilterStore();

  useEffect(() => {
    setFilter('gender', 'female');
    setFilter('voyageRole', 'developer');
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
    const m = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      center: [-71.1252, 42.4756],
      zoom: 1,
    });
    setMap(m);

    return () => {
      m.remove();
    };
  }, []);

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
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      zoom,
    });
  }, [map, selectedCountry]);

  const { countries } = useChinguStats();

  return (
    <div className="relative h-full w-full">
      <div id="map-container" className="h-full w-full" ref={mapContainerRef} />
      {Object.entries(countries).map(([country, count]) => (
        <Marker key={country} map={map} country={country} count={count} />
      ))}
    </div>
  );
};
