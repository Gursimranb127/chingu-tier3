/* eslint-disable prettier/prettier */
'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useFilteredChingus } from '@/hooks/useFilteredChingus';
import { useSelectedCountry } from '@/stores/useSelectedCountry';
import { Search } from 'lucide-react';
import { useUIView } from '@/stores/useUIViewStore';

export const SearchBar = () => {
  const { filteredChingus } = useFilteredChingus();
  const { setSelectedCountry } = useSelectedCountry();

  const [searchValue, setSearchValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const resultRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { currentView } = useUIView();

  const countries = useMemo(() => {
    const set = new Set<string>();
    filteredChingus.forEach((c) => {
      if (c.countryName) set.add(c.countryName);
    });
    return Array.from(set).sort();
  }, [filteredChingus]);

  const filteredResults = useMemo(() => {
    if (!searchValue) return [];

    const searchLower = searchValue.toLowerCase();
    return countries.filter((name) => name.toLowerCase().includes(searchLower));
  }, [searchValue, countries]);

  const areResultsOpen = searchValue.length > 0 && filteredResults.length > 0;

  const selectCountry = (countryName: string) => {
    setSelectedCountry(countryName);
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
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectCountry(filteredResults[selectedIndex]);
        }
        break;
      case "Escape":
        setSearchValue("");
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && resultRefs.current[selectedIndex]) {
      resultRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  if (currentView === 'home') return;

  return (
    <div className="flex-1">
      <div className="relative w-full md:w-auto">
        <input
          type="search"
          placeholder="Search Country"
          className="
            w-full
            rounded-full
            bg-background
            text-foreground
            border
            border-ring
            placeholder:text-muted-foreground
            px-4 py-2 pr-10
            shadow-sm
            md:w-96
            focus:border-ring
            focus:ring-2
            focus:ring-ring
            focus:outline-none
          "
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />

        <Search
          className="
            pointer-events-none absolute right-3 top-1/2 
            h-5 w-5 -translate-y-1/2 text-muted-foreground
          "
        />
        {areResultsOpen && (
          <div className="
              absolute mt-1 max-h-60 w-full overflow-y-auto 
              rounded-md border-2 border-ring bg-background 
              text-popover-foreground shadow-md "
          >
            {filteredResults.map((countryName, index) => (
              <div
                key={countryName}
                ref={(el) => {
                  resultRefs.current[index] = el;
                }}
                className={`cursor-pointer rounded px-2 py-1 ${
                  selectedIndex === index 
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted hover:text-muted-foreground'
                }`}
                onClick={() => selectCountry(countryName)}
              >
                {countryName}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
