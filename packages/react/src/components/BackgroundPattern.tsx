import { Background, BackgroundVariant } from '@xyflow/react';

interface BackgroundPatternProps {
  pattern?: 'dots' | 'lines' | 'cross' | 'none';
}

export function BackgroundPattern({ pattern = 'dots' }: BackgroundPatternProps) {
  if (pattern === 'none') return null;

  const variantMap: Record<string, BackgroundVariant> = {
    dots: BackgroundVariant.Dots,
    lines: BackgroundVariant.Lines,
    cross: BackgroundVariant.Cross,
  };

  return (
    <Background
      variant={variantMap[pattern] ?? BackgroundVariant.Dots}
      gap={16}
      size={1}
      color="#e2e8f0"
    />
  );
}
