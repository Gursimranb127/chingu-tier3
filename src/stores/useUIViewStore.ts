import { create } from 'zustand';

type UIView = 'home' | 'map' | 'list';

interface UIViewStore {
  view: UIView;
  setView: (view: UIView) => void;
}

const useUIViewStore = create<UIViewStore>((set) => ({
  view: 'home',
  setView: (view) => set({ view }),
}));

export function useUIView() {
  const currentView = useUIViewStore((state) => state.view);
  const showHomeView = useUIViewStore((state) => state.setView('home'));
  const showMapView = useUIViewStore((state) => state.setView('map'));
  const showListView = useUIViewStore((state) => state.setView('list'));

  return {
    currentView,
    showHomeView,
    showMapView,
    showListView,
  };
}
