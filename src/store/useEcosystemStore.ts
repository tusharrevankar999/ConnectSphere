import { create } from 'zustand';

interface DrawerState {
  isOpen: boolean;
  type: 'Founder' | 'Startup' | 'Investor' | 'Mentor' | 'Technology' | 'Industry' | null;
  id: string | null;
  name: string | null;
}

interface EcosystemStore {
  // Filter & Search State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;

  // Active Drawer State
  drawer: DrawerState;
  openDrawer: (type: DrawerState['type'], id: string, name: string) => void;
  closeDrawer: () => void;

  // Notification / Toast state helpers
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useEcosystemStore = create<EcosystemStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectedIndustry: 'All',
  setSelectedIndustry: (industry) => set({ selectedIndustry: industry }),

  drawer: {
    isOpen: false,
    type: null,
    id: null,
    name: null,
  },

  openDrawer: (type, id, name) =>
    set({
      drawer: {
        isOpen: true,
        type,
        id,
        name,
      },
    }),

  closeDrawer: () =>
    set({
      drawer: {
        isOpen: false,
        type: null,
        id: null,
        name: null,
      },
    }),

  activeTab: 'All',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
