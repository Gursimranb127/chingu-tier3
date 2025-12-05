import { useState, useEffect, useMemo, useRef } from 'react';
import { useCountryStats } from '@/hooks/useCountryStats';
import { ChinguCountryStats } from '@/features/chingu/chingu.type';
import { useSelectedCountry } from '@/stores/useSelectedCountry';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const { data: countryStats } = useCountryStats();
  const [searchValue, setSearchValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const resultRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { setSelectedCountry } = useSelectedCountry();

  const filteredResults = useMemo(() => {
    if (!searchValue || !countryStats) return [];

    const searchLower = searchValue.toLowerCase();
    return countryStats.filter((country: ChinguCountryStats) =>
      country.countryName?.toLowerCase().includes(searchLower)
    );
  }, [searchValue, countryStats]);

  const areResultsOpen = searchValue.length > 0 && filteredResults.length > 0;

  const selectCountry = (country: ChinguCountryStats) => {
    setSelectedCountry(country);
    setSearchValue('');
    setSelectedIndex(-1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!areResultsOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectCountry(filteredResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setSearchValue('');
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && resultRefs.current[selectedIndex]) {
      resultRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  return (
    <div className="absolute top-16 z-[1000] flex w-full items-center justify-center px-4">
      <div className="relative w-full md:w-auto">
        <input
          id="country-search"
          name="country-search"
          type="search"
          placeholder="Search Country"
          className="w-full rounded-full bg-white px-4 py-1 pr-10 text-black md:w-96"
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
        <Search className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

        {areResultsOpen && (
          <div className="absolute mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white p-1 shadow-md">
            {filteredResults.map(
              (country: ChinguCountryStats, index: number) => (
                <div
                  key={country.countryCode}
                  ref={(el) => {
                    resultRefs.current[index] = el;
                  }}
                  className={`cursor-pointer rounded px-2 py-1 ${
                    selectedIndex === index
                      ? 'bg-blue-100'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => selectCountry(country)}
                >
                  {country.countryName}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
