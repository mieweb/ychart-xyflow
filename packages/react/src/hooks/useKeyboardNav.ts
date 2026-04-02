import { useEffect, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useYChartStore } from '../store';
import { useExpandCollapse } from './useExpandCollapse';

/**
 * Keyboard navigation for the org chart.
 * - Arrow keys: navigate between nodes
 * - Enter/Space: expand/collapse
 * - Ctrl+F: focus search
 * - Escape: deselect / close search
 */
export function useKeyboardNav() {
  const { nodes, selectedNodeId, setSelectedNodeId, collapsed } = useYChartStore();
  const { toggleNode } = useExpandCollapse();
  useReactFlow();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't interfere with input elements
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (!selectedNodeId) return;

      const currentNode = nodes.find((n) => n.id === selectedNodeId);
      if (!currentNode) return;

      switch (event.key) {
        case 'ArrowDown': {
          // Move to first child
          event.preventDefault();
          const child = nodes.find((n) => n.parentId === selectedNodeId);
          if (child && !collapsed.has(selectedNodeId)) {
            setSelectedNodeId(child.id);
          }
          break;
        }
        case 'ArrowUp': {
          // Move to parent
          event.preventDefault();
          if (currentNode.parentId) {
            setSelectedNodeId(currentNode.parentId);
          }
          break;
        }
        case 'ArrowRight': {
          // Move to next sibling
          event.preventDefault();
          const siblings = nodes.filter((n) => n.parentId === currentNode.parentId);
          const idx = siblings.findIndex((n) => n.id === selectedNodeId);
          if (idx < siblings.length - 1) {
            setSelectedNodeId(siblings[idx + 1].id);
          }
          break;
        }
        case 'ArrowLeft': {
          // Move to previous sibling
          event.preventDefault();
          const sibs = nodes.filter((n) => n.parentId === currentNode.parentId);
          const i = sibs.findIndex((n) => n.id === selectedNodeId);
          if (i > 0) {
            setSelectedNodeId(sibs[i - 1].id);
          }
          break;
        }
        case 'Enter':
        case ' ': {
          // Toggle expand/collapse
          event.preventDefault();
          const hasChildren = nodes.some((n) => n.parentId === selectedNodeId);
          if (hasChildren) {
            toggleNode(selectedNodeId);
          }
          break;
        }
        case 'Escape': {
          setSelectedNodeId(null);
          break;
        }
      }
    },
    [nodes, selectedNodeId, collapsed, setSelectedNodeId, toggleNode]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
