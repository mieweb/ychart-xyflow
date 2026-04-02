import { useState } from 'react';
import { YChart } from '@mieweb/ychart-react';
import type { OrgNode } from '@mieweb/ychart-core';

const SAMPLE_YAML = `---
options:
  nodeWidth: 220
  nodeHeight: 120
  direction: TB
schema:
  id: string | required
  name: string | required
  title: string
---
- id: "1"
  name: Alice Johnson
  title: CEO
  department: Executive

- id: "2"
  parentId: "1"
  name: Bob Smith
  title: VP Engineering
  department: Engineering

- id: "3"
  parentId: "1"
  name: Carol Williams
  title: VP Marketing
  department: Marketing

- id: "4"
  parentId: "2"
  name: Dave Brown
  title: Senior Engineer
  department: Engineering

- id: "5"
  parentId: "2"
  name: Eve Davis
  title: Staff Engineer
  department: Engineering

- id: "6"
  parentId: "3"
  name: Frank Miller
  title: Marketing Manager
  department: Marketing

- id: "7"
  parentId: "3"
  name: Grace Wilson
  title: Content Lead
  department: Marketing

- id: "8"
  parentId: "4"
  name: Hank Taylor
  title: Frontend Developer
  department: Engineering

- id: "9"
  parentId: "4"
  name: Ivy Anderson
  title: Backend Developer
  department: Engineering
`;

export function App() {
  const [showEditor, setShowEditor] = useState(false);

  const handleNodeClick = (node: OrgNode) => {
    console.log('Node clicked:', node);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        padding: '12px 20px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
      }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
          YChart XYFlow — Playground
        </h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setShowEditor(!showEditor)}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              background: showEditor ? '#3b82f6' : '#fff',
              color: showEditor ? '#fff' : '#1e293b',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {showEditor ? 'Hide Editor' : 'Show Editor'}
          </button>
        </div>
      </header>

      <div style={{ flex: 1 }}>
        <YChart
          data={SAMPLE_YAML}
          showEditor={showEditor}
          showToolbar={true}
          showSearch={true}
          showMinimap={true}
          backgroundPattern="dots"
          onNodeClick={handleNodeClick}
        />
      </div>
    </div>
  );
}
