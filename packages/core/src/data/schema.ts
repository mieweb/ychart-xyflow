import type { Schema, OrgNode } from '../types';

/**
 * Parse the `schema:` front matter section into structured SchemaField[].
 *
 * Input format:
 * ```yaml
 * schema:
 *   id: number | required
 *   name: string | required
 *   title: string
 * ```
 */
export function parseSchema(raw: Record<string, string>): Schema {
  return Object.entries(raw).map(([name, definition]) => {
    const parts = definition.split('|').map((s) => s.trim());
    const type = parts[0] ?? 'string';
    const required = parts.includes('required');
    return { name, type, required };
  });
}

/** Validate nodes against a schema. Returns array of error messages. */
export function validateSchema(nodes: OrgNode[], schema: Schema): string[] {
  const errors: string[] = [];

  for (const node of nodes) {
    for (const field of schema) {
      const value = node[field.name];

      if (field.required && (value == null || value === '')) {
        errors.push(`Node "${node.id}": missing required field "${field.name}"`);
        continue;
      }

      if (value == null) continue;

      if (field.type === 'number' && typeof value !== 'number') {
        errors.push(`Node "${node.id}": field "${field.name}" should be a number`);
      }
    }
  }

  return errors;
}
