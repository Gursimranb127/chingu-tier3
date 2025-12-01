'use client';

import { CountryRoles } from './CountryRoles';
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
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <span className="rounded bg-gray-100/80 px-3 py-1 text-sm text-gray-800">
            Country Stats Loading...
          </span>
        </div>
      )}
      {countryStatsError && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <span className="rounded bg-red-100/80 px-3 py-1 text-sm text-red-800">
            Error Loading Country Stats
          </span>
        </div>
      )}
      <MapView countryStats={countryStats} />
      <CountryRoles />
    </>
  );
}

export default Map;
