import yaml from 'js-yaml';
import type { FrontMatter, OrgNode, ParsedYaml } from '../types';

const FRONT_MATTER_RE = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;

/** Parse YAML front matter into options/schema/card + body data. */
export function parseFrontMatter(raw: string): { frontMatter: FrontMatter; body: string } {
  const match = raw.match(FRONT_MATTER_RE);
  if (!match) {
    return { frontMatter: {}, body: raw };
  }
  const fm = yaml.load(match[1]) as FrontMatter | null;
  return { frontMatter: fm ?? {}, body: match[2] };
}

/** Parse a YAML body string into OrgNode[]. */
export function parseYaml(yamlBody: string): OrgNode[] {
  const parsed = yaml.load(yamlBody);
  if (!Array.isArray(parsed)) {
    return [];
  }
  return normalizeNodes(parsed);
}

/** Parse a JSON string into OrgNode[]. */
export function parseJson(jsonStr: string): OrgNode[] {
  const parsed = JSON.parse(jsonStr) as unknown;
  if (!Array.isArray(parsed)) {
    return [];
  }
  return normalizeNodes(parsed);
}

/**
 * Parse input (YAML with front matter, plain YAML, or JSON) into OrgData.
 * Flexible entry point — auto-detects format.
 */
export function parseInput(input: string | OrgNode[]): ParsedYaml {
  // Already an array of nodes
  if (Array.isArray(input)) {
    return { frontMatter: {}, data: normalizeNodes(input) };
  }

  const trimmed = input.trim();

  // Try YAML with front matter
  if (trimmed.startsWith('---')) {
    const { frontMatter, body } = parseFrontMatter(trimmed);
    const data = parseYaml(body);
    return { frontMatter, data };
  }

  // Try JSON
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const data = parseJson(trimmed);
      return { frontMatter: {}, data };
    } catch {
      // Fall through to YAML
    }
  }

  // Plain YAML (no front matter)
  const data = parseYaml(trimmed);
  return { frontMatter: {}, data };
}

/** Ensure every node has string `id` and `parentId`. */
function normalizeNodes(raw: Record<string, unknown>[]): OrgNode[] {
  return raw.map((item) => ({
    ...item,
    id: String(item['id'] ?? ''),
    parentId: item['parentId'] != null ? String(item['parentId']) : null,
  }));
}
