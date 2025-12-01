'use client';

import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { ChinguCountryStats } from '@/features/chingu/chingu.type';
import { createMarkerElement } from './markerElement';
import { getCountryCoords } from '@/lib/geo';
import { useSelectedCountry } from '@/stores/useSelectedCountry';

interface MarkerType {
  map: mapboxgl.Map | null;
  country: ChinguCountryStats;
}

const Marker = ({ map, country }: MarkerType) => {
  const { setSelectedCountry } = useSelectedCountry();

  useEffect(() => {
    if (!map || !country) return;

    const coords = getCountryCoords(country.countryCode);

    if (!coords) return;

    const el = createMarkerElement(country);

    el.addEventListener('click', () => setSelectedCountry?.(country));

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([coords.lng, coords.lat])
      .addTo(map);

    return () => {
      marker?.remove();
    };
  }, [map, country, setSelectedCountry]);

  return null;
};

export default Marker;
