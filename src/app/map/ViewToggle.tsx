import { Map, List } from 'lucide-react';
import { useShowCountryList } from '@/stores/useShowCountryList';

export function ViewToggle() {
  const { isCountryListDisplayed, showCountryList, hideCountryList } =
    useShowCountryList();

  const handleChange = () => {
    if (isCountryListDisplayed) hideCountryList();
    else showCountryList();
  };

  return (
    <label className="flex items-center w-16 h-8 cursor-pointer select-none bg-background rounded-full p-0.5 absolute top-26 z-100 left-1/2 -translate-x-1/2">
      {/* The checkbox */}
      <input
        type="checkbox"
        checked={isCountryListDisplayed}
        onChange={handleChange}
        className="peer appearance-none w-full h-full rounded-full"
      />

      {/* Sliding knob */}
      <span className="absolute top-0 left-0 h-8 w-8 rounded-full bg-primary shadow transition-transform duration-300 peer-checked:translate-x-8 z-0" />

      {/* Left icon (Map) */}
      <Map className="absolute left-2 h-4 w-4 text-black z-10 transition-opacity peer-checked:opacity-50 peer-checked:text-primary" />

      {/* Right icon (List) */}
      <List className="absolute right-2 h-4 w-4 text-primary z-10 transition-opacity peer-checked:opacity-100 peer-checked:text-black " />
    </label>
  );
}
