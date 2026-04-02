import { useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { OrgNode, YChartConfig, TemplateFunction } from '@mieweb/ychart-core';
import {
  toFlowEdges,
  getVisibleNodes,
  computeTreeLayout,
} from '@mieweb/ychart-core';

/**
 * Computes xyflow-ready nodes and edges from org data,
 * applying layout and expand/collapse filtering.
 */
export function useOrgLayout(
  nodes: OrgNode[],
  config: YChartConfig,
  collapsed: Set<string>,
  template?: TemplateFunction
) {
  return useMemo(() => {
    if (nodes.length === 0) {
      return { flowNodes: [] as Node[], flowEdges: [] as Edge[] };
    }

    // Filter visible nodes
    const visible = getVisibleNodes(nodes, collapsed);
    // Create flow edges (only between visible nodes)
    const rawEdges = toFlowEdges(visible, config.supervisorFields);

    // Compute layout
    const layout = computeTreeLayout(visible, rawEdges, {
      nodeWidth: config.nodeWidth,
      nodeHeight: config.nodeHeight,
      direction: config.direction,
      childrenMargin: config.childrenMargin,
      siblingMargin: config.siblingMargin,
    });

    // Build positioned flow nodes
    const posMap = new Map(layout.positions.map((p) => [p.id, p]));

    const flowNodes: Node[] = visible.map((node) => {
      const pos = posMap.get(node.id);
      const hasChildren = nodes.some((n) => n.parentId === node.id);
      const isCollapsed = collapsed.has(node.id);

      return {
        id: node.id,
        type: 'orgChart',
        position: { x: pos?.x ?? 0, y: pos?.y ?? 0 },
        data: {
          ...node,
          _hasChildren: hasChildren,
          _isCollapsed: isCollapsed,
          _template: template,
          _config: config,
        },
      };
    });

    const flowEdges: Edge[] = rawEdges.map((e) => ({
      ...e,
      type: 'orgEdge',
    }));

    return { flowNodes, flowEdges };
  }, [nodes, config, collapsed, template]);
}
