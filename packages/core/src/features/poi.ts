import type { OrgNode } from '../types';

/** Get the ancestor chain from a node up to the root. */
export function getAncestorChain(nodes: OrgNode[], nodeId: string): string[] {
  const parentMap = new Map<string, string | null>();
  for (const node of nodes) {
    parentMap.set(node.id, node.parentId);
  }

  const chain: string[] = [];
  let current: string | null = nodeId;

  while (current) {
    chain.push(current);
    current = parentMap.get(current) ?? null;
  }

  return chain;
}

/**
 * Expand to Person of Interest: returns a collapsed set that
 * shows the ancestor chain + direct children of the target node.
 * All other branches are collapsed.
 */
export function expandToPoi(nodes: OrgNode[], targetId: string): Set<string> {
  const ancestorChain = new Set(getAncestorChain(nodes, targetId));

  // Find all nodes that have children
  const nodesWithChildren = new Set<string>();
  for (const node of nodes) {
    if (node.parentId) {
      nodesWithChildren.add(node.parentId);
    }
  }

  // Collapse everything except the ancestor chain and the target itself
  const collapsed = new Set<string>();
  for (const id of nodesWithChildren) {
    if (!ancestorChain.has(id) && id !== targetId) {
      collapsed.add(id);
    }
  }

  return collapsed;
}
