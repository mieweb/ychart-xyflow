import { memo, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Plus, Minus } from 'lucide-react';
import type { OrgNode, TemplateFunction, YChartConfig } from '@mieweb/ychart-core';
import { defaultTemplate } from '@mieweb/ychart-core';
import { useYChartStore } from '../store';
import { useExpandCollapse } from '../hooks/useExpandCollapse';

interface OrgChartNodeData extends OrgNode {
  _hasChildren?: boolean;
  _isCollapsed?: boolean;
  _template?: TemplateFunction;
  _config?: YChartConfig;
}

export const OrgChartNode = memo(({ id, data, selected }: NodeProps) => {
  const nodeData = data as unknown as OrgChartNodeData;
  const { toggleNode } = useExpandCollapse();
  const selectedNodeId = useYChartStore((s) => s.selectedNodeId);
  const isSelected = selected || selectedNodeId === id;

  const template = nodeData._template ?? defaultTemplate;
  const html = template(nodeData);

  const handleExpandClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleNode(id);
    },
    [id, toggleNode]
  );

  return (
    <div
      className={`ychart-node ${isSelected ? 'ychart-node--selected' : ''}`}
      role="treeitem"
      aria-selected={isSelected}
      aria-expanded={nodeData._hasChildren ? !nodeData._isCollapsed : undefined}
      tabIndex={0}
    >
      <Handle type="target" position={Position.Top} className="ychart-handle" />

      <div
        className="ychart-node-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {nodeData._hasChildren && (
        <button
          className="ychart-expand-btn"
          onClick={handleExpandClick}
          aria-label={nodeData._isCollapsed ? 'Expand' : 'Collapse'}
        >
          {nodeData._isCollapsed ? <Plus size={14} /> : <Minus size={14} />}
        </button>
      )}

      <Handle type="source" position={Position.Bottom} className="ychart-handle" />
    </div>
  );
});

OrgChartNode.displayName = 'OrgChartNode';
