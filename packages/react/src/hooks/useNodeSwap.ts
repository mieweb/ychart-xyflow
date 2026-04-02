import { useCallback } from 'react';
import { swapNodes } from '@mieweb/ychart-core';
import { useYChartStore } from '../store';

export function useNodeSwap() {
  const { nodes, setNodes } = useYChartStore();

  const swap = useCallback(
    (nodeIdA: string, nodeIdB: string) => {
      const newNodes = swapNodes(nodes, nodeIdA, nodeIdB);
      setNodes(newNodes);
      return newNodes;
    },
    [nodes, setNodes]
  );

  return { swap };
}
