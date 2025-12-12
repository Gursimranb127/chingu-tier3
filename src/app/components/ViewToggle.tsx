'use client';
import { Map, List } from 'lucide-react';
import { useUIView } from '@/stores/useUIViewStore';

export const ViewToggle = () => {
  const { currentView, showListView, showMapView } = useUIView();

  const handleChange = () => {
    if (currentView === 'list') showMapView();
    else showListView();
  };

  if (currentView === 'home') return;

  return (
    <label className="flex items-center w-16 h-8 cursor-pointer select-none bg-gray-300 rounded-full p-0.5 absolute top-26 z-20 left-1/2 -translate-x-1/2">
      {/* The checkbox */}
      <input
        type="checkbox"
        checked={currentView === 'list'}
        onChange={handleChange}
        className="peer appearance-none w-full h-full rounded-full"
      />

      {/* Sliding knob */}
      <span className="absolute top-0 left-0 h-8 w-8 rounded-full bg-white shadow transition-transform duration-300 peer-checked:translate-x-8 z-0" />

      {/* Left icon (Map) */}
      <Map className="absolute left-2 h-4 w-4 text-black z-10 transition-opacity peer-checked:opacity-50" />

      {/* Right icon (List) */}
      <List className="absolute right-2 h-4 w-4 text-black z-10 transition-opacity opacity-50 peer-checked:opacity-100" />
    </label>
  );
};
