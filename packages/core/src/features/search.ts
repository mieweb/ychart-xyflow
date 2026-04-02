import type { OrgNode, SearchResult } from '../types';

export interface SearchOptions {
  /** Fields to search in. If empty, searches all string fields. */
  fields?: string[];
  caseSensitive?: boolean;
}

/** Search nodes for a query string. Returns matching node IDs with field matches. */
export function searchNodes(
  nodes: OrgNode[],
  query: string,
  options?: SearchOptions
): SearchResult[] {
  if (!query.trim()) return [];

  const normalizedQuery = options?.caseSensitive ? query : query.toLowerCase();
  const results: SearchResult[] = [];

  for (const node of nodes) {
    const matches: SearchResult['matches'] = [];
    const fieldsToSearch = options?.fields ?? Object.keys(node);

    for (const field of fieldsToSearch) {
      const value = node[field];
      if (typeof value !== 'string' && typeof value !== 'number') continue;

      const strVal = String(value);
      const normalizedVal = options?.caseSensitive ? strVal : strVal.toLowerCase();

      if (normalizedVal.includes(normalizedQuery)) {
        matches.push({ field, value: strVal });
      }
    }

    if (matches.length > 0) {
      results.push({ nodeId: node.id, matches });
    }
  }

  return results;
}
