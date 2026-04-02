import dagre from 'dagre';
import type { NodePosition, LayoutResult } from '../types';

export interface TreeLayoutOptions {
  nodeWidth: number;
  nodeHeight: number;
  direction: 'TB' | 'LR';
  childrenMargin: number;
  siblingMargin: number;
}

const DEFAULT_LAYOUT: TreeLayoutOptions = {
  nodeWidth: 220,
  nodeHeight: 120,
  direction: 'TB',
  childrenMargin: 40,
  siblingMargin: 20,
};

/**
 * Compute hierarchical tree layout using dagre.
 * Returns positioned nodes compatible with xyflow.
 */
export function computeTreeLayout(
  nodes: { id: string; [k: string]: unknown }[],
  edges: { source: string; target: string }[],
  options?: Partial<TreeLayoutOptions>
): LayoutResult {
  const opts = { ...DEFAULT_LAYOUT, ...options };

  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: opts.direction,
    nodesep: opts.siblingMargin,
    ranksep: opts.childrenMargin,
    marginx: 20,
    marginy: 20,
  });
  g.setDefaultEdgeLabel(() => ({}));

  for (const node of nodes) {
    g.setNode(node.id as string, { width: opts.nodeWidth, height: opts.nodeHeight });
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const positions: NodePosition[] = nodes.map((node) => {
    const pos = g.node(node.id as string);
    return {
      id: node.id as string,
      x: pos.x - opts.nodeWidth / 2,
      y: pos.y - opts.nodeHeight / 2,
      width: opts.nodeWidth,
      height: opts.nodeHeight,
    };
  });

  const graphInfo = g.graph();
  return {
    positions,
    width: graphInfo.width ?? 0,
    height: graphInfo.height ?? 0,
  };
}
