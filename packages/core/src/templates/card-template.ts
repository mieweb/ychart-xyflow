import type { OrgNode, CardTemplate, CardTemplateElement } from '../types';

/**
 * Interpolate `$field$` placeholders in a string with node data.
 */
export function interpolateTemplate(template: string, node: OrgNode): string {
  return template.replace(/\$(\w+)\$/g, (_match, field: string) => {
    const value = node[field];
    return value != null ? String(value) : '';
  });
}

/**
 * Build HTML string from a CardTemplate definition and node data.
 *
 * Card template format (from YAML front matter):
 * ```yaml
 * card:
 *   - div:
 *       class: card-wrapper
 *       children:
 *         - h1: $name$
 *         - p: $title$
 * ```
 */
export function buildCardHtml(template: CardTemplate, node: OrgNode): string {
  return template.map((el) => renderElement(el, node)).join('');
}

function renderElement(element: CardTemplateElement | Record<string, unknown>, node: OrgNode): string {
  // Simple form: { h1: "$name$" }
  const entries = Object.entries(element);
  if (entries.length === 0) return '';

  const [tag, value] = entries[0];

  // Simple text element
  if (typeof value === 'string') {
    return `<${tag}>${interpolateTemplate(value, node)}</${tag}>`;
  }

  // Complex element with attributes
  if (typeof value === 'object' && value !== null) {
    const attrs = value as Record<string, unknown>;
    const classAttr = attrs['class'] ? ` class="${attrs['class']}"` : '';
    const styleAttr = attrs['style'] ? ` style="${attrs['style']}"` : '';
    const text = typeof attrs['text'] === 'string' ? interpolateTemplate(attrs['text'], node) : '';
    const children = Array.isArray(attrs['children'])
      ? (attrs['children'] as CardTemplateElement[]).map((child) => renderElement(child, node)).join('')
      : '';

    return `<${tag}${classAttr}${styleAttr}>${text}${children}</${tag}>`;
  }

  return '';
}
