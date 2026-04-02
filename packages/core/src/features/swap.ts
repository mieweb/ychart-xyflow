import type { OrgNode } from '../types';

/**
 * Swap two nodes' positions in the hierarchy.
 * Swaps their parentId values (and thus their position in the tree).
 * Returns a new array with the swapped nodes.
 */
export function swapNodes(nodes: OrgNode[], nodeIdA: string, nodeIdB: string): OrgNode[] {
  const nodeA = nodes.find((n) => n.id === nodeIdA);
  const nodeB = nodes.find((n) => n.id === nodeIdB);

  if (!nodeA || !nodeB) return nodes;

  // Don't swap if one is ancestor of the other
  if (isAncestor(nodes, nodeIdA, nodeIdB) || isAncestor(nodes, nodeIdB, nodeIdA)) {
    return nodes;
  }

  return nodes.map((node) => {
    if (node.id === nodeIdA) {
      return { ...node, parentId: nodeB.parentId };
    }
    if (node.id === nodeIdB) {
      return { ...node, parentId: nodeA.parentId };
    }
    return node;
  });
}

function isAncestor(nodes: OrgNode[], ancestorId: string, descendantId: string): boolean {
  const parentMap = new Map<string, string | null>();
  for (const node of nodes) {
    parentMap.set(node.id, node.parentId);
  }

  let current = parentMap.get(descendantId) ?? null;
  while (current) {
    if (current === ancestorId) return true;
    current = parentMap.get(current) ?? null;
  }
  return false;
}
