'use client';
import { Button } from '@/components/ui/button';
import { useUIView } from '@/stores/useUIViewStore';

export const Hero = () => {
  const { currentView, showMapView } = useUIView();

  if (currentView !== 'home') return;

  return (
    <div className="flex flex-col gap-10 justify-start items-center mb-10 pointer-events-auto">
      <h1 className="text-4xl text-center text-white md:mt-20 lg:mt-30">
        Find your fellow Chingus around the world
      </h1>
      <Button
        onClick={showMapView}
        className="rounded-full text-lg px-6 py-5 --color-primary --color-primary-foreground hover:text-[125%] hover:cursor-pointer""
      >
        Explore Now
      </Button>
    </div>
  );
};

