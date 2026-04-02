/**
 * Expand/collapse state management for org chart nodes.
 * Works as pure functions over a Set<string> of collapsed node IDs.
 */

import type { OrgNode } from '../types';

/** Toggle expand/collapse for a single node. Returns new collapsed set. */
export function toggleExpand(collapsed: Set<string>, nodeId: string): Set<string> {
  const next = new Set(collapsed);
  if (next.has(nodeId)) {
    next.delete(nodeId);
  } else {
    next.add(nodeId);
  }
  return next;
}

/** Expand all nodes (clear collapsed set). */
export function expandAll(): Set<string> {
  return new Set();
}

/** Collapse all nodes that have children. */
export function collapseAll(nodes: OrgNode[]): Set<string> {
  const childParentIds = new Set<string>();
  for (const node of nodes) {
    if (node.parentId) {
      childParentIds.add(node.parentId);
    }
  }
  return childParentIds;
}

/**
 * Filter visible nodes given a collapsed set.
 * A node is hidden if any of its ancestors are collapsed.
 */
export function getVisibleNodes(nodes: OrgNode[], collapsed: Set<string>): OrgNode[] {
  if (collapsed.size === 0) return nodes;

  // Build parent lookup
  const parentMap = new Map<string, string | null>();
  for (const node of nodes) {
    parentMap.set(node.id, node.parentId);
  }

  // Check if any ancestor is collapsed
  const isHidden = (nodeId: string): boolean => {
    let current = parentMap.get(nodeId) ?? null;
    while (current) {
      if (collapsed.has(current)) return true;
      current = parentMap.get(current) ?? null;
    }
    return false;
  };

  return nodes.filter((node) => !isHidden(node.id));
}
