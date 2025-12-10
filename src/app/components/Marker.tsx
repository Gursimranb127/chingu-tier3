'use client';
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { createMarkerElement } from './markerElement';
import { getCountryCoords } from '@/lib/geo';
import { useSelectedCountry } from '@/stores/useSelectedCountry';

interface MarkerProps {
  map: mapboxgl.Map | null;
  country: string;
  count: number;
}

export const Marker = ({ map, country, count }: MarkerProps) => {
  const { setSelectedCountry } = useSelectedCountry();

  useEffect(() => {
    if (!map || !country) return;

    const coords = getCountryCoords(country);

    if (!coords) return;

    const el = createMarkerElement(count);

    el.addEventListener('click', () => setSelectedCountry?.(country));

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([coords.lng, coords.lat])
      .addTo(map);

    return () => {
      marker?.remove();
    };
  }, [map, country, count, setSelectedCountry]);

  return null;
};
