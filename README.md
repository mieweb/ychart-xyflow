# YChart XYFlow

**Interactive, YAML-driven org charts powered by [React Flow (XYFlow)](https://reactflow.dev/).**

Define your organizational hierarchy in plain YAML and get a fully interactive, pannable, and zoomable chart — with search, expand/collapse, node swapping, SVG/PNG export, and a live YAML editor — out of the box.

---

## Why It's Cool

- **YAML-first data model** — Your chart data is just a list of records with `id` and `parentId` fields. Front matter lets you configure layout, field schema, and card templates right inside the same file.
- **Zero-boilerplate React component** — Drop in `<YChart data={yaml} />` and you're done.
- **Fully interactive** — Pan, zoom, click nodes for a detail sidebar, search across all fields, expand/collapse entire subtrees, and even drag nodes to swap positions in the hierarchy.
- **Live YAML editor** — An integrated CodeMirror editor lets you edit the YAML in real time and see the chart update instantly — great for exploration and demos.
- **Custom card templates** — Override the default card design with a template function to render any HTML inside each node.
- **Export to SVG or PNG** — One-click export of the entire chart, including background and padding options.
- **Framework-agnostic core** — All parsing, layout, search, and expand/collapse logic lives in `@mieweb/ychart-core` and can be used independently of React.
- **Imperative mount API** — A `mount()` helper lets you embed the chart in any non-React page with a single function call.

---

## Packages

This is a pnpm monorepo with two publishable packages and a playground app:

| Package | Description |
|---|---|
| [`@mieweb/ychart-core`](./packages/core) | Framework-agnostic core: YAML/JSON parsing, tree layout (dagre), search, expand/collapse, export |
| [`@mieweb/ychart-react`](./packages/react) | React component library: `<YChart>`, hooks, toolbar, search bar, sidebar, YAML editor |
| `playground` | Vite + React dev playground for local experimentation |

---

## Getting Started

### Requirements

- Node.js ≥ 20
- pnpm ≥ 10

### Install

```bash
# React package (includes core as a dependency)
npm install @mieweb/ychart-react

# Peer dependencies
npm install react react-dom
```

### Basic Usage

```tsx
import { YChart } from '@mieweb/ychart-react';
import '@mieweb/ychart-react/style.css';

const yaml = `
---
options:
  direction: TB
schema:
  id: string | required
  name: string | required
  title: string
---
- id: "1"
  name: Alice Johnson
  title: CEO

- id: "2"
  parentId: "1"
  name: Bob Smith
  title: VP Engineering

- id: "3"
  parentId: "1"
  name: Carol Williams
  title: VP Marketing
`;

export function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <YChart
        data={yaml}
        showToolbar
        showSearch
        showMinimap
        backgroundPattern="dots"
      />
    </div>
  );
}
```

---

## YAML Format

The chart data is a YAML file with an optional front matter section followed by a list of nodes.

```yaml
---
options:
  nodeWidth: 220        # card width in pixels (default: 220)
  nodeHeight: 120       # card height in pixels (default: 120)
  direction: TB         # TB (top-to-bottom) or LR (left-to-right)
schema:
  id: string | required
  name: string | required
  title: string
---
- id: "1"
  name: Alice Johnson
  title: CEO

- id: "2"
  parentId: "1"        # connects this node to its parent
  name: Bob Smith
  title: VP Engineering
```

### Front Matter Options

| Option | Type | Default | Description |
|---|---|---|---|
| `nodeWidth` | number | `220` | Node card width (px) |
| `nodeHeight` | number | `120` | Node card height (px) |
| `direction` | `'TB' \| 'LR'` | `'TB'` | Layout direction |
| `childrenMargin` | number | `40` | Vertical gap between levels |
| `siblingMargin` | number | `20` | Horizontal gap between siblings |
| `supervisorFields` | string[] | `['parentId','supervisorId','managerId']` | Field names treated as parent references |
| `idField` | string | `'id'` | Field used as the unique node ID |
| `nameField` | string | `'name'` | Field used for display name and search |

### Schema

Declare field types for validation and editor hints:

```yaml
schema:
  id: string | required
  name: string | required
  title: string
  department: string
```

---

## `<YChart>` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `string \| OrgNode[]` | — | YAML string, JSON string, or array of node objects |
| `config` | `Partial<YChartConfig>` | — | Layout config overrides |
| `template` | `TemplateFunction` | — | Custom card HTML renderer `(node) => string` |
| `showEditor` | `boolean` | `false` | Show the live YAML editor sidebar |
| `showToolbar` | `boolean` | `true` | Show expand/collapse/export toolbar |
| `showSearch` | `boolean` | `true` | Show the search bar (activated via toolbar) |
| `showMinimap` | `boolean` | `false` | Show the React Flow minimap |
| `backgroundPattern` | `'dots' \| 'lines' \| 'cross' \| 'none'` | `'dots'` | Canvas background pattern |
| `onNodeClick` | `(node: OrgNode) => void` | — | Called when a node is clicked |
| `onNodeSwap` | `(a: OrgNode, b: OrgNode) => void` | — | Called when two nodes are swapped |
| `onDataChange` | `(data: OrgNode[], rawYaml: string) => void` | — | Called when data changes via the editor |
| `className` | `string` | — | CSS class on the root container |

---

## Hooks (Programmatic Control)

For custom layouts or headless use, reach for the hooks directly:

```tsx
import { useYChart } from '@mieweb/ychart-react';

function MyChart() {
  const {
    nodes, flowNodes, flowEdges,
    toggleNode, expandAll, collapseAll, expandToNode,
    search, clearSearch, nextResult, prevResult,
    selectNode, setConfig,
  } = useYChart({ data: yamlString });

  // Build your own ReactFlow canvas using flowNodes / flowEdges
}
```

---

## Custom Card Templates

Replace the default card design with a function that receives the node data and returns an HTML string:

```tsx
import { YChart } from '@mieweb/ychart-react';
import type { OrgNode } from '@mieweb/ychart-core';

function myTemplate(node: OrgNode): string {
  return `
    <div style="padding:12px;background:#1e293b;color:#fff;border-radius:8px;">
      <strong>${node.name}</strong><br/>
      <small>${node.title ?? ''}</small>
    </div>
  `;
}

<YChart data={yaml} template={myTemplate} />
```

---

## Imperative Mount API (non-React)

Embed the chart into any HTML page without a React build:

```js
import { mount } from '@mieweb/ychart-react/mount';

const chart = mount('#my-container', {
  data: yamlString,
  showToolbar: true,
  showSearch: true,
});

// Update data later
chart.update({ data: newYaml });

// Tear down
chart.unmount();
```

---

## Core API (`@mieweb/ychart-core`)

Use the core package standalone for server-side processing or headless rendering:

```ts
import {
  parseInput,
  computeTreeLayout,
  searchNodes,
  toggleExpand,
  collapseAll,
  expandAll,
  getVisibleNodes,
  exportSvg,
  exportPng,
} from '@mieweb/ychart-core';

const { data, frontMatter } = parseInput(yamlString);
const layout = computeTreeLayout(data, frontMatter.options);
const results = searchNodes(data, 'engineering');
```

---

## Development

```bash
# Install dependencies
pnpm install

# Start the playground dev server
pnpm dev

# Build all packages
pnpm build

# Type-check
pnpm typecheck

# Lint
pnpm lint
```

### Workspace Structure

```
apps/
  playground/        # Vite + React dev playground
packages/
  core/              # @mieweb/ychart-core
  react/             # @mieweb/ychart-react
```

---

## License

MIT
