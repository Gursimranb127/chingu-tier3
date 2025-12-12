'use client';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Button } from './ui/button';
import { useUIView } from '@/stores/useUIViewStore';

export default function Navbar() {
  const { showHomeView, showListView, showMapView } = useUIView();

  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList className="gap-3">
        <NavigationMenuItem>
          <Button
            variant="link"
            onClick={showHomeView}
            className="px-4 text-xl"
          >
            Home
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button variant="link" onClick={showMapView} className="px-4 text-xl">
            Map
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button
            variant="link"
            onClick={showListView}
            className="px-4 text-xl"
          >
            List
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
