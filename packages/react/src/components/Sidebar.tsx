import { useCallback, useEffect, useRef, useState } from 'react';
import type { OrgNode } from '@mieweb/ychart-core';
import { parseInput } from '@mieweb/ychart-core';
import { YamlEditor } from '../editor/YamlEditor';

interface SidebarProps {
  rawInput: string;
  onDataChange: (data: OrgNode[], rawYaml: string) => void;
}

export function Sidebar({ rawInput, onDataChange }: SidebarProps) {
  const [editorValue, setEditorValue] = useState(rawInput);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setEditorValue(rawInput);
  }, [rawInput]);

  const handleChange = useCallback(
    (value: string) => {
      setEditorValue(value);

      // Debounce parsing
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        try {
          const parsed = parseInput(value);
          onDataChange(parsed.data, value);
        } catch {
          // Invalid YAML — don't update chart
        }
      }, 300);
    },
    [onDataChange]
  );

  return (
    <div className="ychart-sidebar" role="complementary" aria-label="YAML editor">
      <div className="ychart-sidebar-header">
        <h3>Data Editor</h3>
      </div>
      <div className="ychart-sidebar-content">
        <YamlEditor
          value={editorValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
