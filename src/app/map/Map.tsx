'use client';

import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCountryStats } from '@/hooks/useCountryStats';
import { countries } from 'country-data';

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
      zoom: 9,
    });

    const marker1 = new mapboxgl.Marker()
      .setLngLat([-71.1252, 42.4756])
      .addTo(mapRef.current);

    // countryStats.forEach((stat) => {
    //   const country = countries[stat.countryCode];
    //   console.log(country);
    //   if (country?.geo) {
    //     new mapboxgl.Marker()
    //       .setLngLat([country.geo.longitude, country.geo.latitude])
    //       .addTo(mapRef.current!);
    //   }
    // });

    return () => {
      mapRef.current?.remove();
    };
  }, [countryStats]);

  // if (areCountryStatsLoading) return <div>Country Stats Loading...</div>;
  // if (countryStatsError) return <div>Error Loading Country Stats</div>;

  console.table(countryStats);

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

  // return (
  //   <>
  //     <div
  //       id="map-container"
  //       className="h-full w-full bg-gray-100"
  //       ref={mapContainerRef}
  //     />
  //   </>
  // );
}
