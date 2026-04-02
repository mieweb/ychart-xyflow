import { X } from 'lucide-react';
import { useYChartStore } from '../store';

export function NodeDetails() {
  const selectedNodeId = useYChartStore((s) => s.selectedNodeId);
  const nodes = useYChartStore((s) => s.nodes);
  const setSelectedNodeId = useYChartStore((s) => s.setSelectedNodeId);

  if (!selectedNodeId) return null;

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  // Get display fields (exclude internal/parentId)
  const fields = Object.entries(node).filter(
    ([key]) => !key.startsWith('_') && key !== 'parentId'
  );

  return (
    <div className="ychart-node-details" role="dialog" aria-label="Node details">
      <div className="ychart-node-details-header">
        <h3>{String(node['name'] ?? node.id)}</h3>
        <button
          className="ychart-node-details-close"
          onClick={() => setSelectedNodeId(null)}
          aria-label="Close details"
        >
          <X size={16} />
        </button>
      </div>
      <dl className="ychart-node-details-fields">
        {fields.map(([key, value]) => (
          <div key={key} className="ychart-node-details-field">
            <dt>{key}</dt>
            <dd>{String(value ?? '')}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
