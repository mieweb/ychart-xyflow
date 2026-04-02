import { useCallback } from 'react';
import { searchNodes } from '@mieweb/ychart-core';
import { useYChartStore } from '../store';

export function useSearch() {
  const store = useYChartStore();

  const search = useCallback(
    (query: string) => {
      store.setSearchQuery(query);
      if (!query.trim()) {
        store.setSearchResults([]);
        store.setSearchIndex(0);
        return;
      }
      const results = searchNodes(store.nodes, query);
      store.setSearchResults(results);
      store.setSearchIndex(0);
    },
    [store.nodes]
  );

  const clearSearch = useCallback(() => {
    store.setSearchQuery('');
    store.setSearchResults([]);
    store.setSearchIndex(0);
  }, []);

  const nextResult = useCallback(() => {
    if (store.searchResults.length === 0) return;
    const next = (store.searchIndex + 1) % store.searchResults.length;
    store.setSearchIndex(next);
    store.setSelectedNodeId(store.searchResults[next].nodeId);
  }, [store.searchResults, store.searchIndex]);

  const prevResult = useCallback(() => {
    if (store.searchResults.length === 0) return;
    const prev = (store.searchIndex - 1 + store.searchResults.length) % store.searchResults.length;
    store.setSearchIndex(prev);
    store.setSelectedNodeId(store.searchResults[prev].nodeId);
  }, [store.searchResults, store.searchIndex]);

  return {
    searchQuery: store.searchQuery,
    searchResults: store.searchResults,
    searchIndex: store.searchIndex,
    searchActive: store.searchQuery.length > 0,
    search,
    clearSearch,
    nextResult,
    prevResult,
  };
}
