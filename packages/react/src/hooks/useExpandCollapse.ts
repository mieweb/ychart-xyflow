import { useCallback } from 'react';
import {
  toggleExpand,
  expandAll,
  collapseAll,
  expandToPoi,
} from '@mieweb/ychart-core';
import { useYChartStore } from '../store';

export function useExpandCollapse() {
  const store = useYChartStore();

  const toggleNode = useCallback(
    (nodeId: string) => {
      store.setCollapsed(toggleExpand(store.collapsed, nodeId));
    },
    [store]
  );

  const expandAllNodes = useCallback(() => {
    store.setCollapsed(expandAll());
  }, [store]);

  const collapseAllNodes = useCallback(() => {
    store.setCollapsed(collapseAll(store.nodes));
  }, [store]);

  const expandToNode = useCallback(
    (nodeId: string) => {
      store.setCollapsed(expandToPoi(store.nodes, nodeId));
    },
    [store]
  );

  return { toggleNode, expandAllNodes, collapseAllNodes, expandToNode };
}
