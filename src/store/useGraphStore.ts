import { create } from 'zustand';
import { GraphNode } from '@/types';

interface GraphStore {
  selectedNode: GraphNode | null;
  setSelectedNode: (node: GraphNode | null) => void;

  selectedTypeFilter: string;
  setSelectedTypeFilter: (type: string) => void;

  zoomLevel: number;
  setZoomLevel: (zoom: number | ((prev: number) => number)) => void;
  resetZoom: () => void;

  panOffset: { x: number; y: number };
  setPanOffset: (offset: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  resetPan: () => void;
}

export const useGraphStore = create<GraphStore>((set) => ({
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),

  selectedTypeFilter: 'All',
  setSelectedTypeFilter: (type) => set({ selectedTypeFilter: type }),

  zoomLevel: 1,
  setZoomLevel: (zoom) =>
    set((state) => ({
      zoomLevel: typeof zoom === 'function' ? zoom(state.zoomLevel) : zoom,
    })),
  resetZoom: () => set({ zoomLevel: 1 }),

  panOffset: { x: 0, y: 0 },
  setPanOffset: (offset) =>
    set((state) => ({
      panOffset: typeof offset === 'function' ? offset(state.panOffset) : offset,
    })),
  resetPan: () => set({ panOffset: { x: 0, y: 0 } }),
}));
