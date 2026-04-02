// Components
export { YChart } from './YChart';
export type { YChartProps } from './YChart';

// Hooks
export { useYChart } from './hooks/useYChart';
export { useOrgLayout } from './hooks/useOrgLayout';
export { useSearch } from './hooks/useSearch';
export { useExpandCollapse } from './hooks/useExpandCollapse';
export { useNodeSwap } from './hooks/useNodeSwap';
export { useExport } from './hooks/useExport';
export { useKeyboardNav } from './hooks/useKeyboardNav';

// Sub-components (for composition)
export { OrgChartNode } from './components/OrgChartNode';
export { OrgChartEdge } from './components/OrgChartEdge';
export { Toolbar } from './components/Toolbar';
export { SearchBar } from './components/SearchBar';
export { Sidebar } from './components/Sidebar';
export { NodeDetails } from './components/NodeDetails';
export { BackgroundPattern } from './components/BackgroundPattern';

// YAML Editor
export { YamlEditor } from './editor/YamlEditor';

// Store
export { useYChartStore } from './store';
export type { YChartState } from './store';

// Re-export core types for convenience
export type {
  OrgNode,
  OrgEdge,
  YChartConfig,
  CardTemplate,
  Schema,
  SearchResult,
  ExportOptions,
  TemplateFunction,
} from '@mieweb/ychart-core';
