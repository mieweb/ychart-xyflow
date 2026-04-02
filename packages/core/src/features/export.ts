import type { ExportOptions } from '../types';

/**
 * Export an SVG element as an SVG string.
 */
export function exportSvg(svgElement: SVGElement, options?: ExportOptions): string {
  const clone = svgElement.cloneNode(true) as SVGElement;
  const padding = options?.padding ?? 20;

  // Add background if specified
  if (options?.backgroundColor) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', options.backgroundColor);
    clone.insertBefore(rect, clone.firstChild);
  }

  // Add padding via viewBox adjustment
  const viewBox = clone.getAttribute('viewBox');
  if (viewBox) {
    const [x, y, w, h] = viewBox.split(' ').map(Number);
    clone.setAttribute(
      'viewBox',
      `${x - padding} ${y - padding} ${w + padding * 2} ${h + padding * 2}`
    );
  }

  const serializer = new XMLSerializer();
  return serializer.serializeToString(clone);
}

/**
 * Export an SVG element as a PNG data URL.
 */
export async function exportPng(
  svgElement: SVGElement,
  options?: ExportOptions
): Promise<string> {
  const scale = options?.scale ?? 2;
  const svgString = exportSvg(svgElement, options);

  const img = new Image();
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.scale(scale, scale);

      if (options?.backgroundColor) {
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG for PNG export'));
    };

    img.src = url;
  });
}
