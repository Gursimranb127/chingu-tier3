'use client';
import { useSelectedCountry } from '@/stores/useSelectedCountry';
import { useFilterStore } from '@/stores/useFilterStore';
import { useChinguStats } from '@/hooks/useChinguStats';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import ReactCountryFlag from 'react-country-flag';
import { getCountryData } from '@/lib/geo';
import { X } from 'lucide-react';

export const CountryOverview = () => {
  const { selectedCountry, setSelectedCountry } = useSelectedCountry();
  const { clearFilter, filters } = useFilterStore();

  const stats = useChinguStats();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      clearFilter('countryName');
      setSelectedCountry(null);
    }
  };

  if (!selectedCountry) return null;

  const countryData = getCountryData(selectedCountry);

  return (
    <Dialog open={!!selectedCountry} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] fixed bottom-12 top-auto translate-y-0 pt-4">
        <DialogHeader className="gap-4 flex flex-row items-center">
          <div className="border rounded-full p-2 bg-secondary">
            {countryData?.cca2 || countryData?.cca3 ? (
              <ReactCountryFlag
                countryCode={countryData.cca2 || countryData.cca3}
                svg
                style={{
                  fontSize: '1.8rem',
                  lineHeight: '1.8rem',
                }}
              />
            ) : null}
          </div>

          <DialogTitle className="text-left font-bold text-xl">
            {selectedCountry}
          </DialogTitle>
        </DialogHeader>

        <div>
          Number of Chingus:{' '}
          {Object.keys(filters).length > 0
            ? `${stats.summary.filtered} / ${stats.summary.total}`
            : stats.summary.total}
        </div>
        {Object.keys(filters).length > 0 ? (
          <div>
            <h5 className="font-semibold">Filters</h5>
            <div className="flex gap-2">
              {Object.keys(filters).map((filter) => (
                <div
                  key={filter}
                  className="flex items-center gap-0.5 border rounded-full px-2"
                  onClick={() => clearFilter(filter)}
                >
                  <p className="capitalize">
                    {filter.replace(/([a-z])([A-Z])/g, '$1 $2')}
                  </p>
                  <X size={16} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <div className="max-h-[270px] flex gap-4 flex-col overflow-auto scrollbar-hide">
          {Object.entries(stats.counts).map(([category, counts]) => {
            if (category in filters) return null;
            const hasAnyCounts = Object.values(counts).some((val) => val > 0);
            if (!hasAnyCounts) return null;

            return (
              <div key={category} className="flex flex-col">
                <h4 className="capitalize font-semibold mb-1">
                  {category.replace(/([a-z])([A-Z])/g, '$1 $2')}
                </h4>

                {Object.entries(counts).map(([key, val]) => {
                  const filteredTotal = stats.summary.filtered;
                  const fullTotal = stats.summary.total;

                  const percentOfFiltered =
                    filteredTotal > 0 ? (val / filteredTotal) * 100 : 0;

                  return (
                    <div key={key} className="flex flex-col gap-1 mb-2">
                      <div className="flex flex-row justify-between">
                        <p className="truncate">
                          {key} <span>({val})</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {percentOfFiltered.toFixed()}%
                        </p>
                      </div>
                      <Progress
                        value={percentOfFiltered}
                        className="progress-track bg-input"
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <DialogFooter className="pt-8">
          <Button className="flex grow bg-[#444]">View Chingus</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
