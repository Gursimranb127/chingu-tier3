/* eslint-disable prettier/prettier */
'use client';
import { Menu } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { useUIView } from '@/stores/useUIViewStore';
import { Button } from './ui/button';

function MobileNav() {
  const { showHomeView, showMapView, showListView } = useUIView();

  return (
    <Sheet>
      <SheetTrigger className="block md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="right" className="w-auto h-fit pt-6 pb-4 px-6">
        <SheetHeader className="p-0 m-0">
          <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
        </SheetHeader>
        <NavigationMenu>
          <NavigationMenuList className="flex flex-col gap-3">
            <NavigationMenuItem>
              <SheetClose asChild>
                <Button
                  variant="link"
                  onClick={showHomeView}
                  className="px-4 text-xl"
                >
                  Home
                </Button>
              </SheetClose>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <SheetClose asChild>
                <Button
                  variant="link"
                  onClick={showMapView}
                  className="px-4 text-xl"
                >
                  Map
                </Button>
              </SheetClose>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <SheetClose asChild>
                <Button
                  variant="link"
                  onClick={showListView}
                  className="px-4 text-xl"
                >
                  List
                </Button>
              </SheetClose>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
