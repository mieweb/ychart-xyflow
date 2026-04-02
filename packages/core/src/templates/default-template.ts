import type { OrgNode } from '../types';

/** Default card template used when no custom template is provided. */
export function defaultTemplate(node: OrgNode): string {
  const name = String(node['name'] ?? node['label'] ?? node.id);
  const title = node['title'] ? `<div class="ychart-node-title">${String(node['title'])}</div>` : '';
  const department = node['department']
    ? `<div class="ychart-node-dept">${String(node['department'])}</div>`
    : '';
  const img = node['image']
    ? `<img class="ychart-node-avatar" src="${String(node['image'])}" alt="${name}" />`
    : `<div class="ychart-node-avatar-placeholder">${name.charAt(0).toUpperCase()}</div>`;

  return `
    <div class="ychart-node-card">
      <div class="ychart-node-header">
        ${img}
        <div class="ychart-node-info">
          <div class="ychart-node-name">${name}</div>
          ${title}
        </div>
      </div>
      ${department}
    </div>
  `.trim();
}
