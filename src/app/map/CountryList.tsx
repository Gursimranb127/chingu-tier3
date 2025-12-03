import { useShowCountryList } from '@/stores/useShowCountryList';
import { useSelectedCountry } from '@/stores/useSelectedCountry';
import { ChinguCountryStats } from '@/features/chingu/chingu.type';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ReactCountryFlag from 'react-country-flag';

interface CountryListType {
  countryStats?: ChinguCountryStats[];
}

const CountryList = ({ countryStats }: CountryListType) => {
  const { isCountryListDisplayed, hideCountryList } = useShowCountryList();
  const { setSelectedCountry } = useSelectedCountry();

  const handleCountryClick = (country: ChinguCountryStats) => {
    setSelectedCountry(country);
    hideCountryList();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      hideCountryList();
    }
  };

  return (
    <Dialog open={isCountryListDisplayed} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-transparent border-none p-0 fixed left-1/2 top-[35vh] -translate-x-1/2 translate-y-0 h-[90vh] overflow-visible flex flex-col gap-2 [&_button[data-slot='dialog-close']]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Countries</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 flex flex-col gap-2 scrollbar-hide rounded-2xl pb-48">
          {countryStats?.map((countryStat: ChinguCountryStats) => (
            <div
              key={countryStat.countryCode}
              className="bg-white rounded-2xl p-4"
              onClick={() => handleCountryClick(countryStat)}
            >
              <div className="flex flex-row gap-2 items-center">
                <div className="border rounded-full p-2 bg-secondary">
                  {countryStat.countryCode ? (
                    <ReactCountryFlag
                      countryCode={countryStat.countryCode}
                      style={{
                        fontSize: '1.6rem',
                        lineHeight: '1.6rem',
                      }}
                    />
                  ) : null}
                </div>
                <div>
                  <h3 className="text-xl">{countryStat.countryName}</h3>
                  <p>{countryStat.count} Chingus</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CountryList;
