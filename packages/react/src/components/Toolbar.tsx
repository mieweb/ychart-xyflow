import { useCallback, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  ChevronsUpDown,
  ChevronsDownUp,
  Search,
  PenLine,
} from 'lucide-react';
import { useExpandCollapse } from '../hooks/useExpandCollapse';
import { useSearch } from '../hooks/useSearch';
import { useYChartStore } from '../store';

export function Toolbar() {
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const { expandAllNodes, collapseAllNodes } = useExpandCollapse();
  const { clearSearch } = useSearch();
  const sidebarOpen = useYChartStore((s) => s.sidebarOpen);
  const setSidebarOpen = useYChartStore((s) => s.setSidebarOpen);
  const [searchVisible, setSearchVisible] = useState(false);

  const toggleSearch = useCallback(() => {
    if (searchVisible) {
      clearSearch();
    }
    setSearchVisible(!searchVisible);
  }, [searchVisible, clearSearch]);

  return (
    <div className="ychart-toolbar" role="toolbar" aria-label="Chart controls">
      <button
        className="ychart-toolbar-btn"
        onClick={() => zoomIn()}
        aria-label="Zoom in"
        title="Zoom in"
      >
        <ZoomIn size={16} />
      </button>
      <button
        className="ychart-toolbar-btn"
        onClick={() => zoomOut()}
        aria-label="Zoom out"
        title="Zoom out"
      >
        <ZoomOut size={16} />
      </button>
      <button
        className="ychart-toolbar-btn"
        onClick={() => fitView({ padding: 0.2 })}
        aria-label="Fit to view"
        title="Fit to view"
      >
        <Maximize size={16} />
      </button>

      <div className="ychart-toolbar-separator" />

      <button
        className="ychart-toolbar-btn"
        onClick={expandAllNodes}
        aria-label="Expand all"
        title="Expand all"
      >
        <ChevronsUpDown size={16} />
      </button>
      <button
        className="ychart-toolbar-btn"
        onClick={collapseAllNodes}
        aria-label="Collapse all"
        title="Collapse all"
      >
        <ChevronsDownUp size={16} />
      </button>

      <div className="ychart-toolbar-separator" />

      <button
        className="ychart-toolbar-btn"
        onClick={toggleSearch}
        aria-label="Search"
        title="Search"
      >
        <Search size={16} />
      </button>
      <button
        className="ychart-toolbar-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? 'Close editor' : 'Open editor'}
        title={sidebarOpen ? 'Close editor' : 'Open editor'}
      >
        <PenLine size={16} />
      </button>
    </div>
  );
}
