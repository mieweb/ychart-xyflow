import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { exportSvg, exportPng, type ExportOptions } from '@mieweb/ychart-core';

export function useExport() {
  useReactFlow();

  const getSvgElement = useCallback((): SVGElement | null => {
    const el = document.querySelector('.react-flow__viewport')?.closest('svg');
    return el as SVGElement | null;
  }, []);

  const toSvg = useCallback(
    (options?: ExportOptions): string | null => {
      const svg = getSvgElement();
      if (!svg) return null;
      return exportSvg(svg, options);
    },
    [getSvgElement]
  );

  const toPng = useCallback(
    async (options?: ExportOptions): Promise<string | null> => {
      const svg = getSvgElement();
      if (!svg) return null;
      return exportPng(svg, options);
    },
    [getSvgElement]
  );

  const downloadSvg = useCallback(
    (options?: ExportOptions) => {
      const svgStr = toSvg(options);
      if (!svgStr) return;
      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      downloadBlob(blob, options?.filename ?? 'ychart.svg');
    },
    [toSvg]
  );

  const downloadPng = useCallback(
    async (options?: ExportOptions) => {
      const dataUrl = await toPng(options);
      if (!dataUrl) return;
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = options?.filename ?? 'ychart.png';
      link.click();
    },
    [toPng]
  );

  return { toSvg, toPng, downloadSvg, downloadPng };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
