import { create } from 'zustand';
import type { OrgNode, YChartConfig, SearchResult } from '@mieweb/ychart-core';
import { DEFAULT_CONFIG } from '@mieweb/ychart-core';

export interface YChartState {
  // Data
  nodes: OrgNode[];
  config: YChartConfig;
  rawInput: string;

  // UI state
  collapsed: Set<string>;
  selectedNodeId: string | null;
  searchQuery: string;
  searchResults: SearchResult[];
  searchIndex: number;
  sidebarOpen: boolean;

  // Actions
  setNodes: (nodes: OrgNode[]) => void;
  setConfig: (config: Partial<YChartConfig>) => void;
  setRawInput: (input: string) => void;
  setCollapsed: (collapsed: Set<string>) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: SearchResult[]) => void;
  setSearchIndex: (index: number) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useYChartStore = create<YChartState>((set) => ({
  nodes: [],
  config: { ...DEFAULT_CONFIG },
  rawInput: '',

  collapsed: new Set(),
  selectedNodeId: null,
  searchQuery: '',
  searchResults: [],
  searchIndex: 0,
  sidebarOpen: false,

  setNodes: (nodes) => set({ nodes }),
  setConfig: (config) => set((state) => ({ config: { ...state.config, ...config } })),
  setRawInput: (rawInput) => set({ rawInput }),
  setCollapsed: (collapsed) => set({ collapsed }),
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSearchResults: (searchResults) => set({ searchResults }),
  setSearchIndex: (searchIndex) => set({ searchIndex }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));
