'use client';

import CountryList from './CountryList';
import { CountryRoles } from './CountryRoles';
import MapView from './MapView';
import { useCountryStats } from '@/hooks/useCountryStats';
import { ViewToggle } from './ViewToggle';
import SearchBar from './SearchBar';

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
      <SearchBar />
      <ViewToggle />
      <MapView countryStats={countryStats} />
      <CountryRoles />
      <CountryList countryStats={countryStats} />
    </>
  );
}

export default Map;
