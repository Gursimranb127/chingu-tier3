'use client';

import MapView from './MapView';
import { useCountryStats } from '@/hooks/useCountryStats';

function Map() {
  const {
    isLoading: areCountryStatsLoading,
    error: countryStatsError,
    data: countryStats,
  } = useCountryStats();

  return (
    <>
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
      <MapView countryStats={countryStats} />
    </>
  );
}

export default Map;
