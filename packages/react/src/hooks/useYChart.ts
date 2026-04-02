import { useEffect } from 'react';
import type { OrgNode, YChartConfig, TemplateFunction } from '@mieweb/ychart-core';
import { parseInput } from '@mieweb/ychart-core';
import { useYChartStore } from '../store';
import { useOrgLayout } from './useOrgLayout';
import { useExpandCollapse } from './useExpandCollapse';
import { useSearch } from './useSearch';

export interface UseYChartOptions {
  data: string | OrgNode[];
  config?: Partial<YChartConfig>;
  template?: TemplateFunction;
}

/**
 * Main orchestration hook. Provides all state and actions for programmatic control.
 */
export function useYChart(options: UseYChartOptions) {
  const store = useYChartStore();
  const { toggleNode, expandAllNodes, collapseAllNodes, expandToNode } = useExpandCollapse();
  const { search, clearSearch, nextResult, prevResult } = useSearch();

  // Parse data
  useEffect(() => {
    const parsed = parseInput(options.data);
    store.setNodes(parsed.data);
    if (parsed.frontMatter.options) {
      store.setConfig(parsed.frontMatter.options);
    }
    if (options.config) {
      store.setConfig(options.config);
    }
    if (typeof options.data === 'string') {
      store.setRawInput(options.data);
    }
  }, [options.data, options.config]);

  // Layout
  const { flowNodes, flowEdges } = useOrgLayout(
    store.nodes,
    store.config,
    store.collapsed,
    options.template
  );

  return {
    // State
    nodes: store.nodes,
    flowNodes,
    flowEdges,
    config: store.config,
    collapsed: store.collapsed,
    selectedNodeId: store.selectedNodeId,
    searchResults: store.searchResults,

    // Actions
    toggleNode,
    expandAll: expandAllNodes,
    collapseAll: collapseAllNodes,
    expandToNode,
    selectNode: store.setSelectedNodeId,
    search,
    clearSearch,
    nextResult,
    prevResult,
    setConfig: store.setConfig,
  };
}
