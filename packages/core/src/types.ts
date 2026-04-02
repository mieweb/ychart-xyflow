/** A single node in the org chart data model. */
export interface OrgNode {
  id: string;
  parentId: string | null;
  /** Arbitrary user-defined fields (name, title, department, etc.) */
  [key: string]: unknown;
}

/** An edge connecting two nodes. */
export interface OrgEdge {
  id: string;
  source: string;
  target: string;
}

/** Parsed org data: flat list of nodes plus derived edges. */
export interface OrgData {
  nodes: OrgNode[];
  edges: OrgEdge[];
}

/** Configuration for the chart. */
export interface YChartConfig {
  nodeWidth: number;
  nodeHeight: number;
  childrenMargin: number;
  siblingMargin: number;
  direction: 'TB' | 'LR';
  /** Field name(s) used to look up parent ID. */
  supervisorFields: string[];
  /** Field name for self-referencing (the node's own ID field). */
  idField: string;
  /** Field name for displaying name (used in search, default template). */
  nameField: string;
}

export const DEFAULT_CONFIG: YChartConfig = {
  nodeWidth: 220,
  nodeHeight: 120,
  childrenMargin: 40,
  siblingMargin: 20,
  direction: 'TB',
  supervisorFields: ['parentId', 'supervisorId', 'managerId'],
  idField: 'id',
  nameField: 'name',
};

// --- Card Templates ---

export interface CardTemplateElement {
  tag: string;
  class?: string;
  style?: string;
  text?: string;
  children?: CardTemplateElement[];
}

export type CardTemplate = CardTemplateElement[];

export type TemplateFunction = (node: OrgNode, schema?: Schema) => string;

// --- Schema ---

export interface SchemaField {
  name: string;
  type: string;
  required: boolean;
}

export type Schema = SchemaField[];

// --- Front Matter ---

export interface FrontMatter {
  options?: Partial<YChartConfig>;
  schema?: Record<string, string>;
  card?: unknown[];
}

export interface ParsedYaml {
  frontMatter: FrontMatter;
  data: OrgNode[];
}

// --- Layout ---

export interface NodePosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutResult {
  positions: NodePosition[];
  width: number;
  height: number;
}

// --- Search ---

export interface SearchResult {
  nodeId: string;
  matches: { field: string; value: string }[];
}

// --- Export ---

export interface ExportOptions {
  backgroundColor?: string;
  padding?: number;
  scale?: number;
  filename?: string;
}
