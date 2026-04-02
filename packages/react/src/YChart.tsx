import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  type Node,

  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import type { OrgNode, YChartConfig, TemplateFunction } from '@mieweb/ychart-core';
import { parseInput } from '@mieweb/ychart-core';

import { OrgChartNode } from './components/OrgChartNode';
import { OrgChartEdge } from './components/OrgChartEdge';
import { Toolbar } from './components/Toolbar';
import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';
import { BackgroundPattern } from './components/BackgroundPattern';
import { useOrgLayout } from './hooks/useOrgLayout';
import { useExpandCollapse } from './hooks/useExpandCollapse';
import { useSearch } from './hooks/useSearch';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { useYChartStore } from './store';

import './styles/ychart.css';

export interface YChartProps {
  /** YAML string (with optional front matter), JSON string, or OrgNode array. */
  data: string | OrgNode[];
  /** Chart configuration overrides. */
  config?: Partial<YChartConfig>;
  /** Custom node card template function. */
  template?: TemplateFunction;
  /** Show YAML editor sidebar. */
  showEditor?: boolean;
  /** Show toolbar. */
  showToolbar?: boolean;
  /** Show search bar. */
  showSearch?: boolean;
  /** Show minimap. */
  showMinimap?: boolean;
  /** Background pattern style. */
  backgroundPattern?: 'dots' | 'lines' | 'cross' | 'none';
  /** Callback when a node is clicked. */
  onNodeClick?: (node: OrgNode) => void;
  /** Callback when nodes are swapped. */
  onNodeSwap?: (nodeA: OrgNode, nodeB: OrgNode) => void;
  /** Callback when data changes (via editor). */
  onDataChange?: (data: OrgNode[], rawYaml: string) => void;
  /** CSS class name for the container. */
  className?: string;
}

const nodeTypes = {
  orgChart: OrgChartNode,
};

const edgeTypes = {
  orgEdge: OrgChartEdge,
};

function YChartInner({
  data,
  config,
  template,
  showEditor = false,
  showToolbar = true,
  showSearch = true,
  showMinimap = false,
  backgroundPattern = 'dots',
  onNodeClick,
  onDataChange,
  className,
}: YChartProps) {
  const store = useYChartStore();

  // Parse input data
  useEffect(() => {
    const parsed = parseInput(data);
    store.setNodes(parsed.data);
    if (parsed.frontMatter.options) {
      store.setConfig(parsed.frontMatter.options);
    }
    if (typeof data === 'string') {
      store.setRawInput(data);
    }
  }, [data]);

  // Apply config overrides
  useEffect(() => {
    if (config) store.setConfig(config);
  }, [config]);

  // Layout
  const { flowNodes, flowEdges } = useOrgLayout(store.nodes, store.config, store.collapsed, template);
  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Sync layout changes
  useEffect(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges, setNodes, setEdges]);

  // Expand/collapse
  useExpandCollapse();

  // Search
  const { searchActive } = useSearch();

  // Keyboard navigation
  useKeyboardNav();

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      store.setSelectedNodeId(node.id);
      const orgNode = store.nodes.find((n) => n.id === node.id);
      if (orgNode && onNodeClick) {
        onNodeClick(orgNode);
      }
    },
    [store.nodes, onNodeClick]
  );

  const handleDataChange = useCallback(
    (newData: OrgNode[], rawYaml: string) => {
      store.setNodes(newData);
      store.setRawInput(rawYaml);
      onDataChange?.(newData, rawYaml);
    },
    [onDataChange]
  );

  return (
    <div className={`ychart-container ${className ?? ''}`}>
      {showEditor && (
        <Sidebar
          rawInput={store.rawInput}
          onDataChange={handleDataChange}
        />
      )}
      <div className="ychart-flow-wrapper">
        {showToolbar && <Toolbar />}
        {showSearch && searchActive && <SearchBar />}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
          {showMinimap && <MiniMap />}
          <BackgroundPattern pattern={backgroundPattern} />
        </ReactFlow>
      </div>
    </div>
  );
}

/** Main YChart component. Wraps ReactFlowProvider automatically. */
export function YChart(props: YChartProps) {
  return (
    <ReactFlowProvider>
      <YChartInner {...props} />
    </ReactFlowProvider>
  );
}
