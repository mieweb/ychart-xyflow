import type { OrgNode } from '../types';

type FlowNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: OrgNode;
};

type FlowEdge = {
  id: string;
  source: string;
  target: string;
  type: string;
};

/**
 * Resolve the parent field for a node.
 * Checks the supervisorFields list in order, returns the first truthy value.
 */
function resolveParentId(node: OrgNode, supervisorFields: string[]): string | null {
  for (const field of supervisorFields) {
    const val = node[field];
    if (val != null && val !== '') {
      return String(val);
    }
  }
  return null;
}

/**
 * Convert flat node list to a hierarchical tree (children attached).
 * Returns root nodes (nodes with no parent).
 */
export function flatToHierarchy(
  nodes: OrgNode[],
  config?: { supervisorFields?: string[] }
): OrgNode[] {
  const supervisorFields = config?.supervisorFields ?? ['parentId', 'supervisorId', 'managerId'];
  const idMap = new Map<string, OrgNode & { children?: OrgNode[] }>();

  // Index all nodes
  for (const node of nodes) {
    idMap.set(node.id, { ...node, children: [] });
  }

  const roots: OrgNode[] = [];

  for (const node of nodes) {
    const mapped = idMap.get(node.id)!;
    const parentId = resolveParentId(node, supervisorFields);

    if (parentId && idMap.has(parentId)) {
      const parent = idMap.get(parentId)!;
      parent.children = parent.children ?? [];
      parent.children.push(mapped);
    } else {
      roots.push(mapped);
    }
  }

  return roots;
}

/** Convert OrgNode[] into xyflow-compatible Node[]. Positions are (0,0) — use layout engine to position. */
export function toFlowNodes(nodes: OrgNode[]): FlowNode[] {
  return nodes.map((node) => ({
    id: node.id,
    type: 'orgChart',
    position: { x: 0, y: 0 },
    data: node,
  }));
}

/** Derive xyflow-compatible Edge[] from flat node list. */
export function toFlowEdges(nodes: OrgNode[], supervisorFields?: string[]): FlowEdge[] {
  const fields = supervisorFields ?? ['parentId', 'supervisorId', 'managerId'];
  const edges: FlowEdge[] = [];

  for (const node of nodes) {
    const parentId = resolveParentId(node, fields);
    if (parentId) {
      edges.push({
        id: `e-${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        type: 'smoothstep',
      });
    }
  }

  return edges;
}
